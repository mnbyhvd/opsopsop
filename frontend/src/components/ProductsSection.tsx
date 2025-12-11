import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PageContainer from './PageContainer';

interface ProductArea {
  id: string;
  name: string;
  description: string;
  detailPageUrl: string;
  color: string; // Цвет области на маске
  hoverImage: string; // Путь к hover изображению
}

interface ProductModal {
  id: number;
  area_id: string;
  title: string;
  description: string;
  button_text: string;
  button_url: string;
  position_x: number;
  position_y: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ProductSettings {
  id: number;
  title: string;
  subtitle: string;
  created_at: string;
  updated_at: string;
}

const ProductsSection: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<ProductSettings | null>(null);
  const [areas, setAreas] = useState<ProductArea[]>([]);
  const [modals, setModals] = useState<ProductModal[]>([]);
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);
  const [activeArea, setActiveArea] = useState<ProductArea | null>(null);
  const [activeModals, setActiveModals] = useState<ProductModal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoverImage, setHoverImage] = useState<string | null>(null);
  const [maskLoaded, setMaskLoaded] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskImageRef = useRef<HTMLImageElement>(null);

  // Загрузка настроек секции
  const fetchSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setSettings(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching product settings:', error);
    }
  }, []);

  // Загрузка модальных окон для всех областей
  const fetchModals = useCallback(async () => {
    try {
      const allModals: ProductModal[] = [];
      const areas = [
        { id: 'area-1' },
        { id: 'area-2' },
        { id: 'area-3' },
        { id: 'area-4' }
      ];
      
      for (const area of areas) {
        const response = await fetch(`/api/product-modals/${area.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data && Array.isArray(data.data)) {
            allModals.push(...data.data.filter((modal: ProductModal) => modal.is_active));
          }
        }
      }
      setModals(allModals);
      console.log('Loaded modals:', allModals);
    } catch (error) {
      console.error('Error fetching modals:', error);
    }
  }, []);

  // Данные областей (пока заглушки, потом будет из API)
  const defaultAreas: ProductArea[] = [
    {
      id: 'area-1',
      name: 'ППКУП',
      description: 'Интеллектуальная централь системы с 7-дюймовым сенсорным экраном. Обеспечивает управление шлейфами, интеграцию со смежными системами и объединение в сеть MasterNet.',
      detailPageUrl: '/products/ppkup',
      color: '#00ff22', // Первый
      hoverImage: '/images/products/hover-area-1.png'
    },
    {
      id: 'area-2',
      name: 'Датчик',
      description: 'Высокоточный датчик с беспроводной связью. Обеспечивает надежное обнаружение и передачу данных в реальном времени.',
      detailPageUrl: '/products/sensor',
      color: '#a600ff', // Второй
      hoverImage: '/images/products/hover-area-2.png'
    },
    {
      id: 'area-3',
      name: 'Модуль',
      description: 'Компактный модуль управления с расширенными возможностями интеграции. Поддерживает различные протоколы связи.',
      detailPageUrl: '/products/module',
      color: '#ffff00', // Третий
      hoverImage: '/images/products/hover-area-3.png'
    },
    {
      id: 'area-4',
      name: 'Контроллер',
      description: 'Мощный контроллер для управления сложными системами. Обеспечивает высокую производительность и надежность.',
      detailPageUrl: '/products/controller',
      color: '#00d0ff', // Четвертый
      hoverImage: '/images/products/hover-area-4.png'
    }
  ];

  useEffect(() => {
    setAreas(defaultAreas);
    fetchSettings();
    fetchModals();
    console.log('Loaded areas:', defaultAreas.map(a => ({ id: a.id, color: a.color, hoverImage: a.hoverImage })));
  }, [fetchSettings, fetchModals]);

  // Загрузка маски для определения областей
  const loadMaskImage = useCallback(() => {
    const maskImg = new Image();
    maskImg.crossOrigin = 'anonymous';
    maskImg.onload = () => {
      console.log('Mask image loaded successfully');
      (maskImageRef as React.MutableRefObject<HTMLImageElement | null>).current = maskImg;
      setMaskLoaded(true);
    };
    maskImg.onerror = () => {
      console.error('Failed to load mask image');
      setMaskLoaded(false);
    };
    maskImg.src = '/images/products/product-mask.png';
  }, []);

  useEffect(() => {
    loadMaskImage();
  }, [loadMaskImage]);

  // Определение области по цвету пикселя
  const getAreaByColor = useCallback((color: string): ProductArea | null => {
    const normalizedColor = color.toUpperCase();
    const foundArea = areas.find(area => area.color.toUpperCase() === normalizedColor);
    console.log('Searching for color:', normalizedColor, 'Found area:', foundArea?.id);
    return foundArea || null;
  }, [areas]);

  // Получение цвета пикселя на canvas
  const getPixelColor = useCallback((x: number, y: number): string | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Получаем данные пикселя напрямую с canvas (он уже настроен в useEffect)
    const imageData = ctx.getImageData(x, y, 1, 1);
    const data = imageData.data;
    const r = data[0];
    const g = data[1];
    const b = data[2];

    // Конвертируем в hex (убираем альфа-канал)
    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
    console.log('Pixel color at', x, y, ':', hex); // Для отладки
    return hex;
  }, []);

  // Обработка клика по изображению
  const handleImageClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!maskLoaded) {
      console.log('Mask not loaded for click');
      return;
    }
    
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log('Canvas ref is null for click');
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    
    // Координаты относительно canvas
    const x = Math.floor(event.clientX - canvasRect.left);
    const y = Math.floor(event.clientY - canvasRect.top);

    const pixelColor = getPixelColor(x, y);
    if (!pixelColor) return;

    const area = getAreaByColor(pixelColor);
    if (area) {
      console.log('Clicked area:', area.id);
      console.log('All modals:', modals);
      console.log('Modals for area:', modals.filter(modal => modal.area_id === area.id));
      
      // Закрыть предыдущие модальные окна и открыть новые
      setIsModalOpen(false);
      setActiveArea(null);
      setActiveModals([]);
      setHoveredArea(null);
      setHoverImage(null);
      
      // Открыть модальные окна для новой области
      setTimeout(() => {
        setActiveArea(area);
        const areaModals = modals.filter(modal => modal.area_id === area.id);
        setActiveModals(areaModals);
        setIsModalOpen(true);
        
        // Установить hover эффект для активной области
        setHoveredArea(area.id);
        setHoverImage(area.hoverImage);
      }, 50);
    }
  }, [getPixelColor, getAreaByColor, maskLoaded, modals]);

  // Обработка наведения на изображение
  const handleImageHover = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!maskLoaded) {
      console.log('Mask not loaded yet');
      return;
    }
    
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log('Canvas ref is null');
      return;
    }

    // Если модальные окна открыты, не меняем hover эффект
    if (isModalOpen) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    
    // Координаты относительно canvas
    const x = Math.floor(event.clientX - canvasRect.left);
    const y = Math.floor(event.clientY - canvasRect.top);

    const pixelColor = getPixelColor(x, y);
    if (!pixelColor) return;

    const area = getAreaByColor(pixelColor);
    if (area) {
      setHoveredArea(area.id);
      setHoverImage(area.hoverImage);
    } else {
      setHoveredArea(null);
      setHoverImage(null);
    }
  }, [getPixelColor, getAreaByColor, maskLoaded, isModalOpen]);

  // Обработка ухода курсора
  const handleImageLeave = useCallback(() => {
    if (!isModalOpen) {
      setHoveredArea(null);
      setHoverImage(null);
    } else {
      // Если модальные окна открыты, показываем hover эффект для активной области
      if (activeArea) {
        setHoveredArea(activeArea.id);
        setHoverImage(activeArea.hoverImage);
      }
    }
  }, [isModalOpen, activeArea]);

  // Закрытие модального окна
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setActiveArea(null);
    setActiveModals([]);
    setHoveredArea(null);
    setHoverImage(null);
  }, []);

  // Закрытие модального окна при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen, closeModal]);

  // Отрисовка маски на canvas для определения областей
  useEffect(() => {
    const canvas = canvasRef.current;
    const maskImg = maskImageRef.current;
    
    if (!canvas || !maskImg) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Получаем размеры основной картинки
    const mainImg = document.querySelector('img[src="/images/products/main-product.png"]') as HTMLImageElement | null;
    if (!mainImg) return;

    // Устанавливаем внутренние размеры canvas как у отображаемой картинки
    canvas.width = mainImg.offsetWidth;
    canvas.height = mainImg.offsetHeight;

    // Отрисовываем маску на canvas с масштабированием под отображаемый размер
    ctx.drawImage(maskImg, 0, 0, canvas.width, canvas.height);
    
    console.log('Canvas synced with displayed image size:', canvas.width, 'x', canvas.height);
  }, [maskLoaded]);

  return (
    <section className="py-8 relative" style={{ marginTop: '-100px' }}>
      <PageContainer>
        {/* Заголовок и подзаголовок */}
        <div 
          className="col-start-1 col-end-13 text-left px-4 md:px-16 relative z-10"
          style={{
            transform: 'translateY(130px)'
          }}
        >
          <div className="flex items-start gap-4 md:gap-0 md:block">
            <div className="flex-1 md:flex-none">
              <h2 
                className="text-left md:text-center text-4xl md:text-6xl"
                style={{
                  fontFamily: 'Bebas Neue',
                  fontWeight: 400,
                  color: '#F2F0F0',
                  textTransform: 'uppercase',
                  margin: 0,
                  marginBottom: 0
                }}
              >
                {settings?.title || 'ПРОДУКЦИЯ'}
              </h2>
              <p 
                className="text-lg text-left md:text-center"
                style={{
                  fontFamily: 'Bebas Neue',
                  color: '#F2F0F0',
                  margin: 0,
                  marginTop: 0,
                  paddingTop: 0,
                  width: '100%',
                  display: 'inline-block'
                }}
              >
                {settings?.subtitle || 'Технологии, которые не подведут. Изучите ассортимент оборудования.'}
              </p>
            </div>
            {/* Иконка для мобильной версии - справа от текстовых блоков */}
            <motion.img
              src="/ico1.png"
              alt=""
              className="md:hidden w-12 flex-shrink-0 mt-2"
              style={{
                height: 'auto'
              }}
              animate={{
                x: [0, 6, 0, -6, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </div>

        {/* Интерактивная картинка - только заглушка */}
        <div className="col-start-1 col-end-13 relative">
          {!maskLoaded && (
            <div className="text-center py-8 text-gray-400">
              Загрузка интерактивных областей...
            </div>
          )}
        </div>
      </PageContainer>

        {/* Картинка полностью вне всех контейнеров - во всю ширину экрана */}
        <div 
          className={`relative ${maskLoaded ? 'cursor-pointer' : 'cursor-default'} overflow-x-auto overflow-y-hidden hide-scrollbar`}
          style={{
            width: '100vw',
            position: 'relative',
            left: '50%',
            right: '50%',
            marginLeft: '-50vw',
            marginRight: '-50vw',
            marginTop: '7vh',
            marginBottom: '0',
            display: 'flex',
            justifyContent: 'center'
          }}
          onClick={handleImageClick}
          onMouseMove={handleImageHover}
          onMouseLeave={handleImageLeave}
        >
        {/* Контейнер для всех изображений - центрируется на десктопе */}
        <div className="relative inline-block md:translate-y-4">
          {/* Основное изображение - исходные размеры */}
          <img
            src="/images/products/main-product.png"
            alt="Продукция"
            style={{
              width: 'auto',
              height: 'auto',
              display: 'block',
              maxWidth: 'none'
            }}
          />

          {/* Hover изображение (тотально привязано к основной картинке) */}
          <AnimatePresence>
            {hoverImage && (
              <motion.img
                key={hoverImage}
                src={hoverImage}
                alt="Продукция hover"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 'auto',
                  height: 'auto',
                  display: 'block',
                  maxWidth: 'none',
                  zIndex: 1
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>

          {/* Скрытый canvas для определения областей (тотально привязан к основной картинке) */}
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 'auto',
              height: 'auto',
              display: 'block',
              maxWidth: 'none',
              pointerEvents: 'none',
              opacity: 0,
              zIndex: -1
            }}
          />
        </div>
      </div>

      {/* Эллипс под картинкой */}
      <div 
        className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          overflow: 'visible',
          width: '1000px',
          height: '450px',
          opacity: 0.2,
          top: '60%',
          backgroundColor: '#D9D9D9',
          borderRadius: '50%',
          filter: 'blur(308.4px)',
          zIndex: -1
        }}
      />

      {/* Возвращаемся к контейнеру для модальных окон */}
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="grid grid-cols-12 gap-4 md:gap-8 lg:gap-16">
          {/* Модальные окна */}
          <AnimatePresence>
            {isModalOpen && activeArea && activeModals.length > 0 && (
              <div 
                className="absolute z-50"
                style={{
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  pointerEvents: 'none'
                }}
              >
                {activeModals.map((modal, index) => {
                  // Автоматическое позиционирование модальных окон
                  const getModalPosition = (index: number) => {
                    const modalWidth = 320; // ширина модального окна
                    const modalHeight = 200; // примерная высота модального окна
                    const offset = 20; // отступ от края
                    
                    switch (index) {
                      case 0: // Первое - справа снизу
                        return {
                          left: `calc(50% + ${offset}px)`,
                          top: `calc(50% + ${offset}px)`,
                          transform: 'translate(0, 0)'
                        };
                      case 1: // Второе - слева сверху
                        return {
                          left: `calc(50% - ${modalWidth + offset}px)`,
                          top: `calc(50% - ${modalHeight + offset}px)`,
                          transform: 'translate(0, 0)'
                        };
                      case 2: // Третье - справа сверху
                        return {
                          left: `calc(50% + ${offset}px)`,
                          top: `calc(50% - ${modalHeight + offset}px)`,
                          transform: 'translate(0, 0)'
                        };
                      case 3: // Четвертое - слева снизу
                        return {
                          left: `calc(50% - ${modalWidth + offset}px)`,
                          top: `calc(50% + ${offset}px)`,
                          transform: 'translate(0, 0)'
                        };
                      default: // Дополнительные - по кругу
                        const angle = (index * 90) * (Math.PI / 180);
                        const radius = 200;
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * radius;
                        return {
                          left: `calc(50% + ${x}px)`,
                          top: `calc(50% + ${y}px)`,
                          transform: 'translate(-50%, -50%)'
                        };
                    }
                  };

                  const position = getModalPosition(index);

                  return (
                    <motion.div
                      key={modal.id}
                      ref={index === 0 ? modalRef : undefined}
                      initial={{ scale: 0.8, opacity: 0, y: 20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.8, opacity: 0, y: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className="absolute p-6 rounded-2xl"
                      style={{
                        backdropFilter: 'blur(12px)',
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                        border: '1px solid rgba(51, 51, 51, 0.2)',
                        width: '320px',
                        maxWidth: '90vw',
                        left: position.left,
                        top: position.top,
                        transform: position.transform,
                        pointerEvents: 'auto'
                      }}
                    >
                      <h3 
                        className="modal-title"
                        style={{
                          marginBottom: '16px !important'
                        }}
                      >
                        {modal.title}
                      </h3>
                      
                      <p 
                        className="modal-text"
                        style={{
                          marginBottom: '24px !important'
                        }}
                      >
                        {modal.description}
                      </p>
                      
                      {modal.button_text && (
                        <button
                          onClick={() => {
                            setIsModalOpen(false);
                            setActiveArea(null);
                            setActiveModals([]);
                            setHoveredArea(null);
                            setHoverImage(null);
                            navigate('/products');
                          }}
                          className="modal-link"
                          style={{
                            fontFamily: 'Inter !important',
                            fontWeight: 700,
                            fontSize: '16px !important',
                            lineHeight: '100% !important',
                            letterSpacing: '0% !important',
                            color: '#F2F0F0 !important',
                            textDecoration: 'underline !important',
                            textDecorationStyle: 'solid',
                            textDecorationThickness: '1px',
                            textUnderlineOffset: '2px',
                            display: 'inline-block !important',
                            transition: 'opacity 0.2s !important',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = '0.7';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = '1';
                          }}
                        >
                          {modal.button_text}
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
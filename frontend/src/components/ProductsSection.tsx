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
      const response = await fetch('/api/products/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data.data);
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
          if (data.success && data.data) {
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
      (maskImageRef as React.MutableRefObject<HTMLImageElement>).current = maskImg;
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
    if (!canvas || !maskImageRef.current) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Устанавливаем размеры canvas как у изображения
    canvas.width = maskImageRef.current.naturalWidth;
    canvas.height = maskImageRef.current.naturalHeight;

    // Рисуем маску на canvas
    ctx.drawImage(maskImageRef.current, 0, 0);

    // Получаем данные пикселя
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
    
    if (!maskImageRef.current) {
      console.log('Mask image ref is null for click');
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const scaleX = maskImageRef.current.naturalWidth / rect.width;
    const scaleY = maskImageRef.current.naturalHeight / rect.height;

    const x = Math.floor((event.clientX - rect.left) * scaleX);
    const y = Math.floor((event.clientY - rect.top) * scaleY);

    const pixelColor = getPixelColor(x, y);
    if (!pixelColor) return;

    const area = getAreaByColor(pixelColor);
    if (area) {
      console.log('Clicked area:', area.id);
      console.log('All modals:', modals);
      console.log('Modals for area:', modals.filter(modal => modal.area_id === area.id));
      
      // Сначала закрыть предыдущие модальные окна
      setIsModalOpen(false);
      setActiveArea(null);
      setActiveModals([]);
      setHoveredArea(null);
      setHoverImage(null);
      
      // Затем открыть новые модальные окна для новой области
      setTimeout(() => {
        setActiveArea(area);
        const areaModals = modals.filter(modal => modal.area_id === area.id);
        setActiveModals(areaModals);
        setIsModalOpen(true);
      }, 50); // Небольшая задержка для плавного перехода
    }
  }, [getPixelColor, getAreaByColor, maskLoaded, modals]);

  // Обработка наведения на изображение
  const handleImageHover = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!maskLoaded) {
      console.log('Mask not loaded yet');
      return;
    }
    
    if (!maskImageRef.current) {
      console.log('Mask image ref is null');
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const scaleX = maskImageRef.current.naturalWidth / rect.width;
    const scaleY = maskImageRef.current.naturalHeight / rect.height;

    const x = Math.floor((event.clientX - rect.left) * scaleX);
    const y = Math.floor((event.clientY - rect.top) * scaleY);

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
  }, [getPixelColor, getAreaByColor, maskLoaded]);

  // Обработка ухода курсора
  const handleImageLeave = useCallback(() => {
    if (!isModalOpen) {
      setHoveredArea(null);
      setHoverImage(null);
    }
  }, [isModalOpen]);

  // Закрытие модального окна
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setActiveArea(null);
    setActiveModals([]);
    setHoveredArea(null);
    setHoverImage(null);
  }, []);

  // Обработчик клика по изображению
  const handleImageClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!maskLoaded || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const color = getPixelColor(x, y);
    if (!color) return;

    const area = getAreaByColor(color);
    if (!area) return;

    console.log('Clicked on area:', area.id, 'with color:', color);

    // Находим модальные окна для этой области
    const areaModals = modals.filter(modal => modal.area_id === area.id);
    
    if (areaModals.length > 0) {
      setActiveArea(area);
      setActiveModals(areaModals);
      setIsModalOpen(true);
      console.log('Opening modals for area:', area.id, 'modals:', areaModals);
    } else {
      console.log('No modals found for area:', area.id);
    }
  }, [maskLoaded, getPixelColor, getAreaByColor, modals]);

  // Обработчик наведения мыши на изображение
  const handleImageHover = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!maskLoaded || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const color = getPixelColor(x, y);
    if (!color) return;

    const area = getAreaByColor(color);
    if (!area || area.id === hoveredArea) return;

    console.log('Hovering over area:', area.id, 'with color:', color);
    setHoveredArea(area.id);
    setHoverImage(area.hoverImage);
  }, [maskLoaded, getPixelColor, getAreaByColor, hoveredArea]);

  // Обработчик ухода мыши с изображения
  const handleImageLeave = useCallback(() => {
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

    // Устанавливаем размеры canvas как у изображения
    canvas.width = maskImg.naturalWidth;
    canvas.height = maskImg.naturalHeight;

    // Отрисовываем маску на canvas
    ctx.drawImage(maskImg, 0, 0);
    
    console.log('Mask drawn on canvas, size:', canvas.width, 'x', canvas.height);
  }, [maskLoaded]);

  return (
    <section className="py-8 relative" style={{ marginTop: '-100px' }}>
      <PageContainer>
        {/* Заголовок и подзаголовок */}
        <div 
          className="col-start-1 col-end-13 text-left px-16 relative z-10"
          style={{
            transform: 'translateY(130px)'
          }}
        >
          <h2 
            className="mb-6"
            style={{
              fontFamily: 'Bebas Neue',
              fontSize: '64px',
              fontWeight: 400,
              color: '#F2F0F0',
              textTransform: 'uppercase'
            }}
          >
            {settings?.title || '/ПРОДУКЦИЯ'}
          </h2>
          <p 
            className="text-lg"
            style={{
              fontFamily: 'Inter',
              color: '#F2F0F0',
              maxWidth: '600px',
              margin: 0
            }}
          >
            {settings?.subtitle || 'Технологии, которые не подведут. Изучите ассортимент оборудования.'}
          </p>
        </div>

        {/* Интерактивная картинка */}
        <div className="col-start-1 col-end-13 relative px-16 overflow-hidden">
          {!maskLoaded && (
            <div className="text-center py-8 text-gray-400">
              Загрузка интерактивных областей...
            </div>
          )}
          
          {/* Эллипс под картинкой */}
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              overflow: 'visible',
              width: '1000px',
              height: '450px',
              opacity: 0.2,
              top: '52%',
              backgroundColor: '#D9D9D9',
              borderRadius: '50%',
              filter: 'blur(308.4px)',
              zIndex: -1
            }}
          />
          

          <div 
            className={`relative w-full ${maskLoaded ? 'cursor-pointer' : 'cursor-default'}`}
            onClick={handleImageClick}
            onMouseMove={handleImageHover}
            onMouseLeave={handleImageLeave}
          >
            {/* Основное изображение */}
            <img
              src="/images/products/main-product.png"
              alt="Продукция"
              className="w-full h-auto"
              style={{
                maxWidth: '100%',
                height: 'auto',
                objectFit: 'contain',
                display: 'block'
              }}
            />

            {/* Hover изображение (накладывается поверх без изменения размера) */}
            <AnimatePresence>
              {hoverImage && (
                <motion.img
                  key={hoverImage}
                  src={hoverImage}
                  alt="Продукция hover"
                  className="absolute inset-0 w-full h-full"
                  style={{
                    objectFit: 'contain',
                    zIndex: 1,
                    display: 'block'
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </AnimatePresence>

            {/* Скрытый canvas для определения областей */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 pointer-events-none opacity-0"
              style={{ zIndex: -1 }}
            />
          </div>
        </div>

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
      </PageContainer>
    </section>
  );
};

export default ProductsSection;
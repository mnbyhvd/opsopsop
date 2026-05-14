import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAbout } from '../hooks/useAbout';
import PageContainer from './PageContainer';
import { sanitizeHtml } from '../utils/richText';
import { resolveMediaUrl } from '../utils/media';

interface AboutSectionProps {
  group?: 'main' | 'secondary' | string;
  label?: string;
  className?: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({ group = 'main', label = 'о системе', className = '' }) => {
  const { aboutItems, loading } = useAbout(group);
  const [isMobile, setIsMobile] = useState(false);
  
  // Определяем мобильное устройство
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTextFixed, setIsTextFixed] = useState(false);
  const [isLastTextUnfixed, setIsLastTextUnfixed] = useState(false);
  const [lastTextTopOffset, setLastTextTopOffset] = useState(0);
  const [fixedPosition, setFixedPosition] = useState({ left: 'auto', width: 'auto' });
  
  const sectionRef = useRef<HTMLElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  const colors = ['var(--accent)', '#4ecdc4', '#45b7d1', '#96ceb4'];

  // Основной обработчик скролла (только для десктопа)
  useEffect(() => {
    if (isMobile) return; // Пропускаем анимации на мобильных
    
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const sectionRect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;
      
      // 1. ЛОГИКА ФИКСАЦИИ ТЕКСТА - фиксируется когда первая картинка достигает центра или выше центра
      const imageContainer = sectionRef.current.querySelector('[data-image-container]');
      if (imageContainer) {
        const images = imageContainer.querySelectorAll('[data-image-item]');
        const firstImage = images[0];
        
        if (firstImage) {
          const firstImageRect = firstImage.getBoundingClientRect();
          const firstImageCenter = firstImageRect.top + firstImageRect.height / 2;
          
          // Фиксация когда первая картинка достигает центра или выше центра
          if (firstImageCenter <= viewportCenter && !isTextFixed) {
            setIsTextFixed(true);
            
            // Вычисляем позицию для фиксированного элемента
            if (textContainerRef.current && sectionRef.current) {
              const containerRect = sectionRef.current.getBoundingClientRect();
              const textRect = textContainerRef.current.getBoundingClientRect();
              
              // Позиция относительно viewport
              const left = textRect.left;
              const width = textRect.width;
              
              setFixedPosition({ left: `${left}px`, width: `${width}px` });
            }
          }
          // Разфиксация когда первая картинка ниже центра
          else if (firstImageCenter > viewportCenter && isTextFixed) {
            setIsTextFixed(false);
          }
        }
      }
      
      // 2. ЛОГИКА РАЗФИКСАЦИИ/ФИКСАЦИИ ПОСЛЕДНЕГО ТЕКСТА
      if (imageContainer) {
        const images = imageContainer.querySelectorAll('[data-image-item]');
        const lastImage = images[images.length - 1];
        
        if (lastImage) {
          const lastImageRect = lastImage.getBoundingClientRect();
          const lastImageCenter = lastImageRect.top + lastImageRect.height / 2;
          
          // Разфиксация: когда центр последней картинки выше центра видимой области
          if (lastImageCenter < viewportCenter && !isLastTextUnfixed) {
            setIsLastTextUnfixed(true);
            
            // Вычисляем отступ так, чтобы верхняя граница колонки текстов совпадала с верхней границей последней картинки
            // Позиция последней картинки в колонке изображений
            const imageColumnRect = imageContainer.getBoundingClientRect();
            const lastImageTopInColumn = lastImageRect.top - imageColumnRect.top;
            
            // Добавляем отступ от начала секции до колонки изображений
            const sectionRect = sectionRef.current.getBoundingClientRect();
            const columnTopInSection = imageColumnRect.top - sectionRect.top;
            
            // Учитываем высоту заголовка "о системе" и отступы
            const textContainer = sectionRef.current.querySelector('[data-text-container]');
            let headerHeight = 0;
            if (textContainer) {
              const headerElement = textContainer.querySelector('h2');
              if (headerElement) {
                headerHeight = headerElement.getBoundingClientRect().height + 32; 
              }
            }
            
            // Вычисляем высоту: (количество картинок - 1) × (высота картинки + отступ)
            const images = imageContainer.querySelectorAll('[data-image-item]');
            const imageCount = images.length;
            const imageHeight = lastImageRect.height; 
            const gapBetweenImages = 80; 
            
            const totalHeight = (imageCount - 1) * (imageHeight + gapBetweenImages);
            const totalOffset = totalHeight;
            


            
            setLastTextTopOffset(totalOffset);
          }
          // Фиксация: когда центр последней картинки ниже центра видимой области
          else if (lastImageCenter >= viewportCenter && isLastTextUnfixed) {
            setIsLastTextUnfixed(false);
          }
        }
      }
      
      // 3. ЛОГИКА СМЕНЫ АКТИВНОГО ИЗОБРАЖЕНИЯ
      if (isTextFixed && imageContainer) {
        const images = imageContainer.querySelectorAll('[data-image-item]');
        let bestIndex = 0;
        let bestScore = -Infinity;
        
        for (let i = 0; i < images.length; i++) {
          const img = images[i];
          const imgRect = img.getBoundingClientRect();
          
          // Вычисляем расстояние от центра изображения до центра экрана
          const imageCenter = imgRect.top + imgRect.height / 2;
          const distanceFromCenter = Math.abs(imageCenter - viewportCenter);
          
          // Чем ближе к центру экрана, тем выше score
          let score = 0;
          if (imgRect.top < window.innerHeight && imgRect.bottom > 0) {
            score = 1000 - distanceFromCenter;
          }
          
          if (score > bestScore) {
            bestScore = score;
            bestIndex = i;
          }
        }
        
        const newIndex = Math.min(bestIndex, aboutItems.length - 1);
        if (newIndex !== activeIndex) {
          setActiveIndex(newIndex);
        }
      } else if (!isTextFixed) {
        // Если текст не зафиксирован, показываем первый элемент
        if (activeIndex !== 0) {
          setActiveIndex(0);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Первоначальная проверка

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeIndex, aboutItems.length, isTextFixed, isLastTextUnfixed, isMobile]);

  // Условные возвраты после всех хуков
  if (loading) {
    return (
      <div className="py-20 text-center">
        <p style={{ color: 'var(--font-body-color, var(--text))' }}>Загрузка...</p>
      </div>
    );
  }

  if (!aboutItems || aboutItems.length === 0) {
    return (
      <div className="py-20 text-center">
        <p style={{ color: 'var(--font-body-color, var(--text))' }}>Нет данных для отображения</p>
      </div>
    );
  }

  const activeItem = aboutItems[activeIndex] || aboutItems[0];

  // Мобильная версия - простая структура без анимаций
  if (isMobile) {
    return (
      <section 
        ref={sectionRef}
        className={`about-section relative pt-8 pb-16 ${className}`}
      >
        <PageContainer>
          <div className="col-start-1 col-end-13">
            {/* Простая структура: текст -> картинка -> текст -> картинка */}
            <div className="space-y-12">
              {aboutItems.map((item, index) => (
                <div key={item.id} className="space-y-6">
                  {/* Текст */}
                  <div>
                    <h3 className="text-2xl mb-4" style={{ color: 'var(--font-headings-color, var(--text))' }}>
                      {item.title}
                    </h3>
                    <p
                      className="rich-text text-sm md:text-lg leading-relaxed"
                      style={{ color: 'var(--font-body-color, var(--text))', fontFamily: 'var(--font-body, Inter)' }}
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.description) }}
                    />
                  </div>
                  
                  {/* Картинка */}
                  <div className="w-full h-64 flex items-center justify-center">
                    {item.image_url ? (
                      <img 
                        src={resolveMediaUrl(item.image_url)}
                        alt={item.title}
                        className="max-w-full max-h-full object-contain rounded-lg"
                        onError={(e) => {
                          console.error('Ошибка загрузки изображения:', item.image_url);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div 
                        className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 rounded-lg"
                      >
                        <span className="text-lg">Изображение {index + 1}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PageContainer>
      </section>
    );
  }

  // Десктоп версия - с анимациями
  return (
    <section 
      ref={sectionRef}
      className={`about-section relative pb-16 ${className}`}
      style={{ 
        minHeight: `${Math.max(1040, aboutItems.length * 496)}px`
      }}
    >
      <div className="sr-only" data-seo-content={`about-${group}`}>
        {aboutItems.map(item => (
          <article key={`seo-${item.id}`}>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
      <PageContainer>
      {/* Контейнер для текста - колонки 2-6 */}
          <div 
            ref={textContainerRef}
            data-text-container
            className={`col-start-2 col-end-7 flex justify-center z-10 ${
              isLastTextUnfixed ? 'items-bottom relative h-screen' :
              isTextFixed ? 'items-center fixed top-1/2 h-screen' : 'items-top relative h-screen'
            }`}
            style={{ 
              transform: (isTextFixed && !isLastTextUnfixed) ? 'translateY(-50%)' : 'none',
              left: isLastTextUnfixed ? 'auto' : (isTextFixed ? fixedPosition.left : 'auto'),
              width: isLastTextUnfixed ? 'auto' : (isTextFixed ? fixedPosition.width : 'auto'),
              top: isLastTextUnfixed ? `${lastTextTopOffset}px` : undefined,
              position: isLastTextUnfixed ? 'relative' : undefined
            }}
          >
        <div className="w-full">
          <div className="about-title-block" style={{ marginBottom: '32px' }}>
            <div className="about-title-dot"></div>
            <h2 
              className="about-title" 
              style={{ color: 'var(--accent)' }}
            >
              {label}
            </h2>
          </div>
          
          {/* Контейнер для текста с эффектом dissolve */}
          <div className="relative h-96">
            {activeItem && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeItem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0 flex flex-col justify-between"
                >
                  <h3 
                    className="text-2xl"
                  >
                    {activeItem.title}
                  </h3>
                  <p
                    className="rich-text text-lg leading-relaxed"
                    style={{ color: 'var(--font-body-color, var(--text))' }}
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(activeItem.description) }}
                  />
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* Контейнер для изображений - колонки 7-11 */}
      <div 
        className="col-start-7 col-end-12 h-full z-5"
        data-image-container
      >
            <div className="space-y-20 px-8">
          {aboutItems.map((item, index) => (
            <div
              key={item.id}
              data-image-item
              className="w-full h-[28rem] flex items-center justify-center"
            >
              <div 
                className="w-full h-full rounded-lg flex items-center justify-center"
              >
                {item.image_url ? (
                  <img 
                    src={resolveMediaUrl(item.image_url)}
                    alt={item.title}
                    className="max-w-full max-h-full object-contain rounded-lg"
                    onError={(e) => {
                      console.error('Ошибка загрузки изображения:', item.image_url);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 rounded-lg"
                  >
                    <span className="text-lg">Изображение {index + 1}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      </PageContainer>
    </section>
  );
};

export default AboutSection;

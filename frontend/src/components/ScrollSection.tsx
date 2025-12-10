import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import PageContainer from './PageContainer';

interface TextBlock {
  id: number;
  title: string;
  description: string;
  order: number;
}

interface ScrollSectionData {
  id: number;
  section_title: string;
  section_subtitle: string;
  video_url: string;
  text_blocks: TextBlock[];
  created_at: string;
  updated_at: string;
}

// Константы вынесены за пределы компонента для оптимизации
const PLAYBACK_CONST = 500;
const API_URL = '/api/scroll-section';

// Fallback данные вынесены за пределы компонента
const FALLBACK_DATA: ScrollSectionData = {
  id: 1,
  section_title: 'ТЕХНОЛОГИИ БУДУЩЕГО',
  section_subtitle: 'Инновационные решения для автоматического пожаротушения',
  video_url: '/videos/demo.mp4',
  text_blocks: [
    {
      id: 1,
      title: 'Интеллектуальное управление',
      description: 'Система автоматически определяет тип возгорания и выбирает оптимальный способ тушения',
      order: 1
    },
    {
      id: 2,
      title: 'Мгновенное реагирование',
      description: 'Обнаружение пожара за 3 секунды, подача огнетушащего вещества за 10 секунд',
      order: 2
    },
    {
      id: 3,
      title: 'Экологическая безопасность',
      description: 'Использование современных экологически чистых огнетушащих веществ',
      order: 3
    },
    {
      id: 4,
      title: 'Интеграция с системами',
      description: 'Полная совместимость с существующими системами безопасности здания',
      order: 4
    }
  ],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const ScrollSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const textBlocksRef = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  const [data, setData] = useState<ScrollSectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVideoFixed, setIsVideoFixed] = useState(false);
  const [isLastTextUnfixed, setIsLastTextUnfixed] = useState(false);
  const [fixedPosition, setFixedPosition] = useState({ left: 'auto', width: 'auto' });
  const [lastTextTopOffset, setLastTextTopOffset] = useState(0);
  const [relativePosition, setRelativePosition] = useState({ top: 0, left: 0, width: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [textOpacities, setTextOpacities] = useState<number[]>([]);
  const [isMobileFixed, setIsMobileFixed] = useState(false);
  const [isMobileUnfixed, setIsMobileUnfixed] = useState(false);
  const [mobileFixedPosition, setMobileFixedPosition] = useState({ top: 0, left: 0, width: 0 });
  const [mobileUnfixedOffset, setMobileUnfixedOffset] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [fixedStartScroll, setFixedStartScroll] = useState(0);
  const [fixedEndScroll, setFixedEndScroll] = useState(0);
  const mobileContentContainerRef = useRef<HTMLDivElement>(null);
  // Мемоизированные стили для оптимизации
  const videoStyles = useMemo(() => ({
    width: '100%',
    height: '100%',
    objectFit: 'contain' as const,
    maxWidth: '100%',
    maxHeight: '100%'
  }), []);

  const textBlockStyles = useMemo(() => ({
    height: '80vh',
    minHeight: '600px',
    padding: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }), []);

  // Оптимизированная функция загрузки данных
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setData(result.data);
          return;
        }
      }
      throw new Error('Failed to fetch data');
    } catch (err) {
      console.error('Error fetching scroll section data:', err);
      setError('Failed to fetch scroll section data');
      setData(FALLBACK_DATA);
    } finally {
      setLoading(false);
    }
  }, []);

  // Загрузка данных
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Определение мобильного устройства и viewport
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
      setViewportHeight(window.innerHeight);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Инициализация прозрачности текстов для мобильной версии
  useEffect(() => {
    if (data && isMobile) {
      const initialOpacities = new Array(data.text_blocks.length).fill(0);
      initialOpacities[0] = 1; // Первый текст видим сразу
      setTextOpacities(initialOpacities);
    }
  }, [data, isMobile]);

  // Оптимизированная функция обновления видео
  const updateVideoTime = useCallback(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    
    if (!video || !section || video.readyState < 2) return;

    const sectionRect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportCenter = viewportHeight / 2;

    // Проверяем, находится ли секция в области видимости
    if (sectionRect.top <= viewportCenter && sectionRect.bottom >= viewportCenter) {
      const scrollProgress = Math.max(0, Math.min(1, 
        (viewportCenter - sectionRect.top) / (sectionRect.height - viewportHeight)
      ));
      
      const videoTime = video.duration * scrollProgress;
      if (!isNaN(videoTime) && videoTime >= 0 && videoTime <= video.duration) {
        video.currentTime = videoTime;
      }
    }
  }, []);

  // Оптимизированная функция анимации
  const scrollPlay = useCallback(() => {
    updateVideoTime();
    animationFrameRef.current = requestAnimationFrame(scrollPlay);
  }, [updateVideoTime]);

  // Мобильная версия: обработка скролла для текстов и видео
  const handleMobileScroll = useCallback(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    const contentContainer = mobileContentContainerRef.current;
    
    if (!section || !video || !data || !contentContainer) return;

    const sectionRect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportTop = window.scrollY;
    const sectionTop = section.offsetTop;
    
    // Получаем размеры контента (текст + видео)
    const contentRect = contentContainer.getBoundingClientRect();
    const contentHeight = contentRect.height;
    
    // ОПТИМАЛЬНЫЙ АЛГОРИТМ: Две точки на основе позиции скролла
    // Вычисляем точки фиксации и разфиксации на основе позиции секции
    
    // ТОЧКА ФИКСАЦИИ: Когда верхняя граница секции достигла верха viewport
    // Вычисляем scrollY позицию, когда это происходит
    const fixPoint = sectionTop - viewportHeight / 2 + contentHeight / 2;
    
    // ТОЧКА РАЗФИКСАЦИИ: Когда нижняя граница секции появляется во viewport
    // Вычисляем scrollY позицию, когда это происходит
    const sectionHeight = sectionRect.height;
    const unfixPoint = sectionTop + sectionHeight - viewportHeight;
    
    // ЛОГИКА: В зависимости от позиции скролла меняем позиционирование
    
    // 1. ФИКСАЦИЯ: Когда дошли до точки фиксации
    if (viewportTop >= fixPoint && !isMobileFixed) {
      setIsMobileFixed(true);
      setIsMobileUnfixed(false);
      
      // Сохраняем позицию для fixed позиционирования (фиксируем на середине viewport)
      const top = viewportHeight / 2 - contentHeight / 2; // Центрируем на середине viewport
      const left = contentRect.left;
      const width = contentRect.width;
      
      setMobileFixedPosition({ top, left, width });
      
      // Сохраняем момент начала фиксации
      setFixedStartScroll(viewportTop);
      
      // Вычисляем момент окончания фиксации
      const scrollRangePerText = viewportHeight * 0.8;
      const totalScrollRange = data.text_blocks.length * scrollRangePerText;
      setFixedEndScroll(viewportTop + totalScrollRange);
    }
    // 2. РАЗФИКСАЦИЯ ВНИЗ: Когда дошли до точки разфиксации
    else if (viewportTop >= unfixPoint && isMobileFixed && !isMobileUnfixed) {
      // Разфиксируем и ставим блок внизу секции
      setIsMobileUnfixed(true);
      
      // Вычисляем offset так, чтобы блок был внизу секции
      // Позиция контента внизу секции = высота секции - высота контента
      const offset = sectionHeight - contentHeight;
      setMobileUnfixedOffset(offset);
    }
    // 3. РАЗФИКСАЦИЯ ПРИ СКРОЛЛЕ ВВЕРХ: Когда вернулись выше точки разфиксации
    else if (viewportTop < unfixPoint && isMobileFixed && isMobileUnfixed) {
      // Убираем offset, возвращаемся к обычной relative позиции
      setIsMobileUnfixed(false);
      setMobileUnfixedOffset(0);
    }
    // 4. СБРОС ФИКСАЦИИ: Когда вернулись выше точки фиксации
    else if (viewportTop < fixPoint && isMobileFixed) {
      // Полностью сбрасываем фиксацию, возвращаемся в исходное положение
      setIsMobileFixed(false);
      setIsMobileUnfixed(false);
      setMobileUnfixedOffset(0);
    }
    
    // 3. ВЫЧИСЛЕНИЕ ПРОГРЕССА СКРОЛЛА для видео и текстов
    let scrollProgress = 0;
    
    if (isMobileFixed && !isMobileUnfixed) {
      // В зоне фиксации - прогресс от момента фиксации до разфиксации
      scrollProgress = Math.max(0, Math.min(1, 
        (viewportTop - fixedStartScroll) / (fixedEndScroll - fixedStartScroll)
      ));
    } else if (!isMobileFixed) {
      // До фиксации - минимальный прогресс
      scrollProgress = 0;
    } else {
      // После разфиксации - прогресс = 1 (видео доигрывает до конца)
      scrollProgress = 1;
    }

    // Обновляем время видео на основе прогресса скролла
    if (video.readyState >= 2 && video.duration && !isNaN(video.duration) && isFinite(video.duration)) {
      const videoTime = video.duration * scrollProgress;
      // Проверяем, что новое время отличается от текущего, чтобы избежать лишних обновлений
      if (Math.abs(video.currentTime - videoTime) > 0.1) {
        video.currentTime = videoTime;
      }
    }

    // Вычисляем прозрачность для каждого текста (fade in/fade out)
    const textCount = data.text_blocks.length;
    const newOpacities = data.text_blocks.map((_, index) => {
      const isFirst = index === 0;
      const isLast = index === textCount - 1;
      const textStart = index / textCount;
      const textEnd = (index + 1) / textCount;
      
      if (scrollProgress < textStart) {
        // До появления текста - первый текст видим сразу, остальные невидимы
        return isFirst ? 1 : 0;
      } else if (scrollProgress > textEnd && !isLast) {
        // Текст уже ушел (кроме последнего)
        return 0;
      } else if (isFirst && scrollProgress >= textStart) {
        // Первый текст - виден сразу, только fade out
        const textProgressLocal = (scrollProgress - textStart) / (textEnd - textStart);
        if (textProgressLocal > 0.7) {
          return Math.pow((1 - textProgressLocal) / 0.3, 2); // Только fade out (1-0)
        } else {
          return 1; // Полная видимость без fade in
        }
      } else if (isLast && scrollProgress >= textStart) {
        // Последний текст - остается видимым после появления
        const textProgressLocal = (scrollProgress - textStart) / (textEnd - textStart);
        if (textProgressLocal < 0.3) {
          return Math.pow(textProgressLocal / 0.3, 2); // Fade in
        } else {
          return 1; // Остается видимым
        }
      } else {
        // Текст в зоне видимости - вычисляем плавную прозрачность
        const textProgressLocal = (scrollProgress - textStart) / (textEnd - textStart);
        // Плавное появление и исчезновение (fade in/fade out)
        if (textProgressLocal < 0.3) {
          return Math.pow(textProgressLocal / 0.3, 2); // Fade in с квадратичной кривой (0-1)
        } else if (textProgressLocal > 0.7) {
          return Math.pow((1 - textProgressLocal) / 0.3, 2); // Fade out с квадратичной кривой (1-0)
        } else {
          return 1; // Полная видимость
        }
      }
    });
    
    setTextOpacities(newOpacities);
  }, [data, isMobileFixed, isMobileUnfixed, fixedStartScroll, fixedEndScroll]);
  
  // Мобильная версия: оптимизированная функция анимации через requestAnimationFrame
  const mobileScrollPlay = useCallback(() => {
    handleMobileScroll();
    animationFrameRef.current = requestAnimationFrame(mobileScrollPlay);
  }, [handleMobileScroll]);

  // Оптимизированная функция обработки скролла (как в AboutSection)
  const handleScroll = useCallback(() => {
    // Для мобильной версии используем отдельную логику
    if (isMobile) {
      handleMobileScroll();
      return;
    }

    const section = sectionRef.current;
    const videoContainer = videoContainerRef.current;
    const textBlocks = textBlocksRef.current;
    
    if (!section || !videoContainer || textBlocks.length === 0) return;

    const sectionRect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportCenter = viewportHeight / 2;

    // 1. ЛОГИКА ФИКСАЦИИ ВИДЕО - фиксируется когда первый текст достигает центра
    const firstTextBlock = textBlocks[0];
    if (firstTextBlock) {
      const firstTextRect = firstTextBlock.getBoundingClientRect();
      const firstTextCenter = firstTextRect.top + firstTextRect.height / 2;
      
      // Фиксация когда центр первого текста достигает центра экрана
      if (firstTextCenter <= viewportCenter && !isVideoFixed) {
        setIsVideoFixed(true);
        
        // Вычисляем позицию для фиксированного видео
        const videoRect = videoContainer.getBoundingClientRect();
        const left = videoRect.left;
        const width = videoRect.width;
        
        setFixedPosition({ left: `${left}px`, width: `${width}px` });
        console.log('Video fixed at position:', { left, width });
      }
      // Разфиксация когда центр первого текста ниже центра (только если не в режиме lastTextUnfixed)
      else if (firstTextCenter > viewportCenter && isVideoFixed && !isLastTextUnfixed) {
        setIsVideoFixed(false);
      }
    }

    // 2. ЛОГИКА РАЗФИКСАЦИИ ПОСЛЕДНЕГО ТЕКСТА
    const lastTextBlock = textBlocks[textBlocks.length - 1];
    if (lastTextBlock) {
      const lastTextRect = lastTextBlock.getBoundingClientRect();
      const lastTextCenter = lastTextRect.top + lastTextRect.height / 2;
      
      // Разфиксация: делаем переход когда центр последнего текста проходит центр viewport
      // Это обеспечит плавный переход без скачков
      if (lastTextCenter < viewportCenter && !isLastTextUnfixed && isVideoFixed) {
        setIsLastTextUnfixed(true);
        
        // Вычисляем отступ так, чтобы расстояние от нижнего края секции до центра видео было 50vh
        if (videoContainer) {
          const videoRect = videoContainer.getBoundingClientRect();
          const videoHeight = videoRect.height;
          const viewportHeightPx = window.innerHeight;
          const targetDistance = viewportHeightPx * 0.5; // 50vh в пикселях
          
          // Получаем высоту секции из minHeight стиля
          // Высота секции уже рассчитана с учетом видео: textBlocks * 80vh + 50vh + videoHeight/2
          if (!data) return;
          
          // Вычисляем высоту секции на основе minHeight (в vh единицах)
          const videoHeightVh = 80;
          const targetDistanceVh = 50;
          const sectionHeightVh = data.text_blocks.length * 80 + targetDistanceVh + videoHeightVh / 2;
          const sectionHeight = sectionHeightVh * viewportHeightPx / 100; // Конвертируем vh в пиксели
          
          // Вычисляем offset так, чтобы:
          // В relative позиции: top = offset означает позицию верха элемента от начала секции
          // Центр видео = offset + videoHeight / 2
          // Расстояние от нижнего края до центра = sectionHeight - (offset + videoHeight / 2)
          // Нужно: sectionHeight - (offset + videoHeight / 2) = 50vh
          // offset = sectionHeight - 50vh - videoHeight / 2
          const offset = sectionHeight - targetDistance - videoHeight / 2;
          
          // Убеждаемся, что offset не отрицательный и видео не выходит за верхнюю границу
          const safeOffset = Math.max(0, offset);
          
          // Сохраняем позицию для плавного возврата
          const textContainer = section.querySelector('[data-text-container]');
          if (textContainer) {
            const textContainerRect = textContainer.getBoundingClientRect();
            setRelativePosition({
              top: safeOffset,
              left: textContainerRect.left - sectionRect.left,
              width: textContainerRect.width
            });
          }
          
          setLastTextTopOffset(safeOffset);
        }
      }
      // Возврат в fixed: когда центр последнего текста выше центра viewport
      // Нужно плавно вернуться в fixed состояние
      else if (lastTextCenter >= viewportCenter && isLastTextUnfixed) {
        // Сбрасываем разфиксацию только если видео еще в fixed состоянии
        if (isVideoFixed) {
          setIsLastTextUnfixed(false);
        }
      }
    }

    // 3. ЛОГИКА СМЕНЫ АКТИВНОГО ТЕКСТА - убрана, теперь обычный скролл
  }, [isVideoFixed, isLastTextUnfixed, isMobile]);

  // Основной useEffect с оптимизациями
  useEffect(() => {
    if (!data || !videoRef.current) return;

    const video = videoRef.current;
    const section = sectionRef.current;
    
    if (!section) return;

    // Устанавливаем начальное состояние видео
    video.currentTime = 0;
    video.muted = true;
    video.playsInline = true;

    // Обработчик загрузки метаданных видео
    const handleVideoLoad = () => {
      const videoDuration = video.duration;
      console.log('ScrollSection: Video duration:', videoDuration);
    };

    // Если метаданные уже загружены
    if (video.readyState >= 1) {
      handleVideoLoad();
    } else {
      video.addEventListener('loadedmetadata', handleVideoLoad);
    }

    // Для мобильной версии используем requestAnimationFrame для плавной анимации
    if (isMobile) {
      // Запускаем анимацию через requestAnimationFrame для мобильной версии
      animationFrameRef.current = requestAnimationFrame(mobileScrollPlay);
    } else {
      // Для десктопа используем scrollPlay
      if (textBlocksRef.current.length > 0) {
        animationFrameRef.current = requestAnimationFrame(scrollPlay);
      }
    }

    // Добавляем обработчик скролла (throttled через requestAnimationFrame)
    // Используем passive: true для лучшей производительности
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Первоначальная проверка

    return () => {
      // Очистка
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('scroll', handleScroll);
      video.removeEventListener('loadedmetadata', handleVideoLoad);
    };
  }, [data, scrollPlay, handleScroll, isMobile, mobileScrollPlay]);

  // Мемоизированные компоненты для оптимизации рендеринга
  const LoadingComponent = useMemo(() => (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0D0D0D' }}>
      <div className="text-center">
        <div className="text-2xl font-bold mb-4" style={{ fontFamily: 'Bebas Neue', color: '#F2F0F0' }}>
          ЗАГРУЗКА СЕКЦИИ...
        </div>
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  ), []);

  const ErrorComponent = useMemo(() => (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0D0D0D' }}>
      <div className="text-center">
        <div className="text-2xl font-bold mb-4" style={{ fontFamily: 'Bebas Neue', color: '#D71920' }}>
          ОШИБКА ЗАГРУЗКИ
        </div>
        <div className="text-lg" style={{ fontFamily: 'Inter', color: '#B8B8B8' }}>
          Не удалось загрузить данные секции
        </div>
      </div>
    </div>
  ), []);

  if (loading) return LoadingComponent;
  if (error || !data) return ErrorComponent;

  // Мобильная версия рендера
  if (isMobile && data) {
    return (
      <section 
        ref={sectionRef}
        className="scroll-section relative"
        style={{ 
          backgroundColor: '#0D0D0D',
          // Высота секции: заголовок + общий блок (текст + видео) + высота для прокрутки всех текстов
          minHeight: `calc(20vh + 90vh + ${data.text_blocks.length * 100}vh)`
        }}
      >
        <PageContainer>
          {/* Заголовок и подзаголовок */}
          <div className="col-start-1 col-end-13 text-left md:text-center mb-0 px-4 md:px-16">
            <h2 
              className="mb-0 text-4xl md:text-6xl"
              style={{
                fontFamily: 'Bebas Neue',
                fontWeight: 400,
                color: '#F2F0F0',
                textTransform: 'uppercase'
              }}
            >
              {data.section_title}
            </h2>
            <p 
              className="text-sm md:text-lg"
              style={{
                fontFamily: 'Inter',
                color: '#F2F0F0',
                maxWidth: '600px',
                margin: '0'
              }}
            >
              {data.section_subtitle}
            </p>
          </div>

          {/* Общий контейнер для текстов и видео - фиксируется вместе */}
          <div 
            ref={mobileContentContainerRef}
            className="col-start-1 col-end-13 px-4"
            style={{
              position: isMobileUnfixed ? 'relative' : (isMobileFixed ? 'fixed' : 'relative'),
              top: isMobileUnfixed ? `${mobileUnfixedOffset}px` : (isMobileFixed ? `${mobileFixedPosition.top}px` : 'auto'),
              left: isMobileUnfixed ? 'auto' : (isMobileFixed ? `${mobileFixedPosition.left}px` : 'auto'),
              width: isMobileUnfixed ? '100%' : (isMobileFixed ? `${mobileFixedPosition.width}px` : '100%'),
              willChange: isMobileFixed ? 'transform, opacity' : 'auto'
            }}
          >
            {/* Текстовые блоки - сверху */}
            <div 
              data-mobile-text-container
              className="z-20 mb-4"
              style={{ 
                height: '40vh', 
                minHeight: '300px',
                position: 'relative'
              }}
            >
              <div className="relative h-full">
                {data.text_blocks.map((block, index) => (
                  <div
                    key={block.id}
                    ref={(el) => {
                      if (el) textBlocksRef.current[index] = el;
                    }}
                    className="absolute inset-0 flex flex-col justify-center transition-opacity duration-500"
                    style={{ 
                      opacity: textOpacities[index] || 0,
                      pointerEvents: textOpacities[index] > 0.5 ? 'auto' : 'none'
                    }}
                  >
                    <h3 
                      className="text-2xl md:text-3xl font-bold mb-4"
                      style={{ 
                        fontFamily: 'Bebas Neue',
                        color: '#D71920'
                      }}
                    >
                      {block.title}
                    </h3>
                    <p 
                      className="text-sm md:text-lg"
                      style={{ 
                        fontFamily: 'Inter',
                        color: '#F2F0F0'
                      }}
                    >
                      {block.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Видео - снизу, обрезается на 25% сверху и снизу (только по высоте) */}
            <div 
              ref={videoContainerRef}
              className="z-10"
              style={{ 
                height: '50vh', // Видимая высота: 25% сверху + 25% снизу = 50% видимой части
                minHeight: '300px',
                overflow: 'hidden', // Скрываем обрезанные части
                position: 'relative',
                width: '100%' // Полная ширина без обрезки
              }}
            >
              <div 
                className="w-full flex items-center justify-center"
                style={{
                  height: '200%', // Увеличиваем высоту в 2 раза для обрезки
                  transform: 'translateY(-25%)', // Сдвигаем вверх на 25%, чтобы показать среднюю часть
                  transformOrigin: 'center center',
                  willChange: 'transform',
                  width: '100%' // Полная ширина без обрезки
                }}
              >
                <video
                  ref={videoRef}
                  className="rounded-2xl"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover', // Покрывает всю область, сохраняя пропорции
                    objectPosition: 'center',
                    display: 'block'
                  }}
                  preload="metadata"
                  muted
                  playsInline
                >
                  <source src={data.video_url} type="video/mp4" />
                  Ваш браузер не поддерживает видео.
                </video>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>
    );
  }

  // Десктопная версия (без изменений)
  // Вычисляем минимальную высоту секции с учетом видео в relative позиции
  const videoHeightVh = 80; // Высота видео в vh
  const targetDistanceVh = 50; // Расстояние от низа до центра видео в vh
  // Высота = текстовые блоки + пространство для видео (50vh от низа + половина высоты видео)
  const minSectionHeight = data ? (data.text_blocks.length * 80 + targetDistanceVh + videoHeightVh / 2) : 0;
  
  return (
    <section 
      ref={sectionRef}
      className="scroll-section relative"
      style={{ 
        backgroundColor: '#0D0D0D',
        overflow: 'hidden',
        // Высота секции: высота для всех текстовых блоков + пространство для видео в relative
        minHeight: `${minSectionHeight}vh`
      }}
    >
      <PageContainer>
        {/* Заголовок и подзаголовок */}
        <div className="col-start-1 col-end-13 text-center mb-0 px-16">
          <h2 
            className="mb-0"
            style={{
              fontFamily: 'Bebas Neue',
              fontSize: '64px',
              fontWeight: 400,
              color: '#F2F0F0',
              textTransform: 'uppercase'
            }}
          >
            {data.section_title}
          </h2>
          <p 
            className="text-lg"
            style={{
              fontFamily: 'Inter',
              color: '#F2F0F0',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            {data.section_subtitle}
          </p>
        </div>

        {/* Левая часть - текстовые блоки */}
        <div 
          className="col-start-2 col-end-7 h-full z-10"
          data-text-container
        >
          
          <div className="space-y-0">
            {data.text_blocks.map((block, index) => (
              <div
                key={block.id}
                ref={(el) => {
                  if (el) textBlocksRef.current[index] = el;
                }}
                data-text-item
                style={{ 
                  ...textBlockStyles
                }}
              >
                <div className="w-full text-left">
                  <div className="relative h-full">
                    <div className="absolute inset-0 flex flex-col justify-between">
                      <h3 
                        className="text-3xl font-bold"
                        style={{ 
                          fontFamily: 'Bebas Neue',
                          color: '#D71920'
                        }}
                      >
                        {block.title}
                      </h3>
                      <p 
                        className="text-lg"
                        style={{ 
                          fontFamily: 'Inter',
                          color: '#F2F0F0'
                        }}
                      >
                        {block.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Правая часть - видео */}
        <div 
          ref={videoContainerRef}
          data-video-container
          className={`col-start-7 col-end-12 flex items-center justify-center z-5 ${
            isLastTextUnfixed ? 'relative' :
            isVideoFixed ? 'fixed' : 'relative'
          }`}
          style={{ 
            height: '80vh',
            minHeight: '600px',
            transform: (isVideoFixed && !isLastTextUnfixed) ? 'translateY(-50%)' : 'none',
            left: isLastTextUnfixed ? 'auto' : (isVideoFixed ? fixedPosition.left : 'auto'),
            width: isLastTextUnfixed ? 'auto' : (isVideoFixed ? fixedPosition.width : 'auto'),
            top: isLastTextUnfixed ? `${lastTextTopOffset}px` : (isVideoFixed ? '50%' : 'auto'),
            position: isLastTextUnfixed ? 'relative' : undefined,
            transition: 'none' // Отключаем transition для избежания скачков
          }}
        >
          <div className="w-full h-full">
            <div 
              className="w-full h-full flex items-center justify-center"
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            >
              <video
                ref={videoRef}
                className="rounded-2xl"
                style={videoStyles}
                preload="metadata"
                muted
                playsInline
              >
                <source src={data.video_url} type="video/mp4" />
                Ваш браузер не поддерживает видео.
              </video>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
};

export default ScrollSection;
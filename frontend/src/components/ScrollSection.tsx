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
  const textBlocksRef = useRef<HTMLDivElement[]>([]);
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

  // Оптимизированная функция обработки скролла (как в AboutSection)
  const handleScroll = useCallback(() => {
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
      // Разфиксация когда центр первого текста ниже центра
      else if (firstTextCenter > viewportCenter && isVideoFixed && !isLastTextUnfixed) {
        setIsVideoFixed(false);
      }
    }

    // 2. ЛОГИКА РАЗФИКСАЦИИ ПОСЛЕДНЕГО ТЕКСТА
    const lastTextBlock = textBlocks[textBlocks.length - 1];
    if (lastTextBlock) {
      const lastTextRect = lastTextBlock.getBoundingClientRect();
      const lastTextCenter = lastTextRect.top + lastTextRect.height / 2;
      
      // Разфиксация: когда центр последнего текста выше центра видимой области
      if (lastTextCenter < viewportCenter && !isLastTextUnfixed) {
        setIsLastTextUnfixed(true);
        
        // Вычисляем отступ так, чтобы видео располагалось на том же уровне
        const textContainer = section.querySelector('[data-text-container]');
        if (textContainer) {
          const textContainerRect = textContainer.getBoundingClientRect();
          const lastTextTopInContainer = lastTextRect.top - textContainerRect.top;
          
          // Вычисляем высоту: (количество текстов - 1) × (высота текста + отступ)
          const textCount = textBlocks.length;
          const textHeight = lastTextRect.height;
          const gapBetweenTexts = 0; // У нас нет отступов между текстами
          
          const totalHeight = (textCount - 1) * (textHeight + gapBetweenTexts);
          const totalOffset = totalHeight;
          
          setLastTextTopOffset(totalOffset);
        }
      }
      // Фиксация: когда центр последнего текста ниже центра видимой области
      else if (lastTextCenter >= viewportCenter && isLastTextUnfixed) {
        setIsLastTextUnfixed(false);
      }
    }

    // 3. ЛОГИКА СМЕНЫ АКТИВНОГО ТЕКСТА - убрана, теперь обычный скролл
  }, [isVideoFixed, isLastTextUnfixed]);

  // Основной useEffect с оптимизациями
  useEffect(() => {
    if (!data || !videoRef.current || textBlocksRef.current.length === 0) return;

    const video = videoRef.current;
    const section = sectionRef.current;
    
    if (!section) return;

    // Устанавливаем начальное состояние видео
    video.currentTime = 0;
    video.muted = true;

    // Обработчик загрузки метаданных видео
    const handleVideoLoad = () => {
      const videoDuration = video.duration;
      console.log('ScrollSection: Video duration:', videoDuration);
      // Убираем динамическую установку высоты, чтобы избежать лишнего скролла
    };

    // Если метаданные уже загружены
    if (video.readyState >= 1) {
      handleVideoLoad();
    } else {
      video.addEventListener('loadedmetadata', handleVideoLoad);
    }

    // Запускаем анимацию
    animationFrameRef.current = requestAnimationFrame(scrollPlay);

    // Добавляем обработчик скролла
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
  }, [data, scrollPlay, handleScroll]);

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

  return (
    <section 
      ref={sectionRef}
      className="scroll-section relative pb-16"
      style={{ 
        backgroundColor: '#0D0D0D',
        overflow: 'hidden',
        minHeight: `${data.text_blocks.length * 80}vh`
      }}
    >
      <PageContainer>
        {/* Заголовок и подзаголовок */}
        <div className="col-start-1 col-end-13 text-center mb-16 px-16">
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
                  <h3 
                    className="text-3xl font-bold mb-4"
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
            top: isLastTextUnfixed ? `${lastTextTopOffset}px` : (isVideoFixed ? '50%' : 'auto')
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
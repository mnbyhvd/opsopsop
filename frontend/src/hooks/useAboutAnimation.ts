import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AboutItem {
  id: number;
  title: string;
  description: string;
}

export const useAboutAnimation = (aboutItems: AboutItem[]) => {
  const sectionRef = useRef<HTMLElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [activeTextIndex, setActiveTextIndex] = useState(0);
  const [isTextFixed, setIsTextFixed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const lastUpdateTime = useRef(0);

  // Функция для плавной смены текста с эффектом dissolve
  const changeTextWithDissolve = (newIndex: number) => {
    if (newIndex === activeTextIndex || isTransitioning) return;
    
    // Останавливаем текущую анимацию
    gsap.killTweensOf(textContainerRef.current);
    
    setIsTransitioning(true);
    
    // Fade out текущего текста
    gsap.to(textContainerRef.current, {
      opacity: 0,
      duration: 0.2, // Уменьшаем время для быстрого отклика
      ease: "power2.inOut",
      onComplete: () => {
        // Меняем текст
        setActiveTextIndex(newIndex);
        
        // Fade in нового текста
        gsap.to(textContainerRef.current, {
          opacity: 1,
          duration: 0.2, // Уменьшаем время для быстрого отклика
          ease: "power2.inOut",
          onComplete: () => {
            setIsTransitioning(false);
          }
        });
      }
    });
  };

  useEffect(() => {
    if (!sectionRef.current || !textContainerRef.current || !imageContainerRef.current || aboutItems.length === 0) {
      return;
    }

    // Очищаем все предыдущие триггеры
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // Создаем триггеры для каждой пары
    aboutItems.forEach((item, index) => {
      const imageBlock = imageContainerRef.current?.querySelector(`[data-image-block="${index + 1}"]`);
      if (!imageBlock) return;

      const isFirst = index === 0;
      const isLast = index === aboutItems.length - 1;

      // Триггер для фиксации текста когда картинка в центре
      ScrollTrigger.create({
        trigger: imageBlock,
        start: "center center",
        end: isLast ? "bottom center" : "bottom center",
        onEnter: () => {
          console.log(`Image ${index + 1} in center - fixing text`);
          
          // Принудительно обновляем состояние без анимации при быстром скролле
          if (isFirst) {
            setActiveTextIndex(index);
            setIsTextFixed(true);
          } else {
            // Для остальных пар - меняем текст с эффектом dissolve
            changeTextWithDissolve(index);
          }
        },
        onLeave: () => {
          if (isLast) {
            console.log(`Last image leaving center - unfixing text`);
            setIsTextFixed(false);
          }
        },
        onLeaveBack: () => {
          if (isFirst) {
            console.log(`First image leaving center on scroll back - unfixing text`);
            setIsTextFixed(false);
          } else {
            // Для средних пар - возвращаемся к предыдущему тексту
            const prevIndex = index - 1;
            if (prevIndex >= 0) {
              changeTextWithDissolve(prevIndex);
            }
          }
        },
        // Добавляем дополнительные настройки для надежности
        refreshPriority: -1,
        invalidateOnRefresh: true,
        fastScrollEnd: true
      });
    });

    // Добавляем общий триггер для отслеживания позиции скролла
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        // Принудительно обновляем состояние на основе позиции скролла
        const scrollY = self.scroll();
        const sectionTop = sectionRef.current?.offsetTop || 0;
        const sectionHeight = sectionRef.current?.offsetHeight || 0;
        const viewportHeight = window.innerHeight;
        
        // Вычисляем, какая картинка должна быть активной
        const relativeScroll = scrollY - sectionTop;
        const itemHeight = sectionHeight / aboutItems.length;
        const currentIndex = Math.floor(relativeScroll / itemHeight);
        
        if (currentIndex >= 0 && currentIndex < aboutItems.length) {
          const imageBlock = imageContainerRef.current?.querySelector(`[data-image-block="${currentIndex + 1}"]`);
          if (imageBlock) {
            const rect = imageBlock.getBoundingClientRect();
            const isInCenter = rect.top <= viewportHeight / 2 && rect.bottom >= viewportHeight / 2;
            
            if (isInCenter && activeTextIndex !== currentIndex) {
              const now = Date.now();
              // Debounce: обновляем не чаще чем раз в 100ms
              if (now - lastUpdateTime.current > 100) {
                console.log(`Fast scroll correction: switching to text ${currentIndex + 1}`);
                setActiveTextIndex(currentIndex);
                setIsTextFixed(true);
                lastUpdateTime.current = now;
              }
            }
          }
        }
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [aboutItems, activeTextIndex]);

  return {
    sectionRef,
    textContainerRef,
    imageContainerRef,
    activeTextIndex,
    isTextFixed,
    isTransitioning
  };
};
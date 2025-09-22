import { useEffect, useRef, useState, useCallback } from 'react';
import { useInView, useScroll, useTransform } from 'framer-motion';

interface AboutItem {
  id: number;
  title: string;
  description: string;
}

export const useAboutAnimationFramer = (aboutItems: AboutItem[]) => {
  const sectionRef = useRef<HTMLElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [activeTextIndex, setActiveTextIndex] = useState(0);
  const [isTextFixed, setIsTextFixed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Используем Framer Motion для отслеживания скролла
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
    layoutEffect: false
  });

  // Проверяем, видна ли секция
  const isInView = useInView(sectionRef, {
    amount: 0.1,
    once: false
  });

  // Трансформации для анимации текста
  const textY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  // Функция для плавной смены текста
  const changeText = useCallback((newIndex: number) => {
    if (newIndex === activeTextIndex || isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Простая смена текста с задержкой для плавности
    setTimeout(() => {
      setActiveTextIndex(newIndex);
      setIsTransitioning(false);
    }, 150);
  }, [activeTextIndex, isTransitioning]);

  // Функция для определения активного индекса на основе скролла
  const updateActiveIndex = useCallback(() => {
    if (!sectionRef.current || aboutItems.length === 0) return;

    const sectionRect = sectionRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const sectionHeight = sectionRect.height;
    
    // Вычисляем прогресс скролла внутри секции
    const scrollProgress = Math.max(0, Math.min(1, 
      (viewportHeight - sectionRect.top) / sectionHeight
    ));
    
    // Определяем активный индекс на основе прогресса
    const newIndex = Math.floor(scrollProgress * aboutItems.length);
    const clampedIndex = Math.max(0, Math.min(aboutItems.length - 1, newIndex));
    
    if (clampedIndex !== activeTextIndex) {
      changeText(clampedIndex);
    }

    // Определяем, должен ли текст быть зафиксирован
    const shouldBeFixed = scrollProgress > 0.1 && scrollProgress < 0.9;
    if (shouldBeFixed !== isTextFixed) {
      setIsTextFixed(shouldBeFixed);
    }
  }, [aboutItems.length, activeTextIndex, isTextFixed, changeText]);

  // Обновляем состояние при скролле
  useEffect(() => {
    const handleScroll = () => {
      updateActiveIndex();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Первоначальная проверка
    updateActiveIndex();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [aboutItems, activeTextIndex, isTextFixed, updateActiveIndex]);

  // Анимация для изображений
  const getImageVariants = (index: number) => ({
    initial: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: index * 0.1
      }
    },
    exit: { 
      opacity: 0, 
      y: -50,
      scale: 0.9,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  });

  // Анимация для текста
  const getTextVariants = () => ({
    initial: { 
      opacity: 0, 
      y: 30,
      x: -20
    },
    animate: { 
      opacity: 1, 
      y: 0,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -30,
      x: 20,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  });

  return {
    sectionRef,
    textContainerRef,
    imageContainerRef,
    activeTextIndex,
    isTextFixed,
    isTransitioning,
    isInView,
    textY,
    textOpacity,
    getImageVariants,
    getTextVariants
  };
};

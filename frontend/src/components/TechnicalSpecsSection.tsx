import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTechnicalSpecs } from '../hooks/useTechnicalSpecs';
import PageContainer from './PageContainer';

gsap.registerPlugin(ScrollTrigger);

const TechnicalSpecsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const { technicalSpecs, loading } = useTechnicalSpecs();
  const [animatedValues, setAnimatedValues] = useState<number[]>([]);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Функция анимации счетчика
  const animateCounter = (targetValue: number, index: number, duration: number = 2000) => {
    const startTime = Date.now();
    const startValue = 0;
    
    const updateCounter = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOut);
      
      setAnimatedValues(prev => {
        const newValues = [...prev];
        newValues[index] = currentValue;
        return newValues;
      });
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };
    
    requestAnimationFrame(updateCounter);
  };

  // Intersection Observer для запуска анимации
  useEffect(() => {
    if (!sectionRef.current || hasAnimated || technicalSpecs.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            
            // Инициализируем массив анимированных значений
            setAnimatedValues(new Array(technicalSpecs.length).fill(0));
            
            // Запускаем анимацию для каждого числа с небольшой задержкой
            technicalSpecs.forEach((spec, index) => {
              if (spec.value) {
                const targetValue = parseInt(spec.value);
                setTimeout(() => {
                  animateCounter(targetValue, index, 2000);
                }, index * 200); // Задержка 200мс между анимациями
              }
            });
          }
        });
      },
      { threshold: 0.3 } // Анимация запускается когда 30% элемента видно
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, [technicalSpecs, hasAnimated]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <p style={{ color: '#F2F0F0' }}>Загрузка технических характеристик...</p>
      </div>
    );
  }

  if (technicalSpecs.length === 0) {
    return (
      <div className="py-20 text-center">
        <p style={{ color: '#F2F0F0' }}>Нет технических характеристик для отображения</p>
      </div>
    );
  }

  return (
    <section 
      ref={sectionRef}
      className="py-20 relative"
    >
      {/* Background images */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left bottom image */}
        <div 
          className="absolute opacity-20"
          style={{ 
            backgroundImage: 'url(/3.png)', 
            backgroundSize: 'contain', 
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            width: '279px',
            height: '239px',
            left: '-2%',
            bottom: '-25%',
            transform: 'rotate(20deg)',
            animation: 'floatLeft 14s ease-in-out infinite'
          }}
        />
        {/* Right top image */}
        <div 
          className="absolute opacity-20"
          style={{ 
            backgroundImage: 'url(/2.png)', 
            backgroundSize: 'contain', 
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            width: '400px',
            height: '337px',
            right: '1%',
            top: '30%',
            transform: 'rotate(-157deg)',
            animation: 'floatRight 16s ease-in-out infinite'
          }}
        />
      </div>

      <PageContainer>
        {/* Блок с техническими характеристиками */}
        <div 
          ref={el => cardsRef.current[0] = el}
          className="col-start-1 col-end-13 glass py-12"
          style={{ 
            paddingLeft: '8.333%', 
            paddingRight: '8.333%',
            borderRadius: '30px'
          }}
        >
            {/* Заголовок внутри блока */}
            <div className="mb-12">
              <div className="mb-4">
                <div className="about-title-block">
                  <div className="about-title-dot"></div>
                  <h2 
                    className="about-title" 
                    style={{ color: '#D71920' }}
                  >
                    о системе
                  </h2>
                </div>
              </div>
              <h2 
                className="uppercase text-left"
                style={{
                  fontFamily: 'Roboto Flex',
                  fontWeight: 478,
                  fontSize: '48px',
                  lineHeight: '100%',
                  letterSpacing: '-2px',
                  fontVariationSettings: '"wdth" 10, "YTUC" 850, "YTAS" 900',
                  color: '#F2F0F0'
                }}
              >
                Технические характеристики в цифрах
              </h2>
            </div>

            {/* Сетка характеристик */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {technicalSpecs.map((spec, index) => (
                <div key={spec.id} className="text-left">
                  <div 
                    className="text-6xl font-bold mb-4"
                    style={{
                      color: '#D71920'
                    }}
                  >
                    {animatedValues[index] !== undefined ? animatedValues[index] : 0}
                  </div>
                  <p 
                    className="text-sm leading-relaxed"
                    style={{
                      fontFamily: 'Inter',
                      fontWeight: 400,
                      color: '#F2F0F0'
                    }}
                  >
                    {spec.title}
                  </p>
                </div>
              ))}
            </div>
        </div>
      </PageContainer>
    </section>
  );
};

export default TechnicalSpecsSection;

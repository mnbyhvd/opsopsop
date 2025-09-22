import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TechnicalSpecsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Анимация появления блока при скролле
    const card = cardsRef.current[0];
    if (card) {
      gsap.fromTo(card, 
        {
          opacity: 0,
          y: 50,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-20"
    >
      <div className="container mx-auto px-4">
        {/* Заголовок секции */}
        <div className="text-center mb-16">
          <div className="mb-4">
            <span 
              className="inline-block px-3 py-1 rounded-full text-sm"
              style={{
                backgroundColor: '#D71920',
                color: '#ffffff'
              }}
            >
              • о системе
            </span>
          </div>
          <h2 
            className="mb-6 uppercase"
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

        {/* Блок с техническими характеристиками */}
        <div className="max-w-4xl mx-auto">
          <div 
            ref={el => cardsRef.current[0] = el}
            className="relative bg-gray-800 rounded-2xl p-12 border border-gray-700"
            style={{ backgroundColor: '#2A2A2A' }}
          >
            {/* Сетка характеристик */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {/* 4 адресных шлейфа */}
              <div className="text-center">
                <div 
                  className="text-6xl font-bold mb-4"
                  style={{
                    fontFamily: 'Roboto Flex',
                    color: '#D71920'
                  }}
                >
                  4
                </div>
                <p 
                  className="text-sm leading-relaxed"
                  style={{
                    fontFamily: 'Inter',
                    fontWeight: 400,
                    color: '#F2F0F0'
                  }}
                >
                  Адресных шлейфа на панель
                </p>
              </div>

              {/* 199 извещателей */}
              <div className="text-center">
                <div 
                  className="text-6xl font-bold mb-4"
                  style={{
                    fontFamily: 'Roboto Flex',
                    color: '#D71920'
                  }}
                >
                  199
                </div>
                <p 
                  className="text-sm leading-relaxed"
                  style={{
                    fontFamily: 'Inter',
                    fontWeight: 400,
                    color: '#F2F0F0'
                  }}
                >
                  Извещателей на шлейф
                </p>
              </div>

              {/* 1000 метров */}
              <div className="text-center">
                <div 
                  className="text-6xl font-bold mb-4"
                  style={{
                    fontFamily: 'Roboto Flex',
                    color: '#D71920'
                  }}
                >
                  1000
                </div>
                <p 
                  className="text-sm leading-relaxed"
                  style={{
                    fontFamily: 'Inter',
                    fontWeight: 400,
                    color: '#F2F0F0'
                  }}
                >
                  Метров - максимальная длина шлейфа
                </p>
              </div>

              {/* 32 панели */}
              <div className="text-center">
                <div 
                  className="text-6xl font-bold mb-4"
                  style={{
                    fontFamily: 'Roboto Flex',
                    color: '#D71920'
                  }}
                >
                  32
                </div>
                <p 
                  className="text-sm leading-relaxed"
                  style={{
                    fontFamily: 'Inter',
                    fontWeight: 400,
                    color: '#F2F0F0'
                  }}
                >
                  Панели в единой сети
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnicalSpecsSection;

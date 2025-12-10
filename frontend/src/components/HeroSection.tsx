import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

interface HeroData {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  background_image?: string;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

const HeroSection: React.FC = () => {
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      const response = await apiService.getHero();
      if (response.success && response.data) {
        setHeroData(response.data as HeroData);
      }
    } catch (error) {
      console.error('Error fetching hero data:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToContactForm = () => {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  if (loading) {
    return (
      <section 
        className="h-[100vh] flex items-center justify-center relative overflow-hidden"
      >
        <div className="text-center">
          <div className="text-xl">Загрузка...</div>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="h-[100vh] flex items-center justify-center relative overflow-hidden"
    >
      {/* Background images with exact positioning (Figma specs) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top-left (hero1.png) */}
        <div 
          className="hero-image-top-left"
          style={{ 
            position: 'absolute',
            backgroundImage: 'url(/hero1.png)', 
            backgroundSize: 'contain', 
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            width: '19%',
            height: '20%',
            left: '2%',
            top: '5%',
            transform: 'rotate(352)',
            transformOrigin: 'center center',
            willChange: 'transform'
          }}
        />

        {/* Top-right (hero4.png) */}
        <div 
          className="hero-image-top-right"
          style={{ 
            position: 'absolute',
            backgroundImage: 'url(/hero4.png)', 
            backgroundSize: 'contain', 
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            width: '10%',
            height: '12%',
            left: '88%',
            top: '5%',
            transform: 'rotate(25)',
            transformOrigin: 'center center',
            willChange: 'transform'
          }}
        />

        {/* Bottom-left (hero3.png) */}
        <div 
          className="hero-image-bottom-left"
          style={{ 
            position: 'absolute',
            backgroundImage: 'url(/hero3.png)', 
            backgroundSize: 'contain', 
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            width: '12%',
            height: '17%',
            left: '2%',
            top: '75%',
            transform: 'rotate(18)',
            transformOrigin: 'center center',
            willChange: 'transform'
          }}
        />

        {/* Bottom-right (hero2.png) */}
        <div 
          className="hero-image-bottom-right"
          style={{ 
            position: 'absolute',
            backgroundImage: 'url(/hero2.png)', 
            backgroundSize: 'contain', 
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            width: '17%',
            height: '30%',
            left: '83%',
            top: '65%',
            transform: 'rotate(347)',
            transformOrigin: 'center center',
            willChange: 'transform'
          }}
        />
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 relative z-10 flex flex-col items-start md:items-center justify-start md:justify-center h-full pt-[45vh] md:pt-0">
        <h1 
          className="mb-4 uppercase text-left md:text-center text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl w-full md:w-auto"
          style={{
            fontFamily: 'Inter',
            fontWeight: 700,
            lineHeight: '100%',
            letterSpacing: '0%'
          }}
          dangerouslySetInnerHTML={{
            __html: heroData?.title || 'АПС МАСТЕР:<br />СКОРОСТЬ И НАДЕЖНОСТЬ'
          }}
        />
        
        {heroData?.subtitle && (
          <h2 
            className="mb-6 text-left md:text-center text-lg sm:text-xl md:text-2xl lg:text-3xl w-full md:w-auto"
            style={{
              fontFamily: 'Inter',
              fontWeight: 500,
              lineHeight: '120%',
              letterSpacing: '0%',
              color: '#666'
            }}
          >
            {heroData.subtitle}
          </h2>
        )}
        
        <p 
          className="mb-10 max-w-3xl w-full md:w-auto mx-0 md:mx-auto text-left md:text-center px-0 md:px-4 text-sm sm:text-base md:text-lg lg:text-xl"
          style={{
            fontFamily: 'Inter',
            fontWeight: 400,
            lineHeight: '140%',
            letterSpacing: '0%'
          }}
        >
          {heroData?.description || 'Интеллектуальные датчики пожарной безопасности с самым быстрым временем срабатывания на рынке. Получите расчёт стоимости и техническую документацию.'}
        </p>
        
        <button 
          onClick={scrollToContactForm}
          className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-4 rounded-xl font-medium text-base sm:text-lg md:text-xl transition-all self-start md:self-center"
          style={{ 
            backgroundColor: '#E0DADA', 
            color: '#0D0D0D',
            border: '1px solid #E0DADA',
            fontFamily: 'Inter'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = '#0D0D0D';
            (e.currentTarget as HTMLButtonElement).style.color = '#ffffff';
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#ffffff';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = '#E0DADA';
            (e.currentTarget as HTMLButtonElement).style.color = '#0D0D0D';
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#E0DADA';
          }}
        >
          Оставить заявку
        </button>
      </div>
    </section>
  );
};

export default HeroSection;

import React, { useState, useEffect } from 'react';

interface HeroData {
  id: number;
  title: string;
  description: string;
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
      const response = await fetch('/api/hero');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setHeroData(data.data);
        }
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
      {/* Background images with exact positioning */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute opacity-25"
          style={{ 
            backgroundImage: 'url(/1.png)', 
            backgroundSize: 'contain', 
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            width: '572.67px',
            height: '482.76px',
            left: '3%',
            top: '50%',
            transform: 'translateY(-50%) rotate(-15.47deg)',
            animation: 'floatLeft 14s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute opacity-25"
          style={{ 
            backgroundImage: 'url(/2.png)', 
            backgroundSize: 'contain', 
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            width: '594.04px',
            height: '500.78px',
            right: '3%',
            top: '50%',
            transform: 'translateY(-50%) rotate(12.06deg)',
            animation: 'floatRight 16s ease-in-out infinite'
          }}
        />
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 text-center relative z-10 flex flex-col items-center justify-center h-full">
        <h1 
          className="mb-8 uppercase text-center"
          style={{
            fontFamily: 'Inter',
            fontWeight: 700,
            fontSize: '64px',
            lineHeight: '100%',
            letterSpacing: '0%'
          }}
        >
          {heroData?.title || 'АПС МАСТЕР:<br />СКОРОСТЬ И НАДЕЖНОСТЬ'}
        </h1>
        
        <p 
          className="mb-10 max-w-3xl mx-auto text-center"
          style={{
            fontFamily: 'Inter',
            fontWeight: 400,
            fontSize: '20px',
            lineHeight: '140%',
            letterSpacing: '0%'
          }}
        >
          {heroData?.description || 'Интеллектуальные датчики пожарной безопасности с самым быстрым временем срабатывания на рынке. Получите расчёт стоимости и техническую документацию.'}
        </p>
        
        <button 
          onClick={scrollToContactForm}
          className="inline-flex items-center px-10 py-4 rounded-xl font-medium text-xl transition-all"
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

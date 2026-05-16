import React from 'react';
import { Helmet } from 'react-helmet-async';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import TechnicalSpecsSection from '../components/TechnicalSpecsSection';
import ProductsSection from '../components/ProductsSection';
import VideoPresentationsSection from '../components/VideoPresentationsSection';
import DownloadInfoSection from '../components/DownloadInfoSection';
import ScrollSection from '../components/ScrollSection';
import { useHomeBlocks } from '../hooks/useHomeBlocks';

const Home: React.FC = () => {
  const { isEnabled } = useHomeBlocks();

  return (
    <div className="overflow-x-hidden" style={{ backgroundColor: 'var(--bg)' }}>
      <Helmet>
        <title>Автоматическая система пожарной сигнализации - Мастер</title>
        <meta name="description" content="Современная интеллектуальная система пожарной сигнализации с интуитивным управлением, которая обеспечивает непрерывный мониторинг и быстрое реагирование." />
        <link rel="canonical" href="https://sps-master.ru/" />
      </Helmet>
      {/* Hero Section */}
      {isEnabled('hero') && <HeroSection />}

      {/* About Section */}
      {isEnabled('about_main') && <AboutSection />}

      {/* Technical Specs Section */}
      {isEnabled('technical_specs') && <TechnicalSpecsSection />}

      {/* Additional About Section */}
      {isEnabled('about_secondary') && <AboutSection group="secondary" label="решения" />}

      {/* Products Section */}
      {isEnabled('products') && <ProductsSection />}

      {/* Video Presentations Section */}
      {isEnabled('video_presentations') && <VideoPresentationsSection />}


      {/* Download Info Section */}
      {isEnabled('downloads') && <DownloadInfoSection />}
      {isEnabled('scroll_video') && <ScrollSection />}
    </div>
  );
};

export default Home;

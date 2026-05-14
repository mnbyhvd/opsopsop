import React from 'react';
import { Helmet } from 'react-helmet-async';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import TechnicalSpecsSection from '../components/TechnicalSpecsSection';
import ProductsSection from '../components/ProductsSection';
import VideoPresentationsSection from '../components/VideoPresentationsSection';
import DownloadInfoSection from '../components/DownloadInfoSection';
import ScrollSection from '../components/ScrollSection';
import PageContainer from '../components/PageContainer';

const Home: React.FC = () => {

  return (
    <div className="overflow-x-hidden" style={{ backgroundColor: 'var(--bg)' }}>
      <Helmet>
        <title>Автоматическая система пожарной сигнализации - Мастер</title>
        <meta name="description" content="Современная интеллектуальная система пожарной сигнализации с интуитивным управлением, которая обеспечивает непрерывный мониторинг и быстрое реагирование." />
        <link rel="canonical" href="https://sps-master.ru/" />
      </Helmet>
      {/* Hero Section */}
      <HeroSection />

      {/* About Section */}
      <AboutSection />

      {/* Technical Specs Section */}
      <TechnicalSpecsSection />

      {/* Additional About Section */}
      <AboutSection group="secondary" label="решения" />

      {/* Products Section */}
      <ProductsSection />

      {/* Video Presentations Section */}
      <VideoPresentationsSection />


      {/* Download Info Section */}
      <DownloadInfoSection />
      <ScrollSection />
    </div>
  );
};

export default Home;

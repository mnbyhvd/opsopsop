import React from 'react';
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
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <HeroSection />

      {/* About Section */}
      <AboutSection />

      {/* Technical Specs Section */}
      <TechnicalSpecsSection />

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

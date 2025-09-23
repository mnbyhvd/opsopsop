import React, { useState } from 'react';
import AboutAdmin from './AboutAdmin';
import TechnicalSpecsAdmin from './TechnicalSpecsAdmin';
import HeroAdmin from './HeroAdmin';
import ProductsAdmin from './ProductsAdmin';
import VideosAdmin from './VideosAdmin';
import DownloadsAdmin from './DownloadsAdmin';
import FooterAdmin from './FooterAdmin';
import LeadsAdmin from './LeadsAdmin';
import ProductModalsAdmin from './ProductModalsAdmin';
import RequisitesAdmin from './RequisitesAdmin';
import ScrollSectionAdmin from './ScrollSectionAdmin';

type AdminSection = 'hero' | 'about' | 'technical' | 'products' | 'videos' | 'downloads' | 'footer' | 'leads' | 'product-modals' | 'requisites' | 'scroll-section';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('hero');

  const sections = [
    { id: 'hero' as AdminSection, name: 'Hero секция', description: 'Главный экран с заголовком и кнопкой' },
    { id: 'about' as AdminSection, name: 'О системе', description: 'Блок с анимированными парами текст-изображение' },
    { id: 'technical' as AdminSection, name: 'Технические характеристики', description: 'Блок с цифрами и описаниями' },
    { id: 'products' as AdminSection, name: 'Продукция', description: 'Управление продуктами и их страницами' },
    { id: 'videos' as AdminSection, name: 'Видео-презентации', description: 'Управление видео контентом' },
    { id: 'downloads' as AdminSection, name: 'Документы', description: 'Управление документами и сертификатами' },
    { id: 'footer' as AdminSection, name: 'Футер', description: 'Контакты и форма заявки' },
    { id: 'leads' as AdminSection, name: 'Заявки', description: 'Управление заявками с сайта' },
    { id: 'product-modals' as AdminSection, name: 'Модальные окна', description: 'Управление модальными окнами продуктов' },
    { id: 'requisites' as AdminSection, name: 'Реквизиты', description: 'Управление реквизитами компании' },
    { id: 'scroll-section' as AdminSection, name: 'Scroll Section', description: 'Управление секцией с видео анимацией' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'hero':
        return <HeroAdmin />;
      case 'about':
        return <AboutAdmin />;
      case 'technical':
        return <TechnicalSpecsAdmin />;
      case 'products':
        return <ProductsAdmin />;
      case 'videos':
        return <VideosAdmin />;
      case 'downloads':
        return <DownloadsAdmin />;
      case 'footer':
        return <FooterAdmin />;
      case 'leads':
        return <LeadsAdmin />;
      case 'product-modals':
        return <ProductModalsAdmin />;
      case 'requisites':
        return <RequisitesAdmin />;
      case 'scroll-section':
        return <ScrollSectionAdmin />;
      default:
        return <HeroAdmin />;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0D0D0D', color: '#F2F0F0' }}>
      {/* Header */}
      <header 
        className="border-b backdrop-blur-md"
        style={{ 
          borderColor: 'rgba(255,255,255,0.1)',
          backgroundColor: 'rgba(13, 13, 13, 0.8)'
        }}
      >
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: '#D71920' }}
              >
                <span className="text-white font-bold text-xl">М</span>
              </div>
              <div>
                <h1 
                  className="text-3xl font-bold mb-1"
                  style={{
                    fontFamily: 'Bebas Neue',
                    fontSize: '36px',
                    color: '#F2F0F0'
                  }}
                >
                  АДМИН ПАНЕЛЬ
                </h1>
                <p 
                  className="text-sm"
                  style={{
                    fontFamily: 'Inter',
                    fontWeight: 400,
                    color: '#B8B8B8'
                  }}
                >
                  Управление контентом сайта МАСТЕР
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div 
                className="text-xs px-4 py-2 rounded-full"
                style={{ 
                  backgroundColor: 'rgba(215, 25, 32, 0.1)',
                  color: '#D71920',
                  border: '1px solid rgba(215, 25, 32, 0.2)'
                }}
              >
                {sections.find(s => s.id === activeSection)?.name}
              </div>
              <button
                onClick={onLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                Выйти
              </button>
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                <span className="text-xs font-medium">A</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside 
          className="w-80 min-h-screen border-r backdrop-blur-md"
          style={{ 
            backgroundColor: 'rgba(13, 13, 13, 0.9)',
            borderColor: 'rgba(255,255,255,0.1)'
          }}
        >
          <nav className="p-6">
            <div className="mb-8">
              <h3 
                className="text-sm font-medium mb-4"
                style={{
                  fontFamily: 'Inter',
                  color: '#8B8B8B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                Управление контентом
              </h3>
            </div>
            <ul className="space-y-2">
              {sections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 group ${
                      activeSection === section.id
                        ? 'border-l-4'
                        : 'hover:bg-white/5'
                    }`}
                    style={{
                      borderLeftColor: activeSection === section.id ? '#D71920' : 'transparent',
                      backgroundColor: activeSection === section.id ? 'rgba(215, 25, 32, 0.1)' : 'transparent'
                    }}
                  >
                    <div 
                      className="font-medium mb-1 flex items-center justify-between"
                      style={{
                        fontFamily: 'Inter',
                        fontWeight: 500,
                        color: activeSection === section.id ? '#F2F0F0' : '#B8B8B8'
                      }}
                    >
                      <span>{section.name}</span>
                      {activeSection === section.id && (
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: '#D71920' }}
                        />
                      )}
                    </div>
                    <div 
                      className="text-xs leading-relaxed"
                      style={{ color: '#8B8B8B' }}
                    >
                      {section.description}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main 
          className="flex-1 p-8"
          style={{ backgroundColor: 'rgba(13, 13, 13, 0.5)' }}
        >
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, MessageSquare, X } from 'lucide-react';
import { useNavigation } from '../hooks/useNavigation';
import { NavigationProps } from '../types';

const Navigation: React.FC<NavigationProps> = ({ className = '' }) => {
  const { navigation } = useNavigation();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToContactForm = () => {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  const logoSrc = `${process.env.PUBLIC_URL || ''}/logo-master.svg`;

  const items = (navigation && navigation.length > 0)
    ? navigation
    : [
        { id: 2, title: 'Продукция', url: '/products', sort_order: 1, parent_id: null, is_active: true, created_at: '', updated_at: '' },
        { id: 3, title: 'Услуги', url: '/services', sort_order: 2, parent_id: null, is_active: true, created_at: '', updated_at: '' },
        { id: 4, title: 'Портфолио', url: '/portfolio', sort_order: 3, parent_id: null, is_active: true, created_at: '', updated_at: '' },
        { id: 5, title: 'Видео-презентации', url: '/videos', sort_order: 4, parent_id: null, is_active: true, created_at: '', updated_at: '' },
      ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${className}`} style={{ background: 'transparent' }}>
      <div className="container mx-auto px-4 lg:px-16">
        <div className="flex items-center justify-between py-4">
          {/* Left capsule: logo + navigation */}
          <div className="hidden lg:flex items-center gap-8 glass px-6 h-10" style={{ border: 'none', width: 'fit-content' }}>
            <Link 
              to="/" 
              className="shrink-0"
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            >
              <img src={logoSrc} alt="МАСТЕР" className="h-6 w-auto select-none" draggable={false} />
            </Link>
            <nav className="flex items-center gap-6">
              {items.map((item) => (
                <Link
                  key={item.id}
                  to={item.url}
                  className={`text-sm md:text-base transition-colors ${
                    location.pathname === item.url ? 'text-white' : 'text-gray-200 hover:text-white'
                  }`}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>

          {/* Mobile: logo */}
          <div className="flex lg:hidden items-center">
            <Link 
              to="/" 
              className="shrink-0"
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            >
              <img src={logoSrc} alt="МАСТЕР" className="h-6 w-auto select-none" draggable={false} />
            </Link>
          </div>

          {/* Right: request button - только на десктопе (lg и выше) */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={scrollToContactForm}
              className="inline-flex items-center gap-2 border px-5 h-10 font-medium shadow-sm transition-all"
              style={{
                borderRadius: 'var(--button-primary-radius)',
                borderColor: 'var(--button-primary-border)',
                background: 'var(--button-primary-bg)',
                color: 'var(--button-primary-text)',
                boxSizing: 'border-box',
                fontFamily: 'var(--font-body, Inter)'
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget as HTMLButtonElement;
                target.style.background = 'var(--button-primary-hover-bg)';
                target.style.backdropFilter = 'blur(var(--blur-glass))';
                target.style.setProperty('-webkit-backdrop-filter', 'blur(var(--blur-glass))');
                target.style.color = 'var(--button-primary-hover-text)';
                target.style.borderColor = 'var(--button-primary-hover-border)';
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLButtonElement;
                target.style.background = 'var(--button-primary-bg)';
                target.style.backdropFilter = 'none';
                target.style.setProperty('-webkit-backdrop-filter', 'none');
                target.style.color = 'var(--button-primary-text)';
                target.style.borderColor = 'var(--button-primary-border)';
              }}
            >
              <MessageSquare size={18} />
              Оставить заявку
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 text-white"
              style={{ background: 'transparent' }}
              aria-label="Открыть меню"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-3">
            <div className="p-3 rounded-2xl" style={{ border: '1px solid var(--glass-border)', background: 'color-mix(in srgb, white 5%, transparent)', backdropFilter: 'blur(var(--blur-glass))' }}>
              {items.map((item) => (
                <Link
                  key={item.id}
                  to={item.url}
                  onClick={closeMobileMenu}
                  className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                    location.pathname === item.url ? 'bg-white/10 text-white' : 'text-gray-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.title}
                </Link>
              ))}
              
              {/* Кнопка заявки в мобильном меню */}
              <button
                onClick={() => {
                  closeMobileMenu();
                  scrollToContactForm();
                }}
                className="w-full mt-3 inline-flex items-center justify-center gap-2 border px-4 py-2 text-sm font-medium transition-all"
                style={{
                  borderRadius: 'var(--radius-xl)',
                  borderColor: 'var(--button-primary-border)',
                  background: 'var(--button-primary-bg)',
                  color: 'var(--button-primary-text)',
                }}
                onMouseEnter={(e) => {
                  const target = e.currentTarget as HTMLButtonElement;
                  target.style.background = 'color-mix(in srgb, white 5%, transparent)';
                  target.style.backdropFilter = 'blur(var(--blur-glass))';
                  target.style.setProperty('-webkit-backdrop-filter', 'blur(var(--blur-glass))');
                  target.style.color = 'var(--button-primary-hover-text)';
                  target.style.border = 'none';
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget as HTMLButtonElement;
                  target.style.background = 'var(--button-primary-bg)';
                  target.style.backdropFilter = 'none';
                  target.style.setProperty('-webkit-backdrop-filter', 'none');
                  target.style.color = 'var(--button-primary-text)';
                  target.style.border = `1px solid var(--button-primary-border)`;
                }}
              >
                <MessageSquare size={16} />
                Оставить заявку
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;

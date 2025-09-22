import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';
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

  const items = navigation.length
    ? navigation
    : [
        { id: 1, title: 'Главная', url: '/', sort_order: 1, parent_id: null, is_active: true, created_at: '', updated_at: '' },
        { id: 2, title: 'Продукция', url: '/products', sort_order: 2, parent_id: null, is_active: true, created_at: '', updated_at: '' },
        { id: 3, title: 'Видео-презентации', url: '/videos', sort_order: 3, parent_id: null, is_active: true, created_at: '', updated_at: '' },
      ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 px-16 ${className}`} style={{ background: 'transparent' }}>
      <div className="container">
        <div className="flex items-center justify-between py-4">
          {/* Left capsule: logo + navigation */}
          <div className="hidden md:flex items-center gap-8 glass px-6 h-10" style={{ border: 'none', width: 'fit-content' }}>
            <Link to="/" className="shrink-0">
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

          {/* Mobile: logo + бургер */}
          <div className="flex md:hidden items-center gap-3">
            <Link to="/" className="shrink-0">
              <img src={logoSrc} alt="МАСТЕР" className="h-6 w-auto select-none" draggable={false} />
            </Link>
          </div>

          {/* Right: Buy button */}
          <div className="flex items-center gap-4">
            <button
              onClick={scrollToContactForm}
              className="inline-flex items-center gap-2 rounded-xl border px-5 py-2 font-medium shadow-sm transition-all"
              style={{
                borderColor: '#ffffff',
                background: '#ffffff',
                color: '#111827',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg)';
                (e.currentTarget as HTMLButtonElement).style.color = '#ffffff';
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#ffffff';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = '#ffffff';
                (e.currentTarget as HTMLButtonElement).style.color = '#111827';
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#ffffff';
              }}
            >
              <ShoppingBag size={18} />
              Купить
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-gray-100"
              style={{ border: '1px solid var(--glass-border)', background: 'color-mix(in srgb, white 5%, transparent)', backdropFilter: 'blur(var(--blur-glass))' }}
              aria-label="Открыть меню"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-3">
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
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;

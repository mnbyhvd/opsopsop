import React from 'react';
import { useAbout } from '../hooks/useAbout';

const AboutSectionSimple: React.FC = () => {
  const { aboutItems, loading } = useAbout();

  if (loading) {
    return (
      <div className="py-20 text-center">
        <p style={{ color: 'var(--font-body-color, var(--text))' }}>Загрузка...</p>
      </div>
    );
  }

  if (aboutItems.length === 0) {
    return (
      <div className="py-20 text-center">
        <p style={{ color: 'var(--font-body-color, var(--text))' }}>Нет данных для отображения</p>
      </div>
    );
  }

  return (
    <section 
      className="py-20"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="mb-4">
            <span 
              className="inline-block px-3 py-1 rounded-full text-sm"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--button-primary-text)'
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
              color: 'var(--font-headings-color, var(--text))'
            }}
          >
            О системе
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {aboutItems.map((item, index) => (
            <div 
              key={item.id}
              className="p-6 rounded-lg"
              style={{
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--card-border)'
              }}
            >
              <h3 
                className="text-xl font-semibold mb-4"
                style={{
                  fontFamily: 'Roboto Flex',
                  fontWeight: 500,
                  color: 'var(--font-headings-color, var(--text))'
                }}
              >
                {item.title}
              </h3>
              <p 
                className="text-base"
                style={{
                  fontFamily: 'var(--font-body, Inter)',
                  color: 'var(--font-body-color, var(--text))'
                }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSectionSimple;

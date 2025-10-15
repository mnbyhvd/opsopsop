import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingScreenProps {
  message?: string;
  showLogo?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'ЗАГРУЗКА...',
  showLogo = true 
}) => {
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: '#0D0D0D' }}
    >
      <div className="text-center">
        {showLogo && (
          <div className="mb-8">
            <h1 
              className="text-4xl font-bold uppercase mb-2"
              style={{ 
                fontFamily: 'Bebas Neue', 
                color: '#F2F0F0',
                letterSpacing: '2px'
              }}
            >
              АПС МАСТЕР
            </h1>
            <div 
              className="w-16 h-0.5 mx-auto"
              style={{ backgroundColor: '#D71920' }}
            />
          </div>
        )}
        
        {/* Простое кольцо загрузки без Tailwind */}
        <div 
          style={{
            width: '48px',
            height: '48px',
            border: '4px solid #D71920',
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}
        />
        
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default LoadingScreen;
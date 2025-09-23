import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Загрузка...');

  useEffect(() => {
    const loadResources = async () => {
      const resources = [
        // Изображения
        '/logo-master.svg',
        '/1.png',
        '/2.png', 
        '/3.png',
        '/bgfoot.png',
        '/logo1.png',
        '/logo2.png',
        '/Мастер.svg',
        '/images/products/main-product.png',
        '/images/products/hover-area-1.png',
        '/images/products/hover-area-2.png',
        '/images/products/hover-area-3.png',
        '/images/products/hover-area-4.png',
        '/images/products/product-mask.png',
        // Видео
        '/videos/demo.mp4',
        '/videos/demo.webm',
        '/videos/demo.gif',
        // Шрифты
        '/static/fonts/bebas-neue.css',
        '/static/fonts/bebasneuecyrillic.ttf'
      ];

      let loadedCount = 0;
      const totalResources = resources.length;

      const loadResource = (url: string): Promise<void> => {
        return new Promise((resolve) => {
          if (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.gif')) {
            // Загрузка видео
            const video = document.createElement('video');
            video.oncanplaythrough = () => {
              loadedCount++;
              setLoadingProgress(Math.round((loadedCount / totalResources) * 100));
              resolve();
            };
            video.onerror = () => {
              loadedCount++;
              setLoadingProgress(Math.round((loadedCount / totalResources) * 100));
              resolve();
            };
            video.src = url;
          } else if (url.endsWith('.css')) {
            // Загрузка CSS
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            link.onload = () => {
              loadedCount++;
              setLoadingProgress(Math.round((loadedCount / totalResources) * 100));
              resolve();
            };
            link.onerror = () => {
              loadedCount++;
              setLoadingProgress(Math.round((loadedCount / totalResources) * 100));
              resolve();
            };
            document.head.appendChild(link);
          } else {
            // Загрузка изображений и других ресурсов
            const img = new Image();
            img.onload = () => {
              loadedCount++;
              setLoadingProgress(Math.round((loadedCount / totalResources) * 100));
              resolve();
            };
            img.onerror = () => {
              loadedCount++;
              setLoadingProgress(Math.round((loadedCount / totalResources) * 100));
              resolve();
            };
            img.src = url;
          }
        });
      };

      // Загружаем все ресурсы параллельно
      const loadPromises = resources.map(loadResource);
      
      // Обновляем текст загрузки
      setLoadingText('Загрузка ресурсов...');
      
      await Promise.all(loadPromises);
      
      // Дополнительная задержка для плавности
      setLoadingText('Завершение загрузки...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onLoadingComplete();
    };

    loadResources();
  }, [onLoadingComplete]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: '#0D0D0D',
        color: '#F2F0F0'
      }}
    >
      <div className="text-center">
        {/* Логотип */}
        <div className="mb-8">
          <div
            className="w-20 h-20 rounded-xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: '#D71920' }}
          >
            <span className="text-white font-bold text-3xl">М</span>
          </div>
          <h1 
            className="text-4xl font-bold mb-2"
            style={{
              fontFamily: 'Bebas Neue',
              color: '#F2F0F0'
            }}
          >
            МАСТЕР-СПС
          </h1>
          <p 
            className="text-lg"
            style={{
              fontFamily: 'Inter',
              color: '#B8B8B8'
            }}
          >
            Система пожаротушения
          </p>
        </div>

        {/* Прогресс бар */}
        <div className="w-80 mx-auto mb-4">
          <div 
            className="h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            <div
              className="h-full transition-all duration-300 ease-out"
              style={{
                backgroundColor: '#D71920',
                width: `${loadingProgress}%`
              }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span style={{ color: '#B8B8B8' }}>0%</span>
            <span style={{ color: '#F2F0F0' }}>{loadingProgress}%</span>
            <span style={{ color: '#B8B8B8' }}>100%</span>
          </div>
        </div>

        {/* Текст загрузки */}
        <p 
          className="text-lg"
          style={{
            fontFamily: 'Inter',
            color: '#B8B8B8'
          }}
        >
          {loadingText}
        </p>

        {/* Анимация загрузки */}
        <div className="mt-6">
          <div className="flex justify-center space-x-2">
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: '#D71920', animationDelay: '0ms' }}
            />
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: '#D71920', animationDelay: '150ms' }}
            />
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: '#D71920', animationDelay: '300ms' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;

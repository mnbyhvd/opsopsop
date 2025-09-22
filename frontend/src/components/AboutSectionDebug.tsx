import React from 'react';
import { useAbout } from '../hooks/useAbout';

const AboutSectionDebug: React.FC = () => {
  const { aboutItems, loading, error } = useAbout();

  console.log('🐛 AboutSectionDebug - aboutItems:', aboutItems);
  console.log('🐛 AboutSectionDebug - loading:', loading);
  console.log('🐛 AboutSectionDebug - error:', error);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-red-100 flex items-center justify-center">
        <div className="text-xl text-red-600">Ошибка: {error}</div>
      </div>
    );
  }

  if (!aboutItems || aboutItems.length === 0) {
    return (
      <div className="min-h-screen bg-yellow-100 flex items-center justify-center">
        <div className="text-xl text-yellow-600">Нет данных</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">О системе (Debug версия)</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Тексты:</h3>
            {aboutItems.map((item, index) => (
              <div key={item.id} className="p-4 bg-white rounded-lg shadow">
                <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                <p className="text-gray-600">{item.description}</p>
                <p className="text-sm text-gray-400 mt-2">ID: {item.id}, Порядок: {item.sort_order}</p>
              </div>
            ))}
          </div>
          
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Изображения:</h3>
            {aboutItems.map((item, index) => (
              <div key={item.id} className="p-4 bg-white rounded-lg shadow">
                <div className="w-full h-48 bg-gray-200 rounded flex items-center justify-center">
                  {item.image_url ? (
                    <img 
                      src={item.image_url} 
                      alt={item.title}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        console.log('Ошибка загрузки изображения:', item.image_url);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-gray-500">Нет изображения</span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mt-2">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSectionDebug;

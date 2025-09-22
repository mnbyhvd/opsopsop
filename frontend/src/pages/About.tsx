import React from 'react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">О системе АПС МАСТЕР</h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Описание системы</h2>
            <p className="text-gray-600 mb-4">
              АПС МАСТЕР - это современная система автоматического пожаротушения, 
              разработанная для защиты различных объектов от пожара. Система 
              обеспечивает быстрое обнаружение и тушение возгораний с минимальным 
              ущербом для имущества.
            </p>
            <p className="text-gray-600">
              Наша система использует передовые технологии и соответствует всем 
              международным стандартам безопасности.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4">Архитектура системы</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Датчики обнаружения пожара</li>
                <li>• Контрольная панель</li>
                <li>• Система оповещения</li>
                <li>• Модули пожаротушения</li>
                <li>• Резервное питание</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4">Преимущества в цифрах</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Время срабатывания:</span>
                  <span className="font-semibold text-blue-600">&lt; 3 сек</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Степень защиты:</span>
                  <span className="font-semibold text-blue-600">IP67</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Температурный диапазон:</span>
                  <span className="font-semibold text-blue-600">-40°C до +85°C</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Срок службы:</span>
                  <span className="font-semibold text-blue-600">10+ лет</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

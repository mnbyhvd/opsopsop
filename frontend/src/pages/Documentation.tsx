import React from 'react';
import { Download } from 'lucide-react';

const Documentation: React.FC = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Документация</h1>
        
        <div className="max-w-4xl mx-auto">
          {/* Instructions */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Инструкции</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Инструкция по монтажу</h3>
                  <p className="text-gray-600 text-sm">Версия 2.1 • PDF • 2.3 MB</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                  <Download size={16} />
                  Скачать
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Руководство пользователя</h3>
                  <p className="text-gray-600 text-sm">Версия 1.5 • PDF • 1.8 MB</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                  <Download size={16} />
                  Скачать
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Техническое обслуживание</h3>
                  <p className="text-gray-600 text-sm">Версия 1.2 • PDF • 1.1 MB</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                  <Download size={16} />
                  Скачать
                </button>
              </div>
            </div>
          </div>

          {/* Brochures */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Брошюры</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Каталог продукции 2024</h3>
                  <p className="text-gray-600 text-sm">Версия 2024 • PDF • 5.2 MB</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                  <Download size={16} />
                  Скачать
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Технические характеристики</h3>
                  <p className="text-gray-600 text-sm">Версия 3.0 • PDF • 3.7 MB</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                  <Download size={16} />
                  Скачать
                </button>
              </div>
            </div>
          </div>

          {/* Presentations */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Презентации</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Презентация системы АПС МАСТЕР</h3>
                  <p className="text-gray-600 text-sm">Версия 2024 • PPTX • 8.1 MB</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                  <Download size={16} />
                  Скачать
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Кейсы применения</h3>
                  <p className="text-gray-600 text-sm">Версия 2.0 • PPTX • 6.3 MB</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                  <Download size={16} />
                  Скачать
                </button>
              </div>
            </div>
          </div>

          {/* Download All */}
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">Скачать все документы</h3>
            <p className="text-gray-600 mb-4">
              Получите полный комплект документации одним архивом
            </p>
            <button className="btn-primary flex items-center gap-2 mx-auto">
              <Download size={20} />
              Скачать всё (ZIP, 25.6 MB)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;

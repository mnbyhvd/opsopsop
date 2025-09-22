import React from 'react';

const Certificates: React.FC = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Сертификаты</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Certificate 1 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Сертификат ISO</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">ISO 9001:2015</h3>
              <p className="text-gray-600 mb-4">
                Сертификат системы менеджмента качества
              </p>
              <div className="space-y-1 text-sm text-gray-500">
                <div>Номер: ISO-2024-001</div>
                <div>Действует до: 2027</div>
                <div>Орган: TÜV SÜD</div>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="btn-primary flex-1">
                  Скачать PDF
                </button>
                <button className="btn-secondary">
                  Просмотр
                </button>
              </div>
            </div>
          </div>

          {/* Certificate 2 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Сертификат пожарной безопасности</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Пожарная безопасность</h3>
              <p className="text-gray-600 mb-4">
                Сертификат соответствия требованиям пожарной безопасности
              </p>
              <div className="space-y-1 text-sm text-gray-500">
                <div>Номер: ПБ-2024-002</div>
                <div>Действует до: 2026</div>
                <div>Орган: МЧС России</div>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="btn-primary flex-1">
                  Скачать PDF
                </button>
                <button className="btn-secondary">
                  Просмотр
                </button>
              </div>
            </div>
          </div>

          {/* Certificate 3 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Сертификат CE</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">CE Marking</h3>
              <p className="text-gray-600 mb-4">
                Сертификат соответствия европейским стандартам
              </p>
              <div className="space-y-1 text-sm text-gray-500">
                <div>Номер: CE-2024-003</div>
                <div>Действует до: 2028</div>
                <div>Орган: BSI Group</div>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="btn-primary flex-1">
                  Скачать PDF
                </button>
                <button className="btn-secondary">
                  Просмотр
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificates;

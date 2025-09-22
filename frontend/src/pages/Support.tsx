import React, { useState } from 'react';
import { Clock, Phone, Mail, MessageCircle } from 'lucide-react';

const Support: React.FC = () => {
  const [formData, setFormData] = useState({
    requestType: '',
    object: '',
    name: '',
    email: '',
    phone: '',
    message: '',
    preferredTime: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Здесь будет отправка формы
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Поддержка</h1>
        
        <div className="max-w-6xl mx-auto">
          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Project Support */}
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Поддержка проектирования</h3>
              <p className="text-gray-600 mb-4">
                Помощь в разработке технических решений и проектной документации
              </p>
              <div className="text-sm text-gray-500">
                <div className="mb-1">Время реакции: 2-4 часа</div>
                <div>Рабочие дни: Пн-Пт 9:00-18:00</div>
              </div>
            </div>

            {/* PNR Support */}
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone size={24} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">ПНР и пусконаладка</h3>
              <p className="text-gray-600 mb-4">
                Сопровождение пусконаладочных работ и ввод в эксплуатацию
              </p>
              <div className="text-sm text-gray-500">
                <div className="mb-1">Время реакции: 1-2 часа</div>
                <div>Рабочие дни: Пн-Пт 9:00-18:00</div>
              </div>
            </div>

            {/* Operation Support */}
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle size={24} className="text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Эксплуатация</h3>
              <p className="text-gray-600 mb-4">
                Техническая поддержка и обслуживание в процессе эксплуатации
              </p>
              <div className="text-sm text-gray-500">
                <div className="mb-1">Время реакции: 30 мин</div>
                <div>Круглосуточно: 24/7</div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold mb-6">Отправить заявку</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Тип запроса *
                  </label>
                  <select
                    name="requestType"
                    value={formData.requestType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Выберите тип запроса</option>
                    <option value="project">Поддержка проектирования</option>
                    <option value="pnr">ПНР и пусконаладка</option>
                    <option value="operation">Эксплуатация</option>
                    <option value="other">Другое</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Объект
                  </label>
                  <input
                    type="text"
                    name="object"
                    value={formData.object}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Название объекта"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Имя *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ваше имя"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+7 (XXX) XXX-XX-XX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Желаемое время связи
                  </label>
                  <select
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Любое время</option>
                    <option value="morning">Утро (9:00-12:00)</option>
                    <option value="afternoon">День (12:00-17:00)</option>
                    <option value="evening">Вечер (17:00-20:00)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Сообщение
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Опишите ваш запрос..."
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full md:w-auto px-8 py-3"
              >
                Отправить заявку
              </button>
            </form>
          </div>

          {/* Quick Contacts */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Phone size={24} className="text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Телефон</h3>
              <p className="text-gray-600">+7 (XXX) XXX-XX-XX</p>
            </div>
            <div className="text-center">
              <Mail size={24} className="text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Email</h3>
              <p className="text-gray-600">support@aps-master.ru</p>
            </div>
            <div className="text-center">
              <MessageCircle size={24} className="text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Telegram</h3>
              <p className="text-gray-600">@aps_master_support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;

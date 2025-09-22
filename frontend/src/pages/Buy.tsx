import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, ExternalLink } from 'lucide-react';

const Buy: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    agreement: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreement) {
      alert('Необходимо согласиться с условиями обработки персональных данных');
      return;
    }

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        }),
      });

      if (response.ok) {
        alert('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          agreement: false
        });
      } else {
        alert('Ошибка при отправке заявки. Попробуйте еще раз.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Ошибка при отправке заявки. Проверьте подключение к интернету.');
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Купить</h1>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-semibold mb-6">Оставить заявку</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
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
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+7 (XXX) XXX-XX-XX"
                    required
                  />
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
                    placeholder="Опишите ваши потребности..."
                  />
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreement"
                    checked={formData.agreement}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    required
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Я согласен на обработку персональных данных в соответствии с{' '}
                    <a href="/privacy" className="text-blue-600 hover:underline">
                      политикой конфиденциальности
                    </a>
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full py-3"
                >
                  Отправить заявку
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Direct Contacts */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-4">Связаться с нами</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone size={20} className="text-blue-600" />
                    <div>
                      <p className="font-medium">Телефон</p>
                      <a href="tel:+7XXXXXXXXXX" className="text-blue-600 hover:underline">
                        +7 (XXX) XXX-XX-XX
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail size={20} className="text-blue-600" />
                    <div>
                      <p className="font-medium">Email</p>
                      <a href="mailto:info@aps-master.ru" className="text-blue-600 hover:underline">
                        info@aps-master.ru
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin size={20} className="text-blue-600" />
                    <div>
                      <p className="font-medium">Адрес</p>
                      <p className="text-gray-600">г. Москва, ул. Примерная, д. 1</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messengers */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-4">Мессенджеры</h3>
                <div className="space-y-3">
                  <a
                    href="https://wa.me/7XXXXXXXXXX"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <MessageCircle size={20} className="text-green-600" />
                      <span className="font-medium">WhatsApp</span>
                    </div>
                    <ExternalLink size={16} className="text-green-600" />
                  </a>
                  
                  <a
                    href="https://t.me/aps_master"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <MessageCircle size={20} className="text-blue-600" />
                      <span className="font-medium">Telegram</span>
                    </div>
                    <ExternalLink size={16} className="text-blue-600" />
                  </a>
                </div>
              </div>

              {/* Manufacturer Info */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Информация о производителе</h3>
                <p className="text-gray-600 mb-4">
                  Для получения подробной информации о производителе и официальных реквизитах
                </p>
                <a
                  href="/manufacturer"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <ExternalLink size={16} />
                  Перейти к информации
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buy;

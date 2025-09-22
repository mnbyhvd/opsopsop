import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PageContainer from './PageContainer';
import { useFooterSettings } from '../hooks/useFooterSettings';

const Footer: React.FC = () => {
  const { settings } = useFooterSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert('Необходимо согласиться на обработку персональных данных');
      return;
    }

    setIsSubmitting(true);
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
          company: '', // Поле компании не используется в форме
          message: formData.message,
          source: 'contact_form',
          status: 'new',
          priority: 'medium'
        }),
      });

      if (response.ok) {
        alert('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
        // Очищаем форму
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
        setAgreed(false);
      } else {
        throw new Error('Ошибка отправки заявки');
      }
    } catch (error) {
      console.error('Ошибка отправки заявки:', error);
      alert('Произошла ошибка при отправке заявки. Попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="relative">
      {/* Фоновый блок для формы связи и футера (вне колончатой системы) */}
      <div className="relative" style={{ marginLeft: '40px', marginRight: '40px', borderTopLeftRadius: '30px', borderTopRightRadius: '30px' }}>
        {/* Фоновое изображение */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/bgfoot.png)', // Фоновое изображение для футера
            opacity: 1,
            borderTopLeftRadius: '30px',
            borderTopRightRadius: '30px'
          }}
        />
        
        {/* Форма связи */}
        <section className="py-20 relative z-10" >
          <PageContainer>
            {/* Левая часть - заголовок и текст (колонки 1-6) */}
            <div className="col-start-1 col-end-7" style={{ paddingLeft: '40px' }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <h2 
                    className="text-4xl font-bold mb-6"
                    style={{ 
                      fontFamily: 'Bebas Neue',
                      color: '#F2F0F0'
                    }}
                  >
                    {settings.form_title}
                  </h2>
                  
                  <p 
                    className="text-lg leading-relaxed"
                    style={{
                      fontFamily: 'Inter',
                      color: '#F2F0F0'
                    }}
                  >
                    {settings.form_description}
                  </p>
                </motion.div>
            </div>

            {/* Правая часть - форма (колонки 7-12) */}
            <div className="col-start-7 col-end-13" style={{ paddingRight: '40px' }}>
                <motion.form 
                  id="contact-form"
                  onSubmit={handleSubmit} 
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  {/* Имя */}
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none transition-all duration-200"
                      style={{
                        backgroundColor: 'transparent',
                        color: '#F2F0F0',
                        fontFamily: 'Inter',
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        borderTop: 'none'
                      }}
                      placeholder=" "
                    />
                    <label 
                      className="absolute left-3 -top-2 px-2 text-sm font-medium transition-all duration-200"
                      style={{ 
                        fontFamily: 'Inter',
                        color: 'rgba(255, 255, 255, 0.3)',
                        backgroundColor: 'transparent'
                      }}
                    >
                      Имя
                    </label>
                  </div>

                  {/* Телефон */}
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none transition-all duration-200"
                      style={{
                        backgroundColor: 'transparent',
                        color: '#F2F0F0',
                        fontFamily: 'Inter',
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        borderTop: 'none'
                      }}
                      placeholder=" "
                    />
                    <label 
                      className="absolute left-3 -top-2 px-2 text-sm font-medium transition-all duration-200"
                      style={{ 
                        fontFamily: 'Inter',
                        color: 'rgba(255, 255, 255, 0.3)',
                        backgroundColor: 'transparent'
                      }}
                    >
                      Телефон
                    </label>
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none transition-all duration-200"
                      style={{
                        backgroundColor: 'transparent',
                        color: '#F2F0F0',
                        fontFamily: 'Inter',
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        borderTop: 'none'
                      }}
                      placeholder=" "
                    />
                    <label 
                      className="absolute left-3 -top-2 px-2 text-sm font-medium transition-all duration-200"
                      style={{ 
                        fontFamily: 'Inter',
                        color: 'rgba(255, 255, 255, 0.3)',
                        backgroundColor: 'transparent'
                      }}
                    >
                      Email
                    </label>
                  </div>

                  {/* Сообщение */}
                  <div className="relative">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none transition-all duration-200 resize-none"
                      style={{
                        backgroundColor: 'transparent',
                        color: '#F2F0F0',
                        fontFamily: 'Inter',
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        borderTop: 'none'
                      }}
                      placeholder=" "
                    />
                    <label 
                      className="absolute left-3 -top-2 px-2 text-sm font-medium transition-all duration-200"
                      style={{ 
                        fontFamily: 'Inter',
                        color: 'rgba(255, 255, 255, 0.3)',
                        backgroundColor: 'transparent'
                      }}
                    >
                      Сообщение
                    </label>
                  </div>

                  {/* Согласие на обработку данных */}
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="agreement"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-2 border-gray-300 focus:ring-red-500"
                      style={{
                        accentColor: '#D71920'
                      }}
                    />
                    <label 
                      htmlFor="agreement"
                      className="text-sm"
                      style={{
                        fontFamily: 'Inter',
                        color: '#F2F0F0'
                      }}
                    >
                      Согласен на{' '}
                      <a 
                        href={settings.privacy_policy_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:no-underline transition-all duration-200"
                        style={{ color: '#D71920' }}
                      >
                        обработку персональных данных
                      </a>
                    </label>
                  </div>

                  {/* Кнопка отправки */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center px-10 py-4 font-medium text-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: isSubmitting ? '#666' : '#E0DADA',
                      color: isSubmitting ? '#F2F0F0' : '#0D0D0D',
                      border: isSubmitting ? '1px solid #666' : '1px solid #E0DADA',
                      fontFamily: 'Inter',
                      borderRadius: '30px'
                    }}
                    onMouseEnter={!isSubmitting ? (e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                      (e.currentTarget as HTMLButtonElement).style.color = '#ffffff';
                      (e.currentTarget as HTMLButtonElement).style.borderColor = '#ffffff';
                    } : undefined}
                    onMouseLeave={!isSubmitting ? (e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = '#E0DADA';
                      (e.currentTarget as HTMLButtonElement).style.color = '#0D0D0D';
                      (e.currentTarget as HTMLButtonElement).style.borderColor = '#E0DADA';
                    } : undefined}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  >
                    {isSubmitting ? 'Отправка...' : 'Отправить'}
                  </motion.button>
                </motion.form>
            </div>
          </PageContainer>
        </section>

        {/* Футер */}
        <section className="py-16 relative z-10" style={{ 
          backgroundColor: 'rgba(98, 98, 98, 0.3)', 
          marginLeft: '50px', 
          marginRight: '50px', 
          borderTopLeftRadius: '30px', 
          borderTopRightRadius: '30px',
          backdropFilter: 'blur(38.400001525878906px)'
        }}>
          <PageContainer>
            {/* Логотипы (колонки 1-3) */}
            <div className="col-start-1 col-end-4" style={{ paddingLeft: '50px' }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="flex flex-col space-y-3 mb-6">
                    {/* Первый логотип */}
                    <img 
                      src="/logo1.png" 
                      alt="Логотип 1" 
                      style={{ 
                        width: '151px',
                        height: '32px',
                        objectFit: 'contain'
                      }}
                    />
                    
                    {/* Второй логотип */}
                    <img 
                      src="/logo2.png" 
                      alt="Логотип 2" 
                      style={{ 
                        width: '151px',
                        height: '39px',
                        objectFit: 'contain'
                      }}
                    />
                  </div>
                </motion.div>
            </div>

            {/* Навигация "Основное" (колонки 4-7) */}
            <div className="col-start-4 col-end-8" style={{ paddingLeft: '15px' }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <h4 
                    className="text-xl font-semibold mb-6"
                    style={{ 
                      fontFamily: 'Inter',
                      color: '#F2F0F0'
                    }}
                  >
                    Основное
                  </h4>
                  <nav className="space-y-3">
                    {[
                      { name: 'Главная', href: '/' },
                      { name: 'Продукция', href: '/products' },
                      { name: 'Видео-презентации', href: '/videos' },
                      { name: 'Реквизиты', href: '/requisites' }
                    ].map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        className="block text-base hover:text-red-500 transition-colors duration-200"
                        style={{
                          fontFamily: 'Inter',
                          color: '#F2F0F0'
                        }}
                      >
                        {link.name}
                      </a>
                    ))}
                  </nav>
                </motion.div>
            </div>

            {/* Контакты (колонки 8-11) */}
            <div className="col-start-8 col-end-12" style={{ paddingLeft: '15px' }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <h4 
                    className="text-xl font-semibold mb-6"
                    style={{ 
                      fontFamily: 'Inter',
                      color: '#F2F0F0'
                    }}
                  >
                    Контакты
                  </h4>
                  <div className="space-y-3">
                    <p 
                      className="text-base"
                      style={{
                        fontFamily: 'Inter',
                        color: '#F2F0F0'
                      }}
                    >
                      {settings.contact_phone}
                    </p>
                    <p 
                      className="text-base"
                      style={{
                        fontFamily: 'Inter',
                        color: '#F2F0F0'
                      }}
                    >
                      {settings.contact_email}
                    </p>
                    <p 
                      className="text-base"
                      style={{
                        fontFamily: 'Inter',
                        color: '#F2F0F0'
                      }}
                    >
                      г. Москва, ул. Остоженка, д.1/9
                    </p>
                    <p 
                      className="text-base"
                      style={{
                        fontFamily: 'Inter',
                        color: '#F2F0F0'
                      }}
                    >
                      Пн-Пт 10:00-18:00
                    </p>
                  </div>
                </motion.div>
            </div>

            {/* Кнопка "Наверх" (колонка 12) */}
            <div className="col-start-12 col-end-13" style={{ paddingRight: '50px' }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="flex justify-end"
                >
                  <button 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="flex items-center space-x-2 text-base hover:text-red-500 transition-colors duration-200"
                    style={{
                      fontFamily: 'Inter',
                      color: '#F2F0F0'
                    }}
                  >
                    <span>Наверх</span>
                    <span>^</span>
                  </button>
                </motion.div>
            </div>

            {/* Нижняя часть футера */}
            <div className="col-start-1 col-end-13">
              <motion.div 
                className="mt-16 pt-10 border-t flex flex-col md:flex-row justify-between items-center"
                style={{ 
                  borderColor: 'rgba(255, 255, 255, 0.2)'
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
              <p 
                className="text-base mb-3 md:mb-0"
                style={{
                  fontFamily: 'Inter',
                  color: '#F2F0F0'
                }}
              >
                © 2025 ООО "Элемент". Все права защищены
              </p>
              <div className="flex items-center space-x-8">
                <a 
                  href="#privacy" 
                  className="text-base hover:text-red-500 transition-colors duration-200"
                  style={{
                    fontFamily: 'Inter',
                    color: '#F2F0F0'
                  }}
                >
                  Политика конфиденциальности
                </a>
                <a 
                  href="#developer" 
                  className="text-base hover:text-red-500 transition-colors duration-200"
                  style={{
                    fontFamily: 'Inter',
                    color: '#F2F0F0'
                  }}
                >
                  Разработчик ...
                </a>
              </div>
              </motion.div>
            </div>
          </PageContainer>
        </section>
      </div>
    </footer>
  );
};

export default Footer;
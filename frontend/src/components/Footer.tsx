import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageContainer from './PageContainer';
import { useFooterSettings } from '../hooks/useFooterSettings';
import { sanitizeHtml } from '../utils/richText';

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
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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
        
        // Сбрасываем фокус с активного поля
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
          activeElement.blur();
        }
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
      <div className="relative" style={{ marginLeft: isMobile ? '0' : '40px', marginRight: isMobile ? '0' : '40px', borderTopLeftRadius: '30px', borderTopRightRadius: '30px' }}>
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
        <section className="py-12 md:py-20 relative z-10" >
          <PageContainer>
            {/* Левая часть - заголовок и текст (колонки 1-6 на десктопе, 1-13 на мобильных) */}
          <div className="col-start-1 col-end-13 md:col-end-7" style={{ paddingLeft: isMobile ? '16px' : '40px', paddingRight: isMobile ? '16px' : '60px' }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <h2 
                    className="text-4xl md:text-6xl font-bold mb-4 md:mb-6 text-left md:text-left"
                    style={{ 
                      fontFamily: 'Bebas Neue',
                      color: 'var(--font-headings-color, var(--text))',
                      textTransform: 'uppercase'
                    }}
                  >
                    {settings.form_title || 'СВЯЖИТЕСЬ С НАМИ'}
                  </h2>
                  
                  <p
                    className="rich-text text-base md:text-lg leading-relaxed text-left md:text-left mb-8 md:mb-0"
                    style={{ fontFamily: 'Inter', color: '#F2F0F0' }}
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(settings.form_description || 'Оставьте заявку и получите спецификацию и коммерческое предложение, подобранные именно под ваши задачи.') }}
                  />
                </motion.div>
            </div>

            {/* Правая часть - форма (колонки 7-12 на десктопе, 1-13 на мобильных) */}
            <div className="col-start-1 md:col-start-7 col-end-13" style={{ paddingLeft: isMobile ? '16px' : '0', paddingRight: isMobile ? '16px' : '40px', marginTop: isMobile ? '24px' : '0' }}>
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
                      className="w-full px-4 py-3 md:py-3 rounded-lg border focus:outline-none transition-all duration-200"
                      style={{
                        backgroundColor: isMobile ? '#272727' : 'var(--input-bg)',
                        color: 'var(--input-text)',
                        fontFamily: 'var(--font-body, Inter)',
                        borderColor: isMobile ? 'rgba(255, 255, 255, 0.2)' : 'var(--input-border)',
                        borderRadius: 'var(--input-radius)',
                        borderTop: 'none',
                        fontSize: isMobile ? '16px' : 'inherit'
                      }}
                      placeholder=" "
                      onFocus={(e) => {
                        e.currentTarget.style.borderTop = 'none';
                        e.currentTarget.style.borderColor = 'var(--input-focus-border)';
                        e.currentTarget.style.borderWidth = '2px';
                        e.currentTarget.style.backgroundColor = 'var(--input-focus-bg)';
                        e.currentTarget.style.color = 'var(--input-focus-text)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderTop = 'none';
                        e.currentTarget.style.borderColor = isMobile ? 'rgba(255, 255, 255, 0.2)' : 'var(--input-border)';
                        e.currentTarget.style.borderWidth = '1px';
                        e.currentTarget.style.backgroundColor = isMobile ? '#272727' : 'var(--input-bg)';
                        e.currentTarget.style.color = 'var(--input-text)';
                      }}
                    />
                    <label 
                      className="absolute left-3 -top-2 px-2 text-sm font-medium transition-all duration-200"
                      style={{ 
                        fontFamily: 'var(--font-body, Inter)',
                        color: 'var(--input-placeholder)',
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
                      className="w-full px-4 py-3 md:py-3 rounded-lg border focus:outline-none transition-all duration-200"
                      style={{
                        backgroundColor: isMobile ? '#272727' : 'var(--input-bg)',
                        color: 'var(--input-text)',
                        fontFamily: 'var(--font-body, Inter)',
                        borderColor: isMobile ? 'rgba(255, 255, 255, 0.2)' : 'var(--input-border)',
                        borderRadius: 'var(--input-radius)',
                        borderTop: 'none',
                        fontSize: isMobile ? '16px' : 'inherit'
                      }}
                      placeholder=" "
                      onFocus={(e) => {
                        e.currentTarget.style.borderTop = 'none';
                        e.currentTarget.style.borderColor = 'var(--input-focus-border)';
                        e.currentTarget.style.borderWidth = '2px';
                        e.currentTarget.style.backgroundColor = 'var(--input-focus-bg)';
                        e.currentTarget.style.color = 'var(--input-focus-text)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderTop = 'none';
                        e.currentTarget.style.borderColor = isMobile ? 'rgba(255, 255, 255, 0.2)' : 'var(--input-border)';
                        e.currentTarget.style.borderWidth = '1px';
                        e.currentTarget.style.backgroundColor = isMobile ? '#272727' : 'var(--input-bg)';
                        e.currentTarget.style.color = 'var(--input-text)';
                      }}
                    />
                    <label 
                      className="absolute left-3 -top-2 px-2 text-sm font-medium transition-all duration-200"
                      style={{ 
                        fontFamily: 'var(--font-body, Inter)',
                        color: 'var(--input-placeholder)',
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
                      className="w-full px-4 py-3 md:py-3 rounded-lg border focus:outline-none transition-all duration-200"
                      style={{
                        backgroundColor: isMobile ? '#272727' : 'var(--input-bg)',
                        color: 'var(--input-text)',
                        fontFamily: 'var(--font-body, Inter)',
                        borderColor: isMobile ? 'rgba(255, 255, 255, 0.2)' : 'var(--input-border)',
                        borderRadius: 'var(--input-radius)',
                        borderTop: 'none',
                        fontSize: isMobile ? '16px' : 'inherit'
                      }}
                      placeholder=" "
                      onFocus={(e) => {
                        e.currentTarget.style.borderTop = 'none';
                        e.currentTarget.style.borderColor = 'var(--input-focus-border)';
                        e.currentTarget.style.borderWidth = '2px';
                        e.currentTarget.style.backgroundColor = 'var(--input-focus-bg)';
                        e.currentTarget.style.color = 'var(--input-focus-text)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderTop = 'none';
                        e.currentTarget.style.borderColor = isMobile ? 'rgba(255, 255, 255, 0.2)' : 'var(--input-border)';
                        e.currentTarget.style.borderWidth = '1px';
                        e.currentTarget.style.backgroundColor = isMobile ? '#272727' : 'var(--input-bg)';
                        e.currentTarget.style.color = 'var(--input-text)';
                      }}
                    />
                    <label 
                      className="absolute left-3 -top-2 px-2 text-sm font-medium transition-all duration-200"
                      style={{ 
                        fontFamily: 'var(--font-body, Inter)',
                        color: 'var(--input-placeholder)',
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
                      rows={isMobile ? 5 : 4}
                      className="w-full px-4 py-3 md:py-3 rounded-lg border focus:outline-none transition-all duration-200 resize-none"
                      style={{
                        backgroundColor: isMobile ? '#272727' : 'var(--input-bg)',
                        color: 'var(--input-text)',
                        fontFamily: 'var(--font-body, Inter)',
                        borderColor: isMobile ? 'rgba(255, 255, 255, 0.2)' : 'var(--input-border)',
                        borderRadius: 'var(--input-radius)',
                        borderTop: 'none',
                        fontSize: isMobile ? '16px' : 'inherit'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderTop = 'none';
                        e.currentTarget.style.borderColor = 'var(--input-focus-border)';
                        e.currentTarget.style.borderWidth = '2px';
                        e.currentTarget.style.backgroundColor = 'var(--input-focus-bg)';
                        e.currentTarget.style.color = 'var(--input-focus-text)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderTop = 'none';
                        e.currentTarget.style.borderColor = isMobile ? 'rgba(255, 255, 255, 0.2)' : 'var(--input-border)';
                        e.currentTarget.style.borderWidth = '1px';
                        e.currentTarget.style.backgroundColor = isMobile ? '#272727' : 'var(--input-bg)';
                        e.currentTarget.style.color = 'var(--input-text)';
                      }}
                      placeholder=" "
                    />
                    <label 
                      className="absolute left-3 -top-2 px-2 text-sm font-medium transition-all duration-200"
                      style={{ 
                        fontFamily: 'var(--font-body, Inter)',
                        color: 'var(--input-placeholder)',
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
                      className="mt-1 w-4 h-4 md:w-4 md:h-4 rounded border-2 border-gray-300 focus:ring-red-500 flex-shrink-0"
                      style={{
                        accentColor: 'var(--accent)',
                        marginTop: isMobile ? '4px' : '4px'
                      }}
                    />
                    <label 
                      htmlFor="agreement"
                      className="text-sm md:text-sm"
                      style={{
                        fontFamily: 'Inter',
                        color: 'var(--font-headings-color, var(--text))',
                        lineHeight: '1.5'
                      }}
                    >
                      Согласен на{' '}
                      <a 
                        href={settings.privacy_policy_url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:no-underline transition-all duration-200"
                        style={{ color: 'var(--accent)' }}
                      >
                        обработку персональных данных
                      </a>
                    </label>
                  </div>

                  {/* Кнопка отправки */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center px-8 md:px-10 py-3 md:py-4 font-medium text-base md:text-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: isSubmitting ? '#666' : 'var(--button-primary-bg)',
                      color: isSubmitting ? '#F2F0F0' : 'var(--button-primary-text)',
                      border: isSubmitting ? '1px solid #666' : `1px solid var(--button-primary-border)`,
                      borderRadius: 'var(--button-primary-radius)',
                      fontFamily: 'var(--font-body, Inter)'
                    }}
                    onMouseEnter={!isSubmitting && !isMobile ? (e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'var(--button-primary-hover-bg)';
                      (e.currentTarget as HTMLButtonElement).style.color = 'var(--button-primary-hover-text)';
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--button-primary-hover-border)';
                    } : undefined}
                    onMouseLeave={!isSubmitting && !isMobile ? (e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'var(--button-primary-bg)';
                      (e.currentTarget as HTMLButtonElement).style.color = 'var(--button-primary-text)';
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--button-primary-border)';
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
        <section className="py-8 md:py-16 relative z-10" style={{ 
          backgroundColor: 'rgba(98, 98, 98, 0.3)', 
          marginLeft: isMobile ? '0' : '50px', 
          marginRight: isMobile ? '0' : '50px', 
          borderTopLeftRadius: '30px', 
          borderTopRightRadius: '30px',
          backdropFilter: 'blur(38.400001525878906px)'
        }}>
          <PageContainer>
            {/* Мобильная версия */}
            {isMobile ? (
              <div className="col-start-1 col-end-13 px-4 space-y-8">
                {/* Логотип "Элемент" */}
                <div>
                  <img 
                    src="/logo2.png" 
                    alt="Элемент" 
                    style={{ 
                      width: '120px',
                      height: 'auto',
                      objectFit: 'contain'
                    }}
                  />
                </div>

                {/* Навигация "Основное" */}
                <div>
                  <h4 
                    className="text-lg font-semibold mb-4"
                    style={{ 
                      fontFamily: 'Inter',
                      color: '#F2F0F0'
                    }}
                  >
                    Основное
                  </h4>
                  <nav className="space-y-2">
                    {[
                      { name: 'Продукция', href: '/products' },
                      { name: 'Видео-презентации', href: '/videos' },
                      { name: 'Реквизиты', href: '/requisites' }
                    ].map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        className="block text-sm"
                        style={{
                          fontFamily: 'Inter',
                          color: '#F2F0F0'
                        }}
                      >
                        {link.name}
                      </a>
                    ))}
                  </nav>
                </div>

                {/* Контакты */}
                <div>
                  <h4 
                    className="text-lg font-semibold mb-4"
                    style={{ 
                      fontFamily: 'Inter',
                      color: '#F2F0F0'
                    }}
                  >
                    Контакты
                  </h4>
                  <div className="space-y-2">
                    <p 
                      className="text-sm"
                      style={{
                        fontFamily: 'Inter',
                        color: '#F2F0F0'
                      }}
                    >
                      {settings.contact_phone || '+7 (495) 123-45-67'}
                    </p>
                    <p 
                      className="text-sm"
                      style={{
                        fontFamily: 'Inter',
                        color: '#F2F0F0'
                      }}
                    >
                      {settings.contact_email || 'info@example.com'}
                    </p>
                    <p 
                      className="text-sm"
                      style={{
                        fontFamily: 'Inter',
                        color: '#F2F0F0'
                      }}
                    >
                       {settings.contact_address || 'г. Обнинск, проезд Самсоновский, д. 10'}
                    </p>
                    <p 
                      className="text-sm"
                      style={{
                        fontFamily: 'Inter',
                        color: '#F2F0F0'
                      }}
                    >
                      {settings.working_hours || 'Пн-Пт 10:00-18:00'}
                    </p>
                  </div>
                </div>

                {/* Разделительная линия */}
                <div 
                  className="border-t"
                  style={{ 
                    borderColor: 'rgba(255, 255, 255, 0.2)'
                  }}
                />

                {/* Нижняя часть */}
                <div className="space-y-3">
                  <a 
                    href="#privacy" 
                    className="block text-sm"
                    style={{
                      fontFamily: 'Inter',
                      color: '#F2F0F0'
                    }}
                  >
                    Политика конфиденциальности
                  </a>
                  <p 
                    className="text-sm"
                    style={{
                      fontFamily: 'Inter',
                      color: '#F2F0F0'
                    }}
                  >
                    © 2025 ООО "Элемент". Все права защищены
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Десктопная версия - без изменений */}
                {/* Логотипы (колонки 1-3) */}
                <div className="col-start-1 col-end-4" style={{ paddingLeft: '50px' }}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      viewport={{ once: true }}
                    >
                      <div className="flex flex-col space-y-3 mb-6">
                        
                        {/* "Элемент" логотип */}
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
                          {settings.contact_phone || '+7 (495) 123-45-67'}
                        </p>
                        <p 
                          className="text-base"
                          style={{
                            fontFamily: 'Inter',
                            color: '#F2F0F0'
                          }}
                        >
                          {settings.contact_email || 'info@example.com'}
                        </p>
                        <p 
                          className="text-base"
                          style={{
                            fontFamily: 'Inter',
                            color: '#F2F0F0'
                          }}
                        >
                           {settings.contact_address || 'г. Обнинск, проезд Самсоновский, д. 10'}
                        </p>
                        <p 
                          className="text-base"
                          style={{
                            fontFamily: 'Inter',
                            color: '#F2F0F0'
                          }}
                        >
                          {settings.working_hours || 'Пн-Пт 10:00-18:00'}
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
              </>
            )}
          </PageContainer>
        </section>
      </div>
    </footer>
  );
};

export default Footer;
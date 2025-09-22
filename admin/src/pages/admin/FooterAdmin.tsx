import React, { useState, useEffect } from 'react';

interface FooterSettings {
  id: number;
  company_name: string;
  company_subtitle: string;
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  working_hours: string;
  form_title: string;
  form_description: string;
  privacy_policy_url: string;
  created_at: string;
  updated_at: string;
}

const FooterAdmin: React.FC = () => {
  const [settings, setSettings] = useState<FooterSettings>({
    id: 1,
    company_name: 'МАСТЕР',
    company_subtitle: 'Элемент',
    contact_phone: '+7 (999) 999-99-99',
    contact_email: 'email@gmail.ru',
    contact_address: 'г. Москва, ул. Остоженка, д.1/9',
    working_hours: 'Пн-Пт 10:00-18:00',
    form_title: 'СВЯЖИТЕСЬ С НАМИ',
    form_description: 'Оставьте заявку и получите спецификацию и коммерческое предложение, подобранные именно под ваши задачи.',
    privacy_policy_url: '#privacy',
    created_at: '',
    updated_at: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/footer-settings');
      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          setSettings(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching footer settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/footer-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        const result = await response.json();
        setSettings(result.data);
        alert('Настройки футера сохранены!');
      } else {
        console.error('Error saving footer settings');
        alert('Ошибка при сохранении настроек');
      }
    } catch (error) {
      console.error('Error saving footer settings:', error);
      alert('Ошибка при сохранении настроек');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof FooterSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return <div className="p-8">Загрузка...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 
          className="text-3xl font-bold mb-6"
          style={{
            fontFamily: 'Roboto Flex',
            fontWeight: 478,
            fontSize: '32px',
            lineHeight: '100%',
            letterSpacing: '-1px',
            fontVariationSettings: '"wdth" 10, "YTUC" 850, "YTAS" 900',
            color: '#F2F0F0'
          }}
        >
          Управление футером
        </h1>
      </div>

      <div className="space-y-8">
        {/* Информация о компании */}
        <div className="admin-card">
          <h2 
            className="text-xl font-bold mb-6"
            style={{
              fontFamily: 'Roboto Flex',
              fontWeight: 500,
              color: '#F2F0F0'
            }}
          >
            Информация о компании
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: '#B8B8B8' }}
              >
                Название компании
              </label>
              <input
                type="text"
                value={settings.company_name}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
                className="admin-input"
              />
            </div>
            
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: '#B8B8B8' }}
              >
                Подзаголовок компании
              </label>
              <input
                type="text"
                value={settings.company_subtitle}
                onChange={(e) => handleInputChange('company_subtitle', e.target.value)}
                className="admin-input"
              />
            </div>
          </div>
        </div>

        {/* Контактная информация */}
        <div className="admin-card">
          <h2 
            className="text-xl font-bold mb-6"
            style={{
              fontFamily: 'Roboto Flex',
              fontWeight: 500,
              color: '#F2F0F0'
            }}
          >
            Контактная информация
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: '#B8B8B8' }}
              >
                Телефон
              </label>
              <input
                type="text"
                value={settings.contact_phone}
                onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                className="admin-input"
              />
            </div>
            
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: '#B8B8B8' }}
              >
                Email
              </label>
              <input
                type="email"
                value={settings.contact_email}
                onChange={(e) => handleInputChange('contact_email', e.target.value)}
                className="admin-input"
              />
            </div>
            
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: '#B8B8B8' }}
              >
                Адрес
              </label>
              <input
                type="text"
                value={settings.contact_address}
                onChange={(e) => handleInputChange('contact_address', e.target.value)}
                className="admin-input"
              />
            </div>
            
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: '#B8B8B8' }}
              >
                Часы работы
              </label>
              <input
                type="text"
                value={settings.working_hours}
                onChange={(e) => handleInputChange('working_hours', e.target.value)}
                className="admin-input"
              />
            </div>
          </div>
        </div>

        {/* Форма заявки */}
        <div className="admin-card">
          <h2 
            className="text-xl font-bold mb-6"
            style={{
              fontFamily: 'Roboto Flex',
              fontWeight: 500,
              color: '#F2F0F0'
            }}
          >
            Форма заявки
          </h2>
          
          <div className="space-y-6">
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: '#B8B8B8' }}
              >
                Заголовок формы
              </label>
              <input
                type="text"
                value={settings.form_title}
                onChange={(e) => handleInputChange('form_title', e.target.value)}
                className="admin-input"
              />
            </div>
            
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: '#B8B8B8' }}
              >
                Описание формы
              </label>
              <textarea
                value={settings.form_description}
                onChange={(e) => handleInputChange('form_description', e.target.value)}
                className="admin-input h-24"
              />
            </div>
          </div>
        </div>

        {/* Дополнительные настройки */}
        <div className="admin-card">
          <h2 
            className="text-xl font-bold mb-6"
            style={{
              fontFamily: 'Roboto Flex',
              fontWeight: 500,
              color: '#F2F0F0'
            }}
          >
            Дополнительные настройки
          </h2>
          
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: '#B8B8B8' }}
            >
              URL политики конфиденциальности
            </label>
            <input
              type="text"
              value={settings.privacy_policy_url}
              onChange={(e) => handleInputChange('privacy_policy_url', e.target.value)}
              className="admin-input"
            />
          </div>
        </div>

        {/* Кнопка сохранения */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="admin-button-success"
            style={{ opacity: saving ? 0.6 : 1 }}
          >
            {saving ? 'Сохранение...' : 'Сохранить настройки'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FooterAdmin;

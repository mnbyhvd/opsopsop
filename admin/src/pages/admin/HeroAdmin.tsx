import React, { useState, useEffect } from 'react';

interface HeroSettings {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

const HeroAdmin: React.FC = () => {
  const [settings, setSettings] = useState<HeroSettings>({
    id: 1,
    title: 'АПС МАСТЕР',
    description: 'Интеллектуальная система пожарной сигнализации нового поколения',
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
      const response = await fetch('/api/hero');
      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          setSettings(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching hero settings:', error);
    } finally {
      setLoading(false);
    }
  };



  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/hero', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: settings.title,
          description: settings.description
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setSettings(result.data);
        alert('Настройки Hero секции сохранены!');
      } else {
        console.error('Error saving hero settings');
        alert('Ошибка при сохранении настроек');
      }
    } catch (error) {
      console.error('Error saving hero settings:', error);
      alert('Ошибка при сохранении настроек');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof HeroSettings, value: string) => {
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
          Управление Hero секцией
        </h1>
      </div>

      <div className="space-y-8">
        {/* Основные настройки */}
        <div className="admin-card">
          <h2 
            className="text-xl font-bold mb-6"
            style={{
              fontFamily: 'Roboto Flex',
              fontWeight: 500,
              color: '#F2F0F0'
            }}
          >
            Основные настройки
          </h2>
          
          <div className="space-y-6">
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: '#B8B8B8' }}
              >
                Главный заголовок
              </label>
              <input
                type="text"
                value={settings.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="admin-input"
              />
            </div>
            
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: '#B8B8B8' }}
              >
                Описание
              </label>
              <textarea
                value={settings.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="admin-input h-24"
              />
            </div>
          </div>
        </div>

        {/* Информация о неизменяемых элементах */}
        <div className="admin-card">
          <h2 
            className="text-xl font-bold mb-6"
            style={{
              fontFamily: 'Roboto Flex',
              fontWeight: 500,
              color: '#F2F0F0'
            }}
          >
            Неизменяемые элементы
          </h2>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
              <h3 className="text-lg font-medium mb-2" style={{ color: '#F2F0F0' }}>
                Кнопка
              </h3>
              <p className="text-sm" style={{ color: '#B8B8B8' }}>
                Текст и URL кнопки фиксированы и не могут быть изменены через админку
              </p>
            </div>
            
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
              <h3 className="text-lg font-medium mb-2" style={{ color: '#F2F0F0' }}>
                Фоновое изображение
              </h3>
              <p className="text-sm" style={{ color: '#B8B8B8' }}>
                Фоновое изображение фиксировано и не может быть изменено через админку
              </p>
            </div>
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

export default HeroAdmin;
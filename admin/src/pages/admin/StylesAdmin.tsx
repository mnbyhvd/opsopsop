import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';

interface SiteStyles {
  colors: {
    background: string;
    text: string;
    accent: string;
    brand: string;
    glassBorder: string;
  };
  radius: {
    xl: string;
    lg: string;
  };
  blur: {
    glass: string;
  };
  fonts: {
    headings: string;
    body: string;
    headingsFallback: string;
    bodyFallback: string;
    headingsColor: string;
    bodyColor: string;
    headingsUrl?: string;
    bodyUrl?: string;
  };
  buttons: {
    primary: {
      bg: string;
      text: string;
      border: string;
      hoverBg: string;
      hoverText: string;
      hoverBorder: string;
      radius: string;
    };
    secondary: {
      bg: string;
      text: string;
      border: string;
      hoverBg: string;
      hoverText: string;
      hoverBorder: string;
      radius: string;
    };
  };
  inputs: {
    bg: string;
    text: string;
    border: string;
    focusBg: string;
    focusText: string;
    focusBorder: string;
    radius: string;
    placeholder: string;
  };
  search: {
    bg: string;
    text: string;
    border: string;
    focusBg: string;
    focusBorder: string;
    radius: string;
  };
  navigation: {
    bg: string;
    text: string;
    linkHover: string;
    border: string;
    radius: string;
  };
  cards: {
    bg: string;
    text: string;
    border: string;
    radius: string;
    hoverBg: string;
  };
}

const StylesAdmin: React.FC = () => {
  const [styles, setStyles] = useState<SiteStyles | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'colors' | 'fonts' | 'buttons' | 'inputs' | 'search' | 'navigation' | 'cards'>('colors');

  useEffect(() => {
    fetchStyles();
  }, []);

  const fetchStyles = async () => {
    try {
      const response = await apiService.getStyles();
      if (response.success && response.data) {
        setStyles(response.data as SiteStyles);
      }
    } catch (error) {
      console.error('Error fetching styles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!styles) return;
    
    setSaving(true);
    try {
      const response = await apiService.updateStyles(styles);
      if (response.success) {
        alert('Стили успешно сохранены!');
        // Перезагружаем страницу, чтобы применить изменения
        window.location.reload();
      } else {
        alert('Ошибка при сохранении стилей');
      }
    } catch (error) {
      console.error('Error saving styles:', error);
      alert('Ошибка при сохранении стилей');
    } finally {
      setSaving(false);
    }
  };

  const updateNestedValue = (path: string[], value: string) => {
    if (!styles) return;
    
    const newStyles = { ...styles };
    let current: any = newStyles;
    
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    
    current[path[path.length - 1]] = value;
    setStyles(newStyles);
  };

  const ColorInput: React.FC<{
    label: string;
    path: string[];
    value: string;
  }> = ({ label, path, value }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2" style={{ color: '#B8B8B8' }}>
        {label}
      </label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => updateNestedValue(path, e.target.value)}
          className="w-16 h-10 rounded cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => updateNestedValue(path, e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg border"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            color: '#F5F5F5'
          }}
        />
      </div>
    </div>
  );

  const TextInput: React.FC<{
    label: string;
    path: string[];
    value: string;
  }> = ({ label, path, value }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2" style={{ color: '#B8B8B8' }}>
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => updateNestedValue(path, e.target.value)}
        className="w-full px-3 py-2 rounded-lg border"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          color: '#F5F5F5'
        }}
      />
    </div>
  );

  if (loading) {
    return <div className="p-8">Загрузка...</div>;
  }

  if (!styles) {
    return <div className="p-8">Ошибка загрузки стилей</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
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
          Управление стилями сайта
        </h1>
        <p style={{ color: '#8B8B8B', fontSize: '14px' }}>
          Редактирование цветов, шрифтов и стилей компонентов
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
        {(['colors', 'fonts', 'buttons', 'inputs', 'search', 'navigation', 'cards'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2 text-sm font-medium transition-colors"
            style={{
              color: activeTab === tab ? '#F2F0F0' : '#8B8B8B',
              borderBottom: activeTab === tab ? '2px solid #D71920' : '2px solid transparent',
              marginBottom: '-2px'
            }}
          >
            {tab === 'colors' && 'Цвета'}
            {tab === 'fonts' && 'Шрифты'}
            {tab === 'buttons' && 'Кнопки'}
            {tab === 'inputs' && 'Поля ввода'}
            {tab === 'search' && 'Поиск'}
            {tab === 'navigation' && 'Навигация'}
            {tab === 'cards' && 'Карточки'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div 
        className="p-6 rounded-xl mb-6"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        {activeTab === 'colors' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#F2F0F0' }}>Основные цвета</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ColorInput label="Фон сайта" path={['colors', 'background']} value={styles.colors.background} />
                <ColorInput label="Основной текст" path={['colors', 'text']} value={styles.colors.text} />
                <ColorInput label="Акцентный цвет" path={['colors', 'accent']} value={styles.colors.accent} />
                <ColorInput label="Брендовый цвет" path={['colors', 'brand']} value={styles.colors.brand} />
                <div className="md:col-span-2">
                  <TextInput label="Граница стекла (rgba)" path={['colors', 'glassBorder']} value={styles.colors.glassBorder} />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#F2F0F0' }}>Эффекты и радиусы</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextInput label="Радиус XL" path={['radius', 'xl']} value={styles.radius.xl} />
                <TextInput label="Радиус LG" path={['radius', 'lg']} value={styles.radius.lg} />
                <TextInput label="Размытие стекла" path={['blur', 'glass']} value={styles.blur.glass} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fonts' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#F2F0F0' }}>Шрифты</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextInput label="Шрифт заголовков" path={['fonts', 'headings']} value={styles.fonts.headings} />
                <TextInput label="Шрифт текста" path={['fonts', 'body']} value={styles.fonts.body} />
                <TextInput label="Fallback заголовков" path={['fonts', 'headingsFallback']} value={styles.fonts.headingsFallback} />
                <TextInput label="Fallback текста" path={['fonts', 'bodyFallback']} value={styles.fonts.bodyFallback} />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#F2F0F0' }}>Цвета шрифтов</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ColorInput label="Цвет заголовков (h1-h6)" path={['fonts', 'headingsColor']} value={styles.fonts.headingsColor || '#F5F5F5'} />
                <ColorInput label="Цвет основного текста" path={['fonts', 'bodyColor']} value={styles.fonts.bodyColor || '#F5F5F5'} />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#F2F0F0' }}>URL кастомных шрифтов (опционально)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextInput label="URL шрифта заголовков (Google Fonts, CDN и т.д.)" path={['fonts', 'headingsUrl']} value={styles.fonts.headingsUrl || ''} />
                <TextInput label="URL шрифта текста (Google Fonts, CDN и т.д.)" path={['fonts', 'bodyUrl']} value={styles.fonts.bodyUrl || ''} />
              </div>
              <p className="text-sm mt-2" style={{ color: '#8B8B8B' }}>
                Оставьте пустым, если используете локальные шрифты. Пример: https://fonts.googleapis.com/css2?family=Roboto
              </p>
            </div>
          </div>
        )}

        {activeTab === 'buttons' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#F2F0F0' }}>Основная кнопка</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ColorInput label="Фон" path={['buttons', 'primary', 'bg']} value={styles.buttons.primary.bg} />
                <ColorInput label="Текст" path={['buttons', 'primary', 'text']} value={styles.buttons.primary.text} />
                <ColorInput label="Граница" path={['buttons', 'primary', 'border']} value={styles.buttons.primary.border} />
                <TextInput label="Радиус" path={['buttons', 'primary', 'radius']} value={styles.buttons.primary.radius} />
                <ColorInput label="Фон (hover)" path={['buttons', 'primary', 'hoverBg']} value={styles.buttons.primary.hoverBg} />
                <ColorInput label="Текст (hover)" path={['buttons', 'primary', 'hoverText']} value={styles.buttons.primary.hoverText} />
                <ColorInput label="Граница (hover)" path={['buttons', 'primary', 'hoverBorder']} value={styles.buttons.primary.hoverBorder} />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#F2F0F0' }}>Вторичная кнопка</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ColorInput label="Фон" path={['buttons', 'secondary', 'bg']} value={styles.buttons.secondary.bg} />
                <ColorInput label="Текст" path={['buttons', 'secondary', 'text']} value={styles.buttons.secondary.text} />
                <ColorInput label="Граница" path={['buttons', 'secondary', 'border']} value={styles.buttons.secondary.border} />
                <TextInput label="Радиус" path={['buttons', 'secondary', 'radius']} value={styles.buttons.secondary.radius} />
                <ColorInput label="Фон (hover)" path={['buttons', 'secondary', 'hoverBg']} value={styles.buttons.secondary.hoverBg} />
                <ColorInput label="Текст (hover)" path={['buttons', 'secondary', 'hoverText']} value={styles.buttons.secondary.hoverText} />
                <ColorInput label="Граница (hover)" path={['buttons', 'secondary', 'hoverBorder']} value={styles.buttons.secondary.hoverBorder} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inputs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ColorInput label="Фон" path={['inputs', 'bg']} value={styles.inputs.bg} />
            <ColorInput label="Текст" path={['inputs', 'text']} value={styles.inputs.text} />
            <ColorInput label="Граница" path={['inputs', 'border']} value={styles.inputs.border} />
            <TextInput label="Радиус" path={['inputs', 'radius']} value={styles.inputs.radius} />
            <ColorInput label="Фон (focus)" path={['inputs', 'focusBg']} value={styles.inputs.focusBg} />
            <ColorInput label="Текст (focus)" path={['inputs', 'focusText']} value={styles.inputs.focusText} />
            <ColorInput label="Граница (focus)" path={['inputs', 'focusBorder']} value={styles.inputs.focusBorder} />
            <ColorInput label="Placeholder" path={['inputs', 'placeholder']} value={styles.inputs.placeholder} />
          </div>
        )}

        {activeTab === 'search' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ColorInput label="Фон" path={['search', 'bg']} value={styles.search.bg} />
            <ColorInput label="Текст" path={['search', 'text']} value={styles.search.text} />
            <ColorInput label="Граница" path={['search', 'border']} value={styles.search.border} />
            <TextInput label="Радиус" path={['search', 'radius']} value={styles.search.radius} />
            <ColorInput label="Фон (focus)" path={['search', 'focusBg']} value={styles.search.focusBg} />
            <ColorInput label="Граница (focus)" path={['search', 'focusBorder']} value={styles.search.focusBorder} />
          </div>
        )}

        {activeTab === 'navigation' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ColorInput label="Фон" path={['navigation', 'bg']} value={styles.navigation.bg} />
            <ColorInput label="Текст" path={['navigation', 'text']} value={styles.navigation.text} />
            <ColorInput label="Hover ссылок" path={['navigation', 'linkHover']} value={styles.navigation.linkHover} />
            <ColorInput label="Граница" path={['navigation', 'border']} value={styles.navigation.border} />
            <TextInput label="Радиус" path={['navigation', 'radius']} value={styles.navigation.radius} />
          </div>
        )}

        {activeTab === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ColorInput label="Фон" path={['cards', 'bg']} value={styles.cards.bg} />
            <ColorInput label="Текст" path={['cards', 'text']} value={styles.cards.text} />
            <ColorInput label="Граница" path={['cards', 'border']} value={styles.cards.border} />
            <TextInput label="Радиус" path={['cards', 'radius']} value={styles.cards.radius} />
            <ColorInput label="Фон (hover)" path={['cards', 'hoverBg']} value={styles.cards.hoverBg} />
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 rounded-lg font-medium transition-colors"
          style={{
            backgroundColor: saving ? '#666' : '#D71920',
            color: '#FFFFFF',
            cursor: saving ? 'not-allowed' : 'pointer'
          }}
        >
          {saving ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </div>
    </div>
  );
};

export default StylesAdmin;

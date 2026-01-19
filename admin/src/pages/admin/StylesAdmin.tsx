import React, { useState, useEffect, useRef, useCallback } from 'react';
import { apiService } from '../../services/apiService';
import FileUpload from '../../components/FileUpload';

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

// Функция для глубокого копирования объекта
const deepClone = <T,>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any;
  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
};

const StylesAdmin: React.FC = () => {
  const [styles, setStyles] = useState<SiteStyles | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'colors' | 'fonts' | 'buttons' | 'inputs' | 'search' | 'navigation' | 'cards'>('colors');
  const [uploadingHeadingsFont, setUploadingHeadingsFont] = useState(false);
  const [uploadingBodyFont, setUploadingBodyFont] = useState(false);
  
  // Используем useRef для сохранения ссылок на input элементы
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

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

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        throw new Error(`Ошибка загрузки файла (${response.status}): ${errorText.substring(0, 200) || response.statusText}`);
      }
      const errorMessage = errorData.error || errorData.message || `Ошибка загрузки файла (${response.status})`;
      throw new Error(errorMessage);
    }
    
    const result = await response.json();
    if (!result.success || !result.data || !result.data.url) {
      throw new Error('Неверный формат ответа от сервера');
    }
    
    return result.data.url;
  };

  const handleHeadingsFontUpload = async (file: File) => {
    setUploadingHeadingsFont(true);
    try {
      const fileUrl = await uploadFile(file);
      if (styles) {
        const newStyles = deepClone(styles);
        newStyles.fonts.headingsUrl = fileUrl;
        setStyles(newStyles);
      }
    } catch (error) {
      console.error('Error uploading headings font:', error);
      alert(`Ошибка загрузки шрифта заголовков: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    } finally {
      setUploadingHeadingsFont(false);
    }
  };

  const handleBodyFontUpload = async (file: File) => {
    setUploadingBodyFont(true);
    try {
      const fileUrl = await uploadFile(file);
      if (styles) {
        const newStyles = deepClone(styles);
        newStyles.fonts.bodyUrl = fileUrl;
        setStyles(newStyles);
      }
    } catch (error) {
      console.error('Error uploading body font:', error);
      alert(`Ошибка загрузки шрифта текста: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    } finally {
      setUploadingBodyFont(false);
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

  // Исправленная функция обновления с глубоким копированием и сохранением фокуса
  const updateNestedValue = useCallback((path: string[], value: string) => {
    if (!styles) return;
    
    // Сохраняем активный элемент перед обновлением
    const activeElement = document.activeElement as HTMLInputElement;
    const activeElementId = activeElement?.id;
    const selectionStart = activeElement?.selectionStart;
    const selectionEnd = activeElement?.selectionEnd;
    
    const newStyles = deepClone(styles);
    let current: any = newStyles;
    
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) {
        current[path[i]] = {};
      }
      current = current[path[i]];
    }
    
    current[path[path.length - 1]] = value;
    setStyles(newStyles);
    
    // Восстанавливаем фокус после обновления
    setTimeout(() => {
      if (activeElementId && inputRefs.current[activeElementId]) {
        const input = inputRefs.current[activeElementId];
        if (input) {
          input.focus();
          if (selectionStart !== null && selectionEnd !== null && input.setSelectionRange) {
            input.setSelectionRange(selectionStart, selectionEnd);
          }
        }
      }
    }, 0);
  }, [styles]);

  const ColorInput: React.FC<{
    label: string;
    path: string[];
    value: string;
    id: string;
  }> = ({ label, path, value, id }) => {
    const inputId = `color-${id}`;
    
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" style={{ color: '#B8B8B8' }}>
          {label}
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={value}
            onChange={(e) => {
              updateNestedValue(path, e.target.value);
            }}
            className="w-16 h-10 rounded cursor-pointer"
          />
          <input
            ref={(el) => {
              inputRefs.current[inputId] = el;
            }}
            type="text"
            id={inputId}
            value={value}
            onChange={(e) => {
              updateNestedValue(path, e.target.value);
            }}
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
  };

  const TextInput: React.FC<{
    label: string;
    path: string[];
    value: string;
    id: string;
  }> = ({ label, path, value, id }) => {
    const inputId = `text-${id}`;
    
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" style={{ color: '#B8B8B8' }}>
          {label}
        </label>
        <input
          ref={(el) => {
            inputRefs.current[inputId] = el;
          }}
          type="text"
          id={inputId}
          value={value || ''}
          onChange={(e) => {
            updateNestedValue(path, e.target.value);
          }}
          className="w-full px-3 py-2 rounded-lg border"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            color: '#F5F5F5'
          }}
        />
      </div>
    );
  };

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
                <ColorInput label="Фон сайта" path={['colors', 'background']} value={styles.colors.background} id="background" />
                <ColorInput label="Основной текст" path={['colors', 'text']} value={styles.colors.text} id="text" />
                <ColorInput label="Акцентный цвет" path={['colors', 'accent']} value={styles.colors.accent} id="accent" />
                <ColorInput label="Брендовый цвет" path={['colors', 'brand']} value={styles.colors.brand} id="brand" />
                <div className="md:col-span-2">
                  <TextInput label="Граница стекла (rgba)" path={['colors', 'glassBorder']} value={styles.colors.glassBorder} id="glassBorder" />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#F2F0F0' }}>Эффекты и радиусы</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextInput label="Радиус XL" path={['radius', 'xl']} value={styles.radius.xl} id="radius-xl" />
                <TextInput label="Радиус LG" path={['radius', 'lg']} value={styles.radius.lg} id="radius-lg" />
                <TextInput label="Размытие стекла" path={['blur', 'glass']} value={styles.blur.glass} id="blur-glass" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fonts' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#F2F0F0' }}>Шрифты</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextInput label="Шрифт заголовков" path={['fonts', 'headings']} value={styles.fonts.headings} id="headings" />
                <TextInput label="Шрифт текста" path={['fonts', 'body']} value={styles.fonts.body} id="body" />
                <TextInput label="Fallback заголовков" path={['fonts', 'headingsFallback']} value={styles.fonts.headingsFallback} id="headingsFallback" />
                <TextInput label="Fallback текста" path={['fonts', 'bodyFallback']} value={styles.fonts.bodyFallback} id="bodyFallback" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#F2F0F0' }}>Цвета шрифтов</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ColorInput label="Цвет заголовков (h1-h6)" path={['fonts', 'headingsColor']} value={styles.fonts.headingsColor || '#F5F5F5'} id="headingsColor" />
                <ColorInput label="Цвет основного текста" path={['fonts', 'bodyColor']} value={styles.fonts.bodyColor || '#F5F5F5'} id="bodyColor" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#F2F0F0' }}>Загрузка файлов шрифтов</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#B8B8B8' }}>
                    Файл шрифта заголовков (woff, woff2, ttf, otf)
                  </label>
                  <FileUpload
                    onFileSelect={handleHeadingsFontUpload}
                    accept=".woff,.woff2,.ttf,.otf"
                    maxSize={10}
                    disabled={uploadingHeadingsFont}
                  />
                  {uploadingHeadingsFont && (
                    <p className="text-sm mt-2" style={{ color: '#8B8B8B' }}>Загрузка...</p>
                  )}
                  {styles.fonts.headingsUrl && (
                    <div className="mt-2">
                      <p className="text-sm mb-1" style={{ color: '#8B8B8B' }}>Текущий файл:</p>
                      <a 
                        href={styles.fonts.headingsUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-400 hover:underline"
                      >
                        {styles.fonts.headingsUrl}
                      </a>
                      <button
                        onClick={() => {
                          if (styles) {
                            const newStyles = deepClone(styles);
                            newStyles.fonts.headingsUrl = '';
                            setStyles(newStyles);
                          }
                        }}
                        className="ml-2 text-sm text-red-400 hover:underline"
                      >
                        Удалить
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#B8B8B8' }}>
                    Файл шрифта текста (woff, woff2, ttf, otf)
                  </label>
                  <FileUpload
                    onFileSelect={handleBodyFontUpload}
                    accept=".woff,.woff2,.ttf,.otf"
                    maxSize={10}
                    disabled={uploadingBodyFont}
                  />
                  {uploadingBodyFont && (
                    <p className="text-sm mt-2" style={{ color: '#8B8B8B' }}>Загрузка...</p>
                  )}
                  {styles.fonts.bodyUrl && (
                    <div className="mt-2">
                      <p className="text-sm mb-1" style={{ color: '#8B8B8B' }}>Текущий файл:</p>
                      <a 
                        href={styles.fonts.bodyUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-400 hover:underline"
                      >
                        {styles.fonts.bodyUrl}
                      </a>
                      <button
                        onClick={() => {
                          if (styles) {
                            const newStyles = deepClone(styles);
                            newStyles.fonts.bodyUrl = '';
                            setStyles(newStyles);
                          }
                        }}
                        className="ml-2 text-sm text-red-400 hover:underline"
                      >
                        Удалить
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#F2F0F0' }}>URL кастомных шрифтов (опционально)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextInput label="URL шрифта заголовков (Google Fonts, CDN и т.д.)" path={['fonts', 'headingsUrl']} value={styles.fonts.headingsUrl || ''} id="headingsUrl" />
                <TextInput label="URL шрифта текста (Google Fonts, CDN и т.д.)" path={['fonts', 'bodyUrl']} value={styles.fonts.bodyUrl || ''} id="bodyUrl" />
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
                <ColorInput label="Фон" path={['buttons', 'primary', 'bg']} value={styles.buttons.primary.bg} id="primary-bg" />
                <ColorInput label="Текст" path={['buttons', 'primary', 'text']} value={styles.buttons.primary.text} id="primary-text" />
                <ColorInput label="Граница" path={['buttons', 'primary', 'border']} value={styles.buttons.primary.border} id="primary-border" />
                <TextInput label="Радиус" path={['buttons', 'primary', 'radius']} value={styles.buttons.primary.radius} id="primary-radius" />
                <ColorInput label="Фон (hover)" path={['buttons', 'primary', 'hoverBg']} value={styles.buttons.primary.hoverBg} id="primary-hoverBg" />
                <ColorInput label="Текст (hover)" path={['buttons', 'primary', 'hoverText']} value={styles.buttons.primary.hoverText} id="primary-hoverText" />
                <ColorInput label="Граница (hover)" path={['buttons', 'primary', 'hoverBorder']} value={styles.buttons.primary.hoverBorder} id="primary-hoverBorder" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#F2F0F0' }}>Вторичная кнопка</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ColorInput label="Фон" path={['buttons', 'secondary', 'bg']} value={styles.buttons.secondary.bg} id="secondary-bg" />
                <ColorInput label="Текст" path={['buttons', 'secondary', 'text']} value={styles.buttons.secondary.text} id="secondary-text" />
                <ColorInput label="Граница" path={['buttons', 'secondary', 'border']} value={styles.buttons.secondary.border} id="secondary-border" />
                <TextInput label="Радиус" path={['buttons', 'secondary', 'radius']} value={styles.buttons.secondary.radius} id="secondary-radius" />
                <ColorInput label="Фон (hover)" path={['buttons', 'secondary', 'hoverBg']} value={styles.buttons.secondary.hoverBg} id="secondary-hoverBg" />
                <ColorInput label="Текст (hover)" path={['buttons', 'secondary', 'hoverText']} value={styles.buttons.secondary.hoverText} id="secondary-hoverText" />
                <ColorInput label="Граница (hover)" path={['buttons', 'secondary', 'hoverBorder']} value={styles.buttons.secondary.hoverBorder} id="secondary-hoverBorder" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inputs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ColorInput label="Фон" path={['inputs', 'bg']} value={styles.inputs.bg} id="inputs-bg" />
            <ColorInput label="Текст" path={['inputs', 'text']} value={styles.inputs.text} id="inputs-text" />
            <ColorInput label="Граница" path={['inputs', 'border']} value={styles.inputs.border} id="inputs-border" />
            <TextInput label="Радиус" path={['inputs', 'radius']} value={styles.inputs.radius} id="inputs-radius" />
            <ColorInput label="Фон (focus)" path={['inputs', 'focusBg']} value={styles.inputs.focusBg} id="inputs-focusBg" />
            <ColorInput label="Текст (focus)" path={['inputs', 'focusText']} value={styles.inputs.focusText} id="inputs-focusText" />
            <ColorInput label="Граница (focus)" path={['inputs', 'focusBorder']} value={styles.inputs.focusBorder} id="inputs-focusBorder" />
            <ColorInput label="Placeholder" path={['inputs', 'placeholder']} value={styles.inputs.placeholder} id="inputs-placeholder" />
          </div>
        )}

        {activeTab === 'search' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ColorInput label="Фон" path={['search', 'bg']} value={styles.search.bg} id="search-bg" />
            <ColorInput label="Текст" path={['search', 'text']} value={styles.search.text} id="search-text" />
            <ColorInput label="Граница" path={['search', 'border']} value={styles.search.border} id="search-border" />
            <TextInput label="Радиус" path={['search', 'radius']} value={styles.search.radius} id="search-radius" />
            <ColorInput label="Фон (focus)" path={['search', 'focusBg']} value={styles.search.focusBg} id="search-focusBg" />
            <ColorInput label="Граница (focus)" path={['search', 'focusBorder']} value={styles.search.focusBorder} id="search-focusBorder" />
          </div>
        )}

        {activeTab === 'navigation' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ColorInput label="Фон" path={['navigation', 'bg']} value={styles.navigation.bg} id="navigation-bg" />
            <ColorInput label="Текст" path={['navigation', 'text']} value={styles.navigation.text} id="navigation-text" />
            <ColorInput label="Hover ссылок" path={['navigation', 'linkHover']} value={styles.navigation.linkHover} id="navigation-linkHover" />
            <ColorInput label="Граница" path={['navigation', 'border']} value={styles.navigation.border} id="navigation-border" />
            <TextInput label="Радиус" path={['navigation', 'radius']} value={styles.navigation.radius} id="navigation-radius" />
          </div>
        )}

        {activeTab === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ColorInput label="Фон" path={['cards', 'bg']} value={styles.cards.bg} id="cards-bg" />
            <ColorInput label="Текст" path={['cards', 'text']} value={styles.cards.text} id="cards-text" />
            <ColorInput label="Граница" path={['cards', 'border']} value={styles.cards.border} id="cards-border" />
            <TextInput label="Радиус" path={['cards', 'radius']} value={styles.cards.radius} id="cards-radius" />
            <ColorInput label="Фон (hover)" path={['cards', 'hoverBg']} value={styles.cards.hoverBg} id="cards-hoverBg" />
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

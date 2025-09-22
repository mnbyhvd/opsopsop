import React, { useState, useEffect } from 'react';

interface TextBlock {
  id: number;
  title: string;
  description: string;
  order: number;
}

interface ScrollSectionData {
  id: number;
  section_title: string;
  section_subtitle: string;
  video_url: string;
  text_blocks: TextBlock[];
  created_at: string;
  updated_at: string;
}

const ScrollSectionAdmin: React.FC = () => {
  const [data, setData] = useState<ScrollSectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Стили для полей ввода
  const inputStyles: React.CSSProperties = {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#F2F0F0',
    fontFamily: 'Inter',
    borderRadius: '8px',
    padding: '12px 16px',
    width: '100%',
    fontSize: '14px',
    transition: 'all 0.2s ease'
  };

  const labelStyles: React.CSSProperties = {
    fontFamily: 'Inter',
    color: '#E5E5E5',
    fontSize: '14px',
    fontWeight: 500,
    marginBottom: '8px',
    display: 'block'
  };

  const buttonStyles: React.CSSProperties = {
    backgroundColor: '#D71920',
    color: '#F2F0F0',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontFamily: 'Inter',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  // Загрузка данных
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/scroll-section');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setData(result.data);
        }
      }
    } catch (error) {
      console.error('Error fetching scroll section data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Сохранение данных
  const handleSave = async () => {
    if (!data) return;

    try {
      setSaving(true);
      setMessage(null);

      const response = await fetch('/api/scroll-section', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section_title: data.section_title,
          section_subtitle: data.section_subtitle,
          video_url: data.video_url,
          text_blocks: data.text_blocks
        }),
      });

      if (response.ok) {
        setMessage('Данные успешно сохранены!');
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage('Ошибка при сохранении данных');
      }
    } catch (error) {
      console.error('Error saving scroll section data:', error);
      setMessage('Ошибка при сохранении данных');
    } finally {
      setSaving(false);
    }
  };

  // Обновление основного контента
  const updateField = (field: keyof ScrollSectionData, value: string) => {
    if (data) {
      setData({ ...data, [field]: value });
    }
  };

  // Добавление нового текстового блока
  const addTextBlock = () => {
    if (data && data.text_blocks.length < 5) {
      const newBlock: TextBlock = {
        id: Date.now(),
        title: '',
        description: '',
        order: data.text_blocks.length + 1
      };
      setData({
        ...data,
        text_blocks: [...data.text_blocks, newBlock]
      });
    }
  };

  // Удаление текстового блока
  const removeTextBlock = (index: number) => {
    if (data && data.text_blocks.length > 3) {
      const newBlocks = data.text_blocks.filter((_, i) => i !== index);
      // Обновляем порядок
      newBlocks.forEach((block, i) => {
        block.order = i + 1;
      });
      setData({
        ...data,
        text_blocks: newBlocks
      });
    }
  };

  // Обновление текстового блока
  const updateTextBlock = (index: number, field: keyof TextBlock, value: string | number) => {
    if (data) {
      const newBlocks = [...data.text_blocks];
      newBlocks[index] = { ...newBlocks[index], [field]: value };
      setData({ ...data, text_blocks: newBlocks });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Загрузка...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-white">
        <p>Ошибка загрузки данных</p>
        <button 
          onClick={fetchData}
          style={buttonStyles}
          className="mt-4"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Scroll Section</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            ...buttonStyles,
            opacity: saving ? 0.6 : 1,
            cursor: saving ? 'not-allowed' : 'pointer'
          }}
        >
          {saving ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('успешно') 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          {message}
        </div>
      )}

      {/* Основная информация */}
      <div className="bg-gray-800/30 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Основная информация</h3>
        
        <div className="space-y-6">
          <div>
            <label style={labelStyles}>Заголовок секции</label>
            <input
              type="text"
              value={data.section_title}
              onChange={(e) => updateField('section_title', e.target.value)}
              style={inputStyles}
              placeholder="Введите заголовок секции"
              onFocus={(e) => {
                e.target.style.borderColor = '#D71920';
                e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                e.target.style.boxShadow = '0 0 0 2px rgba(215, 25, 32, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div>
            <label style={labelStyles}>Подзаголовок секции</label>
            <textarea
              value={data.section_subtitle}
              onChange={(e) => updateField('section_subtitle', e.target.value)}
              style={{ ...inputStyles, minHeight: '80px', resize: 'vertical' }}
              placeholder="Введите подзаголовок секции"
              onFocus={(e) => {
                e.target.style.borderColor = '#D71920';
                e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                e.target.style.boxShadow = '0 0 0 2px rgba(215, 25, 32, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div>
            <label style={labelStyles}>URL видео</label>
            <input
              type="text"
              value={data.video_url}
              onChange={(e) => updateField('video_url', e.target.value)}
              style={inputStyles}
              placeholder="Введите URL видео файла"
              onFocus={(e) => {
                e.target.style.borderColor = '#D71920';
                e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                e.target.style.boxShadow = '0 0 0 2px rgba(215, 25, 32, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>
      </div>

      {/* Текстовые блоки */}
      <div className="bg-gray-800/30 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">Текстовые блоки</h3>
          <button
            onClick={addTextBlock}
            disabled={data.text_blocks.length >= 5}
            style={{
              ...buttonStyles,
              opacity: data.text_blocks.length >= 5 ? 0.5 : 1,
              cursor: data.text_blocks.length >= 5 ? 'not-allowed' : 'pointer',
              backgroundColor: '#10B981'
            }}
          >
            + Добавить блок
          </button>
        </div>

        <div className="space-y-6">
          {data.text_blocks.map((block, index) => (
            <div key={block.id} className="bg-gray-700/30 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-white">
                  Блок {block.order}
                </h4>
                <button
                  onClick={() => removeTextBlock(index)}
                  disabled={data.text_blocks.length <= 3}
                  style={{
                    ...buttonStyles,
                    backgroundColor: '#EF4444',
                    padding: '8px 16px',
                    fontSize: '12px',
                    opacity: data.text_blocks.length <= 3 ? 0.5 : 1,
                    cursor: data.text_blocks.length <= 3 ? 'not-allowed' : 'pointer'
                  }}
                >
                  Удалить
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label style={labelStyles}>Заголовок блока</label>
                  <input
                    type="text"
                    value={block.title}
                    onChange={(e) => updateTextBlock(index, 'title', e.target.value)}
                    style={inputStyles}
                    placeholder="Введите заголовок блока"
                    onFocus={(e) => {
                      e.target.style.borderColor = '#D71920';
                      e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                      e.target.style.boxShadow = '0 0 0 2px rgba(215, 25, 32, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div>
                  <label style={labelStyles}>Описание блока</label>
                  <textarea
                    value={block.description}
                    onChange={(e) => updateTextBlock(index, 'description', e.target.value)}
                    style={{ ...inputStyles, minHeight: '80px', resize: 'vertical' }}
                    placeholder="Введите описание блока"
                    onFocus={(e) => {
                      e.target.style.borderColor = '#D71920';
                      e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                      e.target.style.boxShadow = '0 0 0 2px rgba(215, 25, 32, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-sm text-gray-400">
          Минимум 3 блока, максимум 5 блоков. Блоки отображаются в порядке их добавления.
        </div>
      </div>
    </div>
  );
};

export default ScrollSectionAdmin;

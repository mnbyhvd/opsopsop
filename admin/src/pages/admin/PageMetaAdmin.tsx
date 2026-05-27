import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/apiService';

interface PageMeta {
  id: number;
  page_key: string;
  path: string;
  label: string;
  title: string;
  description: string;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

const PageMetaAdmin: React.FC = () => {
  const [items, setItems] = useState<PageMeta[]>([]);
  const [editingItem, setEditingItem] = useState<PageMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const loadItems = async () => {
    setLoading(true);
    const response = await apiService.getPageMeta();

    if (response.success && Array.isArray(response.data)) {
      setItems((response.data as PageMeta[]).sort((a, b) => a.sort_order - b.sort_order));
    } else {
      setMessage(response.error || 'Ошибка загрузки метатегов страниц');
    }

    setLoading(false);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleSave = async () => {
    if (!editingItem) return;

    setSaving(true);
    setMessage(null);
    const response = await apiService.updatePageMeta(editingItem.page_key, {
      title: editingItem.title,
      description: editingItem.description
    });

    if (response.success) {
      await loadItems();
      setEditingItem(null);
      setMessage('Метатеги страницы сохранены');
      setTimeout(() => setMessage(null), 2500);
    } else {
      setMessage(response.error || 'Ошибка сохранения метатегов страницы');
    }

    setSaving(false);
  };

  if (loading) {
    return <div className="p-8">Загрузка SEO страниц...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3" style={{ color: '#F2F0F0' }}>
          SEO страниц
        </h1>
        <p className="text-sm max-w-3xl" style={{ color: '#B8B8B8' }}>
          Управление тегами title и description для статических страниц сайта. OG title и OG description на сайте автоматически используют эти же значения.
        </p>
      </div>

      {message && (
        <div
          className="mb-6 p-4 rounded-lg border"
          style={{
            color: message.includes('Ошибка') ? '#FCA5A5' : '#86EFAC',
            backgroundColor: message.includes('Ошибка') ? 'rgba(127, 29, 29, 0.25)' : 'rgba(22, 101, 52, 0.2)',
            borderColor: message.includes('Ошибка') ? 'rgba(252, 165, 165, 0.25)' : 'rgba(134, 239, 172, 0.25)'
          }}
        >
          {message}
        </div>
      )}

      <div className="grid gap-5">
        {items.map(item => (
          <div key={item.page_key} className="admin-card">
            <div className="flex flex-col lg:flex-row gap-5 justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h3 className="text-xl font-semibold" style={{ color: '#F2F0F0' }}>
                    {item.label}
                  </h3>
                  <span className="text-xs px-3 py-1 rounded-full border" style={{ color: '#B8B8B8', borderColor: 'rgba(255,255,255,0.18)' }}>
                    {item.path}
                  </span>
                </div>
                <div className="mb-2" style={{ color: '#F2F0F0' }}>
                  {item.title}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#B8B8B8' }}>
                  {item.description}
                </p>
              </div>

              <div className="flex items-start">
                <button onClick={() => setEditingItem({ ...item })} className="admin-button-secondary">
                  Редактировать
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="admin-card max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#F2F0F0' }}>
              {editingItem.label}
            </h2>
            <div className="text-sm mb-6" style={{ color: '#8B8B8B' }}>
              {editingItem.path}
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#B8B8B8' }}>
                  Title
                </label>
                <input
                  className="admin-input"
                  value={editingItem.title}
                  onChange={event => setEditingItem({ ...editingItem, title: event.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#B8B8B8' }}>
                  Description
                </label>
                <textarea
                  className="admin-input h-36"
                  value={editingItem.description}
                  onChange={event => setEditingItem({ ...editingItem, description: event.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={handleSave} className="admin-button-primary" disabled={saving}>
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
              <button onClick={() => setEditingItem(null)} className="admin-button-secondary" disabled={saving}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageMetaAdmin;

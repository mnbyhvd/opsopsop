import React, { useEffect, useState } from 'react';
import FileUpload from '../../components/FileUpload';
import { apiService } from '../../services/apiService';
import { resolveMediaUrl } from '../../utils/media';

interface ServiceBlock {
  id: number;
  title: string;
  description: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

const emptyService = (sortOrder: number): ServiceBlock => ({
  id: 0,
  title: '',
  description: '',
  image_url: '',
  sort_order: sortOrder,
  is_active: true
});

const ServicesAdmin: React.FC = () => {
  const [items, setItems] = useState<ServiceBlock[]>([]);
  const [editingItem, setEditingItem] = useState<ServiceBlock | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const loadItems = async () => {
    setLoading(true);
    const response = await apiService.getServices(true);
    if (response.success && Array.isArray(response.data)) {
      setItems((response.data as ServiceBlock[]).sort((a, b) => a.sort_order - b.sort_order));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const uploadFile = async (file: File): Promise<string> => {
    const response = await apiService.uploadFile(file, 'image');

    if (!response.success) {
      throw new Error(response.error || 'Ошибка загрузки файла');
    }

    const data = response.data as { url?: string; publicUrl?: string } | undefined;
    const imageUrl = data?.url || data?.publicUrl;

    if (!imageUrl) {
      throw new Error('Сервер не вернул URL загруженного файла');
    }

    return imageUrl;
  };

  const handleImageUpload = async (file: File) => {
    if (!editingItem) return;
    setUploading(true);
    setUploadStatus(null);
    try {
      const imageUrl = await uploadFile(file);
      setEditingItem({ ...editingItem, image_url: imageUrl });
      setUploadStatus(`Файл загружен: ${imageUrl}. Нажмите "Сохранить", чтобы привязать его к услуге.`);
    } catch (error) {
      console.error('Service image upload error:', error);
      const message = error instanceof Error ? error.message : 'Ошибка загрузки изображения';
      setUploadStatus(message);
      alert(`Ошибка загрузки изображения: ${message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = () => {
    setEditingItem(emptyService(items.length + 1));
    setUploadStatus(null);
    setIsCreating(true);
  };

  const handleEdit = (item: ServiceBlock) => {
    setEditingItem({ ...item });
    setUploadStatus(null);
    setIsCreating(false);
  };

  const handleSave = async () => {
    if (!editingItem) return;
    setSaving(true);
    const response = isCreating
      ? await apiService.createService(editingItem)
      : await apiService.updateService(editingItem.id, editingItem);

    if (response.success) {
      await loadItems();
      setEditingItem(null);
      setUploadStatus(null);
      setIsCreating(false);
    } else {
      alert(response.error || 'Ошибка сохранения услуги');
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Удалить услугу?')) return;
    const response = await apiService.deleteService(id);
    if (response.success) {
      setItems(items.filter(item => item.id !== id));
    } else {
      alert(response.error || 'Ошибка удаления услуги');
    }
  };

  const persistOrder = async (orderedItems: ServiceBlock[]) => {
    setItems(orderedItems);
    await Promise.all(
      orderedItems.map((item, index) =>
        apiService.updateService(item.id, { ...item, sort_order: index + 1 })
      )
    );
    await loadItems();
  };

  const moveItem = async (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= items.length) return;
    const ordered = [...items];
    const [item] = ordered.splice(index, 1);
    ordered.splice(nextIndex, 0, item);
    await persistOrder(ordered.map((entry, orderIndex) => ({ ...entry, sort_order: orderIndex + 1 })));
  };

  if (loading) return <div className="p-8">Загрузка услуг...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6" style={{ color: '#F2F0F0' }}>
          Управление страницей услуг
        </h1>
        <button onClick={handleCreate} className="admin-button-primary">
          Добавить услугу
        </button>
      </div>

      <div className="grid gap-6">
        {items.map((item, index) => (
          <div key={item.id} className="admin-card">
            <div className="flex flex-col lg:flex-row gap-6 justify-between">
              <div className="flex gap-4 flex-1">
                {item.image_url && (
                  <img src={resolveMediaUrl(item.image_url)} alt={item.title} className="w-32 h-24 object-cover rounded-lg flex-shrink-0" />
                )}
                <div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: '#F2F0F0' }}>{item.title}</h3>
                  <p className="mb-3 whitespace-pre-line" style={{ color: '#B8B8B8' }}>{item.description}</p>
                  <div className="text-sm" style={{ color: '#8B8B8B' }}>
                    Порядок: {item.sort_order} | Статус: {item.is_active ? 'Активна' : 'Скрыта'}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 items-start">
                <button onClick={() => moveItem(index, -1)} className="admin-button-secondary" disabled={index === 0}>Выше</button>
                <button onClick={() => moveItem(index, 1)} className="admin-button-secondary" disabled={index === items.length - 1}>Ниже</button>
                <button onClick={() => handleEdit(item)} className="admin-button-secondary">Редактировать</button>
                <button onClick={() => handleDelete(item.id)} className="admin-button-danger">Удалить</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="admin-card max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#F2F0F0' }}>
              {isCreating ? 'Новая услуга' : 'Редактирование услуги'}
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#B8B8B8' }}>Заголовок</label>
                <input className="admin-input" value={editingItem.title} onChange={e => setEditingItem({ ...editingItem, title: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#B8B8B8' }}>Описание</label>
                <textarea className="admin-input h-40" value={editingItem.description} onChange={e => setEditingItem({ ...editingItem, description: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#B8B8B8' }}>Изображение</label>
                <FileUpload onFileSelect={handleImageUpload} accept="image/*" maxSize={10} disabled={uploading} showPreview />
                {uploading && (
                  <div className="mt-2 text-sm" style={{ color: '#B8B8B8' }}>
                    Загружаем файл...
                  </div>
                )}
                {uploadStatus && (
                  <div className="mt-2 text-sm" style={{ color: uploadStatus.startsWith('Файл загружен') ? '#22C55E' : '#D71920' }}>
                    {uploadStatus}
                  </div>
                )}
                <input className="admin-input mt-3" value={editingItem.image_url || ''} onChange={e => setEditingItem({ ...editingItem, image_url: e.target.value })} placeholder="URL изображения" />
                {editingItem.image_url && (
                  <div className="mt-3">
                    <img src={resolveMediaUrl(editingItem.image_url)} alt="Preview" className="w-40 h-28 object-cover rounded-lg" />
                    <a
                      href={resolveMediaUrl(editingItem.image_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-sm underline"
                      style={{ color: '#B8B8B8' }}
                    >
                      Открыть файл
                    </a>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#B8B8B8' }}>Порядок</label>
                <input type="number" className="admin-input" value={editingItem.sort_order} onChange={e => setEditingItem({ ...editingItem, sort_order: parseInt(e.target.value, 10) || 0 })} />
              </div>
              <label className="flex items-center gap-2 text-sm" style={{ color: '#B8B8B8' }}>
                <input type="checkbox" checked={editingItem.is_active} onChange={e => setEditingItem({ ...editingItem, is_active: e.target.checked })} style={{ accentColor: '#D71920' }} />
                Активна на сайте
              </label>
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={handleSave} className="admin-button-success" disabled={saving}>{saving ? 'Сохранение...' : 'Сохранить'}</button>
              <button onClick={() => { setEditingItem(null); setUploadStatus(null); }} className="admin-button-secondary">Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesAdmin;

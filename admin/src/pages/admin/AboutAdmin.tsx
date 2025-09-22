import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAbout, AboutItem } from '../../hooks/useAbout';
import FileUpload from '../../components/FileUpload';
import DataExporter from '../../components/DataExporter';

interface SortableItemProps {
  item: AboutItem;
  index: number;
  onEdit: (item: AboutItem) => void;
  onDelete: (id: number) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ item, index, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="admin-card"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-4">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-700 rounded"
            style={{ color: '#8B8B8B' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </div>
          <div className="flex-1">
            <div className="flex items-start gap-4">
              {item.image_url && (
                <div className="flex-shrink-0">
                  <img 
                    src={`/api${item.image_url}`} 
                    alt={item.title}
                    className="w-24 h-16 object-contain rounded-lg"
                  />
                </div>
              )}
              <div className="flex-1">
                <h3 
                  className="text-xl font-semibold mb-2"
                  style={{
                    fontFamily: 'Roboto Flex',
                    fontWeight: 500,
                    color: '#F2F0F0'
                  }}
                >
                  {item.title}
                </h3>
                <p 
                  className="mb-2"
                  style={{
                    fontFamily: 'Inter',
                    color: '#B8B8B8'
                  }}
                >
                  {item.description}
                </p>
                <div 
                  className="text-sm"
                  style={{ color: '#8B8B8B' }}
                >
                  Порядок: {item.sort_order} | 
                  Статус: {item.is_active ? 'Активен' : 'Неактивен'}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(item)}
            className="admin-button-secondary"
          >
            Редактировать
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="admin-button-danger"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

const AboutAdmin: React.FC = () => {
  const { aboutItems, loading } = useAbout();
  const [items, setItems] = useState<AboutItem[]>([]);
  const [editingItem, setEditingItem] = useState<AboutItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (aboutItems.length > 0) {
      setItems(aboutItems);
    }
  }, [aboutItems]);

  const handleEdit = (item: AboutItem) => {
    setEditingItem({ ...item });
    setIsCreating(false);
  };

  const handleCreate = () => {
    setEditingItem({
      id: 0,
      title: '',
      description: '',
      image_url: '',
      sort_order: items.length + 1,
      is_active: true,
      created_at: '',
      updated_at: ''
    });
    setIsCreating(true);
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Ошибка загрузки файла');
    }
    
    const result = await response.json();
    return result.data.url;
  };

  const handleImageUpload = async (file: File) => {
    if (!editingItem) return;
    
    setUploadingImage(true);
    try {
      const imageUrl = await uploadFile(file);
      setEditingItem({ ...editingItem, image_url: imageUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Ошибка загрузки изображения');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleExport = async (format: 'json' | 'csv' | 'xlsx') => {
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'about',
          format: format
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const downloadResponse = await fetch(`${result.data.downloadUrl}`);
        const blob = await downloadResponse.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = result.data.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        throw new Error('Ошибка экспорта');
      }
    } catch (error) {
      console.error('Export error:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    if (!editingItem) return;

    try {
      const url = isCreating 
        ? '/api/about'
        : `/api/about/${editingItem.id}`;
      
      const method = isCreating ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingItem),
      });

      if (response.ok) {
        const result = await response.json();
        if (isCreating) {
          setItems([...items, result.data]);
        } else {
          setItems(items.map(item => 
            item.id === editingItem.id ? result.data : item
          ));
        }
        setEditingItem(null);
        setIsCreating(false);
      } else {
        console.error('Error saving item');
      }
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот элемент?')) return;

    try {
      const response = await fetch(`/api/about/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setItems(items.filter(item => item.id !== id));
      } else {
        console.error('Error deleting item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      // Обновляем порядок в базе данных
      try {
        const updates = newItems.map((item, index) => ({
          id: item.id,
          sort_order: index + 1
        }));

        // Отправляем все обновления
        const updatePromises = updates.map(update => 
          fetch(`/api/about/${update.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...items.find(item => item.id === update.id),
              sort_order: update.sort_order
            }),
          })
        );

        await Promise.all(updatePromises);
      } catch (error) {
        console.error('Error updating sort order:', error);
        // В случае ошибки возвращаем исходный порядок
        setItems(items);
      }
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
    setIsCreating(false);
  };

  if (loading) {
    return <div className="p-8">Загрузка...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
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
          Управление блоком "О системе"
        </h1>
        <div className="flex gap-4">
          <button
            onClick={handleCreate}
            className="admin-button-primary"
          >
            Добавить новый элемент
          </button>
          <DataExporter onExport={handleExport} />
        </div>
      </div>

      {/* Список элементов с drag and drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
          <div className="grid gap-6">
            {items.map((item, index) => (
              <SortableItem
                key={item.id}
                item={item}
                index={index}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Форма редактирования */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="admin-card max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 
              className="text-2xl font-bold mb-6"
              style={{
                fontFamily: 'Roboto Flex',
                fontWeight: 478,
                color: '#F2F0F0'
              }}
            >
              {isCreating ? 'Создание нового элемента' : 'Редактирование элемента'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#B8B8B8' }}
                >
                  Заголовок
                </label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
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
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                  className="admin-input h-32"
                />
              </div>
              
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#B8B8B8' }}
                >
                  Изображение
                </label>
                <FileUpload
                  onFileSelect={handleImageUpload}
                  accept="image/*"
                  maxSize={10}
                  disabled={uploadingImage}
                  showPreview={true}
                />
                {editingItem.image_url && (
                  <div className="mt-4">
                    <img 
                      src={`/api${editingItem.image_url}`} 
                      alt="Preview" 
                      className="w-32 h-20 object-contain rounded"
                    />
                    <input
                      type="text"
                      value={editingItem.image_url}
                      onChange={(e) => setEditingItem({...editingItem, image_url: e.target.value})}
                      className="admin-input mt-2"
                      placeholder="Или введите URL вручную"
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#B8B8B8' }}
                >
                  Порядок сортировки
                </label>
                <input
                  type="number"
                  value={editingItem.sort_order}
                  onChange={(e) => setEditingItem({...editingItem, sort_order: parseInt(e.target.value) || 0})}
                  className="admin-input"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={editingItem.is_active}
                  onChange={(e) => setEditingItem({...editingItem, is_active: e.target.checked})}
                  className="mr-2"
                  style={{ accentColor: '#D71920' }}
                />
                <label 
                  htmlFor="is_active" 
                  className="text-sm font-medium"
                  style={{ color: '#B8B8B8' }}
                >
                  Активен
                </label>
              </div>
            </div>
            
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleSave}
                className="admin-button-success"
              >
                Сохранить
              </button>
              <button
                onClick={handleCancel}
                className="admin-button-secondary"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutAdmin;

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
import FileUpload from '../../components/FileUpload';
import DataExporter from '../../components/DataExporter';

interface Product {
  id: number;
  name: string;
  description: string;
  image_url: string;
  hover_image_url: string;
  detail_page_url: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface SortableProductProps {
  product: Product;
  index: number;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

const SortableProduct: React.FC<SortableProductProps> = ({ product, index, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

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
            <div className="flex items-center gap-4 mb-2">
              {product.image_url && (
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              )}
              <div>
                <h3 
                  className="text-xl font-semibold mb-1"
                  style={{
                    fontFamily: 'Roboto Flex',
                    fontWeight: 500,
                    color: '#F2F0F0'
                  }}
                >
                  {product.name}
                </h3>
                <p 
                  className="text-sm mb-2"
                  style={{
                    fontFamily: 'Inter',
                    color: '#B8B8B8'
                  }}
                >
                  {product.description}
                </p>
                <div 
                  className="text-xs"
                  style={{ color: '#8B8B8B' }}
                >
                  Порядок: {product.sort_order} | 
                  Статус: {product.is_active ? 'Активен' : 'Неактивен'} |
                  URL: {product.detail_page_url}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="admin-button-secondary"
          >
            Редактировать
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="admin-button-danger"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductsAdmin: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingHoverImage, setUploadingHoverImage] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
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
    });
    
    if (!response.ok) {
      throw new Error('Ошибка загрузки файла');
    }
    
    const result = await response.json();
    return result.data.url;
  };

  const handleImageUpload = async (file: File) => {
    if (!editingProduct) return;
    
    setUploadingImage(true);
    try {
      const imageUrl = await uploadFile(file);
      setEditingProduct({ ...editingProduct, image_url: imageUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Ошибка загрузки изображения');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleHoverImageUpload = async (file: File) => {
    if (!editingProduct) return;
    
    setUploadingHoverImage(true);
    try {
      const imageUrl = await uploadFile(file);
      setEditingProduct({ ...editingProduct, hover_image_url: imageUrl });
    } catch (error) {
      console.error('Error uploading hover image:', error);
      alert('Ошибка загрузки изображения при наведении');
    } finally {
      setUploadingHoverImage(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setIsCreating(false);
  };

  const handleCreate = () => {
    setEditingProduct({
      id: 0,
      name: '',
      description: '',
      image_url: '',
      hover_image_url: '',
      detail_page_url: '',
      sort_order: products.length + 1,
      is_active: true,
      created_at: '',
      updated_at: ''
    });
    setIsCreating(true);
  };

  const handleSave = async () => {
    if (!editingProduct) return;

    try {
      const url = isCreating 
        ? '/api/products'
        : `/api/products/${editingProduct.id}`;
      
      const method = isCreating ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingProduct),
      });

      if (response.ok) {
        const result = await response.json();
        if (isCreating) {
          setProducts([...products, result.data]);
        } else {
          setProducts(products.map(product => 
            product.id === editingProduct.id ? result.data : product
          ));
        }
        setEditingProduct(null);
        setIsCreating(false);
      } else {
        console.error('Error saving product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот продукт?')) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter(product => product.id !== id));
      } else {
        console.error('Error deleting product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = products.findIndex(product => product.id === active.id);
      const newIndex = products.findIndex(product => product.id === over.id);

      const newProducts = arrayMove(products, oldIndex, newIndex);
      setProducts(newProducts);

      // Обновляем порядок в базе данных
      try {
        const updates = newProducts.map((product, index) => ({
          id: product.id,
          sort_order: index + 1
        }));

        const updatePromises = updates.map(update => 
          fetch(`/api/products/${update.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...products.find(product => product.id === update.id),
              sort_order: update.sort_order
            }),
          })
        );

        await Promise.all(updatePromises);
      } catch (error) {
        console.error('Error updating sort order:', error);
        setProducts(products);
      }
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setIsCreating(false);
  };

  const handleExport = async (format: 'json' | 'csv' | 'xlsx') => {
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'products',
          format: format
        }),
      });

      if (response.ok) {
        const result = await response.json();
        // Скачиваем файл
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
          Управление продукцией
        </h1>
        <div className="flex gap-4">
          <button
            onClick={handleCreate}
            className="admin-button-primary"
          >
            Добавить новый продукт
          </button>
          <DataExporter onExport={handleExport} />
        </div>
      </div>

      {/* Список продуктов с drag and drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={products.map(product => product.id)} strategy={verticalListSortingStrategy}>
          <div className="grid gap-6">
            {products.map((product, index) => (
              <SortableProduct
                key={product.id}
                product={product}
                index={index}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Форма редактирования */}
      {editingProduct && (
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
              {isCreating ? 'Создание нового продукта' : 'Редактирование продукта'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#B8B8B8' }}
                >
                  Название продукта
                </label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
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
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  className="admin-input h-32"
                />
              </div>
              
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#B8B8B8' }}
                >
                  Изображение (обычное)
                </label>
                <FileUpload
                  onFileSelect={handleImageUpload}
                  accept="image/*"
                  maxSize={5}
                  disabled={uploadingImage}
                />
                {editingProduct.image_url && (
                  <div className="mt-2">
                    <img 
                      src={`${editingProduct.image_url}`} 
                      alt="Preview" 
                      className="w-20 h-20 object-cover rounded"
                    />
                    <input
                      type="text"
                      value={editingProduct.image_url}
                      onChange={(e) => setEditingProduct({...editingProduct, image_url: e.target.value})}
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
                  Изображение (при наведении)
                </label>
                <FileUpload
                  onFileSelect={handleHoverImageUpload}
                  accept="image/*"
                  maxSize={5}
                  disabled={uploadingHoverImage}
                />
                {editingProduct.hover_image_url && (
                  <div className="mt-2">
                    <img 
                      src={`${editingProduct.hover_image_url}`} 
                      alt="Preview" 
                      className="w-20 h-20 object-cover rounded"
                    />
                    <input
                      type="text"
                      value={editingProduct.hover_image_url}
                      onChange={(e) => setEditingProduct({...editingProduct, hover_image_url: e.target.value})}
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
                  URL страницы продукта
                </label>
                <input
                  type="text"
                  value={editingProduct.detail_page_url || ''}
                  onChange={(e) => setEditingProduct({...editingProduct, detail_page_url: e.target.value})}
                  className="admin-input"
                />
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
                  value={editingProduct.sort_order}
                  onChange={(e) => setEditingProduct({...editingProduct, sort_order: parseInt(e.target.value) || 0})}
                  className="admin-input"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={editingProduct.is_active}
                  onChange={(e) => setEditingProduct({...editingProduct, is_active: e.target.checked})}
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

export default ProductsAdmin;

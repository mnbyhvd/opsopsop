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
  image_url: string | null;
  category_id: number | null;
  category_name: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ProductDocument {
  id: number;
  name: string;
  description: string | null;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  sort_order: number;
}

interface Category {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
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
                {product.category_name && (
                  <div 
                    className="text-xs mb-2 px-2 py-1 bg-red-500/20 text-red-400 rounded-full inline-block"
                    style={{
                      fontFamily: 'Inter'
                    }}
                  >
                    {product.category_name}
                  </div>
                )}
                <div 
                  className="text-xs"
                  style={{ color: '#8B8B8B' }}
                >
                  Порядок: {product.sort_order} | 
                  Статус: {product.is_active ? 'Активен' : 'Неактивен'}
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
  const [productDocuments, setProductDocuments] = useState<ProductDocument[]>([]);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isNewCategory, setIsNewCategory] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };


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


  const fetchProductDocuments = async (productId: number) => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (response.ok) {
        const data = await response.json();
        setProductDocuments(data.data.documents || []);
      }
    } catch (error) {
      console.error('Error fetching product documents:', error);
    }
  };

  const handleDocumentUpload = async (file: File) => {
    if (!editingProduct) return;
    
    setUploadingDocument(true);
    try {
      const fileUrl = await uploadFile(file);
      const fileType = file.type || 'application/octet-stream';
      const fileSize = file.size;
      
      // Добавляем документ к продукту
      const response = await fetch(`/api/products/${editingProduct.id}/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: file.name,
          description: '',
          file_url: fileUrl,
          file_type: fileType,
          file_size: fileSize,
          sort_order: productDocuments.length + 1
        }),
      });
      
      if (response.ok) {
        await fetchProductDocuments(editingProduct.id);
      } else {
        throw new Error('Ошибка добавления документа');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Ошибка загрузки документа');
    } finally {
      setUploadingDocument(false);
    }
  };

  const handleDeleteDocument = async (documentId: number) => {
    if (!editingProduct) return;
    
    try {
      const response = await fetch(`/api/products/${editingProduct.id}/documents/${documentId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        await fetchProductDocuments(editingProduct.id);
      } else {
        throw new Error('Ошибка удаления документа');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Ошибка удаления документа');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setIsCreating(false);
    setIsNewCategory(false);
    fetchProductDocuments(product.id);
  };

  const handleCreate = () => {
    setEditingProduct({
      id: 0,
      name: '',
      description: '',
      image_url: '',
      category_id: null,
      category_name: null,
      sort_order: products.length + 1,
      is_active: true,
      created_at: '',
      updated_at: ''
    });
    setIsCreating(true);
    setIsNewCategory(false);
  };

  const handleSave = async () => {
    if (0) return;

    try {
      let productData = { ...editingProduct };
      
      // Если создается новая категория, сначала создаем её
      if (isNewCategory && editingProduct.category_name) {
        const categoryResponse = await fetch('/api/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: editingProduct.category_name,
            description: '',
            image_url: null,
            sort_order: 0
          }),
        });
        
        if (categoryResponse.ok) {
          const categoryResult = await categoryResponse.json();
          productData.category_id = categoryResult.data.id;
          productData.category_name = categoryResult.data.name;
          
          // Обновляем список категорий
          setCategories([...categories, categoryResult.data]);
        } else {
          console.error('Error creating category');
          return;
        }
      }
      
      const url = isCreating 
        ? '/api/products'
        : `/api/products/${editingProduct.id}`;
      
      const method = isCreating ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
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
        setIsNewCategory(false);
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
                  Категория
                </label>
                <div className="space-y-2">
                  {/* Выпадающий список существующих категорий */}
                  <select
                    value={isNewCategory ? '__new__' : (editingProduct.category_id || '')}
                    onChange={(e) => {
                      const selectedCategory = e.target.value;
                      if (selectedCategory === '__new__') {
                        setIsNewCategory(true);
                        setEditingProduct({
                          ...editingProduct, 
                          category_name: '',
                          category_id: null
                        });
                      } else {
                        setIsNewCategory(false);
                        const categoryId = parseInt(selectedCategory);
                        const selectedCategoryData = categories.find(c => c.id === categoryId);
                        setEditingProduct({
                          ...editingProduct, 
                          category_name: selectedCategoryData?.name || '',
                          category_id: categoryId
                        });
                      }
                    }}
                    className="admin-input w-full"
                  >
                    <option value="">Выберите существующую категорию</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                    <option value="__new__">+ Создать новую категорию</option>
                  </select>
                  
                  {/* Поле для ввода новой категории (показывается только если выбрано "Создать новую") */}
                  {isNewCategory && (
                    <>
                      <div className="text-sm text-gray-400 mb-1">Введите название новой категории:</div>
                      <input
                        type="text"
                        value={editingProduct.category_name || ''}
                        onChange={(e) => setEditingProduct({
                          ...editingProduct, 
                          category_name: e.target.value,
                          category_id: null
                        })}
                        className="admin-input w-full"
                        placeholder="Введите название новой категории"
                      />
                    </>
                  )}
                </div>
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

            {/* Секция документов */}
            {isCreating || editingProduct && (
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#B8B8B8' }}
                >
                  Документы продукта
                </label>
                
                <FileUpload
                  onFileSelect={handleDocumentUpload}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                  maxSize={10}
                  disabled={uploadingDocument}
                />
                
                {productDocuments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {productDocuments.map((doc) => (
                      <div 
                        key={doc.id}
                        className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {doc.file_type?.split('/')[1]?.toUpperCase().substring(0, 3) || 'DOC'}
                            </span>
                          </div>
                          <div>
                            <div className="text-white font-medium">{doc.name}</div>
                            <div className="text-gray-400 text-sm">
                              {doc.file_size ? `${(doc.file_size / 1024).toFixed(1)} KB` : 'N/A'}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
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

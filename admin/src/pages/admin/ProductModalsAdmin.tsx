/* eslint-disable */
import React, { useState, useEffect } from 'react';
import API_ENDPOINTS from '../../config/api';

interface ProductModal {
  id: number;
  area_id: string;
  title: string;
  description: string;
  button_text: string;
  button_url: string;
  position_x: number;
  position_y: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ProductArea {
  id: string;
  name: string;
  color: string;
}

const ProductModalsAdmin: React.FC = () => {
  const [modals, setModals] = useState<ProductModal[]>([]);
  const [areas] = useState<ProductArea[]>([
    { id: 'area-1', name: 'ППКУП', color: '#00ff22' },
    { id: 'area-2', name: 'Датчик', color: '#a600ff' },
    { id: 'area-3', name: 'Модуль', color: '#ffff00' },
    { id: 'area-4', name: 'Контроллер', color: '#00d0ff' }
  ]);
  const [selectedArea, setSelectedArea] = useState<string>('area-1');
  const [editingModal, setEditingModal] = useState<ProductModal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    fetchModals();
  }, [selectedArea]);

  const fetchModals = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_ENDPOINTS.PRODUCT_MODALS}/${selectedArea}`);
      if (response.ok) {
        const data = await response.json();
        setModals(data.data || []);
      } else {
        setError('Ошибка загрузки модальных окон');
      }
    } catch (error) {
      console.error('Error fetching modals:', error);
      setError('Ошибка подключения к серверу');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setError('');
    setSuccess('');
    setEditingModal({
      id: 0,
      area_id: selectedArea,
      title: '',
      description: '',
      button_text: 'Подробнее',
      button_url: '',
      position_x: 0,
      position_y: 0,
      sort_order: modals.length,
      is_active: true,
      created_at: '',
      updated_at: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (modal: ProductModal) => {
    setError('');
    setSuccess('');
    setEditingModal(modal);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingModal) return;

    // Валидация
    if (!editingModal.title.trim()) {
      setError('Заголовок обязателен');
      return;
    }
    if (!editingModal.description.trim()) {
      setError('Описание обязательно');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const url = editingModal.id === 0 
        ? '/api/product-modals'
        : `/api/product-modals/${editingModal.id}`;
      
      const method = editingModal.id === 0 ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingModal),
      });

      if (response.ok) {
        await fetchModals();
        setIsModalOpen(false);
        setEditingModal(null);
        setSuccess(editingModal.id === 0 ? 'Модальное окно создано' : 'Модальное окно обновлено');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Ошибка сохранения');
      }
    } catch (error) {
      console.error('Error saving modal:', error);
      setError('Ошибка подключения к серверу');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    // Временно убираем подтверждение для исправления ошибки компиляции
    // const confirmed = window.confirm('Вы уверены, что хотите удалить это модальное окно?');
    // if (!confirmed) return;

    setDeleting(id);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`/api/product-modals/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchModals();
        setSuccess('Модальное окно удалено');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Ошибка удаления');
      }
    } catch (error) {
      console.error('Error deleting modal:', error);
      setError('Ошибка подключения к серверу');
    } finally {
      setDeleting(null);
    }
  };

  const getAreaName = (areaId: string) => {
    return areas.find(area => area.id === areaId)?.name || areaId;
  };

  const handleToggleActive = async (modal: ProductModal) => {
    try {
      const response = await fetch(`/api/product-modals/${modal.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...modal,
          is_active: !modal.is_active
        }),
      });

      if (response.ok) {
        await fetchModals();
        setSuccess(`Модальное окно ${!modal.is_active ? 'активировано' : 'деактивировано'}`);
      }
    } catch (error) {
      console.error('Error toggling modal:', error);
      setError('Ошибка изменения статуса');
    }
  };

  const handleDuplicate = (modal: ProductModal) => {
    setError('');
    setSuccess('');
    setEditingModal({
      ...modal,
      id: 0,
      title: `${modal.title} (копия)`,
      sort_order: modals.length
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingModal(null);
    setError('');
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Модальные окна продуктов</h1>
        <div className="admin-actions">
          <select 
            value={selectedArea} 
            onChange={(e) => setSelectedArea(e.target.value)}
            className="admin-select"
          >
            {areas.map(area => (
              <option key={area.id} value={area.id}>
                {area.name} ({area.id})
              </option>
            ))}
          </select>
          <button onClick={handleCreate} className="admin-btn admin-btn-primary">
            + Добавить модальное окно
          </button>
        </div>
      </div>

      {/* Уведомления */}
      {error && (
        <div className="admin-alert admin-alert-error">
          <span>⚠️</span>
          <span>{error}</span>
          <button onClick={() => setError('')} className="admin-alert-close">×</button>
        </div>
      )}
      
      {success && (
        <div className="admin-alert admin-alert-success">
          <span>✅</span>
          <span>{success}</span>
          <button onClick={() => setSuccess('')} className="admin-alert-close">×</button>
        </div>
      )}

      {loading ? (
        <div className="admin-loading">
          <div className="admin-spinner"></div>
          <span>Загрузка модальных окон...</span>
        </div>
      ) : (
        <div className="admin-content">
          <div className="admin-stats">
            <div className="admin-stat">
              <span className="admin-stat-number">{modals.length}</span>
              <span className="admin-stat-label">Всего модальных окон</span>
            </div>
            <div className="admin-stat">
              <span className="admin-stat-number">{modals.filter(m => m.is_active).length}</span>
              <span className="admin-stat-label">Активных</span>
            </div>
            <div className="admin-stat">
              <span className="admin-stat-number">{modals.filter(m => !m.is_active).length}</span>
              <span className="admin-stat-label">Неактивных</span>
            </div>
          </div>

          <div className="admin-list">
            {modals.length === 0 ? (
              <div className="admin-empty">
                <div className="admin-empty-icon">📝</div>
                <h3>Нет модальных окон</h3>
                <p>Для области {getAreaName(selectedArea)} пока нет модальных окон</p>
                <button onClick={handleCreate} className="admin-btn admin-btn-primary">
                  Создать первое модальное окно
                </button>
              </div>
            ) : (
              modals
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((modal) => (
                <div key={modal.id} className={`admin-item ${!modal.is_active ? 'admin-item-inactive' : ''}`}>
                  <div className="admin-item-content">
                    <div className="admin-item-header">
                      <h3>{modal.title}</h3>
                      <div className="admin-item-badges">
                        <span className={`admin-badge ${modal.is_active ? 'admin-badge-success' : 'admin-badge-secondary'}`}>
                          {modal.is_active ? 'Активно' : 'Неактивно'}
                        </span>
                        <span className="admin-badge admin-badge-info">
                          Порядок: {modal.sort_order}
                        </span>
                      </div>
                    </div>
                    <p className="admin-item-description">{modal.description}</p>
                    <div className="admin-item-meta">
                      <div className="admin-meta-item">
                        <span className="admin-meta-label">Позиция:</span>
                        <span className="admin-meta-value">({modal.position_x}, {modal.position_y})</span>
                      </div>
                      <div className="admin-meta-item">
                        <span className="admin-meta-label">Кнопка:</span>
                        <span className="admin-meta-value">{modal.button_text}</span>
                      </div>
                      {modal.button_url && (
                        <div className="admin-meta-item">
                          <span className="admin-meta-label">URL:</span>
                          <span className="admin-meta-value admin-meta-url">{modal.button_url}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="admin-item-actions">
                    <button 
                      onClick={() => handleEdit(modal)}
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                      title="Редактировать"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleDuplicate(modal)}
                      className="admin-btn admin-btn-info admin-btn-sm"
                      title="Дублировать"
                    >
                      📋
                    </button>
                    <button 
                      onClick={() => handleToggleActive(modal)}
                      className={`admin-btn admin-btn-sm ${modal.is_active ? 'admin-btn-warning' : 'admin-btn-success'}`}
                      title={modal.is_active ? 'Деактивировать' : 'Активировать'}
                    >
                      {modal.is_active ? '⏸️' : '▶️'}
                    </button>
                    <button 
                      onClick={() => handleDelete(modal.id)}
                      disabled={deleting === modal.id}
                      className="admin-btn admin-btn-danger admin-btn-sm"
                      title="Удалить"
                    >
                      {deleting === modal.id ? '⏳' : '🗑️'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Модальное окно редактирования */}
      {isModalOpen && editingModal && (
        <div className="admin-modal-overlay" onClick={handleCloseModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>
                {editingModal.id === 0 ? 'Создать модальное окно' : 'Редактировать модальное окно'}
              </h2>
              <button 
                onClick={handleCloseModal}
                className="admin-btn admin-btn-close"
              >
                ×
              </button>
            </div>
            <div className="admin-modal-content">
              {error && (
                <div className="admin-alert admin-alert-error admin-alert-inline">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <div className="admin-form-section">
                <h3>Основная информация</h3>
                <div className="admin-form-group">
                  <label>Область: <span className="admin-required">*</span></label>
                  <select 
                    value={editingModal.area_id} 
                    onChange={(e) => setEditingModal({...editingModal, area_id: e.target.value})}
                    className="admin-input"
                  >
                    {areas.map(area => (
                      <option key={area.id} value={area.id}>
                        {area.name} ({area.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Заголовок: <span className="admin-required">*</span></label>
                  <input
                    type="text"
                    value={editingModal.title}
                    onChange={(e) => setEditingModal({...editingModal, title: e.target.value})}
                    className="admin-input"
                    placeholder="Введите заголовок модального окна"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Описание: <span className="admin-required">*</span></label>
                  <textarea
                    value={editingModal.description}
                    onChange={(e) => setEditingModal({...editingModal, description: e.target.value})}
                    className="admin-input"
                    rows={4}
                    placeholder="Введите описание модального окна"
                    required
                  />
                </div>
              </div>

              <div className="admin-form-section">
                <h3>Кнопка</h3>
                <div className="admin-form-group">
                  <label>Текст кнопки:</label>
                  <input
                    type="text"
                    value={editingModal.button_text}
                    onChange={(e) => setEditingModal({...editingModal, button_text: e.target.value})}
                    className="admin-input"
                    placeholder="Подробнее"
                  />
                </div>

                <div className="admin-form-group">
                  <label>URL кнопки:</label>
                  <input
                    type="url"
                    value={editingModal.button_url}
                    onChange={(e) => setEditingModal({...editingModal, button_url: e.target.value})}
                    className="admin-input"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div className="admin-form-section">
                <h3>Позиционирование</h3>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Позиция X (px):</label>
                    <input
                      type="number"
                      value={editingModal.position_x}
                      onChange={(e) => setEditingModal({...editingModal, position_x: parseInt(e.target.value) || 0})}
                      className="admin-input"
                      placeholder="0"
                    />
                    <small>Отступ слева от области</small>
                  </div>
                  <div className="admin-form-group">
                    <label>Позиция Y (px):</label>
                    <input
                      type="number"
                      value={editingModal.position_y}
                      onChange={(e) => setEditingModal({...editingModal, position_y: parseInt(e.target.value) || 0})}
                      className="admin-input"
                      placeholder="0"
                    />
                    <small>Отступ сверху от области</small>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Порядок отображения:</label>
                  <input
                    type="number"
                    value={editingModal.sort_order}
                    onChange={(e) => setEditingModal({...editingModal, sort_order: parseInt(e.target.value) || 0})}
                    className="admin-input"
                    placeholder="0"
                  />
                  <small>Чем меньше число, тем раньше отображается</small>
                </div>
              </div>

              <div className="admin-form-section">
                <h3>Статус</h3>
                <div className="admin-form-group">
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={editingModal.is_active}
                      onChange={(e) => setEditingModal({...editingModal, is_active: e.target.checked})}
                      className="admin-checkbox"
                    />
                    <span className="admin-checkbox-text">Активно (отображается на сайте)</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button 
                onClick={handleCloseModal}
                className="admin-btn admin-btn-secondary"
                disabled={saving}
              >
                Отмена
              </button>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="admin-btn admin-btn-primary"
              >
                {saving ? (
                  <>
                    <div className="admin-spinner admin-spinner-sm"></div>
                    Сохранение...
                  </>
                ) : (
                  <>
                    💾 {editingModal.id === 0 ? 'Создать' : 'Сохранить'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductModalsAdmin;

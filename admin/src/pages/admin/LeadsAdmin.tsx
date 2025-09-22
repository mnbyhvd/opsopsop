import React, { useState, useEffect } from 'react';
import { useLeads, Lead, LeadFilters } from '../../hooks/useLeads';
import DataExporter from '../../components/DataExporter';

const LeadsAdmin: React.FC = () => {
  const {
    leads,
    stats,
    loading,
    pagination,
    fetchLeads,
    updateLead,
    deleteLead,
  } = useLeads();

  const [filters, setFilters] = useState<LeadFilters>({
    page: 1,
    limit: 10,
    sortBy: 'created_at',
    sortOrder: 'DESC'
  });

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLeads(filters);
  }, [filters, fetchLeads]);

  const handleFilterChange = (newFilters: Partial<LeadFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleSearch = () => {
    handleFilterChange({ search: searchTerm });
  };

  const handleStatusChange = async (leadId: number, newStatus: string) => {
    try {
      await updateLead(leadId, { status: newStatus as any });
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Ошибка обновления статуса');
    }
  };

  const handlePriorityChange = async (leadId: number, newPriority: string) => {
    try {
      await updateLead(leadId, { priority: newPriority as any });
    } catch (error) {
      console.error('Error updating priority:', error);
      alert('Ошибка обновления приоритета');
    }
  };

  const handleDelete = async (leadId: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту заявку?')) {
      try {
        await deleteLead(leadId);
      } catch (error) {
        console.error('Error deleting lead:', error);
        alert('Ошибка удаления заявки');
      }
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
          type: 'leads',
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
      alert('Ошибка экспорта данных');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'Новая';
      case 'in_progress': return 'В работе';
      case 'completed': return 'Завершена';
      case 'closed': return 'Закрыта';
      default: return status;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Срочно';
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
      default: return priority;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU');
  };

  if (loading && leads.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Загрузка заявок...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Заголовок и статистика */}
      <div className="mb-6">
        <h1 
          className="text-3xl font-bold mb-4"
          style={{ color: '#F2F0F0' }}
        >
          Управление заявками
        </h1>
        
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-gray-400 text-sm">Всего заявок</div>
            </div>
            <div className="bg-blue-800 p-4 rounded-lg">
              <div className="text-2xl font-bold text-white">{stats.new_leads}</div>
              <div className="text-blue-200 text-sm">Новые</div>
            </div>
            <div className="bg-yellow-800 p-4 rounded-lg">
              <div className="text-2xl font-bold text-white">{stats.in_progress}</div>
              <div className="text-yellow-200 text-sm">В работе</div>
            </div>
            <div className="bg-green-800 p-4 rounded-lg">
              <div className="text-2xl font-bold text-white">{stats.completed}</div>
              <div className="text-green-200 text-sm">Завершены</div>
            </div>
            <div className="bg-red-800 p-4 rounded-lg">
              <div className="text-2xl font-bold text-white">{stats.urgent}</div>
              <div className="text-red-200 text-sm">Срочные</div>
            </div>
            <div className="bg-purple-800 p-4 rounded-lg">
              <div className="text-2xl font-bold text-white">{stats.today}</div>
              <div className="text-purple-200 text-sm">Сегодня</div>
            </div>
            <div className="bg-indigo-800 p-4 rounded-lg">
              <div className="text-2xl font-bold text-white">{stats.this_week}</div>
              <div className="text-indigo-200 text-sm">За неделю</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-2xl font-bold text-white">{stats.closed}</div>
              <div className="text-gray-400 text-sm">Закрыты</div>
            </div>
          </div>
        )}
      </div>

      {/* Фильтры и поиск */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-64">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Поиск
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Поиск по имени, email, компании..."
                className="admin-input flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="admin-button-primary"
              >
                Найти
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Статус
            </label>
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange({ status: e.target.value || undefined })}
              className="admin-input"
            >
              <option value="">Все статусы</option>
              <option value="new">Новые</option>
              <option value="in_progress">В работе</option>
              <option value="completed">Завершены</option>
              <option value="closed">Закрыты</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Приоритет
            </label>
            <select
              value={filters.priority || ''}
              onChange={(e) => handleFilterChange({ priority: e.target.value || undefined })}
              className="admin-input"
            >
              <option value="">Все приоритеты</option>
              <option value="urgent">Срочно</option>
              <option value="high">Высокий</option>
              <option value="medium">Средний</option>
              <option value="low">Низкий</option>
            </select>
          </div>
          
          <div>
            <DataExporter onExport={handleExport} />
          </div>
        </div>
      </div>

      {/* Список заявок */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Клиент
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Контакты
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Приоритет
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Дата
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-700">
                  <td className="px-4 py-4">
                    <div>
                      <div className="text-sm font-medium text-white">{lead.name}</div>
                      {lead.company && (
                        <div className="text-sm text-gray-400">{lead.company}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-300">{lead.email}</div>
                    {lead.phone && (
                      <div className="text-sm text-gray-400">{lead.phone}</div>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}
                    >
                      <option value="new">Новая</option>
                      <option value="in_progress">В работе</option>
                      <option value="completed">Завершена</option>
                      <option value="closed">Закрыта</option>
                    </select>
                  </td>
                  <td className="px-4 py-4">
                    <select
                      value={lead.priority}
                      onChange={(e) => handlePriorityChange(lead.id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(lead.priority)}`}
                    >
                      <option value="urgent">Срочно</option>
                      <option value="high">Высокий</option>
                      <option value="medium">Средний</option>
                      <option value="low">Низкий</option>
                    </select>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-300">
                    {formatDate(lead.created_at)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedLead(lead);
                          setShowModal(true);
                        }}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        Просмотр
                      </button>
                      <button
                        onClick={() => handleDelete(lead.id)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Пагинация */}
        {pagination.pages > 1 && (
          <div className="px-4 py-3 bg-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-300">
              Показано {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} из {pagination.total}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleFilterChange({ page: pagination.page - 1 })}
                disabled={pagination.page <= 1}
                className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Назад
              </button>
              <span className="px-3 py-1 text-gray-300">
                {pagination.page} из {pagination.pages}
              </span>
              <button
                onClick={() => handleFilterChange({ page: pagination.page + 1 })}
                disabled={pagination.page >= pagination.pages}
                className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Вперед
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Модальное окно для просмотра заявки */}
      {showModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Заявка #{selectedLead.id}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Имя</label>
                <div className="text-white">{selectedLead.name}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <div className="text-white">{selectedLead.email}</div>
              </div>
              
              {selectedLead.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Телефон</label>
                  <div className="text-white">{selectedLead.phone}</div>
                </div>
              )}
              
              {selectedLead.company && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Компания</label>
                  <div className="text-white">{selectedLead.company}</div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Сообщение</label>
                <div className="text-white bg-gray-700 p-3 rounded">{selectedLead.message || 'Нет сообщения'}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Статус</label>
                  <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedLead.status)}`}>
                    {getStatusLabel(selectedLead.status)}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Приоритет</label>
                  <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedLead.priority)}`}>
                    {getPriorityLabel(selectedLead.priority)}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Дата создания</label>
                <div className="text-white">{formatDate(selectedLead.created_at)}</div>
              </div>
              
              {selectedLead.responded_at && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Дата ответа</label>
                  <div className="text-white">{formatDate(selectedLead.responded_at)}</div>
                </div>
              )}
              
              {selectedLead.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Заметки</label>
                  <div className="text-white bg-gray-700 p-3 rounded">{selectedLead.notes}</div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="admin-button-secondary"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsAdmin;

import React, { useState, useEffect } from 'react';
import { useRequisites } from '../../hooks/useRequisites';

const RequisitesAdmin: React.FC = () => {
  const { requisites, loading, error, updateRequisites } = useRequisites();
  const [localRequisites, setLocalRequisites] = useState(requisites);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Синхронизация с данными из хука
  useEffect(() => {
    if (requisites) {
      setLocalRequisites(requisites);
    }
  }, [requisites]);

  // Стили для полей ввода
  const inputStyles = {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#F2F0F0',
    fontFamily: 'Inter'
  };

  const labelStyles = {
    fontFamily: 'Inter',
    color: '#E5E5E5',
    fontSize: '14px',
    fontWeight: 500
  };

  // Компонент для поля ввода
  const InputField = ({ 
    label, 
    value, 
    onChange, 
    type = 'text', 
    rows = 1,
    placeholder = ''
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    rows?: number;
    placeholder?: string;
  }) => (
    <div>
      <label 
        className="block text-sm font-medium mb-2"
        style={labelStyles}
      >
        {label}
      </label>
      {rows > 1 ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className="w-full p-3 rounded-xl transition-all duration-200 focus:outline-none resize-none"
          style={inputStyles}
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
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full p-3 rounded-xl transition-all duration-200 focus:outline-none"
          style={inputStyles}
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
      )}
    </div>
  );

  // Загрузка данных реквизитов

  // Сохранение данных
  const handleSave = async () => {
    if (!localRequisites) return;

    try {
      setSaving(true);
      const result = await updateRequisites(localRequisites);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Реквизиты успешно сохранены' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Ошибка сохранения реквизитов' });
      }
    } catch (error) {
      console.error('Error saving requisites:', error);
      setMessage({ type: 'error', text: 'Ошибка сохранения реквизитов' });
    } finally {
      setSaving(false);
    }
  };

  // Обработка изменений в полях
  const handleChange = (field: keyof any, value: string) => {
    if (localRequisites) {
      setLocalRequisites({
        ...localRequisites,
        [field]: value,
        updated_at: new Date().toISOString()
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Загрузка реквизитов...</div>
      </div>
    );
  }

  if (!localRequisites) {
    return (
      <div className="text-center text-red-500">
        Ошибка загрузки реквизитов
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 
            className="text-3xl font-bold mb-2"
            style={{
              fontFamily: 'Bebas Neue',
              fontSize: '32px',
              color: '#F2F0F0'
            }}
          >
            РЕКВИЗИТЫ КОМПАНИИ
          </h2>
          <p 
            className="text-sm"
            style={{
              fontFamily: 'Inter',
              color: '#B8B8B8'
            }}
          >
            Управление реквизитами и контактной информацией
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
          style={{
            backgroundColor: saving ? '#6B7280' : '#D71920',
            color: '#FFFFFF',
            fontFamily: 'Inter',
            fontWeight: 500
          }}
          onMouseEnter={(e) => {
            if (!saving) {
              e.currentTarget.style.backgroundColor = '#B91C1C';
            }
          }}
          onMouseLeave={(e) => {
            if (!saving) {
              e.currentTarget.style.backgroundColor = '#D71920';
            }
          }}
        >
          {saving ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </div>

      {message && (
        <div 
          className="p-4 rounded-xl border backdrop-blur-sm"
          style={{
            backgroundColor: message.type === 'success' 
              ? 'rgba(34, 197, 94, 0.1)' 
              : 'rgba(239, 68, 68, 0.1)',
            borderColor: message.type === 'success' 
              ? 'rgba(34, 197, 94, 0.2)' 
              : 'rgba(239, 68, 68, 0.2)',
            color: message.type === 'success' ? '#22C55E' : '#EF4444'
          }}
        >
          <div className="flex items-center space-x-2">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: message.type === 'success' ? '#22C55E' : '#EF4444' }}
            />
            <span className="font-medium">{message.text}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Основная информация */}
        <div 
          className="space-y-6 p-6 rounded-2xl border backdrop-blur-sm"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            borderColor: 'rgba(255, 255, 255, 0.1)'
          }}
        >
          <h3 
            className="text-lg font-semibold flex items-center space-x-2"
            style={{
              fontFamily: 'Inter',
              color: '#F2F0F0'
            }}
          >
            <div 
              className="w-1 h-6 rounded-full"
              style={{ backgroundColor: '#D71920' }}
            />
            <span>Основная информация</span>
          </h3>
          
          <InputField
            label="Название компании"
            value={localRequisites.company_name}
            onChange={(value) => handleChange('company_name', value)}
            placeholder="Введите название компании"
          />

          <InputField
            label="Юридическое название"
            value={localRequisites.legal_name}
            onChange={(value) => handleChange('legal_name', value)}
            placeholder="Полное юридическое название"
          />

          <InputField
            label="ИНН"
            value={localRequisites.inn}
            onChange={(value) => handleChange('inn', value)}
            placeholder="1234567890"
          />

          <InputField
            label="КПП"
            value={localRequisites.kpp}
            onChange={(value) => handleChange('kpp', value)}
            placeholder="123456789"
          />

          <InputField
            label="ОГРН"
            value={localRequisites.ogrn}
            onChange={(value) => handleChange('ogrn', value)}
            placeholder="1234567890123"
          />
        </div>

        {/* Контактная информация */}
        <div 
          className="space-y-6 p-6 rounded-2xl border backdrop-blur-sm"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            borderColor: 'rgba(255, 255, 255, 0.1)'
          }}
        >
          <h3 
            className="text-lg font-semibold flex items-center space-x-2"
            style={{
              fontFamily: 'Inter',
              color: '#F2F0F0'
            }}
          >
            <div 
              className="w-1 h-6 rounded-full"
              style={{ backgroundColor: '#D71920' }}
            />
            <span>Контактная информация</span>
          </h3>
          
          <InputField
            label="Юридический адрес"
            value={localRequisites.legal_address}
            onChange={(value) => handleChange('legal_address', value)}
            rows={3}
            placeholder="г. Москва, ул. Примерная, д. 1, оф. 1"
          />

          <InputField
            label="Фактический адрес"
            value={localRequisites.actual_address}
            onChange={(value) => handleChange('actual_address', value)}
            rows={3}
            placeholder="г. Москва, ул. Примерная, д. 1, оф. 1"
          />

          <InputField
            label="Телефон"
            value={localRequisites.phone}
            onChange={(value) => handleChange('phone', value)}
            placeholder="+7 (999) 999-99-99"
          />

          <InputField
            label="Email"
            value={localRequisites.email}
            onChange={(value) => handleChange('email', value)}
            type="email"
            placeholder="example@company.ru"
          />

          <InputField
            label="Сайт"
            value={localRequisites.website}
            onChange={(value) => handleChange('website', value)}
            type="url"
            placeholder="https://example.com"
          />
        </div>

        {/* Банковские реквизиты */}
        <div 
          className="space-y-6 p-6 rounded-2xl border backdrop-blur-sm"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            borderColor: 'rgba(255, 255, 255, 0.1)'
          }}
        >
          <h3 
            className="text-lg font-semibold flex items-center space-x-2"
            style={{
              fontFamily: 'Inter',
              color: '#F2F0F0'
            }}
          >
            <div 
              className="w-1 h-6 rounded-full"
              style={{ backgroundColor: '#D71920' }}
            />
            <span>Банковские реквизиты</span>
          </h3>
          
          <InputField
            label="Название банка"
            value={localRequisites.bank_name}
            onChange={(value) => handleChange('bank_name', value)}
            placeholder="ПАО Сбербанк"
          />

          <InputField
            label="Расчетный счет"
            value={localRequisites.bank_account}
            onChange={(value) => handleChange('bank_account', value)}
            placeholder="40702810123456789012"
          />

          <InputField
            label="Корреспондентский счет"
            value={localRequisites.correspondent_account}
            onChange={(value) => handleChange('correspondent_account', value)}
            placeholder="30101810400000000225"
          />

          <InputField
            label="БИК"
            value={localRequisites.bik}
            onChange={(value) => handleChange('bik', value)}
            placeholder="044525225"
          />
        </div>

        {/* Руководство */}
        <div 
          className="space-y-6 p-6 rounded-2xl border backdrop-blur-sm"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            borderColor: 'rgba(255, 255, 255, 0.1)'
          }}
        >
          <h3 
            className="text-lg font-semibold flex items-center space-x-2"
            style={{
              fontFamily: 'Inter',
              color: '#F2F0F0'
            }}
          >
            <div 
              className="w-1 h-6 rounded-full"
              style={{ backgroundColor: '#D71920' }}
            />
            <span>Руководство</span>
          </h3>
          
          <InputField
            label="ФИО руководителя"
            value={localRequisites.director_name}
            onChange={(value) => handleChange('director_name', value)}
            placeholder="Иванов Иван Иванович"
          />

          <InputField
            label="Должность руководителя"
            value={localRequisites.director_position}
            onChange={(value) => handleChange('director_position', value)}
            placeholder="Генеральный директор"
          />
        </div>
      </div>
    </div>
  );
};

export default RequisitesAdmin;

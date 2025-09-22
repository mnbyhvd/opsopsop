import React, { useState } from 'react';

interface DataExporterProps {
  onExport: (format: 'json' | 'csv' | 'xlsx') => Promise<void>;
  className?: string;
}

const DataExporter: React.FC<DataExporterProps> = ({ onExport, className = '' }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'json' | 'csv' | 'xlsx'>('json');

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport(exportFormat);
    } catch (error) {
      console.error('Export error:', error);
      alert('Ошибка при экспорте данных');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 
        className="text-lg font-semibold"
        style={{
          fontFamily: 'Roboto Flex',
          color: '#F2F0F0'
        }}
      >
        Экспорт данных
      </h3>
      
      <div className="flex items-center space-x-4">
        <div>
          <label 
            className="block text-sm font-medium mb-2"
            style={{ color: '#B8B8B8' }}
          >
            Формат экспорта
          </label>
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as 'json' | 'csv' | 'xlsx')}
            className="admin-input w-32"
          >
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
            <option value="xlsx">Excel</option>
          </select>
        </div>
        
        <div className="flex items-end">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="admin-button-primary"
            style={{ opacity: isExporting ? 0.6 : 1 }}
          >
            {isExporting ? 'Экспорт...' : 'Экспортировать'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataExporter;

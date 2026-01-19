import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ProductDocument } from '../types';

interface ProductDocumentsProps {
  documents: ProductDocument[];
}

const ProductDocuments: React.FC<ProductDocumentsProps> = ({ documents }) => {
  const [downloadingZip, setDownloadingZip] = useState(false);

  const getFileIcon = (fileType: string | null) => {
    const type = fileType?.toLowerCase() || '';
    if (type.includes('pdf')) {
      return (
        <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
        </svg>
      );
    } else if (type.includes('doc') || type.includes('docx')) {
      return (
        <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
        </svg>
      );
    } else if (type.includes('xls') || type.includes('xlsx')) {
      return (
        <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
        </svg>
      );
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownloadFile = (doc: ProductDocument) => {
    const link = document.createElement('a');
    link.href = doc.file_url;
    link.download = doc.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAllZip = async () => {
    setDownloadingZip(true);
    try {
      // Создаем ZIP архив с помощью JSZip
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      // Загружаем каждый файл и добавляем в ZIP
      for (const doc of documents) {
        try {
          const response = await fetch(doc.file_url);
          const blob = await response.blob();
          zip.file(doc.name, blob);
        } catch (error) {
          console.error(`Ошибка загрузки файла ${doc.name}:`, error);
        }
      }
      
      // Генерируем и скачиваем ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = 'product-documents.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Ошибка создания ZIP архива:', error);
      alert('Ошибка при создании архива');
    } finally {
      setDownloadingZip(false);
    }
  };

  if (documents.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3 
          className="text-2xl font-bold"
          style={{ 
            fontFamily: 'Bebas Neue',
            color: 'var(--font-headings-color, var(--text))'
          }}
        >
          ДОКУМЕНТЫ ДЛЯ СКАЧИВАНИЯ
        </h3>
        
        {documents.length > 1 && (
          <button
            onClick={handleDownloadAllZip}
            disabled={downloadingZip}
            className="flex items-center gap-2 px-4 py-2 border font-medium shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
            style={{ 
              fontFamily: 'Inter',
              borderColor: 'var(--button-primary-border)',
              background: downloadingZip ? '#666666' : 'var(--button-primary-bg)',
              color: downloadingZip ? '#ffffff' : 'var(--button-primary-text)',
              boxSizing: 'border-box',
            }}
            onMouseEnter={(e) => {
              if (!downloadingZip) {
                const target = e.currentTarget as HTMLButtonElement;
                target.style.background = 'color-mix(in srgb, white 5%, transparent)';
                target.style.backdropFilter = 'blur(var(--blur-glass))';
                target.style.setProperty('-webkit-backdrop-filter', 'blur(var(--blur-glass))');
                target.style.color = 'var(--button-primary-hover-text)';
                target.style.border = `1px solid var(--button-primary-hover-border)`;
              }
            }}
            onMouseLeave={(e) => {
              if (!downloadingZip) {
                const target = e.currentTarget as HTMLButtonElement;
                target.style.background = 'var(--button-primary-bg)';
                target.style.backdropFilter = 'none';
                target.style.setProperty('-webkit-backdrop-filter', 'none');
                target.style.color = 'var(--button-primary-text)';
                target.style.border = `1px solid var(--button-primary-border)`;
              }
            }}
          >
            {downloadingZip ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Создание архива...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Скачать все в ZIP
              </>
            )}
          </button>
        )}
      </div>
      
      <div className="grid gap-4">
        {documents.map((document, index) => (
          <motion.div
            key={document.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 group cursor-pointer glass"
            style={{
              borderColor: 'var(--glass-border)',
            }}
            onClick={() => handleDownloadFile(document)}
          >
            <div className="flex-shrink-0">
              {getFileIcon(document.file_type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 
                className="text-lg font-semibold text-white group-hover:text-red-400 transition-colors duration-200"
                style={{ fontFamily: 'Inter' }}
              >
                {document.name}
              </h4>
              {document.description && (
                <p 
                  className="text-gray-400 text-sm mt-1"
                  style={{ fontFamily: 'Inter' }}
                >
                  {document.description}
                </p>
              )}
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span style={{ fontFamily: 'Inter' }}>
                  {document.file_type?.toUpperCase() || 'UNKNOWN'}
                </span>
                <span style={{ fontFamily: 'Inter' }}>
                  {formatFileSize(document.file_size)}
                </span>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <svg 
                className="w-6 h-6 text-gray-400 group-hover:text-red-400 transition-colors duration-200" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProductDocuments;

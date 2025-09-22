import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import JSZip from 'jszip';
import PageContainer from './PageContainer';
import { useDocuments } from '../hooks/useDocuments';

interface Document {
  id: number;
  title: string;
  url: string;
  type: 'document' | 'certificate';
  sort_order: number;
  is_active: boolean;
  file_size?: number;
  file_type?: string;
  original_filename?: string;
  upload_date?: string;
  created_at: string;
  updated_at: string;
}

const DownloadInfoSection: React.FC = () => {
  const { documents, certificates, loading, error } = useDocuments();
  const [expandedSections, setExpandedSections] = useState({
    documents: true,
    certificates: false
  });

  const toggleSection = (section: 'documents' | 'certificates') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const downloadAll = async () => {
    try {
      const zip = new JSZip();
      
      // Добавляем все документы в ZIP
      for (const doc of documents) {
        try {
          // Формируем полный URL для файла
          const fullUrl = doc.url.startsWith('http') ? doc.url : `/api${doc.url}`;
          const response = await fetch(fullUrl);
          if (response.ok) {
            const blob = await response.blob();
            const fileExtension = doc.file_type?.split('/')[1] || 'pdf';
            zip.file(`documents/${doc.title}.${fileExtension}`, blob);
          }
        } catch (error) {
          console.error(`Ошибка загрузки документа ${doc.title}:`, error);
        }
      }
      
      // Добавляем все сертификаты в ZIP
      for (const cert of certificates) {
        try {
          // Формируем полный URL для файла
          const fullUrl = cert.url.startsWith('http') ? cert.url : `/api${cert.url}`;
          const response = await fetch(fullUrl);
          if (response.ok) {
            const blob = await response.blob();
            const fileExtension = cert.file_type?.split('/')[1] || 'pdf';
            zip.file(`certificates/${cert.title}.${fileExtension}`, blob);
          }
        } catch (error) {
          console.error(`Ошибка загрузки сертификата ${cert.title}:`, error);
        }
      }
      
      // Генерируем ZIP файл
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      
      // Скачиваем ZIP файл
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = 'master_sps_documents.zip';
      link.click();
      
      // Очищаем URL
      URL.revokeObjectURL(link.href);
      
    } catch (error) {
      console.error('Ошибка создания ZIP архива:', error);
      alert('Произошла ошибка при создании архива. Попробуйте позже.');
    }
  };

  const downloadFile = (url: string, title: string) => {
    // Логика для скачивания отдельного файла
    const fullUrl = url.startsWith('http') ? url : `/api${url}`;
    const link = document.createElement('a');
    link.href = fullUrl;
    link.download = title;
    link.click();
  };

  if (loading) {
    return (
      <section className="py-20 relative">
        <PageContainer>
          <div className="col-start-1 col-end-13 text-center mb-16 px-16">
            <div className="text-xl" style={{ color: '#F2F0F0' }}>Загрузка документов...</div>
          </div>
        </PageContainer>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 relative">
        <PageContainer>
          <div className="col-start-1 col-end-13 text-center mb-16 px-16">
            <div className="text-xl" style={{ color: '#D71920' }}>Ошибка загрузки документов</div>
            <div className="text-lg" style={{ color: '#B8B8B8' }}>{error}</div>
          </div>
        </PageContainer>
      </section>
    );
  }

  return (
    <section 
      className="py-20 relative"
    >
      <PageContainer>
        {/* Заголовок */}
        <div className="col-start-1 col-end-13 text-center mb-16 px-16">
          <h2 
            className="mb-6"
            style={{
              fontFamily: 'Bebas Neue',
              fontSize: '64px',
              fontWeight: 400,
              color: '#F2F0F0',
              textTransform: 'uppercase'
            }}
          >
            /ИНФОРМАЦИЯ ДЛЯ СКАЧИВАНИЯ
          </h2>
        </div>

        {/* Контент - колонки 2-11 */}
        <div className="col-start-2 col-end-12 px-16">
          <div className="space-y-6">
            {/* Секция Документы */}
            <div 
              className="overflow-hidden w-full"
              style={{ 
                backgroundColor: '#272727',
                borderRadius: '30px'
              }}
            >
              {/* Заголовок секции */}
              <button
                onClick={() => toggleSection('documents')}
                className="w-full p-6 flex items-center justify-between transition-all duration-200"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0)',
                  borderRadius: '30px 30px 0 0'
                }}
              >
                <h3 
                  className="text-xl font-bold"
                  style={{
                    fontFamily: 'Bebas Neue',
                    color: '#F2F0F0',
                    fontSize: '36px',
                    textTransform: 'uppercase',
                    transform: 'translateY(3px)'
                  }}
                >
                  ДОКУМЕНТЫ
                </h3>
                <motion.div
                  animate={{ rotate: expandedSections.documents ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    className="text-white"
                  >
                    <path 
                      d="M6 9L12 15L18 9" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
              </button>

              {/* Список документов */}
              <AnimatePresence>
                {expandedSections.documents && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-4 space-y-4">
                      {documents.map((doc) => (
                        <button
                          key={doc.id}
                          onClick={() => downloadFile(doc.url, doc.title)}
                          className="w-full p-4 flex items-center justify-between transition-all duration-200 group"
                          style={{ 
                            backgroundColor: '#F2F0F0',
                            color: '#191516',
                            borderRadius: '20px',
                            border: '1px solid #F2F0F0',
                            boxSizing: 'border-box'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#F2F0F0';
                            e.currentTarget.style.border = '1px solid #F2F0F0';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#F2F0F0';
                            e.currentTarget.style.color = '#191516';
                            e.currentTarget.style.border = '1px solid #F2F0F0';
                          }}
                        >
                          <span 
                            className="text-left"
                            style={{
                              fontFamily: 'Inter',
                              fontWeight: 500,
                              fontSize: '16px',
                              lineHeight: '100%',
                              letterSpacing: '0%'
                            }}
                          >
                            {doc.title}
                          </span>
                          <svg 
                            width="20" 
                            height="20" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            className="text-gray-400 group-hover:rotate-45 transition-transform duration-200"
                          >
                            <path 
                              d="M7 17L17 7M17 7H7M17 7V17" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Секция Сертификаты */}
            <div 
              className="overflow-hidden w-full"
              style={{ 
                backgroundColor: '#272727',
                borderRadius: '30px'
              }}
            >
              {/* Заголовок секции */}
              <button
                onClick={() => toggleSection('certificates')}
                className="w-full p-6 flex items-center justify-between transition-all duration-200"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0)',
                  borderRadius: '30px 30px 0 0'
                }}
              >
                <h3 
                  className="text-xl font-bold"
                  style={{
                    fontFamily: 'Bebas Neue',
                    color: '#F2F0F0',
                    fontSize: '36px',
                    textTransform: 'uppercase',
                    transform: 'translateY(3px)'
                  }}
                >
                  СЕРТИФИКАТЫ
                </h3>
                <motion.div
                  animate={{ rotate: expandedSections.certificates ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    className="text-white"
                  >
                    <path 
                      d="M6 9L12 15L18 9" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
              </button>

              {/* Список сертификатов */}
              <AnimatePresence>
                {expandedSections.certificates && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-4 space-y-4">
                      {certificates.map((cert) => (
                        <button
                          key={cert.id}
                          onClick={() => downloadFile(cert.url, cert.title)}
                          className="w-full p-4 flex items-center justify-between transition-all duration-200 group"
                          style={{ 
                            backgroundColor: '#F2F0F0',
                            color: '#191516',
                            borderRadius: '20px',
                            border: '1px solid #F2F0F0',
                            boxSizing: 'border-box'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#F2F0F0';
                            e.currentTarget.style.border = '1px solid #F2F0F0';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#F2F0F0';
                            e.currentTarget.style.color = '#191516';
                            e.currentTarget.style.border = '1px solid #F2F0F0';
                          }}
                        >
                          <span 
                            className="text-left"
                            style={{
                              fontFamily: 'Inter',
                              fontWeight: 500,
                              fontSize: '16px',
                              lineHeight: '100%',
                              letterSpacing: '0%'
                            }}
                          >
                            {cert.title}
                          </span>
                          <svg 
                            width="20" 
                            height="20" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            className="text-gray-400 group-hover:rotate-45 transition-transform duration-200"
                          >
                            <path 
                              d="M7 17L17 7M17 7H7M17 7V17" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Кнопка "Скачать все ZIP" - по центру */}
          <div className="flex justify-center mt-12">
            <button
              onClick={downloadAll}
              className="inline-flex items-center px-10 py-4 font-medium text-xl transition-all"
              style={{ 
                backgroundColor: '#E0DADA', 
                color: '#0D0D0D',
                border: '1px solid #E0DADA',
                fontFamily: 'Inter',
                borderRadius: '30px'

              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = '#0D0D0D';
                (e.currentTarget as HTMLButtonElement).style.color = '#ffffff';
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#ffffff';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = '#E0DADA';
                (e.currentTarget as HTMLButtonElement).style.color = '#0D0D0D';
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#E0DADA';
              }}
            >
              Скачать все ZIP
            </button>
          </div>
        </div>
      </PageContainer>
    </section>
  );
};

export default DownloadInfoSection;

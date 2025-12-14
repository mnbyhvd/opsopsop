import React, { useState, useEffect } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSection = (section: 'documents' | 'certificates') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const downloadAll = async () => {
    try {
      console.log('Начинаем создание ZIP архива...');
      const zip = new JSZip();
      
      // Добавляем все документы в ZIP
      for (const doc of documents) {
        try {
          console.log(`Загружаем документ: ${doc.title}`);
          // Проверяем, является ли URL внешним
          if (doc.url.startsWith('http') && !doc.url.includes('localhost') && !doc.url.includes('127.0.0.1')) {
            console.log(`Пропускаем внешний URL: ${doc.url}`);
            continue;
          }
          
          // Формируем полный URL для файла
          const fullUrl = doc.url.startsWith('http') ? doc.url : `${doc.url}`;
          console.log(`URL документа: ${fullUrl}`);
          const response = await fetch(fullUrl);
          if (response.ok) {
            const blob = await response.blob();
            const fileExtension = doc.file_type?.split('/')[1] || 'pdf';
            zip.file(`documents/${doc.title}.${fileExtension}`, blob);
            console.log(`Документ ${doc.title} добавлен в ZIP`);
          } else {
            console.error(`Ошибка загрузки документа ${doc.title}: ${response.status}`);
          }
        } catch (error) {
          console.error(`Ошибка загрузки документа ${doc.title}:`, error);
        }
      }
      
      // Добавляем все сертификаты в ZIP
      for (const cert of certificates) {
        try {
          console.log(`Загружаем сертификат: ${cert.title}`);
          // Проверяем, является ли URL внешним
          if (cert.url.startsWith('http') && !cert.url.includes('localhost') && !cert.url.includes('127.0.0.1')) {
            console.log(`Пропускаем внешний URL: ${cert.url}`);
            continue;
          }
          
          // Формируем полный URL для файла
          const fullUrl = cert.url.startsWith('http') ? cert.url : `${cert.url}`;
          console.log(`URL сертификата: ${fullUrl}`);
          const response = await fetch(fullUrl);
          if (response.ok) {
            const blob = await response.blob();
            const fileExtension = cert.file_type?.split('/')[1] || 'pdf';
            zip.file(`certificates/${cert.title}.${fileExtension}`, blob);
            console.log(`Сертификат ${cert.title} добавлен в ZIP`);
          } else {
            console.error(`Ошибка загрузки сертификата ${cert.title}: ${response.status}`);
          }
        } catch (error) {
          console.error(`Ошибка загрузки сертификата ${cert.title}:`, error);
        }
      }
      
      console.log('Генерируем ZIP файл...');
      // Генерируем ZIP файл
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      
      console.log('Скачиваем ZIP файл...');
      // Скачиваем ZIP файл
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = 'master_sps_documents.zip';
      link.click();
      
      // Очищаем URL
      URL.revokeObjectURL(link.href);
      
      console.log('ZIP файл успешно скачан!');
      
    } catch (error) {
      console.error('Ошибка создания ZIP архива:', error);
      alert('Произошла ошибка при создании архива. Попробуйте позже.');
    }
  };

  const downloadFile = (url: string, title: string) => {
    // Логика для скачивания отдельного файла
    const fullUrl = url.startsWith('http') ? url : `${url}`;
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
        <div className="col-start-1 col-end-13 text-left md:text-center mb-8 md:mb-16 px-4 md:px-16">
          <h2 
            className="mb-6 text-4xl md:text-6xl"
            style={{
              fontFamily: 'Bebas Neue',
              fontWeight: 400,
              color: '#F2F0F0',
              textTransform: 'uppercase'
            }}
          >
          ФАЙЛЫ ДЛЯ СКАЧИВАНИЯ
          </h2>
        </div>

        {/* Контент - колонки 2-11 */}
        <div className="col-start-1 md:col-start-2 col-end-13 md:col-end-12 px-4 md:px-16">
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
                className="w-full p-4 md:p-6 flex items-center justify-between transition-all duration-200"
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
                    fontSize: isMobile ? '24px' : '36px',
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
                    width={isMobile ? "20" : "24"} 
                    height={isMobile ? "20" : "24"} 
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
                    <div className="p-4 md:p-6 pt-4 space-y-3 md:space-y-4">
                      {documents.map((doc) => (
                        <button
                          key={doc.id}
                          onClick={() => downloadFile(doc.url, doc.title)}
                          className="w-full p-3 md:p-4 flex items-center justify-between transition-all duration-200 group"
                          style={{ 
                            backgroundColor: '#F2F0F0',
                            color: '#191516',
                            borderRadius: '20px',
                            border: '1px solid #F2F0F0',
                            boxSizing: 'border-box'
                          }}
                          onMouseEnter={(e) => {
                            if (!isMobile) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = '#F2F0F0';
                              e.currentTarget.style.border = '1px solid #F2F0F0';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isMobile) {
                              e.currentTarget.style.backgroundColor = '#F2F0F0';
                              e.currentTarget.style.color = '#191516';
                              e.currentTarget.style.border = '1px solid #F2F0F0';
                            }
                          }}
                        >
                          <span 
                            className="text-left"
                            style={{
                              fontFamily: 'Inter',
                              fontWeight: 500,
                              fontSize: isMobile ? '14px' : '16px',
                              lineHeight: '100%',
                              letterSpacing: '0%'
                            }}
                          >
                            {doc.title}
                          </span>
                          <svg 
                            width={isMobile ? "18" : "20"} 
                            height={isMobile ? "18" : "20"} 
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
                className="w-full p-4 md:p-6 flex items-center justify-between transition-all duration-200"
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
                    fontSize: isMobile ? '24px' : '36px',
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
                    width={isMobile ? "20" : "24"} 
                    height={isMobile ? "20" : "24"} 
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
                    <div className="p-4 md:p-6 pt-4 space-y-3 md:space-y-4">
                      {certificates.map((cert) => (
                        <button
                          key={cert.id}
                          onClick={() => downloadFile(cert.url, cert.title)}
                          className="w-full p-3 md:p-4 flex items-center justify-between transition-all duration-200 group"
                          style={{ 
                            backgroundColor: '#F2F0F0',
                            color: '#191516',
                            borderRadius: '20px',
                            border: '1px solid #F2F0F0',
                            boxSizing: 'border-box'
                          }}
                          onMouseEnter={(e) => {
                            if (!isMobile) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = '#F2F0F0';
                              e.currentTarget.style.border = '1px solid #F2F0F0';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isMobile) {
                              e.currentTarget.style.backgroundColor = '#F2F0F0';
                              e.currentTarget.style.color = '#191516';
                              e.currentTarget.style.border = '1px solid #F2F0F0';
                            }
                          }}
                        >
                          <span 
                            className="text-left"
                            style={{
                              fontFamily: 'Inter',
                              fontWeight: 500,
                              fontSize: isMobile ? '14px' : '16px',
                              lineHeight: '100%',
                              letterSpacing: '0%'
                            }}
                          >
                            {cert.title}
                          </span>
                          <svg 
                            width={isMobile ? "18" : "20"} 
                            height={isMobile ? "18" : "20"} 
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
          <div className="flex justify-center mt-8 md:mt-12">
            <button
              onClick={downloadAll}
              className="inline-flex items-center px-8 md:px-10 py-3 md:py-4 font-medium text-base md:text-xl transition-all w-full md:w-auto"
              style={{ 
                backgroundColor: '#E0DADA', 
                color: '#0D0D0D',
                border: '1px solid #E0DADA',
                fontFamily: 'Inter',
                borderRadius: '30px',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                if (!isMobile) {
                  (e.currentTarget as HTMLButtonElement).style.background = '#0D0D0D';
                  (e.currentTarget as HTMLButtonElement).style.color = '#ffffff';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (!isMobile) {
                  (e.currentTarget as HTMLButtonElement).style.background = '#E0DADA';
                  (e.currentTarget as HTMLButtonElement).style.color = '#0D0D0D';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#E0DADA';
                }
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

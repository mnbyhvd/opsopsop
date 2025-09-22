import React from 'react';
import { motion } from 'framer-motion';
import PageContainer from '../components/PageContainer';
import { useRequisites } from '../hooks/useRequisites';

const Requisites: React.FC = () => {
  const { requisites, loading, error } = useRequisites();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0D0D0D' }}>
        <div className="text-center">
          <div className="text-2xl font-bold mb-4" style={{ fontFamily: 'Bebas Neue', color: '#F2F0F0' }}>
            ЗАГРУЗКА РЕКВИЗИТОВ...
          </div>
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0D0D0D' }}>
        <div className="text-center">
          <div className="text-2xl font-bold mb-4" style={{ fontFamily: 'Bebas Neue', color: '#D71920' }}>
            ОШИБКА ЗАГРУЗКИ
          </div>
          <div className="text-lg" style={{ fontFamily: 'Inter', color: '#B8B8B8' }}>
            Не удалось загрузить реквизиты компании
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0D0D0D' }}>
      {/* Фоновое изображение */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/1.png)',
          opacity: 0.1,
          zIndex: -1
        }}
      />
      
      {/* Hero секция */}
      <section className="py-20 relative">
        <PageContainer>
          <div className="col-start-1 col-end-13 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 
                className="text-6xl font-bold mb-6"
                style={{ 
                  fontFamily: 'Bebas Neue',
                  color: '#F2F0F0',
                  textTransform: 'uppercase'
                }}
              >
                РЕКВИЗИТЫ
              </h1>
              
              <p 
                className="text-xl max-w-4xl mx-auto"
                style={{ 
                  fontFamily: 'Inter',
                  color: '#B8B8B8'
                }}
              >
                Реквизиты компании для заключения договоров и проведения платежей
              </p>
            </motion.div>
          </div>
        </PageContainer>
      </section>

      {/* Основной контент */}
      <section className="py-16 relative">
        <PageContainer>
          <div className="col-start-2 col-end-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="rounded-2xl p-8 backdrop-blur-sm border"
                style={{
                  backgroundColor: 'rgba(98, 98, 98, 0.3)',
                  backdropFilter: 'blur(38.400001525878906px)',
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                }}
              >
              {/* Название компании */}
              <div className="mb-8">
                <h2 
                  className="text-3xl font-bold mb-4"
                  style={{ 
                    fontFamily: 'Bebas Neue',
                    color: '#D71920'
                  }}
                >
                  Название организации
                </h2>
                <p 
                  className="text-xl"
                  style={{ 
                    fontFamily: 'Inter',
                    color: '#F2F0F0'
                  }}
                >
                  {requisites.legal_name}
                </p>
                <p 
                  className="text-lg mt-2"
                  style={{ 
                    fontFamily: 'Inter',
                    color: '#B8B8B8'
                  }}
                >
                  Краткое наименование: {requisites.company_name}
                </p>
              </div>

              {/* Основные реквизиты */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 
                    className="text-xl font-bold mb-4"
                    style={{ 
                      fontFamily: 'Bebas Neue',
                      color: '#D71920'
                    }}
                  >
                    Основные реквизиты
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span 
                        className="text-gray-400"
                        style={{ fontFamily: 'Inter' }}
                      >
                        ИНН:
                      </span>
                      <span 
                        className="ml-2 text-white"
                        style={{ fontFamily: 'Inter' }}
                      >
                        {requisites.inn}
                      </span>
                    </div>
                    <div>
                      <span 
                        className="text-gray-400"
                        style={{ fontFamily: 'Inter' }}
                      >
                        КПП:
                      </span>
                      <span 
                        className="ml-2 text-white"
                        style={{ fontFamily: 'Inter' }}
                      >
                        {requisites.kpp}
                      </span>
                    </div>
                    <div>
                      <span 
                        className="text-gray-400"
                        style={{ fontFamily: 'Inter' }}
                      >
                        ОГРН:
                      </span>
                      <span 
                        className="ml-2 text-white"
                        style={{ fontFamily: 'Inter' }}
                      >
                        {requisites.ogrn}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 
                    className="text-xl font-bold mb-4"
                    style={{ 
                      fontFamily: 'Bebas Neue',
                      color: '#D71920'
                    }}
                  >
                    Контактная информация
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span 
                        className="text-gray-400"
                        style={{ fontFamily: 'Inter' }}
                      >
                        Адрес:
                      </span>
                      <span 
                        className="ml-2 text-white"
                        style={{ fontFamily: 'Inter' }}
                      >
                        {requisites.actual_address}
                      </span>
                    </div>
                    <div>
                      <span 
                        className="text-gray-400"
                        style={{ fontFamily: 'Inter' }}
                      >
                        Телефон:
                      </span>
                      <span 
                        className="ml-2 text-white"
                        style={{ fontFamily: 'Inter' }}
                      >
                        {requisites.phone}
                      </span>
                    </div>
                    <div>
                      <span 
                        className="text-gray-400"
                        style={{ fontFamily: 'Inter' }}
                      >
                        Email:
                      </span>
                      <span 
                        className="ml-2 text-white"
                        style={{ fontFamily: 'Inter' }}
                      >
                        {requisites.email}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Банковские реквизиты */}
              <div>
                <h3 
                  className="text-xl font-bold mb-4"
                  style={{ 
                    fontFamily: 'Bebas Neue',
                    color: '#D71920'
                  }}
                >
                  Банковские реквизиты
                </h3>
                <div className="space-y-3">
                  <div>
                    <span 
                      className="text-gray-400"
                      style={{ fontFamily: 'Inter' }}
                    >
                      Банк:
                    </span>
                    <span 
                      className="ml-2 text-white"
                      style={{ fontFamily: 'Inter' }}
                    >
                      {requisites.bank_name}
                    </span>
                  </div>
                  <div>
                    <span 
                      className="text-gray-400"
                      style={{ fontFamily: 'Inter' }}
                    >
                      БИК:
                    </span>
                    <span 
                      className="ml-2 text-white"
                      style={{ fontFamily: 'Inter' }}
                    >
                      {requisites.bik}
                    </span>
                  </div>
                  <div>
                    <span 
                      className="text-gray-400"
                      style={{ fontFamily: 'Inter' }}
                    >
                      Расчетный счет:
                    </span>
                    <span 
                      className="ml-2 text-white"
                      style={{ fontFamily: 'Inter' }}
                    >
                      {requisites.bank_account}
                    </span>
                  </div>
                  <div>
                    <span 
                      className="text-gray-400"
                      style={{ fontFamily: 'Inter' }}
                    >
                      Корреспондентский счет:
                    </span>
                    <span 
                      className="ml-2 text-white"
                      style={{ fontFamily: 'Inter' }}
                    >
                      {requisites.correspondent_account}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </PageContainer>
      </section>
    </div>
  );
};

export default Requisites;

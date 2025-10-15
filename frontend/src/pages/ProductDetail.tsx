import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageContainer from '../components/PageContainer';
import ProductImageCarousel from '../components/ProductImageCarousel';
import ProductDocuments from '../components/ProductDocuments';
import { useProduct } from '../hooks/useProduct';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productId = id ? parseInt(id, 10) : 0;
  
  const { product, loading, error } = useProduct(productId);
  const location = useLocation();
  const documentsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Автоскролл к документам, если передан хэш #documents или state.scrollTo
    const shouldScrollToDocs = location.hash === '#documents' || (location.state as any)?.scrollTo === 'documents';
    if (shouldScrollToDocs && documentsRef.current) {
      documentsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.hash, location.state]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0D0D0D' }}>
        <div className="text-center">
          <div className="text-2xl font-bold mb-4" style={{ fontFamily: 'Bebas Neue', color: '#F2F0F0' }}>
            ЗАГРУЗКА ПРОДУКТА...
          </div>
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0D0D0D' }}>
        <div className="text-center">
          <div className="text-2xl font-bold mb-4" style={{ fontFamily: 'Bebas Neue', color: '#D71920' }}>
            ПРОДУКТ НЕ НАЙДЕН
          </div>
          <div className="text-lg mb-6" style={{ fontFamily: 'Inter', color: '#B8B8B8' }}>
            Запрашиваемый продукт не существует или был удален
          </div>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors duration-200"
            style={{ fontFamily: 'Inter' }}
          >
            Вернуться к продукции
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0D0D0D' }}>

      {/* Кнопка назад */}
      <div className="pt-24">
        <PageContainer>
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
            style={{ fontFamily: 'Inter' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Назад к продукции
          </motion.button>
        </PageContainer>
      </div>

      {/* Основной контент */}
      <section className="py-8 md:py-16 relative">
        <PageContainer>
          {/* Левая колонка - изображения */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="col-start-1 col-end-13 lg:col-start-1 lg:col-end-7"
          >
            <ProductImageCarousel
              images={product.images || []}
              mainImage={product.image_url}
              productName={product.name}
            />
          </motion.div>

          {/* Правая колонка - информация о продукте */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="col-start-1 col-end-13 lg:col-start-7 lg:col-end-13 space-y-6 md:space-y-8"
          >
            {/* Название и категория */}
            <div>
              <div 
                className="text-sm text-red-400 mb-2"
                style={{ fontFamily: 'Inter' }}
              >
                {product.category_name || product.category_name_from_table}
              </div>
              <h1 
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ 
                  fontFamily: 'Bebas Neue',
                  color: '#F2F0F0'
                }}
              >
                {product.name}
              </h1>
            </div>

            {/* Описание */}
            <div>
              <h2 
                className="text-lg md:text-xl font-bold mb-4"
                style={{ 
                  fontFamily: 'Bebas Neue',
                  color: '#F2F0F0'
                }}
              >
                ОПИСАНИЕ
              </h2>
              <p 
                className="text-base md:text-lg leading-relaxed"
                style={{ 
                  fontFamily: 'Inter',
                  color: '#B8B8B8'
                }}
              >
                {product.description}
              </p>
            </div>

            {/* Технические характеристики */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div>
                <h2 
                  className="text-lg md:text-xl font-bold mb-4"
                  style={{ 
                    fontFamily: 'Bebas Neue',
                    color: '#F2F0F0'
                  }}
                >
                  ТЕХНИЧЕСКИЕ ХАРАКТЕРИСТИКИ
                </h2>
                <div className="space-y-3">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div 
                      key={key}
                      className="flex justify-between items-center py-2 border-b border-gray-700"
                    >
                      <span 
                        className="text-gray-400"
                        style={{ fontFamily: 'Inter' }}
                      >
                        {key}:
                      </span>
                      <span 
                        className="text-white font-medium text-right ml-4"
                        style={{ fontFamily: 'Inter' }}
                      >
                        {String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Кнопка заказа */}
            <div className="pt-4 md:pt-6">
              <button
                className="w-full py-4 px-6 md:px-8 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105"
                style={{ fontFamily: 'Bebas Neue' }}
              >
                ЗАКАЗАТЬ ПРОДУКТ
              </button>
            </div>
            </motion.div>
        </PageContainer>
      </section>

      {/* Документы */}
      {product.documents && product.documents.length > 0 && (
        <section className="py-8 md:py-16 relative" id="documents">
          <PageContainer>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div ref={documentsRef} />
              <ProductDocuments documents={product.documents} />
            </motion.div>
          </PageContainer>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
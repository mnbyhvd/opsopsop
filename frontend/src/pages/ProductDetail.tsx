import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="text-center">
          <div className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-headings, Bebas Neue)', color: 'var(--font-headings-color, var(--text))' }}>
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
          <div className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-headings, Bebas Neue)', color: 'var(--accent)' }}>
            ПРОДУКТ НЕ НАЙДЕН
          </div>
          <div className="text-lg mb-6" style={{ fontFamily: 'var(--font-body, Inter)', color: 'var(--font-body-color, var(--text))' }}>
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
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>

      {/* Кнопка назад */}
      <div className="pt-24">
        <PageContainer>
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 whitespace-nowrap"
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
            style={{ marginBottom: '2rem', marginRight: '2rem' }}
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
                {product.category_name || product.category || 'Категория'}
              </div>
              <h1 
                className="text-3xl md:text-4xl font-bold mb-4"
            style={{ 
              fontFamily: 'var(--font-headings, Bebas Neue)',
              color: 'var(--font-headings-color, var(--text))'
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
              fontFamily: 'var(--font-headings, Bebas Neue)',
              color: 'var(--font-headings-color, var(--text))'
            }}
              >
                ОПИСАНИЕ
              </h2>
              <p 
                className="text-base md:text-lg leading-relaxed"
                style={{ 
                  fontFamily: 'var(--font-body, Inter)',
                  color: 'var(--font-body-color, var(--text))'
                }}
              >
                {product.description}
              </p>
            </div>

            {/* Документы */}
            {product.documents && product.documents.length > 0 && (
              <div>
                <ProductDocuments documents={product.documents} />
              </div>
            )}

            {/* Кнопка заказа */}
            <div className="pt-4 md:pt-6">
              <button
                onClick={() => {
                  const contactForm = document.getElementById('contact-form');
                  if (contactForm) {
                    contactForm.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'center'
                    });
                  }
                }}
                className="w-full py-4 px-6 md:px-8 rounded-xl font-medium text-lg transition-all duration-200"
                style={{ 
                  fontFamily: 'var(--font-body, Inter)',
                  backgroundColor: 'var(--button-primary-bg)', 
                  color: 'var(--button-primary-text)',
                  border: `1px solid var(--button-primary-border)`,
                  borderRadius: 'var(--button-primary-radius)'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--button-primary-hover-bg)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--button-primary-hover-text)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--button-primary-hover-border)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--button-primary-bg)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--button-primary-text)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--button-primary-border)';
                }}
              >
                Оставить заявку
              </button>
            </div>
            </motion.div>
        </PageContainer>
      </section>

    </div>
  );
};

export default ProductDetail;
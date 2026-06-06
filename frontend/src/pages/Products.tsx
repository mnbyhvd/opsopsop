import React from 'react';
import SeoHead from '../components/SeoHead';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import { useProducts } from '../hooks/useProducts';
import { useProductContentBlocks } from '../hooks/useProductContentBlocks';
import { Product, ProductContentBlock } from '../types';
import { resolveMediaUrl } from '../utils/media';
import { sanitizeHtml } from '../utils/richText';

const Products: React.FC = () => {
  const navigate = useNavigate();
  const { products, loading, error } = useProducts();
  const { blocks } = useProductContentBlocks();

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const beforeBlocks = blocks.filter(block => block.placement === 'before_products');
  const afterProductsBlocks = blocks.filter(block => block.placement === 'after_products');
  const getBlocksAfterProduct = (productId: number) =>
    blocks.filter(block => block.placement === 'after_product' && block.product_id === productId);

  const renderContentBlock = (block: ProductContentBlock, index: number) => (
    <motion.article
      key={`content-${block.id}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.2) }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center py-8"
    >
      <div className="lg:col-span-7">
        <h2
          className="text-3xl md:text-5xl uppercase mb-6"
          style={{ fontFamily: 'var(--font-headings, Bebas Neue)', color: 'var(--font-headings-color, var(--text))' }}
        >
          {block.title}
        </h2>
        <div
          className="rich-text text-base md:text-lg leading-relaxed"
          style={{ fontFamily: 'var(--font-body, Inter)', color: 'var(--font-body-color, var(--text))' }}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.description) }}
        />
      </div>
      <div className="lg:col-span-5">
        {block.image_url ? (
          <img
            src={resolveMediaUrl(block.image_url)}
            alt={block.title}
            className="w-full aspect-[4/3] object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full aspect-[4/3] flex items-center justify-center glass" style={{ color: 'var(--text)' }}>
            Информационный блок
          </div>
        )}
      </div>
    </motion.article>
  );

  const renderProduct = (product: Product, index: number) => (
    <motion.div
      key={product.id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      viewport={{ once: true }}
      onClick={() => handleProductClick(product.id)}
      className="rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 cursor-pointer hover:scale-[1.02] transition-all duration-300 glass"
      style={{
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-xl)'
      }}
    >
      <div className="w-full md:w-64 h-48 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
        {product.image_url ? (
          <img
            src={resolveMediaUrl(product.image_url)}
            alt={product.name}
            className="w-full h-full object-contain rounded-lg"
          />
        ) : (
          <span className="text-gray-400">Изображение продукта</span>
        )}
      </div>
      <div className="flex-1 w-full">
        <h3
          className="text-3xl font-bold mb-2"
          style={{
            fontFamily: 'Bebas Neue',
            color: '#F2F0F0'
          }}
        >
          {product.name}
        </h3>
        <p
          className="text-gray-300 mb-3 text-lg"
          style={{ fontFamily: 'Inter' }}
        >
          {product.description}
        </p>
        <div className="text-sm text-gray-400" style={{ fontFamily: 'Inter' }}>
          {product.category_name || product.category || 'Категория'}
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="text-center">
          <div className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-headings, Bebas Neue)', color: 'var(--font-headings-color, var(--text))' }}>
            ЗАГРУЗКА ПРОДУКЦИИ...
          </div>
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="text-center">
          <div className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-headings, Bebas Neue)', color: 'var(--accent)' }}>
            ОШИБКА ЗАГРУЗКИ
          </div>
          <div className="text-lg" style={{ fontFamily: 'var(--font-body, Inter)', color: 'var(--font-body-color, var(--text))' }}>
            Не удалось загрузить продукцию
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <SeoHead pageKey="products" />
      {/* Hero секция */}
      <section className="pt-20 pb-0 relative">
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
                  fontFamily: 'var(--font-headings, Bebas Neue)',
                  color: 'var(--font-headings-color, var(--text))',
                  textTransform: 'uppercase'
                }}
              >
                ПРОДУКЦИЯ
              </h1>
              
              <p 
                className="text-xl max-w-4xl mx-auto"
                style={{ 
                  fontFamily: 'var(--font-body, Inter)',
                  color: 'var(--font-body-color, var(--text))'
                }}
              >
                Технологии, которые не подведут. Изучите ассортимент оборудования.
              </p>
            </motion.div>
          </div>
        </PageContainer>
      </section>

      {/* Основной контент */}
      <section className="py-16 relative">
        <PageContainer>
          {/* Список продуктов */}
          <div className="col-start-1 col-end-13">
            <div className="space-y-12">
              {beforeBlocks.map(renderContentBlock)}

              {products.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-headings, Bebas Neue)', color: 'var(--font-headings-color, var(--text))' }}>
                    ПРОДУКТЫ НЕ НАЙДЕНЫ
                  </div>
                  <div className="text-lg" style={{ fontFamily: 'var(--font-body, Inter)', color: 'var(--font-body-color, var(--text))' }}>
                    Пока нет активных продуктов для отображения
                  </div>
                </div>
              ) : (
                products.flatMap((product, index) => [
                  renderProduct(product, index),
                  ...getBlocksAfterProduct(product.id).map((block, blockIndex) => renderContentBlock(block, index + blockIndex + 1))
                ])
              )}

              {afterProductsBlocks.map((block, index) => renderContentBlock(block, products.length + index))}
            </div>
          </div>
        </PageContainer>
      </section>
    </div>
  );
};

export default Products;

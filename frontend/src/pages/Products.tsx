import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import ProductSearchFilter from '../components/ProductSearchFilter';
import { useProducts } from '../hooks/useProducts';

const Products: React.FC = () => {
  const navigate = useNavigate();
  const { products, loading, error } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  // Фильтрация продуктов
  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategoryId || 
      product.category_id === selectedCategoryId;
    
    return matchesSearch && matchesCategory;
  });

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0D0D0D' }}>
        <div className="text-center">
          <div className="text-2xl font-bold mb-4" style={{ fontFamily: 'Bebas Neue', color: '#F2F0F0' }}>
            ЗАГРУЗКА ПРОДУКЦИИ...
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
            Не удалось загрузить продукцию
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0D0D0D' }}>
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
                  fontFamily: 'Bebas Neue',
                  color: '#F2F0F0',
                  textTransform: 'uppercase'
                }}
              >
                ПРОДУКЦИЯ
              </h1>
              
              <p 
                className="text-xl max-w-4xl mx-auto"
                style={{ 
                  fontFamily: 'Inter',
                  color: '#B8B8B8'
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
          {/* Поиск и фильтрация */}
          <div className="col-start-1 col-end-13 mb-12">
            <ProductSearchFilter
              onSearchChange={setSearchTerm}
              onCategoryChange={setSelectedCategoryId}
              searchValue={searchTerm}
              selectedCategoryId={selectedCategoryId}
            />
          </div>

          {/* Список продуктов */}
          <div className="col-start-1 col-end-13">
            <div className="space-y-8">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-2xl font-bold mb-4" style={{ fontFamily: 'Bebas Neue', color: '#F2F0F0' }}>
                    ПРОДУКТЫ НЕ НАЙДЕНЫ
                  </div>
                  <div className="text-lg" style={{ fontFamily: 'Inter', color: '#B8B8B8' }}>
                    Попробуйте изменить параметры поиска или фильтрации
                  </div>
                </div>
              ) : (
                filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                    onClick={() => handleProductClick(product.id)}
                    className="rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 cursor-pointer hover:scale-105 transition-all duration-300"
                  style={{
                    backgroundColor: 'rgba(98, 98, 98, 0.3)',
                    backdropFilter: 'blur(38.400001525878906px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '30px'
                  }}
                >
                  <div className="w-full md:w-64 h-48 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
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
                ))
              )}
            </div>
          </div>
        </PageContainer>
      </section>
    </div>
  );
};

export default Products;
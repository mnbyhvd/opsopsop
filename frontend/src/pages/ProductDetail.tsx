import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import Footer from '../components/Footer';

interface Product {
  id: number;
  name: string;
  description: string;
  image_url: string;
  hover_image_url: string;
  detail_page_url: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProduct(parseInt(id));
    }
  }, [id]);

  const fetchProduct = async (productId: number) => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data.data);
      } else {
        setError('Продукт не найден');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Ошибка загрузки продукта');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div 
          className="text-lg"
          style={{
            fontFamily: 'Inter',
            color: '#F2F0F0'
          }}
        >
          Загрузка...
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 
            className="text-4xl font-bold mb-4"
            style={{
              fontFamily: 'Bebas Neue',
              color: '#F2F0F0'
            }}
          >
            Продукт не найден
          </h1>
          <button
            onClick={() => navigate('/')}
            className="admin-button-primary"
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero секция продукта */}
      <section className="py-20">
        <PageContainer>
          <div className="col-start-1 col-end-13 px-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Изображение продукта */}
              <div className="order-2 lg:order-1">
                <div 
                  className="w-full h-96 rounded-2xl overflow-hidden"
                  style={{ backgroundColor: '#2a2a2a' }}
                >
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-lg">Изображение продукта</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Информация о продукте */}
              <div className="order-1 lg:order-2">
                <h1 
                  className="text-5xl font-bold mb-6"
                  style={{
                    fontFamily: 'Bebas Neue',
                    color: '#F2F0F0',
                    textTransform: 'uppercase'
                  }}
                >
                  {product.name}
                </h1>
                
                <p 
                  className="text-lg leading-relaxed mb-8"
                  style={{
                    fontFamily: 'Inter',
                    color: '#F2F0F0'
                  }}
                >
                  {product.description}
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={() => navigate('/#contact')}
                    className="px-8 py-4 rounded-xl font-medium text-lg transition-all duration-200 hover:scale-105"
                    style={{
                      backgroundColor: '#D71920',
                      color: '#F2F0F0',
                      fontFamily: 'Inter',
                      border: '1px solid #D71920'
                    }}
                  >
                    Получить консультацию
                  </button>
                  
                  <button
                    onClick={() => navigate('/')}
                    className="px-8 py-4 rounded-xl font-medium text-lg transition-all duration-200 hover:scale-105"
                    style={{
                      backgroundColor: 'transparent',
                      color: '#F2F0F0',
                      fontFamily: 'Inter',
                      border: '1px solid #F2F0F0'
                    }}
                  >
                    Назад к продукции
                  </button>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Дополнительная информация */}
      <section className="py-20">
        <PageContainer>
          <div className="col-start-1 col-end-13 px-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Технические характеристики */}
              <div 
                className="glass p-6 rounded-2xl"
                style={{
                  backdropFilter: 'blur(12px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <h3 
                  className="text-2xl font-bold mb-4"
                  style={{
                    fontFamily: 'Bebas Neue',
                    color: '#F2F0F0',
                    textTransform: 'uppercase'
                  }}
                >
                  Технические характеристики
                </h3>
                <p 
                  className="text-sm"
                  style={{
                    fontFamily: 'Inter',
                    color: '#B8B8B8'
                  }}
                >
                  Подробные технические характеристики продукта будут добавлены в админке.
                </p>
              </div>

              {/* Преимущества */}
              <div 
                className="glass p-6 rounded-2xl"
                style={{
                  backdropFilter: 'blur(12px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <h3 
                  className="text-2xl font-bold mb-4"
                  style={{
                    fontFamily: 'Bebas Neue',
                    color: '#F2F0F0',
                    textTransform: 'uppercase'
                  }}
                >
                  Преимущества
                </h3>
                <p 
                  className="text-sm"
                  style={{
                    fontFamily: 'Inter',
                    color: '#B8B8B8'
                  }}
                >
                  Ключевые преимущества продукта будут добавлены в админке.
                </p>
              </div>

              {/* Применение */}
              <div 
                className="glass p-6 rounded-2xl"
                style={{
                  backdropFilter: 'blur(12px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <h3 
                  className="text-2xl font-bold mb-4"
                  style={{
                    fontFamily: 'Bebas Neue',
                    color: '#F2F0F0',
                    textTransform: 'uppercase'
                  }}
                >
                  Область применения
                </h3>
                <p 
                  className="text-sm"
                  style={{
                    fontFamily: 'Inter',
                    color: '#B8B8B8'
                  }}
                >
                  Области применения продукта будут добавлены в админке.
                </p>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* CTA секция */}
      <section className="py-20">
        <PageContainer>
          <div className="col-start-1 col-end-13 text-center px-16">
            <h2 
              className="text-4xl font-bold mb-6"
              style={{
                fontFamily: 'Bebas Neue',
                color: '#F2F0F0',
                textTransform: 'uppercase'
              }}
            >
              Заинтересованы в {product.name}?
            </h2>
            <p 
              className="text-lg mb-8 max-w-2xl mx-auto"
              style={{
                fontFamily: 'Inter',
                color: '#F2F0F0'
              }}
            >
              Получите подробную консультацию и расчет стоимости для вашего объекта
            </p>
            <button
              onClick={() => navigate('/#contact')}
              className="px-12 py-4 rounded-xl font-medium text-lg transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: '#D71920',
                color: '#F2F0F0',
                fontFamily: 'Inter',
                border: '1px solid #D71920'
              }}
            >
              Получить консультацию
            </button>
          </div>
        </PageContainer>
      </section>

      <Footer />
    </div>
  );
};

export default ProductDetail;

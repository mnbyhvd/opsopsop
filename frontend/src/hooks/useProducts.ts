import { useState, useEffect } from 'react';

export interface Product {
  id: number;
  name: string;
  description: string;
  image_url: string;
  category: string;
  specifications: Record<string, any>;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const defaultProducts: Product[] = [
  {
    id: 1,
    name: 'ППКУП',
    description: 'Интеллектуальная централь системы с 7-дюймовым сенсорным экраном. Обеспечивает управление шлейфами, интеграцию со смежными системами и объединение в сеть MasterNet.',
    image_url: '/images/products/ppkup.jpg',
    category: 'Контрольные панели',
    specifications: { power: '12V DC', display: '7-дюймовый сенсорный экран', connectivity: 'Ethernet, Wi-Fi' },
    sort_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Датчик движения',
    description: 'Высокоточный датчик с беспроводной связью. Обеспечивает надежное обнаружение и передачу данных в реальном времени.',
    image_url: '/images/products/sensor.jpg',
    category: 'Датчики',
    specifications: { range: '12 метров', angle: '110°', battery: '2 года' },
    sort_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Модуль управления',
    description: 'Компактный модуль управления с расширенными возможностями интеграции. Поддерживает различные протоколы связи.',
    image_url: '/images/products/module.jpg',
    category: 'Модули',
    specifications: { inputs: '8', outputs: '4', protocols: 'RS-485, Modbus' },
    sort_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    name: 'Контроллер',
    description: 'Мощный контроллер для управления сложными системами. Обеспечивает высокую производительность и надежность.',
    image_url: '/images/products/controller.jpg',
    category: 'Контроллеры',
    specifications: { cpu: 'ARM Cortex-A9', memory: '512MB', storage: '8GB' },
    sort_order: 4,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setProducts(data.data);
            setError(null);
          } else {
            throw new Error('Failed to fetch products');
          }
        } else {
          throw new Error('Failed to fetch products');
        }
      } catch (err) {
        setError('Failed to fetch products');
        console.error('Error fetching products:', err);
        setProducts(defaultProducts); // Use default products on error
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};

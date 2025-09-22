-- Создание таблицы продуктов
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    category VARCHAR(100),
    specifications JSONB,
    price DECIMAL(10,2),
    sort_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Вставляем тестовые данные продуктов
INSERT INTO products (name, description, image_url, category, specifications, price, sort_order, is_active) VALUES
('ППКУП', 'Интеллектуальная централь системы с 7-дюймовым сенсорным экраном. Обеспечивает управление шлейфами, интеграцию со смежными системами и объединение в сеть MasterNet.', '/images/products/ppkup.jpg', 'Контрольные панели', '{"display": "7-дюймовый сенсорный экран", "connectivity": "Ethernet, Wi-Fi", "power": "12V DC"}', 150000.00, 1, true),
('Датчик движения', 'Высокоточный датчик с беспроводной связью. Обеспечивает надежное обнаружение и передачу данных в реальном времени.', '/images/products/sensor.jpg', 'Датчики', '{"range": "12 метров", "angle": "110°", "battery": "2 года"}', 25000.00, 2, true),
('Модуль управления', 'Компактный модуль управления с расширенными возможностями интеграции. Поддерживает различные протоколы связи.', '/images/products/module.jpg', 'Модули', '{"inputs": "8", "outputs": "4", "protocols": "RS-485, Modbus"}', 45000.00, 3, true),
('Контроллер', 'Мощный контроллер для управления сложными системами. Обеспечивает высокую производительность и надежность.', '/images/products/controller.jpg', 'Контроллеры', '{"cpu": "ARM Cortex-A9", "memory": "512MB", "storage": "8GB"}', 75000.00, 4, true)
ON CONFLICT (id) DO NOTHING;

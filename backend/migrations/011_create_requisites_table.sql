-- Создание таблицы реквизитов компании
CREATE TABLE IF NOT EXISTS requisites (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL DEFAULT '',
    legal_name VARCHAR(255) NOT NULL DEFAULT '',
    inn VARCHAR(20) NOT NULL DEFAULT '',
    kpp VARCHAR(20) NOT NULL DEFAULT '',
    ogrn VARCHAR(20) NOT NULL DEFAULT '',
    legal_address TEXT NOT NULL DEFAULT '',
    actual_address TEXT NOT NULL DEFAULT '',
    phone VARCHAR(50) NOT NULL DEFAULT '',
    email VARCHAR(100) NOT NULL DEFAULT '',
    website VARCHAR(255) NOT NULL DEFAULT '',
    bank_name VARCHAR(255) NOT NULL DEFAULT '',
    bank_account VARCHAR(30) NOT NULL DEFAULT '',
    correspondent_account VARCHAR(30) NOT NULL DEFAULT '',
    bik VARCHAR(20) NOT NULL DEFAULT '',
    director_name VARCHAR(255) NOT NULL DEFAULT '',
    director_position VARCHAR(255) NOT NULL DEFAULT '',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Вставляем пустую запись реквизитов
INSERT INTO requisites (
    company_name, legal_name, inn, kpp, ogrn, legal_address, actual_address,
    phone, email, website, bank_name, bank_account, correspondent_account,
    bik, director_name, director_position
) VALUES (
    'ООО "Элемент"',
    'Общество с ограниченной ответственностью "Элемент"',
    '1234567890',
    '123456789',
    '1234567890123',
    'г. Москва, ул. Остоженка, д.1/9',
    'г. Москва, ул. Остоженка, д.1/9',
    '+7 (999) 999-99-99',
    'email@gmail.ru',
    'https://example.com',
    'ПАО "Сбербанк"',
    '40702810123456789012',
    '30101810400000000225',
    '044525225',
    'Иванов Иван Иванович',
    'Генеральный директор'
) ON CONFLICT (id) DO NOTHING;

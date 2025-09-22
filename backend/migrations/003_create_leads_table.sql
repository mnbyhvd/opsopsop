-- Создание таблицы заявок
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    message TEXT,
    source VARCHAR(100) DEFAULT 'website',
    status VARCHAR(50) DEFAULT 'new',
    priority VARCHAR(20) DEFAULT 'medium',
    assigned_to INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP,
    notes TEXT
);

-- Создание индексов для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone);

-- Добавление комментариев к таблице и колонкам
COMMENT ON TABLE leads IS 'Таблица заявок с сайта';
COMMENT ON COLUMN leads.name IS 'Имя клиента';
COMMENT ON COLUMN leads.email IS 'Email клиента';
COMMENT ON COLUMN leads.phone IS 'Телефон клиента';
COMMENT ON COLUMN leads.company IS 'Название компании';
COMMENT ON COLUMN leads.message IS 'Сообщение от клиента';
COMMENT ON COLUMN leads.source IS 'Источник заявки (website, phone, email)';
COMMENT ON COLUMN leads.status IS 'Статус заявки (new, in_progress, completed, closed)';
COMMENT ON COLUMN leads.priority IS 'Приоритет (low, medium, high, urgent)';
COMMENT ON COLUMN leads.assigned_to IS 'ID пользователя, которому назначена заявка';
COMMENT ON COLUMN leads.responded_at IS 'Время первого ответа на заявку';
COMMENT ON COLUMN leads.notes IS 'Внутренние заметки по заявке';

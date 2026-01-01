CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Kullanıcılar
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT false,
    is_email_verified BOOLEAN DEFAULT false,
    is_sms_verified BOOLEAN DEFAULT false,
    email_verify_token VARCHAR(255),
    email_verify_token_created_at TIMESTAMP,
    email_verify_code VARCHAR(6),
    email_verify_code_created_at TIMESTAMP,
    sms_verify_code VARCHAR(6),
    sms_verify_code_created_at TIMESTAMP,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Şifre sıfırlama token'ları
CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

-- Üyelik planları tanımları (önce oluşturulmalı - foreign key için)
CREATE TABLE membership_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,           -- Plan adı: Normal, Pro
    price INT NOT NULL,                   -- Fiyat (TL)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Üyelik planları
CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES membership_plans(id),
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active',  -- active, inactive, expired
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO membership_plans (name, price) VALUES
('Normal', 0),
('Pro', 300);

-- Kişi/Firma Bilgileri
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Borç/Alacak İşlemleri
CREATE TABLE debt_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('debt', 'receivable')),
    amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
    remaining_amount DECIMAL(15, 2) NOT NULL CHECK (remaining_amount >= 0),
    due_date DATE NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed')),
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Ödemeler
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL REFERENCES debt_transactions(id) ON DELETE CASCADE,
    amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT,
    created_at TIMESTAMP DEFAULT now()
);

-- Gönderilen Hatırlatmalar
CREATE TABLE reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL REFERENCES debt_transactions(id) ON DELETE CASCADE,
    reminder_type VARCHAR(20) NOT NULL CHECK (reminder_type IN ('30_days_before', '7_days_before', '3_days_before', 'due_date')),
    sent_at TIMESTAMP NOT NULL DEFAULT now(),
    created_at TIMESTAMP DEFAULT now()
);

-- Kullanıcı Hatırlatma Ayarları
CREATE TABLE user_reminder_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    remind_30_days BOOLEAN DEFAULT true,
    remind_7_days BOOLEAN DEFAULT true,
    remind_3_days BOOLEAN DEFAULT true,
    remind_on_due_date BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Index'ler
CREATE INDEX idx_contacts_user_id ON contacts(user_id);

CREATE INDEX idx_debt_transactions_user_id_due_date ON debt_transactions(user_id, due_date);
CREATE INDEX idx_debt_transactions_user_id_status_type ON debt_transactions(user_id, status, type);
CREATE INDEX idx_debt_transactions_contact_id ON debt_transactions(contact_id);
CREATE INDEX idx_debt_transactions_due_date_status ON debt_transactions(due_date, status) WHERE status = 'active';

CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);

CREATE INDEX idx_reminders_transaction_id_type ON reminders(transaction_id, reminder_type);

-- Aktivite Günlükleri
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL CHECK (category IN ('contact', 'debt_transaction', 'payment')),
    action VARCHAR(50) NOT NULL CHECK (action IN ('created', 'updated', 'deleted')),
    entity_type VARCHAR(50) NOT NULL, -- 'contact', 'debt_transaction', 'payment'
    entity_id UUID,
    description TEXT,
    metadata JSONB, -- Ek bilgiler (ör: contact_name, amount, etc.)
    created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_activity_logs_user_id_created_at ON activity_logs(user_id, created_at DESC);
CREATE INDEX idx_activity_logs_category ON activity_logs(category);
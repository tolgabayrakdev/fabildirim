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
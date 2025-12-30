import pool from "../config/database.js";

export default class AuthRepository {
    async findById(userId, client = null) {
        const dbClient = client || pool;
        const query = `SELECT * FROM users WHERE id = $1`;
        const result = await dbClient.query(query, [userId]);
        return result.rows[0];
    }

    async findByEmail(email) {
        const query = `SELECT * FROM users WHERE email = $1`;
        const result = await pool.query(query, [email]);
        return result.rows[0];
    }

    async findByPhone(phone) {
        const query = `SELECT * FROM users WHERE phone = $1`;
        const result = await pool.query(query, [phone]);
        return result.rows[0];
    }

    async createUser(userData, client = null) {
        const dbClient = client || pool;

        const query = `
        INSERT INTO users (first_name, last_name, email, phone, password)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, first_name, last_name, email, phone, created_at
        `;
        const values = [
            userData.first_name,
            userData.last_name,
            userData.email,
            userData.phone,
            userData.password,
        ];

        const result = await dbClient.query(query, values);
        return result.rows[0];
    }

    async updateEmailVerifyCode(userId, code, createdAt, client = null) {
        const dbClient = client || pool;
        const query = `
            UPDATE users 
            SET email_verify_code = $1, email_verify_code_created_at = $2 
            WHERE id = $3
        `;
        await dbClient.query(query, [code, createdAt, userId]);
    }

    async updateSmsVerifyCode(userId, code, createdAt, client = null) {
        const dbClient = client || pool;
        const query = `
            UPDATE users 
            SET sms_verify_code = $1, sms_verify_code_created_at = $2 
            WHERE id = $3
        `;
        await dbClient.query(query, [code, createdAt, userId]);
    }

    async createPasswordResetToken(userId, token, expiresAt, client = null) {
        const dbClient = client || pool;
        // Önceki token'ları sil (güvenlik için)
        await dbClient.query(`DELETE FROM password_reset_tokens WHERE user_id = $1`, [userId]);
        // Yeni token oluştur
        const query = `
            INSERT INTO password_reset_tokens (user_id, token, expires_at)
            VALUES ($1, $2, $3)
            RETURNING id, token, expires_at, created_at
        `;
        const result = await dbClient.query(query, [userId, token, expiresAt]);
        return result.rows[0];
    }

    async findPasswordResetToken(token, client = null) {
        const dbClient = client || pool;
        const query = `
            SELECT prt.*, u.id as user_id, u.email, u.first_name, u.last_name
            FROM password_reset_tokens prt
            INNER JOIN users u ON prt.user_id = u.id
            WHERE prt.token = $1 AND prt.expires_at > NOW()
        `;
        const result = await dbClient.query(query, [token]);
        return result.rows[0];
    }

    async deletePasswordResetToken(token, client = null) {
        const dbClient = client || pool;
        const query = `DELETE FROM password_reset_tokens WHERE token = $1`;
        await dbClient.query(query, [token]);
    }

    async updatePassword(userId, hashedPassword, client = null) {
        const dbClient = client || pool;
        const query = `
            UPDATE users 
            SET password = $1, updated_at = NOW()
            WHERE id = $2
        `;
        await dbClient.query(query, [hashedPassword, userId]);
    }

    async verifyEmailOtp(email, code, client = null) {
        const dbClient = client || pool;
        const query = `
            SELECT id, email, email_verify_code, email_verify_code_created_at, is_email_verified
            FROM users 
            WHERE email = $1 
            AND email_verify_code = $2
            AND email_verify_code_created_at IS NOT NULL
            AND email_verify_code_created_at > NOW() - INTERVAL '3 minutes'
        `;
        const result = await dbClient.query(query, [email, code]);
        return result.rows[0];
    }

    async verifySmsOtp(email, code, client = null) {
        const dbClient = client || pool;
        const query = `
            SELECT id, email, phone, sms_verify_code, sms_verify_code_created_at, is_sms_verified
            FROM users 
            WHERE email = $1 
            AND sms_verify_code = $2
            AND sms_verify_code_created_at IS NOT NULL
            AND sms_verify_code_created_at > NOW() - INTERVAL '3 minutes'
        `;
        const result = await dbClient.query(query, [email, code]);
        return result.rows[0];
    }

    async markEmailAsVerified(userId, client = null) {
        const dbClient = client || pool;
        const query = `
            UPDATE users 
            SET is_email_verified = true, 
                is_verified = true,
                email_verify_code = NULL,
                email_verify_code_created_at = NULL,
                updated_at = NOW()
            WHERE id = $1
        `;
        await dbClient.query(query, [userId]);
    }

    async markSmsAsVerified(userId, client = null) {
        const dbClient = client || pool;
        const query = `
            UPDATE users 
            SET is_sms_verified = true,
                sms_verify_code = NULL,
                sms_verify_code_created_at = NULL,
                updated_at = NOW()
            WHERE id = $1
        `;
        await dbClient.query(query, [userId]);
    }

    async canResendEmailCode(email, cooldownSeconds = 180, client = null) {
        const dbClient = client || pool;
        const query = `
            SELECT email_verify_code_created_at,
                   EXTRACT(EPOCH FROM (NOW() - email_verify_code_created_at)) as seconds_since_last_code
            FROM users 
            WHERE email = $1
        `;
        const result = await dbClient.query(query, [email]);

        if (result.rows.length === 0) {
            return { canResend: false, reason: "Kullanıcı bulunamadı." };
        }

        const user = result.rows[0];

        // Eğer hiç kod gönderilmemişse, gönderebilir
        if (!user.email_verify_code_created_at) {
            return { canResend: true };
        }

        const secondsSince = parseFloat(user.seconds_since_last_code) || 0;

        // Cooldown süresi geçmişse (3 dakika = 180 saniye), gönderebilir
        if (secondsSince >= cooldownSeconds) {
            return { canResend: true };
        }

        // Cooldown süresi henüz geçmemiş - kalan süreyi hesapla (0 ile cooldownSeconds arasında olmalı)
        if (secondsSince >= 0 && secondsSince < cooldownSeconds) {
            const remainingSeconds = Math.ceil(cooldownSeconds - secondsSince);
            return {
                canResend: false,
                reason: `Lütfen ${remainingSeconds} saniye sonra tekrar deneyin.`,
                remainingSeconds,
            };
        }

        // Eğer secondsSince negatif veya tutarsızsa (veri hatası), göndermeye izin ver
        return { canResend: true };
    }

    async canResendSmsCode(email, cooldownSeconds = 180, client = null) {
        const dbClient = client || pool;
        const query = `
            SELECT sms_verify_code_created_at,
                   EXTRACT(EPOCH FROM (NOW() - sms_verify_code_created_at)) as seconds_since_last_code
            FROM users 
            WHERE email = $1
        `;
        const result = await dbClient.query(query, [email]);

        if (result.rows.length === 0) {
            return { canResend: false, reason: "Kullanıcı bulunamadı." };
        }

        const user = result.rows[0];

        // Eğer hiç kod gönderilmemişse, gönderebilir
        if (!user.sms_verify_code_created_at) {
            return { canResend: true };
        }

        const secondsSince = parseFloat(user.seconds_since_last_code) || 0;

        // Cooldown süresi geçmişse (3 dakika = 180 saniye), gönderebilir
        if (secondsSince >= cooldownSeconds) {
            return { canResend: true };
        }

        // Cooldown süresi henüz geçmemiş - kalan süreyi hesapla (0 ile cooldownSeconds arasında olmalı)
        if (secondsSince >= 0 && secondsSince < cooldownSeconds) {
            const remainingSeconds = Math.ceil(cooldownSeconds - secondsSince);
            return {
                canResend: false,
                reason: `Lütfen ${remainingSeconds} saniye sonra tekrar deneyin.`,
                remainingSeconds,
            };
        }

        // Eğer secondsSince negatif veya tutarsızsa (veri hatası), göndermeye izin ver
        return { canResend: true };
    }

    async deleteUser(userId, client = null) {
        const dbClient = client || pool;
        const query = `DELETE FROM users WHERE id = $1`;
        await dbClient.query(query, [userId]);
    }

    async findPlanByName(planName, client = null) {
        const dbClient = client || pool;
        const query = `SELECT * FROM membership_plans WHERE name = $1`;
        const result = await dbClient.query(query, [planName]);
        return result.rows[0];
    }

    async createSubscription(userId, planId, client = null) {
        const dbClient = client || pool;
        const query = `
            INSERT INTO user_subscriptions (user_id, plan_id, status)
            VALUES ($1, $2, 'active')
            RETURNING id, user_id, plan_id, start_date, status, created_at
        `;
        const result = await dbClient.query(query, [userId, planId]);
        return result.rows[0];
    }
}

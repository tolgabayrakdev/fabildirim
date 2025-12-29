import pool from '../config/database.js';

export default class AuthRepository {

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
        RETURNING first_name, last_name, email, phone, created_at
        `;
        const values = [
            userData.first_name,
            userData.last_name,
            userData.email,
            userData.phone,
            userData.password
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
}
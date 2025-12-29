import pool from '../db/pool.js';

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
        RETURNING *
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
}
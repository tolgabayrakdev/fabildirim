import pool from "../config/database.js";

export default class PaymentRepository {
    async findAll(transactionId, userId, client = null) {
        const dbClient = client || pool;
        const query = `
            SELECT p.*
            FROM payments p
            INNER JOIN debt_transactions dt ON p.transaction_id = dt.id
            WHERE p.transaction_id = $1 AND dt.user_id = $2
            ORDER BY p.payment_date DESC, p.created_at DESC
        `;
        const result = await dbClient.query(query, [transactionId, userId]);
        return result.rows;
    }

    async findById(id, userId, client = null) {
        const dbClient = client || pool;
        const query = `
            SELECT p.*
            FROM payments p
            INNER JOIN debt_transactions dt ON p.transaction_id = dt.id
            WHERE p.id = $1 AND dt.user_id = $2
        `;
        const result = await dbClient.query(query, [id, userId]);
        return result.rows[0];
    }

    async create(paymentData, client = null) {
        const dbClient = client || pool;
        const query = `
            INSERT INTO payments (transaction_id, amount, payment_date, description)
            VALUES ($1, $2::DECIMAL(15,2), $3::DATE, $4)
            RETURNING *
        `;
        const values = [
            paymentData.transaction_id,
            parseFloat(paymentData.amount),
            paymentData.payment_date,
            paymentData.description || null,
        ];
        const result = await dbClient.query(query, values);
        return result.rows[0];
    }

    async delete(id, userId, client = null) {
        const dbClient = client || pool;
        const query = `
            DELETE FROM payments p
            USING debt_transactions dt
            WHERE p.id = $1 
                AND p.transaction_id = dt.id 
                AND dt.user_id = $2
            RETURNING p.id, p.transaction_id, p.amount
        `;
        const result = await dbClient.query(query, [id, userId]);
        return result.rows[0];
    }

    async getTotalPaymentsByTransaction(transactionId, userId, client = null) {
        const dbClient = client || pool;
        const query = `
            SELECT COALESCE(SUM(p.amount), 0) as total_paid
            FROM payments p
            INNER JOIN debt_transactions dt ON p.transaction_id = dt.id
            WHERE p.transaction_id = $1 AND dt.user_id = $2
        `;
        const result = await dbClient.query(query, [transactionId, userId]);
        return parseFloat(result.rows[0].total_paid);
    }
}


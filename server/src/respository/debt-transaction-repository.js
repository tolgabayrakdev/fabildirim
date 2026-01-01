import pool from "../config/database.js";

export default class DebtTransactionRepository {
    async findAll(userId, filters = {}, client = null) {
        const dbClient = client || pool;
        let query = `
            SELECT 
                dt.*,
                c.name as contact_name,
                c.phone as contact_phone,
                c.email as contact_email
            FROM debt_transactions dt
            INNER JOIN contacts c ON dt.contact_id = c.id
            WHERE dt.user_id = $1
        `;
        const values = [userId];
        let paramIndex = 2;

        if (filters.status) {
            query += ` AND dt.status = $${paramIndex}`;
            values.push(filters.status);
            paramIndex++;
        }

        if (filters.type) {
            query += ` AND dt.type = $${paramIndex}`;
            values.push(filters.type);
            paramIndex++;
        }

        query += ` ORDER BY dt.due_date ASC, dt.created_at DESC`;

        const result = await dbClient.query(query, values);
        return result.rows;
    }

    async findById(id, userId, client = null) {
        const dbClient = client || pool;
        const query = `
            SELECT 
                dt.*,
                c.name as contact_name,
                c.phone as contact_phone,
                c.email as contact_email,
                c.address as contact_address,
                c.notes as contact_notes
            FROM debt_transactions dt
            INNER JOIN contacts c ON dt.contact_id = c.id
            WHERE dt.id = $1 AND dt.user_id = $2
        `;
        const result = await dbClient.query(query, [id, userId]);
        return result.rows[0];
    }

    async create(transactionData, client = null) {
        const dbClient = client || pool;
        const query = `
            INSERT INTO debt_transactions (
                user_id, contact_id, type, amount, remaining_amount, 
                due_date, description, status
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `;
        const values = [
            transactionData.user_id,
            transactionData.contact_id,
            transactionData.type,
            transactionData.amount,
            transactionData.remaining_amount,
            transactionData.due_date,
            transactionData.description || null,
            transactionData.status || "active",
        ];
        const result = await dbClient.query(query, values);
        return result.rows[0];
    }

    async update(id, userId, transactionData, client = null) {
        const dbClient = client || pool;
        const query = `
            UPDATE debt_transactions 
            SET 
                contact_id = $1,
                type = $2,
                amount = $3,
                remaining_amount = $4,
                due_date = $5,
                description = $6,
                status = $7,
                updated_at = NOW()
            WHERE id = $8 AND user_id = $9
            RETURNING *
        `;
        const values = [
            transactionData.contact_id,
            transactionData.type,
            transactionData.amount,
            transactionData.remaining_amount,
            transactionData.due_date,
            transactionData.description || null,
            transactionData.status,
            id,
            userId,
        ];
        const result = await dbClient.query(query, values);
        return result.rows[0];
    }

    async updateRemainingAmount(id, userId, remainingAmount, client = null) {
        const dbClient = client || pool;
        const query = `
            UPDATE debt_transactions 
            SET 
                remaining_amount = $1::numeric,
                status = CASE WHEN $1::numeric = 0 THEN 'closed' ELSE status END,
                updated_at = NOW()
            WHERE id = $2 AND user_id = $3
            RETURNING *
        `;
        // remainingAmount'u string olarak gönder - PostgreSQL numeric'e çevirir
        const result = await dbClient.query(query, [String(remainingAmount), id, userId]);
        return result.rows[0];
    }

    async delete(id, userId, client = null) {
        const dbClient = client || pool;
        const query = `
            DELETE FROM debt_transactions 
            WHERE id = $1 AND user_id = $2
            RETURNING id
        `;
        const result = await dbClient.query(query, [id, userId]);
        return result.rows[0];
    }

    async findTodayDueTransactions(userId, client = null) {
        const dbClient = client || pool;
        const query = `
            SELECT 
                dt.*,
                c.name as contact_name,
                c.phone as contact_phone,
                c.email as contact_email
            FROM debt_transactions dt
            INNER JOIN contacts c ON dt.contact_id = c.id
            WHERE dt.user_id = $1 
                AND dt.due_date = CURRENT_DATE
                AND dt.status = 'active'
            ORDER BY dt.type, dt.remaining_amount DESC
        `;
        const result = await dbClient.query(query, [userId]);
        return result.rows;
    }

    async findUpcomingDueTransactions(userId, days, client = null) {
        const dbClient = client || pool;
        // Gelecek tarihi hesapla
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + days);
        const futureDateStr = futureDate.toISOString().split("T")[0]; // YYYY-MM-DD formatı

        const query = `
            SELECT 
                dt.*,
                c.name as contact_name,
                c.phone as contact_phone,
                c.email as contact_email
            FROM debt_transactions dt
            INNER JOIN contacts c ON dt.contact_id = c.id
            WHERE dt.user_id = $1 
                AND dt.due_date >= CURRENT_DATE
                AND dt.due_date <= $2::DATE
                AND dt.status = 'active'
            ORDER BY dt.due_date ASC, dt.type, dt.remaining_amount DESC
        `;
        const result = await dbClient.query(query, [userId, futureDateStr]);
        return result.rows;
    }

    async getTotalReceivable(userId, client = null) {
        const dbClient = client || pool;
        const query = `
            SELECT COALESCE(SUM(remaining_amount), 0) as total_receivable
            FROM debt_transactions 
            WHERE user_id = $1 
                AND type = 'receivable' 
                AND status = 'active'
        `;
        const result = await dbClient.query(query, [userId]);
        return parseFloat(result.rows[0].total_receivable);
    }

    async getTotalDebt(userId, client = null) {
        const dbClient = client || pool;
        const query = `
            SELECT COALESCE(SUM(remaining_amount), 0) as total_debt
            FROM debt_transactions 
            WHERE user_id = $1 
                AND type = 'debt' 
                AND status = 'active'
        `;
        const result = await dbClient.query(query, [userId]);
        return parseFloat(result.rows[0].total_debt);
    }

    async findByContactId(contactId, userId, client = null) {
        const dbClient = client || pool;
        const query = `
            SELECT * FROM debt_transactions 
            WHERE contact_id = $1 AND user_id = $2
            ORDER BY due_date ASC, created_at DESC
        `;
        const result = await dbClient.query(query, [contactId, userId]);
        return result.rows;
    }

    async countByUserId(userId, client = null) {
        const dbClient = client || pool;
        const query = `
            SELECT COUNT(*) as count
            FROM debt_transactions 
            WHERE user_id = $1
        `;
        const result = await dbClient.query(query, [userId]);
        return parseInt(result.rows[0].count, 10);
    }
}


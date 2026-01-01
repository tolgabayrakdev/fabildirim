import pool from "../config/database.js";

export default class ActivityLogRepository {
    async create(userId, logData, client = null) {
        const dbClient = client || pool;
        
        const values = [
            userId,
            logData.category,
            logData.action,
            logData.entity_type,
            logData.entity_id || null,
            logData.description || null,
            logData.metadata ? JSON.stringify(logData.metadata) : null,
        ];
        
        // PostgreSQL JSONB tipine cast et
        const query = `
            INSERT INTO activity_logs (user_id, category, action, entity_type, entity_id, description, metadata)
            VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)
            RETURNING *
        `;
        
        const result = await dbClient.query(query, values);
        return result.rows[0];
    }

    async findByUserId(userId, limit = 5, client = null) {
        const dbClient = client || pool;
        const query = `
            SELECT *
            FROM activity_logs
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT $2
        `;
        const result = await dbClient.query(query, [userId, limit]);
        return result.rows;
    }

    async findAll(userId, filters = {}, client = null) {
        const dbClient = client || pool;
        let query = `
            SELECT *
            FROM activity_logs
            WHERE user_id = $1
        `;
        const values = [userId];
        let paramIndex = 2;

        if (filters.category) {
            query += ` AND category = $${paramIndex}`;
            values.push(filters.category);
            paramIndex++;
        }

        if (filters.action) {
            query += ` AND action = $${paramIndex}`;
            values.push(filters.action);
            paramIndex++;
        }

        query += ` ORDER BY created_at DESC`;
        
        if (filters.limit) {
            query += ` LIMIT $${paramIndex}`;
            values.push(filters.limit);
        }

        const result = await dbClient.query(query, values);
        return result.rows;
    }
}


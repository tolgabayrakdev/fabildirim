import pool from "../config/database.js";

export default class ContactRepository {
    async findAll(userId, client = null) {
        const dbClient = client || pool;
        const query = `
            SELECT * FROM contacts 
            WHERE user_id = $1 
            ORDER BY name ASC
        `;
        const result = await dbClient.query(query, [userId]);
        return result.rows;
    }

    async findById(id, userId, client = null) {
        const dbClient = client || pool;
        const query = `
            SELECT * FROM contacts 
            WHERE id = $1 AND user_id = $2
        `;
        const result = await dbClient.query(query, [id, userId]);
        return result.rows[0];
    }

    async create(contactData, client = null) {
        const dbClient = client || pool;
        const query = `
            INSERT INTO contacts (user_id, name, phone, email, address, notes)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const values = [
            contactData.user_id,
            contactData.name,
            contactData.phone || null,
            contactData.email || null,
            contactData.address || null,
            contactData.notes || null,
        ];
        const result = await dbClient.query(query, values);
        return result.rows[0];
    }

    async update(id, userId, contactData, client = null) {
        const dbClient = client || pool;
        const query = `
            UPDATE contacts 
            SET name = $1, phone = $2, email = $3, address = $4, notes = $5, updated_at = NOW()
            WHERE id = $6 AND user_id = $7
            RETURNING *
        `;
        const values = [
            contactData.name,
            contactData.phone || null,
            contactData.email || null,
            contactData.address || null,
            contactData.notes || null,
            id,
            userId,
        ];
        const result = await dbClient.query(query, values);
        return result.rows[0];
    }

    async delete(id, userId, client = null) {
        const dbClient = client || pool;
        const query = `
            DELETE FROM contacts 
            WHERE id = $1 AND user_id = $2
            RETURNING id
        `;
        const result = await dbClient.query(query, [id, userId]);
        return result.rows[0];
    }
}


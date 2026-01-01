import pool from "../config/database.js";

export default class ReminderRepository {
    async getUserReminderSettings(userId, client = null) {
        const dbClient = client || pool;
        const query = `
            SELECT * FROM user_reminder_settings
            WHERE user_id = $1
        `;
        const result = await dbClient.query(query, [userId]);
        return result.rows[0] || null;
    }

    async createOrUpdateUserReminderSettings(userId, settings, client = null) {
        const dbClient = client || pool;
        const query = `
            INSERT INTO user_reminder_settings (
                user_id, 
                remind_30_days, 
                remind_7_days, 
                remind_3_days, 
                remind_on_due_date,
                updated_at
            )
            VALUES ($1, $2, $3, $4, $5, NOW())
            ON CONFLICT (user_id) 
            DO UPDATE SET
                remind_30_days = EXCLUDED.remind_30_days,
                remind_7_days = EXCLUDED.remind_7_days,
                remind_3_days = EXCLUDED.remind_3_days,
                remind_on_due_date = EXCLUDED.remind_on_due_date,
                updated_at = NOW()
            RETURNING *
        `;
        const result = await dbClient.query(query, [
            userId,
            settings.remind_30_days ?? true,
            settings.remind_7_days ?? true,
            settings.remind_3_days ?? true,
            settings.remind_on_due_date ?? true,
        ]);
        return result.rows[0];
    }

    async getDueTransactionsForReminder(daysBefore, client = null) {
        const dbClient = client || pool;
        const query = `
            SELECT 
                dt.*,
                c.name as contact_name,
                c.phone as contact_phone,
                c.email as contact_email,
                u.first_name as user_first_name,
                u.last_name as user_last_name,
                u.email as user_email
            FROM debt_transactions dt
            INNER JOIN contacts c ON dt.contact_id = c.id
            INNER JOIN users u ON dt.user_id = u.id
            LEFT JOIN user_reminder_settings urs ON dt.user_id = urs.user_id
            WHERE dt.status = 'active'
                AND dt.type = 'receivable'
                AND dt.due_date = CURRENT_DATE + INTERVAL '${daysBefore} days'
                AND dt.remaining_amount > 0
                AND (
                    (${daysBefore} = 30 AND (urs.remind_30_days IS NULL OR urs.remind_30_days = true))
                    OR (${daysBefore} = 7 AND (urs.remind_7_days IS NULL OR urs.remind_7_days = true))
                    OR (${daysBefore} = 3 AND (urs.remind_3_days IS NULL OR urs.remind_3_days = true))
                    OR (${daysBefore} = 0 AND (urs.remind_on_due_date IS NULL OR urs.remind_on_due_date = true))
                )
                AND NOT EXISTS (
                    SELECT 1 FROM reminders r
                    WHERE r.transaction_id = dt.id
                        AND r.reminder_type = $1
                )
        `;
        
        const reminderType = this.getReminderType(daysBefore);
        const result = await dbClient.query(query, [reminderType]);
        return result.rows;
    }

    async createReminder(transactionId, reminderType, client = null) {
        const dbClient = client || pool;
        const query = `
            INSERT INTO reminders (transaction_id, reminder_type, sent_at)
            VALUES ($1, $2, NOW())
            RETURNING *
        `;
        const result = await dbClient.query(query, [transactionId, reminderType]);
        return result.rows[0];
    }

    getReminderType(daysBefore) {
        if (daysBefore === 30) return "30_days_before";
        if (daysBefore === 7) return "7_days_before";
        if (daysBefore === 3) return "3_days_before";
        if (daysBefore === 0) return "due_date";
        return "due_date";
    }

    async getTransactionWithContact(transactionId, userId, client = null) {
        const dbClient = client || pool;
        const query = `
            SELECT 
                dt.*,
                c.name as contact_name,
                c.phone as contact_phone,
                c.email as contact_email,
                u.first_name as user_first_name,
                u.last_name as user_last_name
            FROM debt_transactions dt
            INNER JOIN contacts c ON dt.contact_id = c.id
            INNER JOIN users u ON dt.user_id = u.id
            WHERE dt.id = $1 AND dt.user_id = $2
        `;
        const result = await dbClient.query(query, [transactionId, userId]);
        return result.rows[0] || null;
    }
}


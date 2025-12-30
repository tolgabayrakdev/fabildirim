import pool from "../config/database.js";

export default class SubscriptionRepository {
    async getCurrentSubscription(userId, client = null) {
        const dbClient = client || pool;
        const query = `
            SELECT 
                us.id,
                us.user_id,
                us.plan_id,
                us.start_date,
                us.end_date,
                us.status,
                us.created_at,
                us.updated_at,
                mp.id as plan_id,
                mp.name as plan_name,
                mp.price as plan_price
            FROM user_subscriptions us
            INNER JOIN membership_plans mp ON us.plan_id = mp.id
            WHERE us.user_id = $1 
            AND us.status = 'active'
            ORDER BY us.created_at DESC
            LIMIT 1
        `;
        const result = await dbClient.query(query, [userId]);
        return result.rows[0];
    }

    async getAllPlans(client = null) {
        const dbClient = client || pool;
        const query = `
            SELECT id, name, price, created_at, updated_at
            FROM membership_plans
            ORDER BY price ASC
        `;
        const result = await dbClient.query(query);
        return result.rows;
    }

    async findPlanById(planId, client = null) {
        const dbClient = client || pool;
        const query = `SELECT * FROM membership_plans WHERE id = $1`;
        const result = await dbClient.query(query, [planId]);
        return result.rows[0];
    }

    async findPlanByName(planName, client = null) {
        const dbClient = client || pool;
        const query = `SELECT * FROM membership_plans WHERE name = $1`;
        const result = await dbClient.query(query, [planName]);
        return result.rows[0];
    }

    async deactivateCurrentSubscription(userId, client = null) {
        const dbClient = client || pool;
        const query = `
            UPDATE user_subscriptions
            SET status = 'inactive', updated_at = NOW()
            WHERE user_id = $1 AND status = 'active'
        `;
        await dbClient.query(query, [userId]);
    }

    async createSubscription(userId, planId, client = null) {
        const dbClient = client || pool;
        const query = `
            INSERT INTO user_subscriptions (user_id, plan_id, status)
            VALUES ($1, $2, 'active')
            RETURNING id, user_id, plan_id, start_date, end_date, status, created_at, updated_at
        `;
        const result = await dbClient.query(query, [userId, planId]);
        return result.rows[0];
    }

    async updateSubscription(subscriptionId, planId, client = null) {
        const dbClient = client || pool;
        const query = `
            UPDATE user_subscriptions
            SET plan_id = $1, updated_at = NOW()
            WHERE id = $2
            RETURNING id, user_id, plan_id, start_date, end_date, status, created_at, updated_at
        `;
        const result = await dbClient.query(query, [planId, subscriptionId]);
        return result.rows[0];
    }
}

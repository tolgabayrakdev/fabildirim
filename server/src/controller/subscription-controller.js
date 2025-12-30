import SubscriptionService from "../service/subscription-service.js";

export default class SubscriptionController {
    constructor() {
        this.subscriptionService = new SubscriptionService();
    }

    async getCurrentSubscription(req, res, next) {
        try {
            const userId = req.user.id;
            const subscription = await this.subscriptionService.getCurrentSubscription(userId);
            res.status(200).json({
                success: true,
                data: subscription,
            });
        } catch (error) {
            next(error);
        }
    }

    async getAllPlans(_req, res, next) {
        try {
            const plans = await this.subscriptionService.getAllPlans();
            res.status(200).json({
                success: true,
                data: plans,
            });
        } catch (error) {
            next(error);
        }
    }

    async upgradeSubscription(req, res, next) {
        try {
            const userId = req.user.id;
            const { planId } = req.body;
            const result = await this.subscriptionService.upgradeSubscription(userId, planId);
            res.status(200).json({
                success: true,
                message: result.message,
                data: {
                    id: result.id,
                    plan: result.plan,
                    start_date: result.start_date,
                    end_date: result.end_date,
                    status: result.status,
                },
            });
        } catch (error) {
            next(error);
        }
    }
}

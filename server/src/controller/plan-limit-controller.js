import PlanLimitService from "../service/plan-limit-service.js";

export default class PlanLimitController {
    constructor() {
        this.planLimitService = new PlanLimitService();
    }

    getUsageStats = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const stats = await this.planLimitService.getUsageStats(userId);
            
            res.json({
                success: true,
                data: stats,
            });
        } catch (error) {
            next(error);
        }
    };
}


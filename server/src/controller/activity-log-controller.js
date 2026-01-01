import ActivityLogService from "../service/activity-log-service.js";

export default class ActivityLogController {
    constructor() {
        this.activityLogService = new ActivityLogService();
    }

    async getRecentActivities(req, res, next) {
        try {
            const userId = req.user.id;
            const limit = parseInt(req.query.limit) || 5;
            const activities = await this.activityLogService.getRecentActivities(userId, limit);
            res.status(200).json({
                success: true,
                data: activities,
            });
        } catch (error) {
            next(error);
        }
    }

    async getAllActivities(req, res, next) {
        try {
            const userId = req.user.id;
            const filters = {
                category: req.query.category,
                action: req.query.action,
                limit: req.query.limit ? parseInt(req.query.limit) : undefined,
            };
            const activities = await this.activityLogService.getAllActivities(userId, filters);
            res.status(200).json({
                success: true,
                data: activities,
            });
        } catch (error) {
            next(error);
        }
    }
}


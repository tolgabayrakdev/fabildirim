import DashboardService from "../service/dashboard-service.js";

export default class DashboardController {
    constructor() {
        this.dashboardService = new DashboardService();
    }

    async getDashboard(req, res, next) {
        try {
            const userId = req.user.id;
            const data = await this.dashboardService.getDashboardData(userId);
            res.status(200).json({
                success: true,
                data: data,
            });
        } catch (error) {
            next(error);
        }
    }
}


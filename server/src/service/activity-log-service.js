import ActivityLogRepository from "../respository/activity-log-repository.js";

export default class ActivityLogService {
    constructor() {
        this.activityLogRepository = new ActivityLogRepository();
    }

    async createActivityLog(userId, logData, client = null) {
        return await this.activityLogRepository.create(userId, logData, client);
    }

    async getRecentActivities(userId, limit = 5) {
        const logs = await this.activityLogRepository.findByUserId(userId, limit);
        return logs.map(log => ({
            ...log,
            metadata: log.metadata || null,
        }));
    }

    async getAllActivities(userId, filters = {}) {
        const logs = await this.activityLogRepository.findAll(userId, filters);
        return logs.map(log => ({
            ...log,
            metadata: log.metadata || null,
        }));
    }
}


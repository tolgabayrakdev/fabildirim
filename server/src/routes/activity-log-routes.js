import express from "express";
import ActivityLogController from "../controller/activity-log-controller.js";
import { verifyToken } from "../middleware/auth-middleware.js";

const router = express.Router();
const activityLogController = new ActivityLogController();

router.get(
    "/recent",
    verifyToken,
    activityLogController.getRecentActivities.bind(activityLogController)
);

router.get(
    "/",
    verifyToken,
    activityLogController.getAllActivities.bind(activityLogController)
);

export default router;


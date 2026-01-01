import express from "express";
import DashboardController from "../controller/dashboard-controller.js";
import { verifyToken } from "../middleware/auth-middleware.js";

const router = express.Router();
const dashboardController = new DashboardController();

router.get("/", verifyToken, dashboardController.getDashboard.bind(dashboardController));

export default router;


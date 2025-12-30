import express from "express";
import SubscriptionController from "../controller/subscription-controller.js";
import { schemaValidation } from "../middleware/schema-validation.js";
import { verifyToken } from "../middleware/auth-middleware.js";
import { upgradeSubscriptionSchema } from "../schema/subscription-schema.js";

const router = express.Router();
const subscriptionController = new SubscriptionController();

// Mevcut üyeliği getir
router.get(
    "/current",
    verifyToken,
    subscriptionController.getCurrentSubscription.bind(subscriptionController)
);

// Tüm planları listele
router.get("/plans", subscriptionController.getAllPlans.bind(subscriptionController));

// Üyelik yükseltme
router.post(
    "/upgrade",
    verifyToken,
    schemaValidation(upgradeSubscriptionSchema),
    subscriptionController.upgradeSubscription.bind(subscriptionController)
);

export default router;

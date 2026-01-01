import express from "express";
import PaymentController from "../controller/payment-controller.js";
import { schemaValidation } from "../middleware/schema-validation.js";
import { verifyToken } from "../middleware/auth-middleware.js";
import { createPaymentSchema } from "../schema/payment-schema.js";

const router = express.Router();
const paymentController = new PaymentController();

router.get(
    "/transaction/:transactionId",
    verifyToken,
    paymentController.getAllPayments.bind(paymentController)
);
router.get("/:id", verifyToken, paymentController.getPaymentById.bind(paymentController));
router.post(
    "/",
    verifyToken,
    schemaValidation(createPaymentSchema),
    paymentController.createPayment.bind(paymentController)
);
router.delete("/:id", verifyToken, paymentController.deletePayment.bind(paymentController));

export default router;


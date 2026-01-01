import express from "express";
import DebtTransactionController from "../controller/debt-transaction-controller.js";
import { schemaValidation } from "../middleware/schema-validation.js";
import { verifyToken } from "../middleware/auth-middleware.js";
import {
    createDebtTransactionSchema,
    updateDebtTransactionSchema,
} from "../schema/debt-transaction-schema.js";

const router = express.Router();
const debtTransactionController = new DebtTransactionController();

router.get("/", verifyToken, debtTransactionController.getAllTransactions.bind(debtTransactionController));
router.get(
    "/today-due",
    verifyToken,
    debtTransactionController.getTodayDueTransactions.bind(debtTransactionController)
);
router.get(
    "/upcoming-due",
    verifyToken,
    debtTransactionController.getUpcomingDueTransactions.bind(debtTransactionController)
);
router.get(
    "/total-receivable",
    verifyToken,
    debtTransactionController.getTotalReceivable.bind(debtTransactionController)
);
router.get(
    "/total-debt",
    verifyToken,
    debtTransactionController.getTotalDebt.bind(debtTransactionController)
);
router.get(
    "/contact/:contactId",
    verifyToken,
    debtTransactionController.getTransactionsByContact.bind(debtTransactionController)
);
router.get("/:id", verifyToken, debtTransactionController.getTransactionById.bind(debtTransactionController));
router.post(
    "/",
    verifyToken,
    schemaValidation(createDebtTransactionSchema),
    debtTransactionController.createTransaction.bind(debtTransactionController)
);
router.put(
    "/:id",
    verifyToken,
    schemaValidation(updateDebtTransactionSchema),
    debtTransactionController.updateTransaction.bind(debtTransactionController)
);
router.delete("/:id", verifyToken, debtTransactionController.deleteTransaction.bind(debtTransactionController));

export default router;


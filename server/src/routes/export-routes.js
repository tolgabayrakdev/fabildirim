import express from "express";
import ExportController from "../controller/export-controller.js";
import { verifyToken } from "../middleware/auth-middleware.js";

const router = express.Router();
const exportController = new ExportController();

// Borç/Alacak raporu export
router.get(
    "/debt-transactions",
    verifyToken,
    exportController.exportDebtTransactions
);

// Kişi/Firma raporu export
router.get(
    "/contacts",
    verifyToken,
    exportController.exportContacts
);

// Dashboard raporu export
router.get(
    "/dashboard",
    verifyToken,
    exportController.exportDashboard
);

// Excel (CSV) Export endpoints
router.get(
    "/excel/debt-transactions",
    verifyToken,
    exportController.exportDebtTransactionsToExcel
);

router.get(
    "/excel/contacts",
    verifyToken,
    exportController.exportContactsToExcel
);

router.get(
    "/excel/dashboard",
    verifyToken,
    exportController.exportDashboardToExcel
);

export default router;


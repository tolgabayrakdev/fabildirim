import express from "express";
import ReminderController from "../controller/reminder-controller.js";
import { verifyToken } from "../middleware/auth-middleware.js";
import  { schemaValidation as validate } from "../middleware/schema-validation.js";
import { updateReminderSettingsSchema, sendReminderSchema } from "../schema/reminder-schema.js";

const router = express.Router();
const reminderController = new ReminderController();

// Bildirim ayarlarını getir
router.get("/settings", verifyToken, reminderController.getUserReminderSettings);

// Bildirim ayarlarını güncelle
router.put(
    "/settings",
    verifyToken,
    validate(updateReminderSettingsSchema),
    reminderController.updateUserReminderSettings
);

// Manuel bildirim gönder
router.post(
    "/send/:transaction_id",
    verifyToken,
    validate(sendReminderSchema),
    reminderController.sendManualReminder
);

// Otomatik bildirimleri işle (cron job için)
router.post("/process-automatic", reminderController.processAutomaticReminders);

export default router;


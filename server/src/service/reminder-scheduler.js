import ReminderService from "./reminder-service.js";
import logger from "../config/logger.js";

class ReminderScheduler {
    constructor() {
        this.reminderService = new ReminderService();
        this.intervalId = null;
        this.isRunning = false;
    }

    start() {
        // Her gün saat 09:00'da çalışacak şekilde ayarla
        // Şimdilik her 24 saatte bir çalışacak
        const INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 saat

        // İlk çalıştırmayı hemen yap
        this.processReminders();

        // Sonra her 24 saatte bir çalıştır
        this.intervalId = setInterval(() => {
            this.processReminders();
        }, INTERVAL_MS);

        logger.info("Reminder scheduler started. Will run every 24 hours.");
    }

    async processReminders() {
        if (this.isRunning) {
            logger.warn("Reminder process is already running, skipping...");
            return;
        }

        this.isRunning = true;
        logger.info("Starting automatic reminder process...");

        try {
            const result = await this.reminderService.processAutomaticReminders();
            logger.info(
                `Automatic reminder process completed. Processed: ${result.processed}, Sent: ${result.sent}, Errors: ${result.errors.length}`
            );

            if (result.errors.length > 0) {
                logger.warn("Some errors occurred during reminder process:", result.errors);
            }
        } catch (error) {
            logger.error("Error in automatic reminder process:", error);
        } finally {
            this.isRunning = false;
        }
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            logger.info("Reminder scheduler stopped.");
        }
    }
}

export default ReminderScheduler;


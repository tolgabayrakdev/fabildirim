import ReminderService from "../service/reminder-service.js";
import HttpException from "../exception/http-exception.js";

export default class ReminderController {
    constructor() {
        this.reminderService = new ReminderService();
    }

    getUserReminderSettings = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const settings = await this.reminderService.getUserReminderSettings(userId);
            
            res.json({
                success: true,
                data: settings,
            });
        } catch (error) {
            next(error);
        }
    };

    updateUserReminderSettings = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const { remind_30_days, remind_7_days, remind_3_days, remind_on_due_date } = req.body;

            const settings = await this.reminderService.updateUserReminderSettings(userId, {
                remind_30_days,
                remind_7_days,
                remind_3_days,
                remind_on_due_date,
            });

            res.json({
                success: true,
                message: "Bildirim ayarları başarıyla güncellendi.",
                data: settings,
            });
        } catch (error) {
            next(error);
        }
    };

    sendManualReminder = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const { transaction_id } = req.params;
            const { send_email = true, send_sms = true } = req.body;

            const result = await this.reminderService.sendReminder(transaction_id, userId, {
                sendEmail: send_email,
                sendSms: send_sms,
            });

            if (result.errors.length > 0 && !result.email && !result.sms) {
                throw new HttpException(500, "Bildirim gönderilemedi. Lütfen iletişim bilgilerini kontrol edin.");
            }

            res.json({
                success: true,
                message: "Bildirim başarıyla gönderildi.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    processAutomaticReminders = async (req, res, next) => {
        try {
            // Bu endpoint sadece admin veya cron job tarafından çağrılmalı
            // Şimdilik herkes çağırabilir, production'da auth middleware eklenebilir
            const result = await this.reminderService.processAutomaticReminders();

            res.json({
                success: true,
                message: "Otomatik bildirimler işlendi.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };
}


import ReminderRepository from "../respository/reminder-repository.js";
import EmailService from "../util/send-email.js";
import { sendSms } from "../util/send-sms.js";
import { getReminderTemplate } from "../util/email-templates.js";
import { BRAND_NAME } from "../util/email-templates.js";
import logger from "../config/logger.js";
import HttpException from "../exception/http-exception.js";

export default class ReminderService {
    constructor() {
        this.reminderRepository = new ReminderRepository();
        this.emailService = new EmailService();
    }

    async getUserReminderSettings(userId) {
        let settings = await this.reminderRepository.getUserReminderSettings(userId);
        
        // Eğer ayar yoksa varsayılan ayarları oluştur
        if (!settings) {
            settings = await this.reminderRepository.createOrUpdateUserReminderSettings(userId, {
                remind_30_days: true,
                remind_7_days: true,
                remind_3_days: true,
                remind_on_due_date: true,
            });
        }
        
        return settings;
    }

    async updateUserReminderSettings(userId, settings) {
        return await this.reminderRepository.createOrUpdateUserReminderSettings(userId, settings);
    }

    async sendReminder(transactionId, userId, options = {}) {
        const { sendEmail = true, sendSms: sendSmsOption = true } = options;
        
        const transaction = await this.reminderRepository.getTransactionWithContact(transactionId, userId);
        
        if (!transaction) {
            throw new HttpException(404, "İşlem bulunamadı.");
        }

        if (transaction.status !== "active" || transaction.type !== "receivable") {
            throw new HttpException(400, "Sadece aktif alacak kayıtları için bildirim gönderilebilir.");
        }

        if (parseFloat(transaction.remaining_amount) <= 0) {
            throw new HttpException(400, "Kalan tutarı olmayan işlemler için bildirim gönderilemez.");
        }

        const results = {
            email: null,
            sms: null,
            errors: [],
        };

        // Email gönder
        if (sendEmail && transaction.contact_email) {
            try {
                const emailHtml = getReminderTemplate(
                    transaction.contact_name,
                    parseFloat(transaction.remaining_amount),
                    transaction.due_date,
                    transaction.type
                );
                
                await this.emailService.sendEmail(
                    transaction.contact_email,
                    `${BRAND_NAME} - Ödeme Hatırlatması`,
                    { html: emailHtml }
                );
                
                results.email = { success: true, sentTo: transaction.contact_email };
                logger.info(`Reminder email sent to ${transaction.contact_email} for transaction ${transactionId}`);
            } catch (error) {
                logger.error(`Failed to send reminder email:`, error);
                results.errors.push({ type: "email", error: error.message });
            }
        }

        // SMS gönder
        if (sendSmsOption && transaction.contact_phone) {
            try {
                const formattedAmount = new Intl.NumberFormat("tr-TR", {
                    style: "currency",
                    currency: "TRY",
                    minimumFractionDigits: 2,
                }).format(parseFloat(transaction.remaining_amount));

                const formattedDate = new Date(transaction.due_date).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                });

                const smsMessage = `Sayın ${transaction.contact_name}, ${formattedDate} tarihine kadar ${formattedAmount} tutarındaki ödemenizi rica ederiz. ${BRAND_NAME}`;
                
                await sendSms({
                    msg: smsMessage,
                    no: transaction.contact_phone.replace(/^0/, ""), // Remove leading 0 for NetGSM
                });
                
                results.sms = { success: true, sentTo: transaction.contact_phone };
                logger.info(`Reminder SMS sent to ${transaction.contact_phone} for transaction ${transactionId}`);
            } catch (error) {
                logger.error(`Failed to send reminder SMS:`, error);
                results.errors.push({ type: "sms", error: error.message });
            }
        }

        // Reminder kaydı oluştur
        try {
            await this.reminderRepository.createReminder(transactionId, "due_date");
        } catch (error) {
            logger.error(`Failed to create reminder record:`, error);
        }

        return results;
    }

    async processAutomaticReminders() {
        const reminderDays = [30, 7, 3, 0];
        const results = {
            processed: 0,
            sent: 0,
            errors: [],
        };

        for (const daysBefore of reminderDays) {
            try {
                const transactions = await this.reminderRepository.getDueTransactionsForReminder(daysBefore);
                results.processed += transactions.length;

                for (const transaction of transactions) {
                    try {
                        const reminderType = this.reminderRepository.getReminderType(daysBefore);
                        
                        // Email gönder
                        if (transaction.contact_email) {
                            try {
                                const emailHtml = getReminderTemplate(
                                    transaction.contact_name,
                                    parseFloat(transaction.remaining_amount),
                                    transaction.due_date,
                                    transaction.type
                                );
                                
                                await this.emailService.sendEmail(
                                    transaction.contact_email,
                                    `${BRAND_NAME} - Ödeme Hatırlatması`,
                                    { html: emailHtml }
                                );
                                logger.info(`Auto reminder email sent to ${transaction.contact_email} for transaction ${transaction.id}`);
                            } catch (error) {
                                logger.error(`Failed to send auto reminder email:`, error);
                            }
                        }

                        // SMS gönder
                        if (transaction.contact_phone) {
                            try {
                                const formattedAmount = new Intl.NumberFormat("tr-TR", {
                                    style: "currency",
                                    currency: "TRY",
                                    minimumFractionDigits: 2,
                                }).format(parseFloat(transaction.remaining_amount));

                                const formattedDate = new Date(transaction.due_date).toLocaleDateString("tr-TR", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                });

                                const smsMessage = `Sayın ${transaction.contact_name}, ${formattedDate} tarihine kadar ${formattedAmount} tutarındaki ödemenizi rica ederiz. ${BRAND_NAME}`;
                                
                                await sendSms({
                                    msg: smsMessage,
                                    no: transaction.contact_phone.replace(/^0/, ""),
                                });
                                logger.info(`Auto reminder SMS sent to ${transaction.contact_phone} for transaction ${transaction.id}`);
                            } catch (error) {
                                logger.error(`Failed to send auto reminder SMS:`, error);
                            }
                        }

                        // Reminder kaydı oluştur
                        await this.reminderRepository.createReminder(transaction.id, reminderType);
                        results.sent++;
                    } catch (error) {
                        logger.error(`Error processing reminder for transaction ${transaction.id}:`, error);
                        results.errors.push({ transactionId: transaction.id, error: error.message });
                    }
                }
            } catch (error) {
                logger.error(`Error fetching transactions for ${daysBefore} days before:`, error);
                results.errors.push({ daysBefore, error: error.message });
            }
        }

        return results;
    }
}


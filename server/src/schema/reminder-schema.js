import Joi from "joi";

export const updateReminderSettingsSchema = Joi.object({
    remind_30_days: Joi.boolean().optional(),
    remind_7_days: Joi.boolean().optional(),
    remind_3_days: Joi.boolean().optional(),
    remind_on_due_date: Joi.boolean().optional(),
});

export const sendReminderSchema = Joi.object({
    send_email: Joi.boolean().optional().default(true),
    send_sms: Joi.boolean().optional().default(true),
});


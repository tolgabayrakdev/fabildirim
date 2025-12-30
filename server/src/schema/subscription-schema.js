import Joi from "joi";

export const upgradeSubscriptionSchema = Joi.object({
    planId: Joi.string().uuid().required().messages({
        "string.empty": "Plan ID alanı boş bırakılamaz",
        "string.guid": "Geçerli bir plan ID formatı giriniz",
        "any.required": "Plan ID alanı zorunludur",
    }),
});

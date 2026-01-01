import Joi from "joi";

export const createPaymentSchema = Joi.object({
    transaction_id: Joi.string().uuid().required().messages({
        "string.empty": "Borç/Alacak ID alanı boş bırakılamaz",
        "string.guid": "Geçerli bir UUID giriniz",
        "any.required": "Borç/Alacak ID alanı zorunludur",
    }),
    amount: Joi.number().positive().precision(2).required().messages({
        "number.base": "Ödeme tutarı sayı olmalıdır",
        "number.positive": "Ödeme tutarı pozitif bir sayı olmalıdır",
        "number.precision": "Ödeme tutarı en fazla 2 ondalık basamağa sahip olmalıdır",
        "any.required": "Ödeme tutarı alanı zorunludur",
    }),
    payment_date: Joi.date().iso().required().messages({
        "date.base": "Ödeme tarihi geçerli bir tarih olmalıdır",
        "date.format": "Ödeme tarihi ISO formatında olmalıdır (YYYY-MM-DD)",
        "any.required": "Ödeme tarihi alanı zorunludur",
    }),
    description: Joi.string().max(5000).allow("", null).optional().messages({
        "string.max": "Açıklama en fazla 5000 karakter olabilir",
    }),
});


import Joi from "joi";

export const createDebtTransactionSchema = Joi.object({
    contact_id: Joi.string().uuid().required().messages({
        "string.empty": "Kişi/Firma ID alanı boş bırakılamaz",
        "string.guid": "Geçerli bir UUID giriniz",
        "any.required": "Kişi/Firma ID alanı zorunludur",
    }),
    type: Joi.string().valid("debt", "receivable").required().messages({
        "any.only": "Tip 'debt' (borç) veya 'receivable' (alacak) olmalıdır",
        "any.required": "Tip alanı zorunludur",
    }),
    amount: Joi.number().positive().precision(2).required().messages({
        "number.base": "Tutar sayı olmalıdır",
        "number.positive": "Tutar pozitif bir sayı olmalıdır",
        "number.precision": "Tutar en fazla 2 ondalık basamağa sahip olmalıdır",
        "any.required": "Tutar alanı zorunludur",
    }),
    due_date: Joi.date().iso().required().messages({
        "date.base": "Vade tarihi geçerli bir tarih olmalıdır",
        "date.format": "Vade tarihi ISO formatında olmalıdır (YYYY-MM-DD)",
        "any.required": "Vade tarihi alanı zorunludur",
    }),
    description: Joi.string().max(5000).allow("", null).optional().messages({
        "string.max": "Açıklama en fazla 5000 karakter olabilir",
    }),
});

export const updateDebtTransactionSchema = Joi.object({
    contact_id: Joi.string().uuid().required().messages({
        "string.empty": "Kişi/Firma ID alanı boş bırakılamaz",
        "string.guid": "Geçerli bir UUID giriniz",
        "any.required": "Kişi/Firma ID alanı zorunludur",
    }),
    type: Joi.string().valid("debt", "receivable").required().messages({
        "any.only": "Tip 'debt' (borç) veya 'receivable' (alacak) olmalıdır",
        "any.required": "Tip alanı zorunludur",
    }),
    amount: Joi.number().positive().precision(2).required().messages({
        "number.base": "Tutar sayı olmalıdır",
        "number.positive": "Tutar pozitif bir sayı olmalıdır",
        "number.precision": "Tutar en fazla 2 ondalık basamağa sahip olmalıdır",
        "any.required": "Tutar alanı zorunludur",
    }),
    remaining_amount: Joi.number().min(0).precision(2).required().messages({
        "number.base": "Kalan tutar sayı olmalıdır",
        "number.min": "Kalan tutar 0'dan küçük olamaz",
        "number.precision": "Kalan tutar en fazla 2 ondalık basamağa sahip olmalıdır",
        "any.required": "Kalan tutar alanı zorunludur",
    }),
    due_date: Joi.date().iso().required().messages({
        "date.base": "Vade tarihi geçerli bir tarih olmalıdır",
        "date.format": "Vade tarihi ISO formatında olmalıdır (YYYY-MM-DD)",
        "any.required": "Vade tarihi alanı zorunludur",
    }),
    status: Joi.string().valid("active", "closed").required().messages({
        "any.only": "Durum 'active' veya 'closed' olmalıdır",
        "any.required": "Durum alanı zorunludur",
    }),
    description: Joi.string().max(5000).allow("", null).optional().messages({
        "string.max": "Açıklama en fazla 5000 karakter olabilir",
    }),
});


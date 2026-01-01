import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string().min(1).max(255).required().messages({
        "string.empty": "İsim alanı boş bırakılamaz",
        "string.min": "İsim en az 1 karakter olmalıdır",
        "string.max": "İsim en fazla 255 karakter olabilir",
        "any.required": "İsim alanı zorunludur",
    }),
    phone: Joi.string()
        .pattern(/^(\+90|0)?[5][0-9]{9}$/)
        .allow("", null)
        .optional()
        .messages({
            "string.pattern.base": "Geçerli bir telefon numarası giriniz (örn: 05551234567)",
        }),
    email: Joi.string().email().allow("", null).optional().messages({
        "string.email": "Geçerli bir e-posta adresi giriniz",
    }),
    address: Joi.string().max(1000).allow("", null).optional().messages({
        "string.max": "Adres en fazla 1000 karakter olabilir",
    }),
    notes: Joi.string().max(5000).allow("", null).optional().messages({
        "string.max": "Notlar en fazla 5000 karakter olabilir",
    }),
});

export const updateContactSchema = Joi.object({
    name: Joi.string().min(1).max(255).required().messages({
        "string.empty": "İsim alanı boş bırakılamaz",
        "string.min": "İsim en az 1 karakter olmalıdır",
        "string.max": "İsim en fazla 255 karakter olabilir",
        "any.required": "İsim alanı zorunludur",
    }),
    phone: Joi.string()
        .pattern(/^(\+90|0)?[5][0-9]{9}$/)
        .allow("", null)
        .optional()
        .messages({
            "string.pattern.base": "Geçerli bir telefon numarası giriniz (örn: 05551234567)",
        }),
    email: Joi.string().email().allow("", null).optional().messages({
        "string.email": "Geçerli bir e-posta adresi giriniz",
    }),
    address: Joi.string().max(1000).allow("", null).optional().messages({
        "string.max": "Adres en fazla 1000 karakter olabilir",
    }),
    notes: Joi.string().max(5000).allow("", null).optional().messages({
        "string.max": "Notlar en fazla 5000 karakter olabilir",
    }),
});


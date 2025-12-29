import Joi from "joi";

export const signUpSchema = Joi.object({
    first_name: Joi.string().min(2).max(50).required().messages({
        "string.empty": "Ad alanı boş bırakılamaz",
        "string.min": "Ad en az 2 karakter olmalıdır",
        "string.max": "Ad en fazla 50 karakter olabilir",
        "any.required": "Ad alanı zorunludur",
    }),
    last_name: Joi.string().min(2).max(50).required().messages({
        "string.empty": "Soyad alanı boş bırakılamaz",
        "string.min": "Soyad en az 2 karakter olmalıdır",
        "string.max": "Soyad en fazla 50 karakter olabilir",
        "any.required": "Soyad alanı zorunludur",
    }),
    email: Joi.string().email().required().messages({
        "string.empty": "E-posta alanı boş bırakılamaz",
        "string.email": "Geçerli bir e-posta adresi giriniz",
        "any.required": "E-posta alanı zorunludur",
    }),
    phone: Joi.string()
        .pattern(/^(\+90|0)?[5][0-9]{9}$/)
        .required()
        .messages({
            "string.empty": "Telefon numarası boş bırakılamaz",
            "string.pattern.base": "Geçerli bir telefon numarası giriniz (örn: 05551234567)",
            "any.required": "Telefon numarası zorunludur",
        }),
    password: Joi.string()
        .min(8)
        .max(100)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .required()
        .messages({
            "string.empty": "Şifre alanı boş bırakılamaz",
            "string.min": "Şifre en az 8 karakter olmalıdır",
            "string.max": "Şifre en fazla 100 karakter olabilir",
            "string.pattern.base":
                "Şifre en az bir küçük harf, bir büyük harf ve bir rakam içermelidir",
            "any.required": "Şifre alanı zorunludur",
        }),
});

export const signInSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": "E-posta alanı boş bırakılamaz",
        "string.email": "Geçerli bir e-posta adresi giriniz",
        "any.required": "E-posta alanı zorunludur",
    }),
    password: Joi.string().required().messages({
        "string.empty": "Şifre alanı boş bırakılamaz",
        "any.required": "Şifre alanı zorunludur",
    }),
});

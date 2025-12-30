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

export const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": "E-posta alanı boş bırakılamaz",
        "string.email": "Geçerli bir e-posta adresi giriniz",
        "any.required": "E-posta alanı zorunludur",
    }),
});

export const verifyResetTokenSchema = Joi.object({
    token: Joi.string().required().messages({
        "string.empty": "Token alanı boş bırakılamaz",
        "any.required": "Token alanı zorunludur",
    }),
});

export const resetPasswordSchema = Joi.object({
    token: Joi.string().required().messages({
        "string.empty": "Token alanı boş bırakılamaz",
        "any.required": "Token alanı zorunludur",
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

export const verifyEmailOtpSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": "E-posta alanı boş bırakılamaz",
        "string.email": "Geçerli bir e-posta adresi giriniz",
        "any.required": "E-posta alanı zorunludur",
    }),
    code: Joi.string().length(6).pattern(/^\d+$/).required().messages({
        "string.empty": "Doğrulama kodu boş bırakılamaz",
        "string.length": "Doğrulama kodu 6 haneli olmalıdır",
        "string.pattern.base": "Doğrulama kodu sadece rakamlardan oluşmalıdır",
        "any.required": "Doğrulama kodu zorunludur",
    }),
});

export const verifySmsOtpSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": "E-posta alanı boş bırakılamaz",
        "string.email": "Geçerli bir e-posta adresi giriniz",
        "any.required": "E-posta alanı zorunludur",
    }),
    code: Joi.string().length(6).pattern(/^\d+$/).required().messages({
        "string.empty": "Doğrulama kodu boş bırakılamaz",
        "string.length": "Doğrulama kodu 6 haneli olmalıdır",
        "string.pattern.base": "Doğrulama kodu sadece rakamlardan oluşmalıdır",
        "any.required": "Doğrulama kodu zorunludur",
    }),
});

export const resendEmailVerificationSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": "E-posta alanı boş bırakılamaz",
        "string.email": "Geçerli bir e-posta adresi giriniz",
        "any.required": "E-posta alanı zorunludur",
    }),
});

export const resendSmsVerificationSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": "E-posta alanı boş bırakılamaz",
        "string.email": "Geçerli bir e-posta adresi giriniz",
        "any.required": "E-posta alanı zorunludur",
    }),
});

export const changePasswordSchema = Joi.object({
    currentPassword: Joi.string().required().messages({
        "string.empty": "Mevcut şifre alanı boş bırakılamaz",
        "any.required": "Mevcut şifre alanı zorunludur",
    }),
    newPassword: Joi.string()
        .min(8)
        .max(100)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .required()
        .messages({
            "string.empty": "Yeni şifre alanı boş bırakılamaz",
            "string.min": "Yeni şifre en az 8 karakter olmalıdır",
            "string.max": "Yeni şifre en fazla 100 karakter olabilir",
            "string.pattern.base":
                "Yeni şifre en az bir küçük harf, bir büyük harf ve bir rakam içermelidir",
            "any.required": "Yeni şifre alanı zorunludur",
        }),
});

import rateLimit from "express-rate-limit";

/**
 * Genel API rate limiter
 * Tüm API endpoint'leri için 15 dakikada en fazla 250 istek
 */
export const generalRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: 250, // 15 dakikada en fazla 250 istek
    message: {
        error: "Çok fazla istek gönderildi. Lütfen 15 dakika sonra tekrar deneyin.",
    },
    standardHeaders: true, // `RateLimit-*` headers'ı ekler
    legacyHeaders: false, // `X-RateLimit-*` headers'ını kaldırır
});

/**
 * Auth endpoint'leri için rate limiter
 * Sign in, Sign up ve Forgot password için 15 dakikada en fazla 6 istek
 */
export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: 6, // 15 dakikada en fazla 6 istek
    message: {
        error: "Çok fazla istek gönderildi. Lütfen 15 dakika sonra tekrar deneyin.",
    },
    standardHeaders: true, // `RateLimit-*` headers'ı ekler
    legacyHeaders: false, // `X-RateLimit-*` headers'ını kaldırır
});


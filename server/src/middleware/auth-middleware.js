import jwt from "jsonwebtoken";
import logger from "../config/logger.js";

export const verifyToken = (req, res, next) => {
    try {
        const token =
            req.cookies.access_token || req.headers.authorization?.split(" ")[1] || req.query.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Erişim token'ı bulunamadı. Lütfen giriş yapın.",
            });
        }

        const jwtSecret = process.env.ACCESS_TOKEN_SECRET;
        if (!jwtSecret) {
            logger.error("ACCESS_TOKEN_SECRET environment variable is not set");
            return res.status(500).json({
                success: false,
                message: "Sunucu yapılandırma hatası. Lütfen daha sonra tekrar deneyin.",
            });
        }

        jwt.verify(token, jwtSecret, (error, decoded) => {
            if (error) {
                if (error.name === "TokenExpiredError") {
                    return res.status(401).json({
                        success: false,
                        message: "Token süresi dolmuş. Lütfen tekrar giriş yapın.",
                    });
                }
                if (error.name === "JsonWebTokenError") {
                    return res.status(403).json({
                        success: false,
                        message: "Geçersiz token. Lütfen tekrar giriş yapın.",
                    });
                }
                logger.error("Token verification error:", error);
                return res.status(403).json({
                    success: false,
                    message: "Token doğrulama hatası. Lütfen tekrar giriş yapın.",
                });
            }

            req.user = decoded;
            next();
        });
    } catch (error) {
        logger.error("Unexpected error in token verification:", error);
        res.status(500).json({
            success: false,
            message: "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
        });
    }
};

export const authenticateToken = verifyToken;

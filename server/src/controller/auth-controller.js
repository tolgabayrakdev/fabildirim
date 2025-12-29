import AuthService from "../service/auth-service.js";

export default class AuthController {
    constructor() {
        this.authService = new AuthService();
    }

    async signUp(req, res, next) {
        try {
            const userData = req.body;
            const user = await this.authService.signUp(userData);
            res.status(201).json({
                success: true,
                message: "Kullanıcı başarıyla oluşturuldu.",
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }

    async signIn(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await this.authService.signIn(email, password);

            // Eğer email veya SMS doğrulaması gerekiyorsa
            if (result.emailRequired || result.smsRequired) {
                return res.status(200).json({
                    success: true,
                    message: result.emailRequired
                        ? "E-posta doğrulaması gerekiyor."
                        : "SMS doğrulaması gerekiyor.",
                    data: {
                        emailRequired: result.emailRequired || false,
                        smsRequired: result.smsRequired || false,
                        email: result.email,
                        maskedPhone: result.maskedPhone,
                    },
                });
            }

            // Normal giriş başarılı, token'ları cookie'ye kaydet
            res.cookie("access_token", result.accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });
            res.cookie("refresh_token", result.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });
            res.status(200).json({
                success: true,
                message: "Giriş başarılı.",
            });
        } catch (error) {
            next(error);
        }
    }

    async signOut(_req, res, next) {
        try {
            res.clearCookie("access_token");
            res.clearCookie("refresh_token");
            res.status(200).json({
                success: true,
                message: "Çıkış işlemi başarılıyla gerçekleştirildi.",
            });
        } catch (error) {
            next(error);
        }
    }

    async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            const result = await this.authService.forgotPassword(email);
            res.status(200).json({
                success: true,
                message: result.message,
            });
        } catch (error) {
            next(error);
        }
    }

    async verifyResetToken(req, res, next) {
        try {
            const { token } = req.body;
            const result = await this.authService.verifyResetToken(token);
            res.status(200).json({
                success: true,
                message: result.message,
                data: {
                    valid: result.valid,
                    email: result.email,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    async resetPassword(req, res, next) {
        try {
            const { token, password } = req.body;
            const result = await this.authService.resetPassword(token, password);
            res.status(200).json({
                success: true,
                message: result.message,
            });
        } catch (error) {
            next(error);
        }
    }

    async verifyEmailOtp(req, res, next) {
        try {
            const { email, code } = req.body;
            const result = await this.authService.verifyEmailOtp(email, code);
            
            // Eğer token döndüyse, cookie'ye kaydet
            if (result.accessToken && result.refreshToken) {
                res.cookie("access_token", result.accessToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                });
                res.cookie("refresh_token", result.refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                });
            }

            res.status(200).json({
                success: true,
                message: result.message,
                data: {
                    requiresSmsVerification: result.requiresSmsVerification,
                    maskedPhone: result.maskedPhone,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    async verifySmsOtp(req, res, next) {
        try {
            const { email, code } = req.body;
            const result = await this.authService.verifySmsOtp(email, code);
            
            // Token'ları cookie'ye kaydet
            res.cookie("access_token", result.accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });
            res.cookie("refresh_token", result.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });

            res.status(200).json({
                success: true,
                message: result.message,
            });
        } catch (error) {
            next(error);
        }
    }

    async resendEmailVerification(req, res, next) {
        try {
            const { email } = req.body;
            const result = await this.authService.resendEmailVerification(email);
            res.status(200).json({
                success: true,
                message: result.message,
            });
        } catch (error) {
            next(error);
        }
    }

    async resendSmsVerification(req, res, next) {
        try {
            const { email } = req.body;
            const result = await this.authService.resendSmsVerification(email);
            res.status(200).json({
                success: true,
                message: result.message,
                data: {
                    maskedPhone: result.maskedPhone,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    async getCurrentUser(req, res, next) {
        try {
            const userId = req.user.id;
            const user = await this.authService.getCurrentUser(userId);
            res.status(200).json({
                success: true,
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }

    async changePassword(req, res, next) {
        try {
            const userId = req.user.id;
            const { currentPassword, newPassword } = req.body;
            const result = await this.authService.changePassword(userId, currentPassword, newPassword);
            res.status(200).json({
                success: true,
                message: result.message,
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteAccount(req, res, next) {
        try {
            const userId = req.user.id;
            const result = await this.authService.deleteAccount(userId);
            
            // Cookie'leri temizle
            res.clearCookie("access_token");
            res.clearCookie("refresh_token");
            
            res.status(200).json({
                success: true,
                message: result.message,
            });
        } catch (error) {
            next(error);
        }
    }
}

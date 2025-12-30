import HttpException from "../exception/http-exception.js";
import AuthRepository from "../respository/auth-repository.js";
import SubscriptionRepository from "../respository/subscription-repository.js";
import { generateAccessToken, generateRefreshToken } from "../util/jwt.js";
import { hashPassword, comparePassword } from "../util/password.js";
import EmailService from "../util/send-email.js";
import {
    getEmailVerificationTemplate,
    getWelcomeTemplate,
    getPasswordResetTemplate,
    BRAND_NAME,
} from "../util/email-templates.js";
import { sendSms } from "../util/send-sms.js";
import logger from "../config/logger.js";
import crypto from "crypto";
import TransactionManager from "../util/transaction-manager.js";

export default class AuthService {
    constructor() {
        this.authRepository = new AuthRepository();
        this.subscriptionRepository = new SubscriptionRepository();
        this.emailService = new EmailService();
        this.transactionManager = new TransactionManager();
    }

    async signUp(userData) {
        const emailExists = await this.authRepository.findByEmail(userData.email);
        if (emailExists) {
            throw new HttpException(409, "Bu e-posta adresi zaten kullanılıyor.");
        }

        const phoneExists = await this.authRepository.findByPhone(userData.phone);
        if (phoneExists) {
            throw new HttpException(409, "Bu telefon numarası zaten kullanılıyor.");
        }

        userData.password = await hashPassword(userData.password);

        // Transaction içinde kullanıcı oluştur ve otomatik Normal üyelik tanımla
        const user = await this.transactionManager.execute(async (client) => {
            // Kullanıcı oluştur
            const newUser = await this.authRepository.createUser(userData, client);

            // Normal planı bul
            const normalPlan = await this.authRepository.findPlanByName("Normal", client);
            if (!normalPlan) {
                throw new HttpException(
                    500,
                    "Normal üyelik planı bulunamadı. Lütfen sistem yöneticisi ile iletişime geçin."
                );
            }

            // Otomatik olarak Normal üyelik oluştur
            await this.authRepository.createSubscription(newUser.id, normalPlan.id, client);

            return newUser;
        });

        try {
            const welcomeEmailHtml = getWelcomeTemplate(user.first_name, user.last_name);
            await this.emailService.sendEmail(user.email, "Hoş Geldiniz!", {
                html: welcomeEmailHtml,
            });
        } catch (error) {
            logger.error("Welcome email gönderilemedi:", error);
        }
    }

    async signIn(email, password) {
        const user = await this.authRepository.findByEmail(email);
        if (!user) {
            throw new HttpException(401, "Geçersiz e-posta veya şifre.");
        }

        if (user.is_banned === true) {
            throw new HttpException(
                403,
                "Hesabınız yasaklanmıştır. Lütfen destek ile iletişime geçin."
            );
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new HttpException(401, "Geçersiz e-posta veya şifre.");
        }

        // Backward compatibility: prefer new column if exists; fall back to is_verified
        const isEmailVerified = user.is_email_verified ?? user.is_verified;

        // If email verification required and not yet verified, send OTP and return 202-style payload
        if (!isEmailVerified) {
            const code = String(Math.floor(100000 + Math.random() * 900000)); // 6-digit
            const createdAt = new Date();

            await this.authRepository.updateEmailVerifyCode(user.id, code, createdAt);

            // Send email OTP with professional template
            const emailHtml = getEmailVerificationTemplate(user.first_name, code);
            await this.emailService.sendEmail(user.email, `${BRAND_NAME} E-posta Doğrulama Kodu`, {
                html: emailHtml,
            });

            return { emailRequired: true, email: user.email };
        }

        // If SMS verification required and not yet verified, send OTP and return 202-style payload
        if (user.is_sms_verified === false) {
            const code = String(Math.floor(100000 + Math.random() * 900000)); // 6-digit
            const createdAt = new Date();

            await this.authRepository.updateSmsVerifyCode(user.id, code, createdAt);

            // Send SMS (best-effort; if SMS fails, surface error)
            const phoneNumber = user.phone;
            if (!phoneNumber) {
                throw new HttpException(
                    400,
                    "SMS doğrulaması için kayıtlı bir telefon numarası bulunamadı."
                );
            }
            await sendSms({
                msg: `${BRAND_NAME} doğrulama kodunuz: ${code}. Kod 3 dakika geçerlidir.`,
                no: phoneNumber,
            });

            const maskedPhone = phoneNumber.replace(
                /(\+?\d{0,3})?(\d{2})(\d+)(\d{2})$/,
                (_m, cc = "", p2, mid, p4) => {
                    return `${cc || ""}${p2}${"*".repeat(mid.length)}${p4}`;
                }
            );

            return { smsRequired: true, email: user.email, maskedPhone };
        }

        const accessToken = generateAccessToken({ id: user.id, email: user.email });
        const refreshToken = generateRefreshToken({ id: user.id, email: user.email });
        return { accessToken, refreshToken };
    }

    async forgotPassword(email) {
        const user = await this.authRepository.findByEmail(email);
        if (!user) {
            // Güvenlik için: kullanıcı yoksa bile başarılı mesajı döndür
            return {
                message: "Eğer bu e-posta adresi kayıtlıysa, şifre sıfırlama linki gönderildi.",
            };
        }

        // Güvenli token oluştur
        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 dakika

        // Token'ı veritabanına kaydet
        await this.authRepository.createPasswordResetToken(user.id, token, expiresAt);

        // Reset link oluştur
        const resetLink = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${token}`;

        try {
            // Email gönder
            const emailHtml = getPasswordResetTemplate(resetLink, 15);
            await this.emailService.sendEmail(user.email, `${BRAND_NAME} Şifre Sıfırlama`, {
                html: emailHtml,
            });
        } catch (error) {
            logger.error("Password reset email gönderilemedi:", error);
            throw new HttpException(
                500,
                "E-posta gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
            );
        }

        return { message: "Eğer bu e-posta adresi kayıtlıysa, şifre sıfırlama linki gönderildi." };
    }

    async verifyResetToken(token) {
        const resetToken = await this.authRepository.findPasswordResetToken(token);
        if (!resetToken) {
            throw new HttpException(400, "Geçersiz veya süresi dolmuş token.");
        }

        return {
            valid: true,
            email: resetToken.email,
            message: "Token geçerli.",
        };
    }

    async resetPassword(token, newPassword) {
        // Token'ı doğrula
        const resetToken = await this.authRepository.findPasswordResetToken(token);
        if (!resetToken) {
            throw new HttpException(400, "Geçersiz veya süresi dolmuş token.");
        }

        // Yeni şifreyi hashle
        const hashedPassword = await hashPassword(newPassword);

        // Şifreyi güncelle
        await this.authRepository.updatePassword(resetToken.user_id, hashedPassword);

        // Token'ı sil (tekrar kullanılamaz)
        await this.authRepository.deletePasswordResetToken(token);

        return { message: "Şifreniz başarıyla sıfırlandı." };
    }

    async verifyEmailOtp(email, code) {
        const user = await this.authRepository.verifyEmailOtp(email, code);

        if (!user) {
            throw new HttpException(400, "Geçersiz veya süresi dolmuş doğrulama kodu.");
        }

        // Email'i doğrulanmış olarak işaretle
        await this.authRepository.markEmailAsVerified(user.id);

        // Eğer SMS de doğrulanmışsa, token döndür
        const fullUser = await this.authRepository.findByEmail(email);
        if (fullUser.is_sms_verified === true) {
            const accessToken = generateAccessToken({ id: fullUser.id, email: fullUser.email });
            const refreshToken = generateRefreshToken({ id: fullUser.id, email: fullUser.email });
            return {
                message: "E-posta başarıyla doğrulandı.",
                accessToken,
                refreshToken,
                requiresSmsVerification: false,
            };
        }

        // SMS doğrulaması gerekiyorsa
        if (fullUser.is_sms_verified === false) {
            const smsCode = String(Math.floor(100000 + Math.random() * 900000));
            const createdAt = new Date();
            await this.authRepository.updateSmsVerifyCode(fullUser.id, smsCode, createdAt);

            const phoneNumber = fullUser.phone;
            if (phoneNumber) {
                try {
                    await sendSms({
                        msg: `${BRAND_NAME} doğrulama kodunuz: ${smsCode}. Kod 3 dakika geçerlidir.`,
                        no: phoneNumber,
                    });
                } catch (error) {
                    logger.error("SMS gönderilemedi:", error);
                }
            }

            const maskedPhone = phoneNumber?.replace(
                /(\+?\d{0,3})?(\d{2})(\d+)(\d{2})$/,
                (_m, cc = "", p2, mid, p4) => {
                    return `${cc || ""}${p2}${"*".repeat(mid.length)}${p4}`;
                }
            );

            return {
                message: "E-posta başarıyla doğrulandı. SMS doğrulaması gerekiyor.",
                requiresSmsVerification: true,
                maskedPhone,
            };
        }

        return { message: "E-posta başarıyla doğrulandı." };
    }

    async verifySmsOtp(email, code) {
        const user = await this.authRepository.verifySmsOtp(email, code);

        if (!user) {
            throw new HttpException(400, "Geçersiz veya süresi dolmuş doğrulama kodu.");
        }

        // SMS'i doğrulanmış olarak işaretle
        await this.authRepository.markSmsAsVerified(user.id);

        // Token oluştur ve döndür
        const accessToken = generateAccessToken({ id: user.id, email: user.email });
        const refreshToken = generateRefreshToken({ id: user.id, email: user.email });

        return {
            message: "SMS başarıyla doğrulandı.",
            accessToken,
            refreshToken,
        };
    }

    async resendEmailVerification(email) {
        const user = await this.authRepository.findByEmail(email);
        if (!user) {
            throw new HttpException(404, "Kullanıcı bulunamadı.");
        }

        // Cooldown kontrolü (180 saniye = 3 dakika)
        const cooldownCheck = await this.authRepository.canResendEmailCode(email, 180);
        if (!cooldownCheck.canResend) {
            throw new HttpException(
                429,
                cooldownCheck.reason || "Çok fazla istek. Lütfen daha sonra tekrar deneyin."
            );
        }

        // Yeni kod oluştur
        const code = String(Math.floor(100000 + Math.random() * 900000));
        const createdAt = new Date();
        await this.authRepository.updateEmailVerifyCode(user.id, code, createdAt);

        // Email gönder
        try {
            const emailHtml = getEmailVerificationTemplate(user.first_name, code);
            await this.emailService.sendEmail(user.email, `${BRAND_NAME} E-posta Doğrulama Kodu`, {
                html: emailHtml,
            });
        } catch (error) {
            logger.error("Email gönderilemedi:", error);
            throw new HttpException(
                500,
                "E-posta gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
            );
        }

        return { message: "Doğrulama kodu e-posta adresinize gönderildi." };
    }

    async resendSmsVerification(email) {
        const user = await this.authRepository.findByEmail(email);
        if (!user) {
            throw new HttpException(404, "Kullanıcı bulunamadı.");
        }

        // Cooldown kontrolü (180 saniye = 3 dakika)
        const cooldownCheck = await this.authRepository.canResendSmsCode(email, 180);
        if (!cooldownCheck.canResend) {
            throw new HttpException(
                429,
                cooldownCheck.reason || "Çok fazla istek. Lütfen daha sonra tekrar deneyin."
            );
        }

        const phoneNumber = user.phone;
        if (!phoneNumber) {
            throw new HttpException(
                400,
                "SMS doğrulaması için kayıtlı bir telefon numarası bulunamadı."
            );
        }

        // Yeni kod oluştur
        const code = String(Math.floor(100000 + Math.random() * 900000));
        const createdAt = new Date();
        await this.authRepository.updateSmsVerifyCode(user.id, code, createdAt);

        // SMS gönder
        try {
            await sendSms({
                msg: `${BRAND_NAME} doğrulama kodunuz: ${code}. Kod 3 dakika geçerlidir.`,
                no: phoneNumber,
            });
        } catch (error) {
            logger.error("SMS gönderilemedi:", error);
            throw new HttpException(
                500,
                "SMS gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
            );
        }

        const maskedPhone = phoneNumber.replace(
            /(\+?\d{0,3})?(\d{2})(\d+)(\d{2})$/,
            (_m, cc = "", p2, mid, p4) => {
                return `${cc || ""}${p2}${"*".repeat(mid.length)}${p4}`;
            }
        );

        return {
            message: "Doğrulama kodu telefon numaranıza gönderildi.",
            maskedPhone,
        };
    }

    async getCurrentUser(userId) {
        const user = await this.authRepository.findById(userId);
        if (!user) {
            throw new HttpException(404, "Kullanıcı bulunamadı.");
        }

        // Abonelik bilgisini al
        let subscription = null;
        try {
            const currentSubscription =
                await this.subscriptionRepository.getCurrentSubscription(userId);
            if (currentSubscription) {
                subscription = {
                    id: currentSubscription.id,
                    plan: {
                        id: currentSubscription.plan_id,
                        name: currentSubscription.plan_name,
                        price: currentSubscription.plan_price,
                    },
                    status: currentSubscription.status,
                    start_date: currentSubscription.start_date,
                    end_date: currentSubscription.end_date,
                };
            }
        } catch (error) {
            // Abonelik bulunamazsa null olarak bırak, hata fırlatma
            logger.warn(`Subscription not found for user ${userId}`);
        }

        return {
            id: user.id,
            email: user.email,
            name: `${user.first_name} ${user.last_name}`,
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone,
            created_at: user.created_at,
            subscription: subscription,
        };
    }

    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.authRepository.findById(userId);
        if (!user) {
            throw new HttpException(404, "Kullanıcı bulunamadı.");
        }

        // Mevcut şifreyi doğrula
        const isPasswordValid = await comparePassword(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new HttpException(401, "Mevcut şifre yanlış.");
        }

        // Yeni şifre mevcut şifre ile aynı olamaz
        const isSamePassword = await comparePassword(newPassword, user.password);
        if (isSamePassword) {
            throw new HttpException(400, "Yeni şifre mevcut şifre ile aynı olamaz.");
        }

        const hashedPassword = await hashPassword(newPassword);
        await this.authRepository.updatePassword(userId, hashedPassword);

        return { message: "Şifreniz başarıyla değiştirildi." };
    }

    async deleteAccount(userId) {
        const user = await this.authRepository.findById(userId);
        if (!user) {
            throw new HttpException(404, "Kullanıcı bulunamadı.");
        }

        await this.authRepository.deleteUser(userId);

        return { message: "Hesabınız başarıyla silindi." };
    }
}

import HttpException from "../exception/http-exception.js";
import AuthRepository from "../respository/auth-repository.js";
import { generateAccessToken, generateRefreshToken } from "../util/jwt.js";
import { hashPassword, comparePassword } from "../util/password.js";
import EmailService from "../util/send-email.js";
import { getEmailVerificationTemplate, getWelcomeTemplate, BRAND_NAME } from "../util/email-templates.js";
import { sendSms } from "../util/send-sms.js";
import logger from "../config/logger.js";

export default class AuthService {
    constructor() {
        this.authRepository = new AuthRepository();
        this.emailService = new EmailService();
    }

    async signUp(userData) {
        const emailExists = await this.authRepository.findByEmail(userData.email);
        if (emailExists) {
            throw new HttpException(409, 'Bu e-posta adresi zaten kullanılıyor.');
        }

        const phoneExists = await this.authRepository.findByPhone(userData.phone);
        if (phoneExists) {
            throw new HttpException(409, 'Bu telefon numarası zaten kullanılıyor.');
        }

        userData.password = await hashPassword(userData.password);
        const user = await this.authRepository.createUser(userData);

        try {
            const welcomeEmailHtml = getWelcomeTemplate(user.first_name, user.last_name);
            await this.emailService.sendEmail(user.email, 'Hoş Geldiniz!', { html: welcomeEmailHtml });
        } catch (error) {
            // Email gönderme hatası kayıt işlemini engellemez
            logger.error('Welcome email gönderilemedi:', error);
        }
    }

    async signIn(email, password) {
        const user = await this.authRepository.findByEmail(email);
        if (!user) {
            throw new HttpException(401, 'Geçersiz e-posta veya şifre.');
        }

        if (user.is_banned === true) {
            throw new HttpException(403, 'Hesabınız yasaklanmıştır. Lütfen destek ile iletişime geçin.');
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new HttpException(401, 'Geçersiz e-posta veya şifre.');
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
            await this.emailService.sendEmail(
                user.email,
                `${BRAND_NAME} E-posta Doğrulama Kodu`,
                { html: emailHtml }
            );

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
                throw new HttpException(400, 'SMS doğrulaması için kayıtlı bir telefon numarası bulunamadı.');
            }
            await sendSms({ 
                msg: `${BRAND_NAME} doğrulama kodunuz: ${code}. Kod 3 dakika geçerlidir.`, 
                no: phoneNumber 
            });

            const maskedPhone = phoneNumber.replace(/(\+?\d{0,3})?(\d{2})(\d+)(\d{2})$/, (_m, cc = '', p2, mid, p4) => {
                return `${cc || ''}${p2}${'*'.repeat(mid.length)}${p4}`;
            });

            return { smsRequired: true, email: user.email, maskedPhone };
        }

        const accessToken = generateAccessToken({ id: user.id, email: user.email });
        const refreshToken = generateRefreshToken({ id: user.id, email: user.email });
        return { accessToken, refreshToken };
    }




}
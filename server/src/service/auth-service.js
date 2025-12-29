import HttpException from "../exception/http-exception.js";
import AuthRepository from "../respository/auth-repository.js";
import { hashPassword } from "../util/password.js";


export default class AuthService {
    constructor() {
        this.authRepository = new AuthRepository();
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
            const welcomeEmailHtml = getEmailVerificationTemplate(user.firstName, user.last_name);
            await sendEmail(user.email, 'Hoş Geldiniz!', welcomeEmailHtml);
        } catch (error) {
            throw error;
        }
    }




}
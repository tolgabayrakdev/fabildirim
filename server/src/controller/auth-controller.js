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

            res.cookie("access_token", result.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "none",
            });
            res.cookie("refresh_token", result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
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
}

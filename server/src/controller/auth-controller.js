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
                message: 'Kullanıcı başarıyla oluşturuldu.',
                data: user
            })
        } catch (error) {
            next(error);
        }
    }
}
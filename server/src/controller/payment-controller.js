import PaymentService from "../service/payment-service.js";

export default class PaymentController {
    constructor() {
        this.paymentService = new PaymentService();
    }

    async getAllPayments(req, res, next) {
        try {
            const userId = req.user.id;
            const { transactionId } = req.params;
            const payments = await this.paymentService.getAllPayments(transactionId, userId);
            res.status(200).json({
                success: true,
                data: payments,
            });
        } catch (error) {
            next(error);
        }
    }

    async getPaymentById(req, res, next) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const payment = await this.paymentService.getPaymentById(id, userId);
            res.status(200).json({
                success: true,
                data: payment,
            });
        } catch (error) {
            next(error);
        }
    }

    async createPayment(req, res, next) {
        try {
            const userId = req.user.id;
            const paymentData = req.body;
            const payment = await this.paymentService.createPayment(userId, paymentData);
            res.status(201).json({
                success: true,
                message: "Ödeme kaydı başarıyla oluşturuldu.",
                data: payment,
            });
        } catch (error) {
            console.log(error);
            
            next(error);
        }
    }

    async deletePayment(req, res, next) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const result = await this.paymentService.deletePayment(id, userId);
            res.status(200).json({
                success: true,
                message: result.message,
            });
        } catch (error) {
            next(error);
        }
    }
}


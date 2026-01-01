import HttpException from "../exception/http-exception.js";
import PaymentRepository from "../respository/payment-repository.js";
import DebtTransactionRepository from "../respository/debt-transaction-repository.js";
import TransactionManager from "../util/transaction-manager.js";
import ActivityLogService from "./activity-log-service.js";

export default class PaymentService {
    constructor() {
        this.paymentRepository = new PaymentRepository();
        this.debtTransactionRepository = new DebtTransactionRepository();
        this.transactionManager = new TransactionManager();
        this.activityLogService = new ActivityLogService();
    }

    async getAllPayments(transactionId, userId) {
        // Transaction'ın kullanıcıya ait olduğunu kontrol et
        const transaction = await this.debtTransactionRepository.findById(transactionId, userId);
        if (!transaction) {
            throw new HttpException(404, "Borç/Alacak kaydı bulunamadı.");
        }

        const payments = await this.paymentRepository.findAll(transactionId, userId);
        return payments;
    }

    async getPaymentById(id, userId) {
        const payment = await this.paymentRepository.findById(id, userId);
        if (!payment) {
            throw new HttpException(404, "Ödeme kaydı bulunamadı.");
        }
        return payment;
    }

    async createPayment(userId, paymentData) {
        // Transaction'ın kullanıcıya ait olduğunu kontrol et
        const transaction = await this.debtTransactionRepository.findById(
            paymentData.transaction_id,
            userId
        );
        if (!transaction) {
            throw new HttpException(404, "Borç/Alacak kaydı bulunamadı.");
        }

        if (transaction.status === "closed") {
            throw new HttpException(400, "Kapalı bir borç/alacak kaydına ödeme eklenemez.");
        }

        // Transaction içinde ödeme oluştur ve remaining_amount'u güncelle
        const result = await this.transactionManager.execute(async (client) => {
            // Ödeme oluştur
            const payment = await this.paymentRepository.create(paymentData, client);

            // Toplam ödemeleri hesapla
            const totalPaid = await this.paymentRepository.getTotalPaymentsByTransaction(
                paymentData.transaction_id,
                userId,
                client
            );

            // Kalan tutarı hesapla
            const remainingAmount = parseFloat(transaction.amount) - totalPaid;

            // Remaining amount'u güncelle (0 veya negatif olamaz)
            const newRemainingAmount = Math.max(0, remainingAmount);

            // Transaction'ın remaining_amount'unu güncelle (status otomatik olarak güncellenir)
            await this.debtTransactionRepository.updateRemainingAmount(
                paymentData.transaction_id,
                userId,
                newRemainingAmount,
                client
            );

            return payment;
        });

        // Activity log kaydet
        await this.activityLogService.createActivityLog(userId, {
            category: "payment",
            action: "created",
            entity_type: "payment",
            entity_id: result.id,
            description: `Yeni ödeme eklendi: ${parseFloat(result.amount).toFixed(2)} ₺`,
            metadata: {
                amount: result.amount,
                payment_date: result.payment_date,
                transaction_type: transaction.type,
                contact_name: transaction.contact_name || "Bilinmiyor",
            },
        });

        return result;
    }

    async deletePayment(id, userId) {
        const payment = await this.paymentRepository.findById(id, userId);
        if (!payment) {
            throw new HttpException(404, "Ödeme kaydı bulunamadı.");
        }

        const transaction = await this.debtTransactionRepository.findById(
            payment.transaction_id,
            userId
        );
        if (!transaction) {
            throw new HttpException(404, "Borç/Alacak kaydı bulunamadı.");
        }

        // Transaction içinde ödemeyi sil ve remaining_amount'u güncelle
        await this.transactionManager.execute(async (client) => {
            // Ödemeyi sil
            await this.paymentRepository.delete(id, userId, client);

            // Toplam ödemeleri yeniden hesapla
            const totalPaid = await this.paymentRepository.getTotalPaymentsByTransaction(
                payment.transaction_id,
                userId,
                client
            );

            // Kalan tutarı hesapla
            const remainingAmount = parseFloat(transaction.amount) - totalPaid;
            const newRemainingAmount = Math.max(0, remainingAmount);

            // Transaction'ın remaining_amount'unu güncelle
            await this.debtTransactionRepository.updateRemainingAmount(
                payment.transaction_id,
                userId,
                newRemainingAmount,
                client
            );
        });

        return { message: "Ödeme kaydı başarıyla silindi." };
    }
}


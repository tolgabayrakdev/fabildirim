import DebtTransactionService from "../service/debt-transaction-service.js";

export default class DebtTransactionController {
    constructor() {
        this.debtTransactionService = new DebtTransactionService();
    }

    async getAllTransactions(req, res, next) {
        try {
            const userId = req.user.id;
            const filters = {
                status: req.query.status,
                type: req.query.type,
            };
            const transactions = await this.debtTransactionService.getAllTransactions(userId, filters);
            res.status(200).json({
                success: true,
                data: transactions,
            });
        } catch (error) {
            next(error);
        }
    }

    async getTransactionById(req, res, next) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const transaction = await this.debtTransactionService.getTransactionById(id, userId);
            res.status(200).json({
                success: true,
                data: transaction,
            });
        } catch (error) {
            next(error);
        }
    }

    async createTransaction(req, res, next) {
        try {
            const userId = req.user.id;
            const transactionData = req.body;
            const transaction = await this.debtTransactionService.createTransaction(userId, transactionData);
            res.status(201).json({
                success: true,
                message: "Borç/Alacak kaydı başarıyla oluşturuldu.",
                data: transaction,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateTransaction(req, res, next) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const transactionData = req.body;
            const transaction = await this.debtTransactionService.updateTransaction(
                id,
                userId,
                transactionData
            );
            res.status(200).json({
                success: true,
                message: "Borç/Alacak kaydı başarıyla güncellendi.",
                data: transaction,
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteTransaction(req, res, next) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const result = await this.debtTransactionService.deleteTransaction(id, userId);
            res.status(200).json({
                success: true,
                message: result.message,
            });
        } catch (error) {
            next(error);
        }
    }

    async getTodayDueTransactions(req, res, next) {
        try {
            const userId = req.user.id;
            const transactions = await this.debtTransactionService.getTodayDueTransactions(userId);
            res.status(200).json({
                success: true,
                data: transactions,
            });
        } catch (error) {
            next(error);
        }
    }

    async getUpcomingDueTransactions(req, res, next) {
        try {
            const userId = req.user.id;
            const days = parseInt(req.query.days) || 7;
            
            // Geçerli gün sayısı kontrolü (7, 15, 30)
            const validDays = [7, 15, 30];
            if (!validDays.includes(days)) {
                return res.status(400).json({
                    success: false,
                    message: "Geçersiz gün sayısı. 7, 15 veya 30 gün seçebilirsiniz.",
                });
            }

            const transactions = await this.debtTransactionService.getUpcomingDueTransactions(userId, days);
            res.status(200).json({
                success: true,
                data: transactions,
            });
        } catch (error) {
            next(error);
        }
    }

    async getTotalReceivable(req, res, next) {
        try {
            const userId = req.user.id;
            const result = await this.debtTransactionService.getTotalReceivable(userId);
            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    async getTotalDebt(req, res, next) {
        try {
            const userId = req.user.id;
            const result = await this.debtTransactionService.getTotalDebt(userId);
            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    async getTransactionsByContact(req, res, next) {
        try {
            const userId = req.user.id;
            const { contactId } = req.params;
            const transactions = await this.debtTransactionService.getTransactionsByContact(
                contactId,
                userId
            );
            res.status(200).json({
                success: true,
                data: transactions,
            });
        } catch (error) {
            next(error);
        }
    }
}


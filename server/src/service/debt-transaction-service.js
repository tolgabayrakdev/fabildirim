import HttpException from "../exception/http-exception.js";
import DebtTransactionRepository from "../respository/debt-transaction-repository.js";
import ContactRepository from "../respository/contact-repository.js";
import ActivityLogService from "./activity-log-service.js";

export default class DebtTransactionService {
    constructor() {
        this.debtTransactionRepository = new DebtTransactionRepository();
        this.contactRepository = new ContactRepository();
        this.activityLogService = new ActivityLogService();
    }

    async getAllTransactions(userId, filters = {}) {
        const transactions = await this.debtTransactionRepository.findAll(userId, filters);
        return transactions;
    }

    async getTransactionById(id, userId) {
        const transaction = await this.debtTransactionRepository.findById(id, userId);
        if (!transaction) {
            throw new HttpException(404, "Borç/Alacak kaydı bulunamadı.");
        }
        return transaction;
    }

    async createTransaction(userId, transactionData) {
        // Contact'ın kullanıcıya ait olduğunu kontrol et
        const contact = await this.contactRepository.findById(transactionData.contact_id, userId);
        if (!contact) {
            throw new HttpException(404, "Kişi/Firma bulunamadı.");
        }

        const transaction = await this.debtTransactionRepository.create({
            ...transactionData,
            user_id: userId,
            remaining_amount: transactionData.amount, // İlk oluşturulduğunda kalan tutar = toplam tutar
        });

        // Activity log kaydet
        const typeLabel = transaction.type === "receivable" ? "Alacak" : "Borç";
        await this.activityLogService.createActivityLog(userId, {
            category: "debt_transaction",
            action: "created",
            entity_type: "debt_transaction",
            entity_id: transaction.id,
            description: `Yeni ${typeLabel.toLowerCase()} kaydı eklendi`,
            metadata: {
                type: transaction.type,
                type_label: typeLabel,
                amount: transaction.amount,
                contact_name: contact.name,
            },
        });

        return transaction;
    }

    async updateTransaction(id, userId, transactionData) {
        const existingTransaction = await this.debtTransactionRepository.findById(id, userId);
        if (!existingTransaction) {
            throw new HttpException(404, "Borç/Alacak kaydı bulunamadı.");
        }

        // Contact'ın kullanıcıya ait olduğunu kontrol et
        const contact = await this.contactRepository.findById(transactionData.contact_id, userId);
        if (!contact) {
            throw new HttpException(404, "Kişi/Firma bulunamadı.");
        }

        // Kalan tutar kontrolü: toplam tutardan fazla olamaz
        if (parseFloat(transactionData.remaining_amount) > parseFloat(transactionData.amount)) {
            throw new HttpException(
                400,
                "Kalan tutar toplam tutardan fazla olamaz."
            );
        }

        const updatedTransaction = await this.debtTransactionRepository.update(
            id,
            userId,
            transactionData
        );

        return updatedTransaction;
    }

    async deleteTransaction(id, userId) {
        const existingTransaction = await this.debtTransactionRepository.findById(id, userId);
        if (!existingTransaction) {
            throw new HttpException(404, "Borç/Alacak kaydı bulunamadı.");
        }

        await this.debtTransactionRepository.delete(id, userId);
        return { message: "Borç/Alacak kaydı başarıyla silindi." };
    }

    async getTodayDueTransactions(userId) {
        const transactions = await this.debtTransactionRepository.findTodayDueTransactions(userId);
        return transactions;
    }

    async getUpcomingDueTransactions(userId, days) {
        const transactions = await this.debtTransactionRepository.findUpcomingDueTransactions(userId, days);
        return transactions;
    }

    async getTotalReceivable(userId) {
        const total = await this.debtTransactionRepository.getTotalReceivable(userId);
        return { total_receivable: total };
    }

    async getTotalDebt(userId) {
        const total = await this.debtTransactionRepository.getTotalDebt(userId);
        return { total_debt: total };
    }

    async getTransactionsByContact(contactId, userId) {
        // Contact'ın kullanıcıya ait olduğunu kontrol et
        const contact = await this.contactRepository.findById(contactId, userId);
        if (!contact) {
            throw new HttpException(404, "Kişi/Firma bulunamadı.");
        }

        const transactions = await this.debtTransactionRepository.findByContactId(contactId, userId);
        return transactions;
    }
}


import DebtTransactionRepository from "../respository/debt-transaction-repository.js";

export default class DashboardService {
    constructor() {
        this.debtTransactionRepository = new DebtTransactionRepository();
    }

    async getDashboardData(userId) {
        // Bugün vadesi gelen işlemler
        const todayDueTransactions = await this.debtTransactionRepository.findTodayDueTransactions(userId);

        // Toplam alacak (receivable)
        const totalReceivable = await this.debtTransactionRepository.getTotalReceivable(userId);

        // Toplam borç (debt)
        const totalDebt = await this.debtTransactionRepository.getTotalDebt(userId);

        // Net pozisyon (alacak - borç)
        const netPosition = totalReceivable - totalDebt;

        return {
            today_due: todayDueTransactions,
            total_receivable: totalReceivable,
            total_debt: totalDebt,
            net_position: netPosition,
        };
    }
}


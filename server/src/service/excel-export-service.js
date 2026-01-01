import HttpException from "../exception/http-exception.js";
import SubscriptionRepository from "../respository/subscription-repository.js";
import ContactRepository from "../respository/contact-repository.js";
import DebtTransactionRepository from "../respository/debt-transaction-repository.js";
import DashboardService from "./dashboard-service.js";

export default class ExcelExportService {
    constructor() {
        this.subscriptionRepository = new SubscriptionRepository();
        this.contactRepository = new ContactRepository();
        this.debtTransactionRepository = new DebtTransactionRepository();
        this.dashboardService = new DashboardService();
    }

    async checkProPlanAccess(userId) {
        const subscription = await this.subscriptionRepository.getCurrentSubscription(userId);
        if (!subscription) {
            throw new HttpException(403, "Pro plan özelliği. Lütfen Pro plana yükseltin.");
        }
        
        if (subscription.plan_name !== "Pro") {
            throw new HttpException(
                403,
                "Bu özellik sadece Pro plan kullanıcıları için kullanılabilir. Lütfen Pro plana yükseltin."
            );
        }
        
        return true;
    }

    // CSV formatında Excel uyumlu export
    async exportDebtTransactionsToCSV(userId, filters = {}) {
        await this.checkProPlanAccess(userId);
        
        const transactions = await this.debtTransactionRepository.findAll(userId, filters);
        
        // CSV başlıkları
        const headers = [
            "Kişi/Firma",
            "Tip",
            "Toplam Tutar",
            "Kalan Tutar",
            "Vade Tarihi",
            "Durum",
            "Açıklama",
        ];
        
        // CSV satırları
        const rows = transactions.map((t) => [
            t.contact_name || "",
            t.type === "receivable" ? "Alacak" : "Borç",
            parseFloat(t.amount).toFixed(2),
            parseFloat(t.remaining_amount).toFixed(2),
            t.due_date,
            t.status === "active" ? "Aktif" : "Kapalı",
            t.description || "",
        ]);
        
        // CSV oluştur (BOM ekle Excel'de Türkçe karakterler için)
        const csvContent = [
            "\ufeff", // UTF-8 BOM
            headers.join(","),
            ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
        ].join("\n");
        
        return csvContent;
    }

    async exportContactsToCSV(userId) {
        await this.checkProPlanAccess(userId);
        
        const contacts = await this.contactRepository.findAll(userId);
        
        const headers = ["Ad", "Telefon", "E-posta", "Adres", "Notlar"];
        
        const rows = contacts.map((c) => [
            c.name || "",
            c.phone || "",
            c.email || "",
            c.address || "",
            c.notes || "",
        ]);
        
        const csvContent = [
            "\ufeff", // UTF-8 BOM
            headers.join(","),
            ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
        ].join("\n");
        
        return csvContent;
    }

    async exportDashboardToCSV(userId, upcomingDays = 7) {
        await this.checkProPlanAccess(userId);
        
        const dashboardData = await this.dashboardService.getDashboardData(userId);
        
        const allTransactions = await this.debtTransactionRepository.findAll(userId, {
            status: "active",
        });
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const upcomingDate = new Date();
        upcomingDate.setDate(upcomingDate.getDate() + upcomingDays);
        upcomingDate.setHours(23, 59, 59, 999);
        
        const upcomingDue = allTransactions.filter((t) => {
            const dueDate = new Date(t.due_date);
            return dueDate >= today && dueDate <= upcomingDate;
        });
        
        // Özet bölümü
        const summaryRows = [
            ["ÖZET"],
            ["Toplam Alacak", dashboardData.total_receivable.toFixed(2)],
            ["Toplam Borç", dashboardData.total_debt.toFixed(2)],
            ["Net Pozisyon", dashboardData.net_position.toFixed(2)],
            [],
            ["BUGÜN VADESİ GELENLER"],
            ["Kişi/Firma", "Tip", "Kalan Tutar", "Vade Tarihi"],
            ...(dashboardData.today_due || []).map((t) => [
                t.contact_name || "",
                t.type === "receivable" ? "Alacak" : "Borç",
                parseFloat(t.remaining_amount).toFixed(2),
                t.due_date,
            ]),
            [],
            [`VADESİ YAKLAŞANLAR (${upcomingDays} gün)`],
            ["Kişi/Firma", "Tip", "Kalan Tutar", "Vade Tarihi"],
            ...upcomingDue.map((t) => [
                t.contact_name || "",
                t.type === "receivable" ? "Alacak" : "Borç",
                parseFloat(t.remaining_amount).toFixed(2),
                t.due_date,
            ]),
        ];
        
        const csvContent = [
            "\ufeff", // UTF-8 BOM
            ...summaryRows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
        ].join("\n");
        
        return csvContent;
    }
}


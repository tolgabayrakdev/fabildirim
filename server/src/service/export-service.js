import HttpException from "../exception/http-exception.js";
import SubscriptionRepository from "../respository/subscription-repository.js";
import ContactRepository from "../respository/contact-repository.js";
import DebtTransactionRepository from "../respository/debt-transaction-repository.js";
import DashboardService from "./dashboard-service.js";
import {
    getDebtTransactionReportTemplate,
    getContactReportTemplate,
    getDashboardReportTemplate,
} from "../util/pdf-templates.js";

export default class ExportService {
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

    async generateDebtTransactionReport(userId, filters = {}) {
        await this.checkProPlanAccess(userId);
        
        const transactions = await this.debtTransactionRepository.findAll(userId, filters);
        
        // Özet hesapla
        const totalReceivable = transactions
            .filter((t) => t.type === "receivable" && t.status === "active")
            .reduce((sum, t) => sum + parseFloat(t.remaining_amount), 0);
        
        const totalDebt = transactions
            .filter((t) => t.type === "debt" && t.status === "active")
            .reduce((sum, t) => sum + parseFloat(t.remaining_amount), 0);
        
        const summary = {
            total_receivable: totalReceivable,
            total_debt: totalDebt,
            net_position: totalReceivable - totalDebt,
        };
        
        const html = getDebtTransactionReportTemplate({
            summary,
            transactions,
        });
        
        return html;
    }

    async generateContactReport(userId) {
        await this.checkProPlanAccess(userId);
        
        const contacts = await this.contactRepository.findAll(userId);
        
        const html = getContactReportTemplate({
            contacts,
        });
        
        return html;
    }

    async generateDashboardReport(userId, upcomingDays = 7) {
        await this.checkProPlanAccess(userId);
        
        const dashboardData = await this.dashboardService.getDashboardData(userId);
        
        // Vadesi yaklaşan işlemleri al
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
        
        const html = getDashboardReportTemplate({
            summary: {
                total_receivable: dashboardData.total_receivable,
                total_debt: dashboardData.total_debt,
                net_position: dashboardData.net_position,
            },
            todayDue: dashboardData.today_due || [],
            upcomingDue,
        });
        
        return html;
    }
}


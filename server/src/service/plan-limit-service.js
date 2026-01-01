import SubscriptionRepository from "../respository/subscription-repository.js";
import ContactRepository from "../respository/contact-repository.js";
import DebtTransactionRepository from "../respository/debt-transaction-repository.js";
import HttpException from "../exception/http-exception.js";

// Plan limitleri
const PLAN_LIMITS = {
    Normal: {
        maxContacts: 10,
        maxDebtTransactions: 50,
    },
    Pro: {
        maxContacts: null, // Sınırsız
        maxDebtTransactions: null, // Sınırsız
    },
};

export default class PlanLimitService {
    constructor() {
        this.subscriptionRepository = new SubscriptionRepository();
        this.contactRepository = new ContactRepository();
        this.debtTransactionRepository = new DebtTransactionRepository();
    }

    async getUserPlan(userId) {
        const subscription = await this.subscriptionRepository.getCurrentSubscription(userId);
        if (!subscription) {
            // Varsayılan olarak Normal plan
            return "Normal";
        }
        return subscription.plan_name || "Normal";
    }

    async checkContactLimit(userId) {
        const planName = await this.getUserPlan(userId);
        const limits = PLAN_LIMITS[planName] || PLAN_LIMITS.Normal;

        // Pro plan sınırsız
        if (limits.maxContacts === null) {
            return { allowed: true, remaining: null, limit: null };
        }

        const contactCount = await this.contactRepository.countByUserId(userId);
        const remaining = limits.maxContacts - contactCount;

        return {
            allowed: remaining > 0,
            remaining: Math.max(0, remaining),
            limit: limits.maxContacts,
            used: contactCount,
        };
    }

    async checkDebtTransactionLimit(userId) {
        const planName = await this.getUserPlan(userId);
        const limits = PLAN_LIMITS[planName] || PLAN_LIMITS.Normal;

        // Pro plan sınırsız
        if (limits.maxDebtTransactions === null) {
            return { allowed: true, remaining: null, limit: null };
        }

        const transactionCount = await this.debtTransactionRepository.countByUserId(userId);
        const remaining = limits.maxDebtTransactions - transactionCount;

        return {
            allowed: remaining > 0,
            remaining: Math.max(0, remaining),
            limit: limits.maxDebtTransactions,
            used: transactionCount,
        };
    }

    async validateContactCreation(userId) {
        const limitCheck = await this.checkContactLimit(userId);
        if (!limitCheck.allowed) {
            throw new HttpException(
                403,
                `Kişi/Firma limitine ulaştınız. Normal plan için maksimum ${limitCheck.limit} kişi/firma ekleyebilirsiniz. Pro plana yükselterek sınırsız ekleyebilirsiniz.`
            );
        }
        return limitCheck;
    }

    async validateDebtTransactionCreation(userId) {
        const limitCheck = await this.checkDebtTransactionLimit(userId);
        if (!limitCheck.allowed) {
            throw new HttpException(
                403,
                `Borç/Alacak kaydı limitine ulaştınız. Normal plan için maksimum ${limitCheck.limit} kayıt ekleyebilirsiniz. Pro plana yükselterek sınırsız ekleyebilirsiniz.`
            );
        }
        return limitCheck;
    }

    async getUsageStats(userId) {
        const planName = await this.getUserPlan(userId);
        const limits = PLAN_LIMITS[planName] || PLAN_LIMITS.Normal;

        const contactLimit = await this.checkContactLimit(userId);
        const transactionLimit = await this.checkDebtTransactionLimit(userId);

        return {
            plan: planName,
            contacts: {
                used: contactLimit.used || 0,
                limit: contactLimit.limit,
                remaining: contactLimit.remaining,
                isUnlimited: contactLimit.limit === null,
            },
            debtTransactions: {
                used: transactionLimit.used || 0,
                limit: transactionLimit.limit,
                remaining: transactionLimit.remaining,
                isUnlimited: transactionLimit.limit === null,
            },
        };
    }
}


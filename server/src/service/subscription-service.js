import HttpException from "../exception/http-exception.js";
import SubscriptionRepository from "../respository/subscription-repository.js";
import AuthRepository from "../respository/auth-repository.js";
import TransactionManager from "../util/transaction-manager.js";
import EmailService from "../util/send-email.js";
import {
    getProPlanUpgradeTemplate,
    getNormalPlanChangeTemplate,
    BRAND_NAME,
} from "../util/email-templates.js";
import logger from "../config/logger.js";

export default class SubscriptionService {
    constructor() {
        this.subscriptionRepository = new SubscriptionRepository();
        this.authRepository = new AuthRepository();
        this.transactionManager = new TransactionManager();
        this.emailService = new EmailService();
    }

    async getCurrentSubscription(userId) {
        const subscription = await this.subscriptionRepository.getCurrentSubscription(userId);

        if (!subscription) {
            throw new HttpException(404, "Aktif üyelik bulunamadı.");
        }

        return {
            id: subscription.id,
            plan: {
                id: subscription.plan_id,
                name: subscription.plan_name,
                price: subscription.plan_price,
            },
            start_date: subscription.start_date,
            end_date: subscription.end_date,
            status: subscription.status,
            created_at: subscription.created_at,
        };
    }

    async getAllPlans() {
        const plans = await this.subscriptionRepository.getAllPlans();
        return plans.map((plan) => ({
            id: plan.id,
            name: plan.name,
            price: plan.price,
        }));
    }

    async upgradeSubscription(userId, planId) {
        // Planın var olup olmadığını kontrol et
        const targetPlan = await this.subscriptionRepository.findPlanById(planId);
        if (!targetPlan) {
            throw new HttpException(404, "Belirtilen plan bulunamadı.");
        }

        // Mevcut üyeliği kontrol et
        const currentSubscription =
            await this.subscriptionRepository.getCurrentSubscription(userId);
        if (!currentSubscription) {
            throw new HttpException(404, "Aktif üyelik bulunamadı.");
        }

        // Aynı plana geçiş yapılamaz
        if (currentSubscription.plan_id === planId) {
            throw new HttpException(400, "Zaten bu plana sahipsiniz.");
        }

        // Transaction içinde üyeliği güncelle
        // Şimdilik ödeme sistemi olmadığı için direkt güncelleme yapıyoruz
        // Ödeme sistemi entegre edildiğinde burada ödeme kontrolü yapılacak
        await this.transactionManager.execute(async (client) => {
            // Mevcut üyeliği pasif yap
            await this.subscriptionRepository.deactivateCurrentSubscription(userId, client);

            // Yeni üyelik oluştur
            await this.subscriptionRepository.createSubscription(userId, planId, client);
        });

        // Güncellenmiş üyelik bilgilerini plan bilgisiyle birlikte döndür
        const subscriptionWithPlan =
            await this.subscriptionRepository.getCurrentSubscription(userId);

        // Mevcut plan bilgisini al
        const currentPlan = await this.subscriptionRepository.findPlanById(
            currentSubscription.plan_id
        );
        const isUpgrade = targetPlan.price > currentPlan.price;

        logger.info(
            `User ${userId} ${isUpgrade ? "upgraded" : "downgraded"} to plan ${targetPlan.name}`
        );

        // Kullanıcı bilgilerini al ve e-posta gönder
        try {
            const user = await this.authRepository.findById(userId);
            if (user && user.email) {
                if (isUpgrade && targetPlan.name === "Pro") {
                    // Pro plana yükseltme e-postası
                    const emailHtml = getProPlanUpgradeTemplate(
                        user.first_name,
                        targetPlan.name,
                        targetPlan.price,
                        subscriptionWithPlan.end_date
                    );
                    await this.emailService.sendEmail(
                        user.email,
                        `${BRAND_NAME} - Pro Plan Yükseltme`,
                        { html: emailHtml }
                    );
                } else if (!isUpgrade && targetPlan.name === "Normal") {
                    // Normal plana geçiş e-postası
                    const emailHtml = getNormalPlanChangeTemplate(user.first_name, targetPlan.name);
                    await this.emailService.sendEmail(
                        user.email,
                        `${BRAND_NAME} - Üyelik Planı Değişikliği`,
                        { html: emailHtml }
                    );
                }
            }
        } catch (error) {
            // E-posta gönderme hatası işlemi engellemez
            logger.error("Subscription change email gönderilemedi:", error);
        }

        return {
            id: subscriptionWithPlan.id,
            plan: {
                id: subscriptionWithPlan.plan_id,
                name: subscriptionWithPlan.plan_name,
                price: subscriptionWithPlan.plan_price,
            },
            start_date: subscriptionWithPlan.start_date,
            end_date: subscriptionWithPlan.end_date,
            status: subscriptionWithPlan.status,
            message: isUpgrade
                ? `Üyeliğiniz ${targetPlan.name} planına başarıyla yükseltildi.`
                : `Üyeliğiniz ${targetPlan.name} planına başarıyla değiştirildi.`,
        };
    }
}

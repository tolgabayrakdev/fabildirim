import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/store/auth-store";
import { apiUrl } from "@/lib/api";
import { Loader2, Crown, Check, Bell, Mail, MessageSquare } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface Subscription {
    id: string;
    plan: {
        id: string;
        name: string;
        price: number;
    };
    start_date: string;
    end_date: string | null;
    status: string;
}

interface Plan {
    id: string;
    name: string;
    price: number;
}

export default function Settings() {
    const navigate = useNavigate();
    const { reset } = useAuthStore();
    
    // Abonelik state
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [subscriptionLoading, setSubscriptionLoading] = useState(true);
    const [upgradeLoading, setUpgradeLoading] = useState(false);
    const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    
    // Şifre değiştirme formu state
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    
    const [passwordLoading, setPasswordLoading] = useState(false);
    
    // Hesap silme dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);
    
    // Bildirim ayarları state
    const [reminderSettings, setReminderSettings] = useState({
        remind_30_days: true,
        remind_7_days: true,
        remind_3_days: true,
        remind_on_due_date: true,
    });
    const [reminderSettingsLoading, setReminderSettingsLoading] = useState(true);
    const [reminderSettingsSaving, setReminderSettingsSaving] = useState(false);
    
    // Abonelik bilgilerini yükle
    useEffect(() => {
        const fetchSubscriptionData = async () => {
            setSubscriptionLoading(true);
            try {
                // Mevcut abonelik
                const subResponse = await fetch(apiUrl("/api/subscriptions/current"), {
                    method: "GET",
                    credentials: "include",
                });
                
                if (subResponse.ok) {
                    const subData = await subResponse.json();
                    if (subData.success) {
                        setSubscription(subData.data);
                    }
                }
                
                // Tüm planlar
                const plansResponse = await fetch(apiUrl("/api/subscriptions/plans"), {
                    method: "GET",
                    credentials: "include",
                });
                
                if (plansResponse.ok) {
                    const plansData = await plansResponse.json();
                    if (plansData.success) {
                        setPlans(plansData.data);
                    }
                }
            } catch (err) {
                console.error("Subscription fetch error:", err);
            } finally {
                setSubscriptionLoading(false);
            }
        };
        
        fetchSubscriptionData();
    }, []);
    
    // Bildirim ayarlarını yükle
    useEffect(() => {
        const fetchReminderSettings = async () => {
            setReminderSettingsLoading(true);
            try {
                const response = await fetch(apiUrl("/api/reminders/settings"), {
                    method: "GET",
                    credentials: "include",
                });
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.data) {
                        setReminderSettings({
                            remind_30_days: data.data.remind_30_days ?? true,
                            remind_7_days: data.data.remind_7_days ?? true,
                            remind_3_days: data.data.remind_3_days ?? true,
                            remind_on_due_date: data.data.remind_on_due_date ?? true,
                        });
                    }
                }
            } catch (err) {
                console.error("Reminder settings fetch error:", err);
            } finally {
                setReminderSettingsLoading(false);
            }
        };
        
        fetchReminderSettings();
    }, []);
    
    const handleReminderSettingsChange = async (key: string, value: boolean) => {
        const newSettings = { ...reminderSettings, [key]: value };
        setReminderSettings(newSettings);
        
        setReminderSettingsSaving(true);
        try {
            const response = await fetch(apiUrl("/api/reminders/settings"), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(newSettings),
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                toast.success("Bildirim ayarları güncellendi.");
            } else {
                toast.error(data.message || "Bildirim ayarları güncellenemedi.");
                // Hata durumunda eski değere geri dön
                setReminderSettings(reminderSettings);
            }
        } catch (err) {
            console.error("Reminder settings update error:", err);
            toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
            // Hata durumunda eski değere geri dön
            setReminderSettings(reminderSettings);
        } finally {
            setReminderSettingsSaving(false);
        }
    };
    
    const handleUpgrade = async () => {
        if (!selectedPlan) return;
        
        setUpgradeLoading(true);
        
        try {
            const response = await fetch(apiUrl("/api/subscriptions/upgrade"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    planId: selectedPlan.id,
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success(data.message || "Üyeliğiniz başarıyla yükseltildi.");
                setUpgradeDialogOpen(false);
                setSelectedPlan(null);
                
                // Sayfayı tamamen yenile
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                toast.error(data.message || data.error?.message || "Üyelik yükseltilemedi.");
            }
        } catch (err) {
            console.error("Upgrade error:", err);
            toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setUpgradeLoading(false);
        }
    };
    
    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validasyon
        if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
            toast.error("Lütfen tüm alanları doldurun.");
            return;
        }
        
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("Yeni şifreler eşleşmiyor.");
            return;
        }
        
        if (passwordForm.newPassword.length < 8) {
            toast.error("Yeni şifre en az 8 karakter olmalıdır.");
            return;
        }
        
        // Şifre kuralları kontrolü
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
        if (!passwordRegex.test(passwordForm.newPassword)) {
            toast.error("Yeni şifre en az bir küçük harf, bir büyük harf ve bir rakam içermelidir.");
            return;
        }
        
        setPasswordLoading(true);
        
        try {
            const response = await fetch(apiUrl("/api/auth/change-password"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success(data.message || "Şifreniz başarıyla değiştirildi.");
                setPasswordForm({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
            } else {
                toast.error(data.message || data.error?.message || "Şifre değiştirilemedi.");
            }
        } catch (err) {
            console.error("Change password error:", err);
            toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setPasswordLoading(false);
        }
    };
    
    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== "Onaylıyorum") {
            toast.error("Lütfen 'Onaylıyorum' yazarak onaylayın.");
            return;
        }
        
        setDeleteLoading(true);
        
        try {
            const response = await fetch(apiUrl("/api/auth/delete-account"), {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success(data.message || "Hesabınız başarıyla silindi.");
                reset();
                navigate("/sign-in");
            } else {
                toast.error(data.message || data.error?.message || "Hesap silinemedi.");
                setDeleteDialogOpen(false);
            }
        } catch (err) {
            console.error("Delete account error:", err);
            toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
            setDeleteDialogOpen(false);
        } finally {
            setDeleteLoading(false);
        }
    };
    
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold">Ayarlar</h1>
                <p className="text-muted-foreground mt-2 text-sm md:text-base">
                    Hesap ayarlarınızı buradan yönetebilirsiniz.
                </p>
            </div>
            
            {/* Abonelik Bilgileri */}
            <div className="space-y-6">
                {subscriptionLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : subscription ? (
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-[1fr_auto_1fr]">
                        {/* Mevcut Plan Bilgileri */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold">Mevcut Plan</h3>
                                {subscription.plan.name === "Pro" && (
                                    <Crown className="h-5 w-5 text-yellow-500" />
                                )}
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Durum</p>
                                    <p className="text-sm font-medium text-green-600">
                                        {subscription.status === "active" ? "Aktif" : subscription.status}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Başlangıç Tarihi</p>
                                    <p className="text-sm">
                                        {new Date(subscription.start_date).toLocaleDateString("tr-TR")}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Ayırıcı Çizgi */}
                        <div className="hidden md:block">
                            <Separator orientation="vertical" className="h-full" />
                        </div>
                        <div className="md:hidden col-span-full">
                            <Separator />
                        </div>
                        
                        {/* Mevcut Planlar */}
                        {plans.length > 0 && (
                            <div className="space-y-4 md:col-start-3 col-start-1">
                                <h3 className="text-lg font-semibold">Mevcut Planlar</h3>
                                <div className="space-y-3">
                                    {plans.map((plan) => {
                                        const isCurrentPlan = subscription.plan.id === plan.id;
                                        const canUpgrade = plan.price > subscription.plan.price;
                                        const canDowngrade = plan.price < subscription.plan.price;
                                        
                                        return (
                                            <div
                                                key={plan.id}
                                                className={`p-4 border rounded-lg ${
                                                    isCurrentPlan ? "bg-primary/5 border-primary" : ""
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        {plan.name === "Pro" && (
                                                            <Crown className="h-4 w-4 text-yellow-500" />
                                                        )}
                                                        <div>
                                                            <p className="font-semibold">{plan.name}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {plan.price === 0 ? "Ücretsiz" : `${plan.price} ₺`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {isCurrentPlan && (
                                                            <span className="text-sm text-primary font-medium flex items-center gap-1">
                                                                <Check className="h-4 w-4" />
                                                                Aktif
                                                            </span>
                                                        )}
                                                        {canUpgrade && !isCurrentPlan && (
                                                            <Button
                                                                size="sm"
                                                                onClick={() => {
                                                                    setSelectedPlan(plan);
                                                                    setUpgradeDialogOpen(true);
                                                                }}
                                                            >
                                                                Yükselt
                                                            </Button>
                                                        )}
                                                        {canDowngrade && !isCurrentPlan && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => {
                                                                    setSelectedPlan(plan);
                                                                    setUpgradeDialogOpen(true);
                                                                }}
                                                            >
                                                                Normal Plana Geç
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="py-4">
                        <p className="text-sm text-muted-foreground">
                            Abonelik bilgisi bulunamadı.
                        </p>
                    </div>
                )}
            </div>
            
            <Separator />
            
            {/* Bildirim Ayarları */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Bildirim Ayarları
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Vadesi yaklaşan alacaklar için otomatik bildirim ayarlarınızı yönetin.
                    </p>
                </div>
                
                {reminderSettingsLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>Otomatik Hatırlatmalar</CardTitle>
                            <CardDescription>
                                Vadesi yaklaşan alacaklar için otomatik olarak e-posta ve SMS gönderilir.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            30 Gün Önce Hatırlat
                                        </label>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Vadesinden 30 gün önce bildirim gönder
                                    </p>
                                </div>
                                <Switch
                                    checked={reminderSettings.remind_30_days}
                                    onCheckedChange={(checked) =>
                                        handleReminderSettingsChange("remind_30_days", checked)
                                    }
                                    disabled={reminderSettingsSaving}
                                />
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            7 Gün Önce Hatırlat
                                        </label>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Vadesinden 7 gün önce bildirim gönder
                                    </p>
                                </div>
                                <Switch
                                    checked={reminderSettings.remind_7_days}
                                    onCheckedChange={(checked) =>
                                        handleReminderSettingsChange("remind_7_days", checked)
                                    }
                                    disabled={reminderSettingsSaving}
                                />
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            3 Gün Önce Hatırlat
                                        </label>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Vadesinden 3 gün önce bildirim gönder
                                    </p>
                                </div>
                                <Switch
                                    checked={reminderSettings.remind_3_days}
                                    onCheckedChange={(checked) =>
                                        handleReminderSettingsChange("remind_3_days", checked)
                                    }
                                    disabled={reminderSettingsSaving}
                                />
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <Bell className="h-4 w-4 text-muted-foreground" />
                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Vade Günü Hatırlat
                                        </label>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Vade günü bildirim gönder
                                    </p>
                                </div>
                                <Switch
                                    checked={reminderSettings.remind_on_due_date}
                                    onCheckedChange={(checked) =>
                                        handleReminderSettingsChange("remind_on_due_date", checked)
                                    }
                                    disabled={reminderSettingsSaving}
                                />
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
            
            <Separator />
            
            {/* Şifre Değiştirme */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold mb-2">Şifre Değiştir</h2>
                    <p className="text-sm text-muted-foreground">
                        Hesabınızın güvenliği için düzenli olarak şifrenizi değiştirin.
                    </p>
                </div>
                
                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="currentPassword">Mevcut Şifre</Label>
                        <Input
                            id="currentPassword"
                            type="password"
                            value={passwordForm.currentPassword}
                            onChange={(e) =>
                                setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                            }
                            placeholder="Mevcut şifrenizi girin"
                            disabled={passwordLoading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="newPassword">Yeni Şifre</Label>
                        <Input
                            id="newPassword"
                            type="password"
                            value={passwordForm.newPassword}
                            onChange={(e) =>
                                setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                            }
                            placeholder="Yeni şifrenizi girin"
                            disabled={passwordLoading}
                        />
                        <p className="text-xs text-muted-foreground">
                            En az 8 karakter, bir küçük harf, bir büyük harf ve bir rakam içermelidir.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Yeni Şifre (Tekrar)</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={passwordForm.confirmPassword}
                            onChange={(e) =>
                                setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                            }
                            placeholder="Yeni şifrenizi tekrar girin"
                            disabled={passwordLoading}
                        />
                    </div>
                    <div>
                        <Button type="submit" disabled={passwordLoading}>
                            {passwordLoading ? "İşleniyor..." : "Şifreyi Değiştir"}
                        </Button>
                    </div>
                </form>
            </div>
            
            <Separator />
            
            {/* Hesap Silme */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold mb-2 text-destructive">Tehlikeli Bölge</h2>
                    <p className="text-sm text-muted-foreground">
                        Hesabınızı kalıcı olarak silmek istiyorsanız, aşağıdaki butona tıklayın.
                        Bu işlem geri alınamaz.
                    </p>
                </div>
                
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Hesabınızı sildiğinizde, tüm verileriniz kalıcı olarak silinecektir.
                        Bu işlem geri alınamaz.
                    </p>
                    <Button
                        variant="destructive"
                        onClick={() => setDeleteDialogOpen(true)}
                        disabled={deleteLoading}
                    >
                        Hesabı Sil
                    </Button>
                </div>
            </div>
            
            {/* Hesap Silme Onay Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hesabı Sil</DialogTitle>
                        <DialogDescription>
                            Bu işlem geri alınamaz. Hesabınızı kalıcı olarak silmek istediğinizden emin misiniz?
                            Onaylamak için aşağıya <strong>Onaylıyorum</strong> yazın.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="deleteConfirm">Onay için 'Onaylıyorum' yazın</Label>
                            <Input
                                id="deleteConfirm"
                                type="text"
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                placeholder="Onaylıyorum"
                                disabled={deleteLoading}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setDeleteDialogOpen(false);
                                setDeleteConfirmText("");
                            }}
                            disabled={deleteLoading}
                        >
                            İptal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteAccount}
                            disabled={deleteLoading || deleteConfirmText !== "Onaylıyorum"}
                        >
                            {deleteLoading ? "Siliniyor..." : "Hesabı Kalıcı Olarak Sil"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            
            {/* Üyelik Değiştirme Onay Dialog */}
            <Dialog open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {selectedPlan && subscription && selectedPlan.price > subscription.plan.price
                                ? "Üyelik Yükseltme"
                                : "Üyelik Değiştirme"}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedPlan && subscription && (
                                <>
                                    {selectedPlan.price > subscription.plan.price ? (
                                        <>
                                            Üyeliğinizi <strong>{selectedPlan.name}</strong> planına yükseltmek istediğinizden emin misiniz?
                                            {selectedPlan.price > 0 && (
                                                <span className="block mt-2">
                                                    Bu işlem için ödeme gerekebilir. (Şu an ödeme sistemi entegre değil, test modunda çalışıyor)
                                                </span>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            Üyeliğinizi <strong>{selectedPlan.name}</strong> planına değiştirmek istediğinizden emin misiniz?
                                            <span className="block mt-2 text-amber-600 dark:text-amber-400">
                                                Pro plan özelliklerine erişiminiz sona erecektir.
                                            </span>
                                        </>
                                    )}
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setUpgradeDialogOpen(false);
                                setSelectedPlan(null);
                            }}
                            disabled={upgradeLoading}
                        >
                            İptal
                        </Button>
                        <Button
                            onClick={handleUpgrade}
                            disabled={upgradeLoading || !selectedPlan}
                            variant={selectedPlan && subscription && selectedPlan.price < subscription.plan.price ? "outline" : "default"}
                        >
                            {upgradeLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    İşleniyor...
                                </>
                            ) : selectedPlan && subscription && selectedPlan.price < subscription.plan.price ? (
                                "Normal Plana Geç"
                            ) : (
                                "Yükselt"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

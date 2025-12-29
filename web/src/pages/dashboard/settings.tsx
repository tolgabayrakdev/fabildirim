import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/store/auth-store";
import { apiUrl } from "@/lib/api";

export default function Settings() {
    const navigate = useNavigate();
    const { reset } = useAuthStore();
    
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
        </div>
    );
}

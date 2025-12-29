import { useState } from "react"
import { Link } from "react-router"
import { Eye, EyeOff, Bell, Zap, Shield, Sparkles, CheckCircle, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/auth-store"

export default function SignUp() {
    const { signUp, error } = useAuthStore()

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const formatPhoneNumber = (value: string) => {
        // Sadece rakamları al (10 haneli)
        const numbers = value.replace(/\D/g, "").slice(0, 10)
        
        // 10 haneli format: 537 985 44 56
        if (numbers.length === 0) return ""
        if (numbers.length <= 3) return numbers
        if (numbers.length <= 6) return `${numbers.slice(0, 3)} ${numbers.slice(3)}`
        if (numbers.length <= 8) return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6)}`
        return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6, 8)} ${numbers.slice(8, 10)}`
    }

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        // +90 ve boşlukları temizle
        const cleaned = value.replace(/\+90\s*/g, "").replace(/\s/g, "")
        const formatted = formatPhoneNumber(cleaned)
        setPhone(formatted)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormError(null)

        // Şifre kontrolü
        if (password.length < 8) {
            setFormError("Şifre en az 8 karakter olmalıdır.")
            return
        }

        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            setFormError("Şifre en az bir küçük harf, bir büyük harf ve bir rakam içermelidir.")
            return
        }

        if (password !== confirmPassword) {
            setFormError("Şifreler eşleşmiyor.")
            return
        }

        // Telefon numarasını temizle (sadece rakamlar)
        const cleanPhone = phone.replace(/\D/g, "")
        
        // Telefon numarası format kontrolü (10 haneli olmalı, 5 ile başlamalı)
        if (cleanPhone.length !== 10 || !cleanPhone.startsWith("5")) {
            setFormError("Geçerli bir telefon numarası giriniz (örn: 537 985 44 56)")
            return
        }

        // Backend'e 0 ile başlayan 11 haneli format gönder (05379854456)
        const phoneForBackend = `0${cleanPhone}`

        setIsLoading(true)
        const result = await signUp(firstName, lastName, email, phoneForBackend, password)
        setIsLoading(false)

        if (result.success) {
            setIsSuccess(true)
        } else {
            setFormError(result.error || "Kayıt başarısız. Lütfen tekrar deneyin.")
        }
    }

    // Başarı ekranı
    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-muted/20 px-4 py-12">
                <div className="w-full max-w-md space-y-8 text-center">
                    <div className="space-y-4">
                        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <CheckCircle className="h-8 w-8 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight">
                                Hesabınız Başarıyla Oluşturuldu
                            </h1>
                            <p className="text-muted-foreground">
                                Giriş ekranından e-posta ve telefon numaranızı doğruladıktan sonra giriş yapabilirsiniz.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Link to="/sign-in">
                            <Button className="w-full" size="lg">
                                Giriş Ekranına Git
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex">
            {/* Sol Taraf - Fabildirim İçeriği (Kayıt) */}
            <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-primary/10 via-primary/5 to-background items-center justify-center p-12">
                <div className="max-w-md space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-lg bg-primary/10">
                                <Bell className="h-8 w-8 text-primary" />
                            </div>
                            <h2 className="text-4xl font-bold tracking-tight">Fabildirim</h2>
                        </div>
                        <p className="text-xl text-muted-foreground">
                            Kayıt olun ve bildirimlerinizi yönetmeye hemen başlayın
                        </p>
                    </div>

                    <div className="space-y-6 pt-8">
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-md bg-primary/10 mt-1">
                                <Zap className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Hemen Başla</h3>
                                <p className="text-sm text-muted-foreground">
                                    Kolay ve hızlı kayıt ile dakikalar içinde bildirimlerinizi yönetmeye başlayın
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-md bg-primary/10 mt-1">
                                <Shield className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Güvenli ve Güvenilir</h3>
                                <p className="text-sm text-muted-foreground">
                                    Verileriniz güvende, gizliliğiniz korunuyor. Endişelenmeden kullanın
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-md bg-primary/10 mt-1">
                                <Sparkles className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Akıllı Bildirimler</h3>
                                <p className="text-sm text-muted-foreground">
                                    Özelleştirilebilir bildirimler ile istediğiniz zaman, istediğiniz şekilde bilgilendirilin
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sağ Taraf - Kayıt Formu */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-background px-4 py-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Hesap Oluştur</h1>
                        <p className="text-muted-foreground">
                            Yeni hesabınızı oluşturun ve başlayın
                        </p>
                    </div>

                    {(error || formError) && (
                        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                            <p className="text-sm text-destructive">{error || formError}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">Ad</Label>
                                    <Input
                                        id="firstName"
                                        type="text"
                                        placeholder="Adınız"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                        autoComplete="given-name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Soyad</Label>
                                    <Input
                                        id="lastName"
                                        type="text"
                                        placeholder="Soyadınız"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                        autoComplete="family-name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">E-posta</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="ornek@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Telefon Numarası</Label>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5 px-3 h-10 border border-input bg-background rounded-md">
                                        <span className="text-lg">🇹🇷</span>
                                        <span className="text-sm font-medium">+90</span>
                                    </div>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="537 985 44 56"
                                        value={phone}
                                        onChange={handlePhoneChange}
                                        required
                                        autoComplete="tel"
                                        maxLength={13}
                                        className="flex-1"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Şifre</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        autoComplete="new-password"
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        autoComplete="new-password"
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        aria-label={showConfirmPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Kayıt yapılıyor...
                                </>
                            ) : (
                                "Kayıt Ol"
                            )}
                        </Button>
                    </form>

                    <div className="text-center text-sm">
                        <span className="text-muted-foreground">Zaten hesabınız var mı? </span>
                        <Link
                            to="/sign-in"
                            className="text-primary font-medium hover:underline"
                        >
                            Giriş yapın
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

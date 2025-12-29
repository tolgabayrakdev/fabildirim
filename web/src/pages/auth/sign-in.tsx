import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router"
import { Eye, EyeOff, Bell, CheckCircle, Clock, TrendingUp, Mail, Phone, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/auth-store"

type Step = "login" | "emailOtp" | "smsOtp"

const COOLDOWN_DURATION = 180 // 3 dakika

export default function SignIn() {
    const navigate = useNavigate()
    const { 
        login, 
        verifyEmailOtp, 
        verifySmsOtp, 
        resendEmailVerification, 
        resendSmsVerification,
        checkAuth,
        error 
    } = useAuthStore()

    const [checkingAuth, setCheckingAuth] = useState(true)
    const [step, setStep] = useState<Step>("login")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailOtp, setEmailOtp] = useState("")
    const [smsOtp, setSmsOtp] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [maskedPhone, setMaskedPhone] = useState<string>("")
    const [resendCooldown, setResendCooldown] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [isResendEmailLoading, setIsResendEmailLoading] = useState(false)
    const [isResendSmsLoading, setIsResendSmsLoading] = useState(false)
    const cooldownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    // Resend cooldown timer
    const startCooldown = () => {
        // Önceki interval'i temizle
        if (cooldownIntervalRef.current) {
            clearInterval(cooldownIntervalRef.current)
        }
        
        setResendCooldown(COOLDOWN_DURATION)
        cooldownIntervalRef.current = setInterval(() => {
            setResendCooldown((prev) => {
                if (prev <= 1) {
                    if (cooldownIntervalRef.current) {
                        clearInterval(cooldownIntervalRef.current)
                        cooldownIntervalRef.current = null
                    }
                    return 0
                }
                return prev - 1
            })
        }, 1000)
    }

    // Cleanup interval on unmount
    useEffect(() => {
        return () => {
            if (cooldownIntervalRef.current) {
                clearInterval(cooldownIntervalRef.current)
            }
        }
    }, [])

    // Auth kontrolü - eğer zaten giriş yapmışsa ana sayfaya yönlendir
    useEffect(() => {
        const checkAuthentication = async () => {
            const isAuthenticated = await checkAuth()
            if (isAuthenticated) {
                navigate("/", { replace: true })
            } else {
                setCheckingAuth(false)
            }
        }
        checkAuthentication()
    }, [checkAuth, navigate])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        const result = await login(email, password)

        if (result.success) {
            navigate("/", { replace: true })
        } else if (result.emailRequired) {
            setStep("emailOtp")
        } else if (result.smsRequired) {
            setMaskedPhone(result.maskedPhone || "")
            setStep("smsOtp")
        }
        setIsLoading(false)
    }

    const handleEmailOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        const result = await verifyEmailOtp(email, emailOtp)
        setIsLoading(false)

        if (result.success) {
            if (result.requiresSmsVerification) {
                setMaskedPhone(result.maskedPhone || "")
                setStep("smsOtp")
                setEmailOtp("")
            } else {
                navigate("/", { replace: true })
            }
        }
    }

    const handleSmsOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        const result = await verifySmsOtp(email, smsOtp)
        setIsLoading(false)

        if (result.success) {
            navigate("/", { replace: true })
        }
    }

    const handleResendEmail = async () => {
        setIsResendEmailLoading(true)
        const result = await resendEmailVerification(email)
        setIsResendEmailLoading(false)
        if (result.success) {
            startCooldown()
        }
    }

    const handleResendSms = async () => {
        setIsResendSmsLoading(true)
        const result = await resendSmsVerification(email)
        setIsResendSmsLoading(false)
        if (result.success) {
            setMaskedPhone(result.maskedPhone || "")
            startCooldown()
        }
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    // Auth kontrolü yapılırken loading göster (sadece ilk kontrol için)
    if (checkingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3">
                    <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center animate-pulse">
                        <Bell className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-muted-foreground">Yükleniyor...</div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex">
            {/* Sol Taraf - Fabildirim İçeriği */}
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
                            {step === "login" && "Hoş geldiniz! Hesabınıza giriş yaparak bildirimlerinizi yönetmeye devam edin"}
                            {step === "emailOtp" && "E-posta adresinizi doğrulayın"}
                            {step === "smsOtp" && "Telefon numaranızı doğrulayın"}
                        </p>
                    </div>

                    <div className="space-y-6 pt-8">
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-md bg-primary/10 mt-1">
                                <CheckCircle className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Güvenli Giriş</h3>
                                <p className="text-sm text-muted-foreground">
                                    İki adımlı doğrulama ile hesabınızı koruyun
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-md bg-primary/10 mt-1">
                                <Clock className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Hızlı Erişim</h3>
                                <p className="text-sm text-muted-foreground">
                                    Doğrulama kodları 3 dakika süreyle geçerlidir
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-md bg-primary/10 mt-1">
                                <TrendingUp className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Kolay Yönetim</h3>
                                <p className="text-sm text-muted-foreground">
                                    Bildirim tercihlerinizi düzenleyin ve istediğiniz zaman bilgilendirilin
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sağ Taraf - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-background px-4 py-12">
                <div className="w-full max-w-md space-y-8">
                    {/* Login Step */}
                    {step === "login" && (
                        <>
                            <div className="text-center space-y-2">
                                <h1 className="text-3xl font-bold tracking-tight">Hoş Geldiniz</h1>
                                <p className="text-muted-foreground">
                                    Hesabınıza giriş yapın
                                </p>
                            </div>

                            {error && (
                                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                                    <p className="text-sm text-destructive">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleLogin} className="space-y-6">
                                <div className="space-y-4">
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
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password">Şifre</Label>
                                            <Link
                                                to="/forgot-password"
                                                className="text-sm text-primary hover:underline"
                                            >
                                                Şifremi unuttum
                                            </Link>
                                        </div>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                autoComplete="current-password"
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
                                            Giriş yapılıyor...
                                        </>
                                    ) : (
                                        "Giriş Yap"
                                    )}
                                </Button>
                            </form>
                        </>
                    )}

                    {/* Email OTP Step */}
                    {step === "emailOtp" && (
                        <>
                            <div className="text-center space-y-2">
                                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                    <Mail className="h-8 w-8 text-primary" />
                                </div>
                                <h1 className="text-3xl font-bold tracking-tight">E-posta Doğrulama</h1>
                                <p className="text-muted-foreground">
                                    {email} adresine gönderilen doğrulama kodunu girin
                                </p>
                            </div>

                            {error && (
                                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                                    <p className="text-sm text-destructive">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleEmailOtp} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="emailOtp">Doğrulama Kodu</Label>
                                    <Input
                                        id="emailOtp"
                                        type="text"
                                        placeholder="123456"
                                        value={emailOtp}
                                        onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                        required
                                        maxLength={6}
                                        className="text-center text-2xl tracking-widest font-mono"
                                        autoFocus
                                    />
                                    <p className="text-xs text-muted-foreground text-center">
                                        6 haneli doğrulama kodunu girin
                                    </p>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    size="lg"
                                    disabled={isLoading || emailOtp.length !== 6}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Doğrulanıyor...
                                        </>
                                    ) : (
                                        "Doğrula"
                                    )}
                                </Button>

                                <div className="text-center space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        Kod gelmedi mi?
                                    </p>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        onClick={handleResendEmail}
                                        disabled={isResendEmailLoading || resendCooldown > 0}
                                    >
                                        {isResendEmailLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Gönderiliyor...
                                            </>
                                        ) : resendCooldown > 0 ? (
                                            `${formatTime(resendCooldown)} sonra tekrar gönder`
                                        ) : (
                                            "Kodu Tekrar Gönder"
                                        )}
                                    </Button>
                                </div>

                                <div className="text-center">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => {
                                            setStep("login")
                                            setEmailOtp("")
                                        }}
                                    >
                                        ← Geri dön
                                    </Button>
                                </div>
                            </form>
                        </>
                    )}

                    {/* SMS OTP Step */}
                    {step === "smsOtp" && (
                        <>
                            <div className="text-center space-y-2">
                                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                    <Phone className="h-8 w-8 text-primary" />
                                </div>
                                <h1 className="text-3xl font-bold tracking-tight">SMS Doğrulama</h1>
                                <p className="text-muted-foreground">
                                    {maskedPhone ? `${maskedPhone} numarasına` : "Telefon numaranıza"} gönderilen doğrulama kodunu girin
                                </p>
                            </div>

                            {error && (
                                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                                    <p className="text-sm text-destructive">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSmsOtp} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="smsOtp">Doğrulama Kodu</Label>
                                    <Input
                                        id="smsOtp"
                                        type="text"
                                        placeholder="123456"
                                        value={smsOtp}
                                        onChange={(e) => setSmsOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                        required
                                        maxLength={6}
                                        className="text-center text-2xl tracking-widest font-mono"
                                        autoFocus
                                    />
                                    <p className="text-xs text-muted-foreground text-center">
                                        6 haneli doğrulama kodunu girin
                                    </p>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    size="lg"
                                    disabled={isLoading || smsOtp.length !== 6}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Doğrulanıyor...
                                        </>
                                    ) : (
                                        "Doğrula"
                                    )}
                                </Button>

                                <div className="text-center space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        Kod gelmedi mi?
                                    </p>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        onClick={handleResendSms}
                                        disabled={isResendSmsLoading || resendCooldown > 0}
                                    >
                                        {isResendSmsLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Gönderiliyor...
                                            </>
                                        ) : resendCooldown > 0 ? (
                                            `${formatTime(resendCooldown)} sonra tekrar gönder`
                                        ) : (
                                            "Kodu Tekrar Gönder"
                                        )}
                                    </Button>
                                </div>

                                <div className="text-center">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => {
                                            setStep("login")
                                            setSmsOtp("")
                                        }}
                                    >
                                        ← Geri dön
                                    </Button>
                                </div>
                            </form>
                        </>
                    )}

                    {/* Sign Up Link - Sadece login step'inde göster */}
                    {step === "login" && (
                        <div className="text-center text-sm">
                            <span className="text-muted-foreground">Hesabınız yok mu? </span>
                            <Link
                                to="/sign-up"
                                className="text-primary font-medium hover:underline"
                            >
                                Kayıt olun
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

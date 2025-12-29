import { useState, useEffect } from "react"
import { useSearchParams, useNavigate, Link } from "react-router"
import { Eye, EyeOff, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { apiUrl } from "@/lib/api"

export default function ResetPassword() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const token = searchParams.get("token")

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isVerifying, setIsVerifying] = useState(true)
    const [isValidToken, setIsValidToken] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    // Token geçerliliğini kontrol et
    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setIsVerifying(false)
                setIsValidToken(false)
                setError("Token bulunamadı. Lütfen e-postanızdaki linki kullanın.")
                return
            }

            try {
                const response = await fetch(apiUrl("/api/auth/verify-reset-token"), {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ token }),
                })

                const data = await response.json()

                if (response.ok && data.success) {
                    setIsValidToken(true)
                    setError(null)
                } else {
                    setIsValidToken(false)
                    setError(data.error?.message || "Geçersiz veya süresi dolmuş token.")
                }
            } catch (err) {
                setIsValidToken(false)
                setError("Token doğrulanırken bir hata oluştu. Lütfen tekrar deneyin.")
            } finally {
                setIsVerifying(false)
            }
        }

        verifyToken()
    }, [token])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        // Şifre kontrolü
        if (password.length < 8) {
            setError("Şifre en az 8 karakter olmalıdır.")
            return
        }

        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            setError("Şifre en az bir küçük harf, bir büyük harf ve bir rakam içermelidir.")
            return
        }

        if (password !== confirmPassword) {
            setError("Şifreler eşleşmiyor.")
            return
        }

        if (!token) {
            setError("Token bulunamadı.")
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch(apiUrl("/api/auth/reset-password"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ token, password }),
            })

            const data = await response.json()

            if (response.ok && data.success) {
                setSuccess(true)
                // 2 saniye sonra giriş sayfasına yönlendir
                setTimeout(() => {
                    navigate("/sign-in", { replace: true })
                }, 2000)
            } else {
                setError(data.error?.message || "Şifre sıfırlama başarısız. Lütfen tekrar deneyin.")
            }
        } catch (err) {
            setError("Bir hata oluştu. Lütfen tekrar deneyin.")
        } finally {
            setIsLoading(false)
        }
    }

    // Token doğrulanıyor
    if (isVerifying) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-muted/20 px-4 py-12">
                <div className="w-full max-w-md space-y-8 text-center">
                    <div className="space-y-4">
                        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 text-primary animate-spin" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight">Token Doğrulanıyor</h1>
                            <p className="text-muted-foreground">
                                Lütfen bekleyin...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Token geçersiz
    if (!isValidToken) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-muted/20 px-4 py-12">
                <div className="w-full max-w-md space-y-8 text-center">
                    <div className="space-y-4">
                        <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                            <XCircle className="h-8 w-8 text-destructive" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight">Geçersiz Token</h1>
                            <p className="text-muted-foreground">
                                {error || "Bu link geçersiz veya süresi dolmuş. Lütfen yeni bir şifre sıfırlama linki isteyin."}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Link to="/forgot-password">
                            <Button className="w-full" size="lg">
                                Yeni Şifre Sıfırlama Linki İste
                            </Button>
                        </Link>
                        <Link to="/sign-in">
                            <Button variant="ghost" className="w-full">
                                Giriş sayfasına dön
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    // Başarılı
    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-muted/20 px-4 py-12">
                <div className="w-full max-w-md space-y-8 text-center">
                    <div className="space-y-4">
                        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <CheckCircle className="h-8 w-8 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight">Şifre Başarıyla Sıfırlandı</h1>
                            <p className="text-muted-foreground">
                                Yeni şifrenizle giriş yapabilirsiniz. Giriş sayfasına yönlendiriliyorsunuz...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Şifre sıfırlama formu
    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-muted/20 px-4 py-12">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Yeni Şifre Belirle</h1>
                    <p className="text-muted-foreground">
                        Yeni şifrenizi girin
                    </p>
                </div>

                {error && (
                    <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                        <p className="text-sm text-destructive">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Yeni Şifre</Label>
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
                            <p className="text-xs text-muted-foreground">
                                En az 8 karakter, bir küçük harf, bir büyük harf ve bir rakam içermelidir.
                            </p>
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
                        {isLoading ? "Şifre sıfırlanıyor..." : "Şifreyi Sıfırla"}
                    </Button>
                </form>

                <div className="text-center text-sm">
                    <Link
                        to="/sign-in"
                        className="text-primary font-medium hover:underline"
                    >
                        ← Giriş sayfasına dön
                    </Link>
                </div>
            </div>
        </div>
    )
}

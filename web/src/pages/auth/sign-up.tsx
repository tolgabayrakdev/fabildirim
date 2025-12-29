import { useState } from "react"
import { Link } from "react-router"
import { Eye, EyeOff, Bell, Zap, Shield, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function SignUp() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            // TODO: Show error message
            return
        }
        setIsLoading(true)
        // TODO: Implement sign up logic
        setTimeout(() => setIsLoading(false), 1000)
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

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Ad Soyad</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Adınız Soyadınız"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    autoComplete="name"
                                />
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
                            {isLoading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
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

import { useState } from "react"
import { Link } from "react-router"
import { Eye, EyeOff, Bell, CheckCircle, Clock, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function SignIn() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // TODO: Implement sign in logic
        setTimeout(() => setIsLoading(false), 1000)
    }

    return (
        <div className="min-h-screen flex">
            {/* Sol Taraf - Fabildirim İçeriği (Giriş) */}
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
                            Hoş geldiniz! Hesabınıza giriş yaparak bildirimlerinizi yönetmeye devam edin
                        </p>
                    </div>

                    <div className="space-y-6 pt-8">
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-md bg-primary/10 mt-1">
                                <CheckCircle className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Bildirimlerinizi Kontrol Edin</h3>
                                <p className="text-sm text-muted-foreground">
                                    Giriş yaparak tüm bildirimlerinizi görüntüleyin ve yönetin
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-md bg-primary/10 mt-1">
                                <Clock className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Kaçırdığınız Bildirimler</h3>
                                <p className="text-sm text-muted-foreground">
                                    Son girişinizden bu yana kaçırdığınız önemli bildirimleri görün
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-md bg-primary/10 mt-1">
                                <TrendingUp className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Özelleştirme Ayarları</h3>
                                <p className="text-sm text-muted-foreground">
                                    Bildirim tercihlerinizi düzenleyin ve istediğiniz zaman bilgilendirilin
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sağ Taraf - Giriş Formu */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-background px-4 py-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Hoş Geldiniz</h1>
                        <p className="text-muted-foreground">
                            Hesabınıza giriş yapın
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
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
                            {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
                        </Button>
                    </form>

                    <div className="text-center text-sm">
                        <span className="text-muted-foreground">Hesabınız yok mu? </span>
                        <Link
                            to="/sign-up"
                            className="text-primary font-medium hover:underline"
                        >
                            Kayıt olun
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

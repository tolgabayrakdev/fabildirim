import { useState } from "react"
import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // TODO: Implement forgot password logic
        setTimeout(() => {
            setIsLoading(false)
            setIsSubmitted(true)
        }, 1000)
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-muted/20 px-4 py-12">
                <div className="w-full max-w-md space-y-8 text-center">
                    <div className="space-y-4">
                        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight">
                                E-posta Gönderildi
                            </h1>
                            <p className="text-muted-foreground">
                                Şifre sıfırlama bağlantısı {email} adresine gönderildi.
                                Lütfen e-postanızı kontrol edin.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Button
                            onClick={() => setIsSubmitted(false)}
                            variant="outline"
                            className="w-full"
                        >
                            Yeni E-posta Gönder
                        </Button>
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

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-muted/20 px-4 py-12">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Şifremi Unuttum</h1>
                    <p className="text-muted-foreground">
                        E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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

                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isLoading}
                    >
                        {isLoading ? "Gönderiliyor..." : "Şifre Sıfırlama Bağlantısı Gönder"}
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

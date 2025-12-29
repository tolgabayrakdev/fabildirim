import { Link } from "react-router"
import { Home, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="text-center space-y-6 max-w-md">
                <div className="space-y-4">
                    <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                        <AlertCircle className="h-10 w-10 text-primary" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-6xl font-bold tracking-tight">404</h1>
                        <h2 className="text-2xl font-semibold">Sayfa Bulunamadı</h2>
                        <p className="text-muted-foreground">
                            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
                        </p>
                    </div>
                </div>

                <div className="pt-4">
                    <Button asChild size="lg">
                        <Link to="/">
                            <Home className="mr-2 h-4 w-4" />
                            Ana Sayfaya Dön
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}


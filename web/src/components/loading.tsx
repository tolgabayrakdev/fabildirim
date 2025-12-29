import { Bell } from "lucide-react"

export default function Loading() {
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

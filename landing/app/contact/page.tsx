import Link from "next/link";
import { Wallet, ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://vanpara.com';

export const metadata: Metadata = {
  title: "İletişim",
  description: "Vanpara iletişim bilgileri ve destek. Sorularınız, önerileriniz veya destek talepleriniz için bizimle iletişime geçin.",
  keywords: ["vanpara iletişim", "vanpara destek", "vanpara yardım", "borç takip sistemi destek"],
  openGraph: {
    title: "İletişim - Vanpara",
    description: "Vanpara iletişim bilgileri ve destek. Sorularınız, önerileriniz veya destek talepleriniz için bizimle iletişime geçin.",
    url: `${baseUrl}/contact`,
    type: "website",
  },
  alternates: {
    canonical: `${baseUrl}/contact`,
  },
};

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
                <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <span className="text-lg sm:text-xl font-bold tracking-tight">Vanpara</span>
            </Link>
            <Link
              href="/"
              className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              Ana Sayfa
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="mb-8 sm:mb-12 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              İletişim
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              Sorularınız, önerileriniz veya destek talepleriniz için bizimle iletişime geçin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12">
            <div className="p-6 sm:p-8 rounded-xl border border-border bg-card">
              <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">E-posta</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-3">
                Genel sorularınız için
              </p>
              <a
                href="mailto:destek@vanpara.com"
                className="text-sm sm:text-base text-primary hover:underline font-medium"
              >
                destek@vanpara.com
              </a>
            </div>

            <div className="p-6 sm:p-8 rounded-xl border border-border bg-card">
              <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Telefon</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-3">
                Acil durumlar için
              </p>
              <a
                href="tel:+905479854487"
                className="text-sm sm:text-base text-primary hover:underline font-medium"
              >
                547 985 44 87
              </a>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-xl border border-border bg-card mb-8">
            <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Adres</h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              vanpara.com
              <br />
              Giresun, Türkiye
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-xl border border-border bg-muted/30">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">Sık Sorulan Sorular</h3>
            <div className="space-y-4 text-sm sm:text-base text-muted-foreground">
              <div>
                <h4 className="font-medium text-foreground mb-1">Hesap nasıl oluşturulur?</h4>
                <p>
                  Ana sayfadaki "Kayıt Ol" butonuna tıklayarak ücretsiz hesap oluşturabilirsiniz.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">Pro plana nasıl geçilir?</h4>
                <p>
                  Hesap ayarlarınızdan plan yönetimi bölümünden Pro plana geçiş yapabilirsiniz.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">Verilerim güvende mi?</h4>
                <p>
                  Evet, tüm verileriniz şifreli bağlantılar ile korunur ve güvenli sunucularda saklanır. 
                  Detaylar için{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Gizlilik Politikası
                  </Link>{" "}
                  sayfamızı inceleyebilirsiniz.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
                <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <span className="text-base sm:text-lg font-bold tracking-tight">Vanpara</span>
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
              <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Kullanım Şartları
              </Link>
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Gizlilik Politikası
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                İletişim
              </Link>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground text-center md:text-right">
              © {new Date().getFullYear()} Vanpara. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}


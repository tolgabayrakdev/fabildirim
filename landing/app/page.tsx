import Link from "next/link";
import { Wallet, CheckCircle, Bell, Mail, Phone, TrendingUp, BarChart3, FileText, Shield, Zap, Crown, ArrowRight } from "lucide-react";
import { AnimatedSection } from "./components/animated-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-bold tracking-tight">Vanpara</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/sign-in"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Giriş Yap
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Kayıt Ol
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-2 text-sm mb-8">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Basit, Anlaşılır, Herkes İçin</span>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
                Neden <span className="text-primary">Vanpara</span>?
              </h1>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Karmaşıklık yok. Sadece basit ve anlaşılır bir borç/alacak takip sistemi. 
                Herkes tarafından kolayca kullanılabilir.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/sign-up"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Ücretsiz Başla
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/sign-in"
                  className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-base font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Giriş Yap
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32 border-b border-border/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <AnimatedSection>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                Özellikler
              </h2>
              <p className="text-lg text-muted-foreground">
                Borç ve alacaklarınızı kolayca yönetin, vade takibi yapın
              </p>
            </AnimatedSection>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatedSection delay={0.1}>
              <div className="p-6 rounded-lg border border-border bg-card">
                <div className="p-3 rounded-md bg-primary/10 w-fit mb-4">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Otomatik Bildirimler</h3>
                <p className="text-muted-foreground">
                  SMS ve e-posta ile vade yaklaşan borç/alacaklarınız hakkında otomatik bildirim alın. 
                  30, 7, 3 gün önce ve vade günü hatırlatmaları.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="p-6 rounded-lg border border-border bg-card">
                <div className="p-3 rounded-md bg-primary/10 w-fit mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Kolay Takip</h3>
                <p className="text-muted-foreground">
                  Kişi ve firmalarınızın borç/alacaklarını tek bir yerden yönetin. 
                  Vade tarihleri, ödemeler ve kalan tutarlar her zaman elinizin altında.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="p-6 rounded-lg border border-border bg-card">
                <div className="p-3 rounded-md bg-primary/10 w-fit mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Detaylı İstatistikler</h3>
                <p className="text-muted-foreground">
                  Toplam alacak, borç ve net pozisyonunuzu görsel grafiklerle takip edin. 
                  Aylık trendler ve dağılım analizleri.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <div className="p-6 rounded-lg border border-border bg-card">
                <div className="p-3 rounded-md bg-primary/10 w-fit mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Güvenli ve Güvenilir</h3>
                <p className="text-muted-foreground">
                  Verileriniz güvende. İki adımlı doğrulama ile hesabınızı koruyun. 
                  Tüm işlemleriniz kayıt altında.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.5}>
              <div className="p-6 rounded-lg border border-border bg-card">
                <div className="p-3 rounded-md bg-primary/10 w-fit mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">E-posta Bildirimleri</h3>
                <p className="text-muted-foreground">
                  Vade yaklaşan işlemler hakkında detaylı e-posta bildirimleri alın. 
                  Bildirim tercihlerinizi özelleştirin.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.6}>
              <div className="p-6 rounded-lg border border-border bg-card">
                <div className="p-3 rounded-md bg-primary/10 w-fit mb-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">SMS Bildirimleri</h3>
                <p className="text-muted-foreground">
                  Telefon numaranıza SMS ile anında bildirim alın. 
                  Vade takibi için en hızlı yöntem.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Why Vanpara Section */}
      <section className="py-24 sm:py-32 border-b border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <AnimatedSection>
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                  Neden Vanpara?
                </h2>
                <p className="text-lg text-muted-foreground">
                  Basitlik ve anlaşılırlık önceliğimiz
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AnimatedSection delay={0.1}>
                <div className="p-6 rounded-lg border border-border bg-card">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-md bg-primary/10 mt-1">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-lg">Karmaşıklık Yok</h3>
                      <p className="text-muted-foreground">
                        Gereksiz özellikler yok. Sadece ihtiyacınız olanlar. 
                        Arayüz sade ve anlaşılır.
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <div className="p-6 rounded-lg border border-border bg-card">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-md bg-primary/10 mt-1">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-lg">Hızlı Başlangıç</h3>
                      <p className="text-muted-foreground">
                        Kayıt olun ve hemen kullanmaya başlayın. 
                        Karmaşık kurulumlar yok.
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.3}>
                <div className="p-6 rounded-lg border border-border bg-card">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-md bg-primary/10 mt-1">
                      <Wallet className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-lg">Herkes İçin</h3>
                      <p className="text-muted-foreground">
                        Teknik bilgi gerektirmez. Herkes kolayca kullanabilir. 
                        Bireysel kullanıcılar ve işletmeler için uygun.
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.4}>
                <div className="p-6 rounded-lg border border-border bg-card">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-md bg-primary/10 mt-1">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-lg">Güvenli</h3>
                      <p className="text-muted-foreground">
                        Verileriniz güvende. İki adımlı doğrulama ve şifreli bağlantılar. 
                        Gizliliğiniz korunuyor.
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 sm:py-32 border-b border-border/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <AnimatedSection>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                Planlar
              </h2>
              <p className="text-lg text-muted-foreground">
                İhtiyacınıza uygun planı seçin
              </p>
            </AnimatedSection>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Normal Plan */}
            <AnimatedSection delay={0.1}>
              <div className="p-8 rounded-lg border border-border bg-card">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">Normal Plan</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">Ücretsiz</span>
                  </div>
                  <p className="text-muted-foreground mt-2">Tamamen ücretsiz kullanın</p>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">10 kişi/firma</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">50 borç/alacak kaydı</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Otomatik bildirimler</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Dashboard ve istatistikler</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">SMS ve e-posta bildirimleri</span>
                  </li>
                </ul>

                <Link
                  href="/sign-up"
                  className="w-full inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Ücretsiz Başla
                </Link>
              </div>
            </AnimatedSection>

            {/* Pro Plan */}
            <AnimatedSection delay={0.2}>
              <div className="p-8 rounded-lg border-2 border-primary bg-card relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    <Crown className="h-3 w-3" />
                    Popüler
                  </span>
                </div>

                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">Pro Plan</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">300₺</span>
                    <span className="text-muted-foreground">/ay</span>
                  </div>
                  <p className="text-muted-foreground mt-2">Tüm özellikler + sınırsız</p>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">Sınırsız</strong> kişi/firma
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">Sınırsız</strong> borç/alacak kaydı
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Normal plan özellikleri</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">PDF Export</strong> (3 rapor tipi)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">Excel Export</strong> (CSV formatı)
                    </span>
                  </li>
                </ul>

                <Link
                  href="/sign-up"
                  className="w-full inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Pro Plana Başla
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <AnimatedSection>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                Hemen Başlayın
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Ücretsiz plan ile borç ve alacaklarınızı takip etmeye başlayın. 
                Karmaşık kurulumlar yok, hemen kullanmaya başlayın.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/sign-up"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Ücretsiz Kayıt Ol
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/sign-in"
                  className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-base font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Giriş Yap
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <span className="text-lg font-bold tracking-tight">Vanpara</span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-right">
              © {new Date().getFullYear()} Vanpara. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

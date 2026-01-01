import Link from "next/link";
import { Wallet, CheckCircle, Bell, Mail, Phone, TrendingUp, BarChart3, FileText, Shield, Zap, Crown, ArrowRight, Users, Receipt, Calendar, PieChart, Activity, Clock, MessageSquare, Settings } from "lucide-react";
import { AnimatedSection } from "./components/animated-section";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://vanpara.com';

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Vanpara",
  "url": baseUrl,
  "logo": `${baseUrl}/logo.png`,
  "description": "Basit ve anlaşılır borç/alacak takip sistemi",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+90-547-985-44-87",
    "contactType": "customer service",
    "email": "destek@vanpara.com",
    "areaServed": "TR",
    "availableLanguage": "Turkish"
  },
  "sameAs": []
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Vanpara",
  "url": baseUrl,
  "description": "Basit ve anlaşılır borç/alacak takip sistemi",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${baseUrl}/search?q={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  }
};

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Vanpara",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "offers": [
    {
      "@type": "Offer",
      "name": "Normal Plan",
      "price": "0",
      "priceCurrency": "TRY",
      "description": "Ücretsiz plan - 10 kişi/firma, 50 borç/alacak kaydı"
    },
    {
      "@type": "Offer",
      "name": "Pro Plan",
      "price": "300",
      "priceCurrency": "TRY",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "300",
        "priceCurrency": "TRY",
        "billingIncrement": "P1M"
      },
      "description": "Pro plan - Sınırsız kişi/firma ve borç/alacak kaydı, PDF ve Excel export"
    }
  ]
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
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
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/sign-in"
                className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Giriş Yap
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
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
                Güçlü Özellikler
              </h2>
              <p className="text-lg text-muted-foreground">
                Borç ve alacaklarınızı kolayca yönetin, vade takibi yapın, raporlar oluşturun
              </p>
            </AnimatedSection>
          </div>

          {/* Ana Özellikler - 3 Kolon */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <AnimatedSection delay={0.1}>
              <div className="p-8 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors h-full flex flex-col">
                <div className="p-4 rounded-xl bg-primary/10 w-fit mb-6">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Kişi/Firma Yönetimi</h3>
                <p className="text-muted-foreground mb-4 flex-grow">
                  Kişi ve firmalarınızın tüm bilgilerini tek bir yerden yönetin. İletişim bilgileri, adresler ve notlar.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>Kolay ekleme ve düzenleme</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>Detaylı iletişim bilgileri</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>Notlar ve özel bilgiler</span>
                  </li>
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="p-8 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors h-full flex flex-col">
                <div className="p-4 rounded-xl bg-primary/10 w-fit mb-6">
                  <Receipt className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Borç/Alacak Takibi</h3>
                <p className="text-muted-foreground mb-4 flex-grow">
                  Tüm borç ve alacak işlemlerinizi detaylı şekilde takip edin. Vade tarihleri, ödemeler ve kalan tutarlar.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>Vade tarihi takibi</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>Ödeme kayıtları</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>Durum yönetimi (Aktif/Kapalı)</span>
                  </li>
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="p-8 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors h-full flex flex-col">
                <div className="p-4 rounded-xl bg-primary/10 w-fit mb-6">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Dashboard & İstatistikler</h3>
                <p className="text-muted-foreground mb-4 flex-grow">
                  Finansal durumunuzu görsel grafiklerle takip edin. Toplam alacak, borç ve net pozisyon analizi.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>Görsel grafikler ve analizler</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>Aylık trend analizi</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>Dağılım raporları</span>
                  </li>
                </ul>
              </div>
            </AnimatedSection>
          </div>

          {/* Bildirim Özellikleri - 2 Kolon */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <AnimatedSection delay={0.4}>
              <div className="p-6 sm:p-8 rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  <div className="p-3 sm:p-4 rounded-xl bg-primary/20 w-fit">
                    <Bell className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Otomatik Bildirimler</h3>
                    <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                      Vade yaklaşan borç/alacaklarınız hakkında otomatik hatırlatmalar alın. 
                      Hiçbir şeyi kaçırmayın.
                    </p>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                        <span>30 gün önce</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                        <span>7 gün önce</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                        <span>3 gün önce</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                        <span>Vade günü</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.5}>
              <div className="p-6 sm:p-8 rounded-xl border border-border bg-card">
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  <div className="p-3 sm:p-4 rounded-xl bg-primary/10 w-fit">
                    <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">SMS & E-posta Bildirimleri</h3>
                    <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                      İstediğiniz kanaldan bildirim alın. SMS ile anında, e-posta ile detaylı bilgi.
                    </p>
                    <div className="flex gap-3 sm:gap-4">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        <span className="text-xs sm:text-sm font-medium">SMS</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        <span className="text-xs sm:text-sm font-medium">E-posta</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 sm:mt-3">
                      Bildirim tercihlerinizi özelleştirebilirsiniz
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Diğer Özellikler - 4 Kolon */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatedSection delay={0.6}>
              <div className="p-6 rounded-lg border border-border bg-card text-center">
                <div className="p-3 rounded-lg bg-primary/10 w-fit mx-auto mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Vade Takibi</h4>
                <p className="text-sm text-muted-foreground">
                  Bugün vadesi gelenler ve yaklaşan vadeleri görüntüleyin
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.7}>
              <div className="p-6 rounded-lg border border-border bg-card text-center">
                <div className="p-3 rounded-lg bg-primary/10 w-fit mx-auto mb-4">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Aktivite Günlükleri</h4>
                <p className="text-sm text-muted-foreground">
                  Tüm işlemlerinizin kaydı. Oluşturma, güncelleme ve silme logları
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.8}>
              <div className="p-6 rounded-lg border border-border bg-card text-center">
                <div className="p-3 rounded-lg bg-primary/10 w-fit mx-auto mb-4">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Özelleştirilebilir</h4>
                <p className="text-sm text-muted-foreground">
                  Bildirim ayarları ve tercihlerinizi kendinize göre düzenleyin
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.9}>
              <div className="p-6 rounded-lg border border-border bg-card text-center">
                <div className="p-3 rounded-lg bg-primary/10 w-fit mx-auto mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Raporlama (Pro)</h4>
                <p className="text-sm text-muted-foreground">
                  PDF ve Excel formatında detaylı raporlar oluşturun
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Why Vanpara Section */}
      <section className="py-16 sm:py-24 md:py-32 border-b border-border/40 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <AnimatedSection>
              <div className="text-center mb-12 sm:mb-16">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm mb-4 sm:mb-6">
                  <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                  <span className="text-primary font-medium">Basitlik ve Sadelik</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 sm:mb-6 px-4">
                  Neden Vanpara?
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
                  Karmaşık sistemler insanları yoruyor. Nerede, nasıl, neyi bulacağınızı bilmek zorunda değilsiniz. 
                  <strong className="text-foreground"> Vanpara'da her şey basit, sade ve anlaşılır.</strong>
                </p>
              </div>
            </AnimatedSection>

            {/* Ana Mesaj Kartı */}
            <AnimatedSection delay={0.1}>
              <div className="p-8 md:p-12 rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-background mb-12">
                <div className="max-w-3xl mx-auto text-center">
                  <div className="p-4 rounded-xl bg-primary/20 w-fit mx-auto mb-6">
                    <Wallet className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    Karmaşıklık Yok, Sadece Basitlik
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Diğer sistemlerde kaybolmayın. Vanpara'da ihtiyacınız olan her şey bir tık uzağınızda. 
                    Gereksiz özellikler, karmaşık menüler, anlaşılmaz terimler yok. 
                    <strong className="text-foreground"> Sadece ihtiyacınız olanlar, sade ve anlaşılır şekilde.</strong>
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Özellik Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatedSection delay={0.2}>
                <div className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors h-full">
                  <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Sade Arayüz</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Karmaşık menüler yok. Her şey açık ve net. Nerede ne olduğunu hemen görürsünüz. 
                    <strong className="text-foreground"> Kaybolmazsınız.</strong>
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.3}>
                <div className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors h-full">
                  <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Hemen Başlayın</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Karmaşık kurulumlar, uzun eğitimler yok. 
                    <strong className="text-foreground"> Kayıt olun, hemen kullanmaya başlayın.</strong> 
                    Her şey sezgisel.
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.4}>
                <div className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors h-full">
                  <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Herkes İçin</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Teknik bilgi gerektirmez. 
                    <strong className="text-foreground"> Herkes kolayca kullanabilir.</strong> 
                    Bireysel kullanıcılar, küçük işletmeler, büyük firmalar - hepsi için.
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.5}>
                <div className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors h-full">
                  <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Gereksiz Özellik Yok</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Sadece ihtiyacınız olanlar. Kullanmadığınız özelliklerle uğraşmayın. 
                    <strong className="text-foreground"> Odaklanın, yönetin, takip edin.</strong>
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.6}>
                <div className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors h-full">
                  <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Güvenli ve Güvenilir</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Basit olması güvensiz olduğu anlamına gelmez. 
                    <strong className="text-foreground"> Verileriniz güvende,</strong> 
                    işlemleriniz kayıt altında.
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.7}>
                <div className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors h-full">
                  <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Zaman Kazandırır</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Karmaşık sistemlerde kaybolmayın. 
                    <strong className="text-foreground"> Vanpara ile işlerinizi hızlıca halledin.</strong> 
                    Daha az tıklama, daha çok verimlilik.
                  </p>
                </div>
              </AnimatedSection>
            </div>

            {/* Sonuç Mesajı */}
            <AnimatedSection delay={0.8}>
              <div className="mt-12 text-center">
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  <strong className="text-foreground text-xl">Karmaşık sistemler yoruyor.</strong> 
                  <br className="hidden sm:block" />
                  Vanpara ile yorulmayın, sadece kullanın.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 sm:py-24 md:py-32 border-b border-border/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12 sm:mb-16">
            <AnimatedSection>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4">
                Planlar
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground px-4">
                İhtiyacınıza uygun planı seçin
              </p>
            </AnimatedSection>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
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
                      <strong className="text-foreground">PDF ve Excel Export</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      Detaylı raporlar ve analizler
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
      <section className="py-16 sm:py-24 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <AnimatedSection>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4 px-4">
                Hemen Başlayın
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 px-4">
                Ücretsiz plan ile borç ve alacaklarınızı takip etmeye başlayın. 
                Karmaşık kurulumlar yok, hemen kullanmaya başlayın.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                <Link
                  href="/sign-up"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Ücretsiz Kayıt Ol
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/sign-in"
                  className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Giriş Yap
                </Link>
              </div>
            </AnimatedSection>
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
    </>
  );
}

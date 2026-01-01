import Link from "next/link";
import { Wallet, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://vanpara.com';

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description: "Vanpara gizlilik politikası ve veri koruma bilgileri. KVKK kapsamında verilerinizin nasıl korunduğunu ve kullanıldığını öğrenin.",
  keywords: ["vanpara gizlilik", "vanpara veri koruma", "vanpara KVKK", "borç takip sistemi gizlilik", "veri güvenliği"],
  openGraph: {
    title: "Gizlilik Politikası - Vanpara",
    description: "Vanpara gizlilik politikası ve veri koruma bilgileri. KVKK kapsamında verilerinizin nasıl korunduğunu ve kullanıldığını öğrenin.",
    url: `${baseUrl}/privacy`,
    type: "website",
  },
  alternates: {
    canonical: `${baseUrl}/privacy`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Privacy() {
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
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Gizlilik Politikası
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Son güncelleme: {new Date().toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="prose prose-sm sm:prose-base max-w-none space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3">1. Veri Toplama</h2>
              <p>
                Vanpara, hizmetlerimizi sağlamak için aşağıdaki bilgileri toplar:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Ad, soyad, e-posta ve telefon numarası</li>
                <li>Kişi/firma bilgileri ve borç/alacak kayıtları</li>
                <li>Kullanım verileri ve aktivite logları</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3">2. Veri Kullanımı</h2>
              <p>
                Toplanan veriler aşağıdaki amaçlarla kullanılır:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Hizmetlerimizi sağlamak ve geliştirmek</li>
                <li>Bildirimler göndermek (SMS ve e-posta)</li>
                <li>Hesap güvenliğini sağlamak</li>
                <li>Yasal yükümlülükleri yerine getirmek</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3">3. Veri Güvenliği</h2>
              <p>
                Verilerinizin güvenliği bizim için önemlidir. Verilerinizi korumak için:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Şifreli bağlantılar (HTTPS) kullanıyoruz</li>
                <li>İki adımlı doğrulama sistemi sunuyoruz</li>
                <li>Düzenli güvenlik güncellemeleri yapıyoruz</li>
                <li>Verilerinize sadece yetkili personel erişebilir</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3">4. Veri Paylaşımı</h2>
              <p>
                Verilerinizi üçüncü taraflarla paylaşmıyoruz. Ancak aşağıdaki durumlarda paylaşım yapılabilir:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Yasal yükümlülükler gereği</li>
                <li>Hizmet sağlayıcılarımız (e-posta, SMS servisleri) - sadece hizmet sağlama amaçlı</li>
                <li>Kullanıcının açık izni ile</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3">5. Veri Saklama</h2>
              <p>
                Verileriniz, hesabınız aktif olduğu sürece saklanır. Hesabınızı sildiğinizde, 
                verileriniz güvenli bir şekilde silinir.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3">6. Haklarınız</h2>
              <p>
                KVKK kapsamında aşağıdaki haklara sahipsiniz:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Kişisel verilerinize erişim</li>
                <li>Verilerinizin düzeltilmesi</li>
                <li>Verilerinizin silinmesi</li>
                <li>Veri işlemeye itiraz etme</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3">7. Çerezler</h2>
              <p>
                Vanpara, hizmetlerimizi iyileştirmek için çerezler kullanır. 
                Çerezler, oturum yönetimi ve kullanıcı deneyimi için gereklidir.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3">8. İletişim</h2>
              <p>
                Gizlilik politikamız hakkında sorularınız için{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  İletişim
                </Link>{" "}
                sayfamızı kullanabilirsiniz.
              </p>
            </section>
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


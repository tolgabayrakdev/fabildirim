# Vanpara Plan Karşılaştırması

## Normal Plan vs Pro Plan

### 📋 Genel Bilgiler

| Özellik | Normal Plan | Pro Plan |
|---------|------------|----------|
| **Fiyat** | Ücretsiz | 300 TL/ay |
| **Kayıt** | Otomatik (Yeni kullanıcılar) | Manuel yükseltme |

---

## 🔢 Limitler

### Kişi/Firma Limiti

| Plan | Limit |
|------|-------|
| **Normal Plan** | Maksimum **10** kişi/firma |
| **Pro Plan** | **Sınırsız** kişi/firma |

### Borç/Alacak Kaydı Limiti

| Plan | Limit |
|------|-------|
| **Normal Plan** | Maksimum **50** borç/alacak kaydı |
| **Pro Plan** | **Sınırsız** borç/alacak kaydı |

---

## ✨ Özellikler

### Temel Özellikler (Her İki Planda Mevcut)

✅ **Kişi/Firma Yönetimi**
- Kişi/firma ekleme, düzenleme, silme
- İletişim bilgileri (telefon, e-posta, adres)
- Notlar ekleme

✅ **Borç/Alacak Takibi**
- Borç ve alacak kayıtları oluşturma
- Vade tarihi takibi
- Ödeme kayıtları
- Durum yönetimi (Aktif/Kapalı)

✅ **Dashboard**
- Toplam alacak/borç özeti
- Net pozisyon hesaplama
- Bugün vadesi gelenler
- Vadesi yaklaşanlar listesi

✅ **İstatistikler**
- Grafikler ve analizler
- Toplam alacak vs borç
- İşlem tipi dağılımı
- Kişi/firma bazlı dağılım
- Durum dağılımı
- Aylık trend analizi

✅ **Bildirim Sistemi**
- Otomatik hatırlatmalar (30, 7, 3 gün önce ve vade günü)
- Manuel bildirim gönderme
- E-posta ve SMS bildirimleri
- Bildirim ayarları yönetimi

✅ **Aktivite Günlükleri**
- Tüm işlemlerin kaydı
- Oluşturma, güncelleme, silme logları

---

## 🎯 Sadece Pro Plan'da Mevcut Özellikler

### 📄 PDF Export

Pro plan kullanıcıları aşağıdaki raporları PDF formatında dışa aktarabilir:

1. **Borç/Alacak Raporu**
   - Tüm borç/alacak kayıtları
   - Özet bilgiler (toplam alacak, borç, net pozisyon)
   - Filtreleme desteği (tip, durum)

2. **Kişi/Firma Raporu**
   - Tüm kişi/firma listesi
   - İletişim bilgileri

3. **Dashboard Özet Raporu**
   - Genel özet
   - Bugün vadesi gelenler
   - Vadesi yaklaşanlar (7, 15, 30 gün)

### 📊 Excel Export (CSV Formatı)

Pro plan kullanıcıları aynı raporları Excel uyumlu CSV formatında indirebilir:

1. **Borç/Alacak Raporu (CSV)**
2. **Kişi/Firma Raporu (CSV)**
3. **Dashboard Özet Raporu (CSV)**

**Not:** CSV dosyaları UTF-8 BOM ile kodlanmıştır, Türkçe karakterler Excel'de düzgün görüntülenir.

---

## ⚠️ Limit Uyarıları

### Normal Plan Kullanıcıları İçin

- **Kişi/Firma Limiti:** 10 kişi/firma limitine yaklaşıldığında (3 veya daha az kaldığında) uyarı gösterilir
- **Borç/Alacak Limiti:** 50 kayıt limitine yaklaşıldığında (3 veya daha az kaldığında) uyarı gösterilir
- Limit dolduğunda yeni kayıt eklenemez, Pro plana yükseltme önerilir

### Pro Plan Kullanıcıları İçin

- Limit uyarıları gösterilmez (sınırsız)
- Tüm özelliklere erişim sağlanır

---

## 🔄 Plan Yükseltme/Düşürme

### Normal → Pro

- Kullanıcılar istedikleri zaman Pro plana yükseltebilir
- Pro plana geçiş anında aktif olur
- Sınırsız limitler hemen devreye girer
- PDF/Excel export özellikleri hemen kullanılabilir

### Pro → Normal

- Kullanıcılar istedikleri zaman Normal plana düşürebilir
- Mevcut kayıtlar korunur
- Limitler uygulanmaya başlar (10 kişi/firma, 50 borç/alacak)
- PDF/Excel export özellikleri devre dışı kalır
- Limit aşılıyorsa yeni kayıt eklenemez (mevcut kayıtlar silinmez)

---

## 📝 Teknik Detaylar

### Plan Kontrolü

- Plan kontrolü backend'de yapılır
- Her istekte kullanıcının aktif planı kontrol edilir
- Limit kontrolleri gerçek zamanlıdır

### Export Özellikleri

- PDF export: HTML template kullanılarak oluşturulur, tarayıcı print özelliği ile PDF'e çevrilir
- Excel export: CSV formatında indirilir, Excel ve diğer spreadsheet uygulamaları ile açılabilir

### Bildirim Sistemi

- Her iki planda da otomatik bildirimler mevcuttur
- Bildirim ayarları kullanıcı tarafından özelleştirilebilir
- E-posta ve SMS gönderimi için gerekli servisler yapılandırılmalıdır

---

## 💡 Öneriler

### Normal Plan Kimler İçin Uygundur?

- Küçük işletmeler
- Bireysel kullanıcılar
- Az sayıda kişi/firma takibi yapanlar
- Raporlama ihtiyacı olmayanlar

### Pro Plan Kimler İçin Uygundur?

- Orta ve büyük ölçekli işletmeler
- Çok sayıda kişi/firma takibi yapanlar
- Düzenli raporlama ihtiyacı olanlar
- PDF/Excel export gereksinimi olanlar
- Sınırsız kayıt ihtiyacı olanlar

---

## 📞 Destek

Plan değişiklikleri ve limitler hakkında sorularınız için:
- Ayarlar sayfasından plan yönetimi yapabilirsiniz
- Sistem yöneticisi ile iletişime geçebilirsiniz

---

**Son Güncelleme:** 2024
**Versiyon:** 1.0.0


# Vanpara API Dokümantasyonu

Borç/Alacak Takip Yazılımı - Backend API Dokümantasyonu

**Base URL:** `http://localhost:1234/api`  
**Version:** 1.0.0

## İçindekiler

- [Genel Bilgiler](#genel-bilgiler)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
  - [Auth Endpoints](#auth-endpoints)
  - [Subscription Endpoints](#subscription-endpoints)
  - [Contact Endpoints](#contact-endpoints)
  - [Debt Transaction Endpoints](#debt-transaction-endpoints)
  - [Payment Endpoints](#payment-endpoints)
  - [Dashboard Endpoints](#dashboard-endpoints)

---

## Genel Bilgiler

### Response Format

Tüm API endpoint'leri standart bir response formatı kullanır:

**Başarılı Response:**
```json
{
  "success": true,
  "message": "İşlem başarılı",
  "data": { ... }
}
```

**Hata Response:**
```json
{
  "success": false,
  "message": "Hata mesajı"
}
```

### HTTP Status Kodları

- `200` - Başarılı
- `201` - Oluşturuldu
- `400` - Geçersiz istek
- `401` - Yetkilendirme hatası
- `403` - Erişim reddedildi
- `404` - Bulunamadı
- `409` - Çakışma (örn: email zaten kullanılıyor)
- `429` - Çok fazla istek (rate limit)
- `500` - Sunucu hatası

### Authentication

Çoğu endpoint authentication gerektirir. Authentication için JWT token kullanılır. Token'lar:

- **Cookie olarak:** `access_token` (httpOnly, secure, sameSite: none)
- **Header olarak:** `Authorization: Bearer <token>`
- **Query parameter olarak:** `?token=<token>`

---

## API Endpoints

## Auth Endpoints

### 1. Kullanıcı Kaydı

**POST** `/api/auth/register`

Rate Limit: Var (authRateLimiter)

**Request Body:**
```json
{
  "first_name": "Ahmet",
  "last_name": "Yılmaz",
  "email": "ahmet@example.com",
  "phone": "05371234567",
  "password": "SecurePass123"
}
```

**Validation:**
- `first_name`: 2-50 karakter, zorunlu
- `last_name`: 2-50 karakter, zorunlu
- `email`: Geçerli email formatı, zorunlu, unique
- `phone`: 10 haneli, 5 ile başlamalı, zorunlu, unique
- `password`: Min 8 karakter, en az 1 büyük harf, 1 küçük harf, 1 rakam

**Response:**
```json
{
  "success": true,
  "message": "Kullanıcı başarıyla oluşturuldu.",
  "data": {
    "id": "uuid",
    "first_name": "Ahmet",
    "last_name": "Yılmaz",
    "email": "ahmet@example.com",
    "phone": "05371234567",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 2. Kullanıcı Girişi

**POST** `/api/auth/login`

Rate Limit: Var (authRateLimiter)

**Request Body:**
```json
{
  "email": "ahmet@example.com",
  "password": "SecurePass123"
}
```

**Response (Başarılı Giriş):**
```json
{
  "success": true,
  "message": "Giriş başarılı."
}
```
Cookie'ler otomatik olarak set edilir.

**Response (Email Doğrulaması Gerekli):**
```json
{
  "success": true,
  "message": "E-posta doğrulaması gerekiyor.",
  "data": {
    "emailRequired": true,
    "email": "ahmet@example.com"
  }
}
```

**Response (SMS Doğrulaması Gerekli):**
```json
{
  "success": true,
  "message": "SMS doğrulaması gerekiyor.",
  "data": {
    "smsRequired": true,
    "email": "ahmet@example.com",
    "maskedPhone": "05**123**67"
  }
}
```

---

### 3. Çıkış

**POST** `/api/auth/logout`

**Response:**
```json
{
  "success": true,
  "message": "Çıkış işlemi başarıyla gerçekleştirildi."
}
```

---

### 4. E-posta OTP Doğrulama

**POST** `/api/auth/verify-email-otp`

**Request Body:**
```json
{
  "email": "ahmet@example.com",
  "code": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "E-posta başarıyla doğrulandı.",
  "data": {
    "requiresSmsVerification": true,
    "maskedPhone": "05**123**67"
  }
}
```
Eğer SMS doğrulaması gerekmiyorsa token'lar cookie'ye set edilir.

---

### 5. SMS OTP Doğrulama

**POST** `/api/auth/verify-sms-otp`

**Request Body:**
```json
{
  "email": "ahmet@example.com",
  "code": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "SMS başarıyla doğrulandı."
}
```
Token'lar cookie'ye set edilir.

---

### 6. E-posta Doğrulama Kodunu Tekrar Gönder

**POST** `/api/auth/resend-email-verification`

**Request Body:**
```json
{
  "email": "ahmet@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Doğrulama kodu e-posta adresinize gönderildi."
}
```

**Not:** Cooldown: 3 dakika (180 saniye)

---

### 7. SMS Doğrulama Kodunu Tekrar Gönder

**POST** `/api/auth/resend-sms-verification`

**Request Body:**
```json
{
  "email": "ahmet@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Doğrulama kodu telefon numaranıza gönderildi.",
  "data": {
    "maskedPhone": "05**123**67"
  }
}
```

**Not:** Cooldown: 3 dakika (180 saniye)

---

### 8. Şifremi Unuttum

**POST** `/api/auth/forgot-password`

Rate Limit: Var (authRateLimiter)

**Request Body:**
```json
{
  "email": "ahmet@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Eğer bu e-posta adresi kayıtlıysa, şifre sıfırlama linki gönderildi."
}
```

---

### 9. Reset Token Doğrulama

**POST** `/api/auth/verify-reset-token`

**Request Body:**
```json
{
  "token": "reset-token-string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token geçerli.",
  "data": {
    "valid": true,
    "email": "ahmet@example.com"
  }
}
```

---

### 10. Şifre Sıfırlama

**POST** `/api/auth/reset-password`

**Request Body:**
```json
{
  "token": "reset-token-string",
  "password": "NewSecurePass123"
}
```

**Validation:**
- `password`: Min 8 karakter, en az 1 büyük harf, 1 küçük harf, 1 rakam

**Response:**
```json
{
  "success": true,
  "message": "Şifreniz başarıyla sıfırlandı."
}
```

---

### 11. Mevcut Kullanıcı Bilgileri

**GET** `/api/auth/me`

**Authentication:** Gerekli

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "ahmet@example.com",
    "name": "Ahmet Yılmaz",
    "first_name": "Ahmet",
    "last_name": "Yılmaz",
    "phone": "05371234567",
    "created_at": "2024-01-01T00:00:00.000Z",
    "subscription": {
      "id": "uuid",
      "plan": {
        "id": "uuid",
        "name": "Normal",
        "price": 0
      },
      "status": "active",
      "start_date": "2024-01-01T00:00:00.000Z",
      "end_date": null
    }
  }
}
```

---

### 12. Şifre Değiştirme

**POST** `/api/auth/change-password`

**Authentication:** Gerekli

**Request Body:**
```json
{
  "currentPassword": "OldSecurePass123",
  "newPassword": "NewSecurePass123"
}
```

**Validation:**
- `newPassword`: Min 8 karakter, en az 1 büyük harf, 1 küçük harf, 1 rakam
- Yeni şifre mevcut şifre ile aynı olamaz

**Response:**
```json
{
  "success": true,
  "message": "Şifreniz başarıyla değiştirildi."
}
```

---

### 13. Hesap Silme

**DELETE** `/api/auth/delete-account`

**Authentication:** Gerekli

**Response:**
```json
{
  "success": true,
  "message": "Hesabınız başarıyla silindi."
}
```

---

## Subscription Endpoints

### 1. Mevcut Üyelik Bilgisi

**GET** `/api/subscriptions/current`

**Authentication:** Gerekli

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "plan": {
      "id": "uuid",
      "name": "Normal",
      "price": 0
    },
    "status": "active",
    "start_date": "2024-01-01T00:00:00.000Z",
    "end_date": null
  }
}
```

---

### 2. Tüm Planları Listele

**GET** `/api/subscriptions/plans`

**Authentication:** Gerekli değil

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Normal",
      "price": 0
    },
    {
      "id": "uuid",
      "name": "Pro",
      "price": 300
    }
  ]
}
```

---

### 3. Üyelik Yükseltme

**POST** `/api/subscriptions/upgrade`

**Authentication:** Gerekli

**Request Body:**
```json
{
  "plan_name": "Pro"
}
```

**Validation:**
- `plan_name`: "Normal" veya "Pro" olmalı

**Response:**
```json
{
  "success": true,
  "message": "Üyelik başarıyla yükseltildi.",
  "data": {
    "id": "uuid",
    "plan": {
      "id": "uuid",
      "name": "Pro",
      "price": 300
    },
    "status": "active",
    "start_date": "2024-01-01T00:00:00.000Z",
    "end_date": null
  }
}
```

---

## Contact Endpoints

### 1. Tüm Kişi/Firmaları Listele

**GET** `/api/contacts`

**Authentication:** Gerekli

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "name": "Ahmet Yılmaz",
      "phone": "05371234567",
      "email": "ahmet@example.com",
      "address": "İstanbul, Türkiye",
      "notes": "Notlar buraya",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 2. Kişi/Firma Detayı

**GET** `/api/contacts/:id`

**Authentication:** Gerekli

**Parameters:**
- `id` (UUID): Kişi/Firma ID'si

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "name": "Ahmet Yılmaz",
    "phone": "05371234567",
    "email": "ahmet@example.com",
    "address": "İstanbul, Türkiye",
    "notes": "Notlar buraya",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 3. Yeni Kişi/Firma Oluştur

**POST** `/api/contacts`

**Authentication:** Gerekli

**Request Body:**
```json
{
  "name": "Ahmet Yılmaz",
  "phone": "05371234567",
  "email": "ahmet@example.com",
  "address": "İstanbul, Türkiye",
  "notes": "Notlar buraya"
}
```

**Validation:**
- `name`: 1-255 karakter, zorunlu
- `phone`: Geçerli telefon formatı (opsiyonel)
- `email`: Geçerli email formatı (opsiyonel)
- `address`: Max 1000 karakter (opsiyonel)
- `notes`: Max 5000 karakter (opsiyonel)

**Response:**
```json
{
  "success": true,
  "message": "Kişi/Firma başarıyla oluşturuldu.",
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "name": "Ahmet Yılmaz",
    "phone": "05371234567",
    "email": "ahmet@example.com",
    "address": "İstanbul, Türkiye",
    "notes": "Notlar buraya",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 4. Kişi/Firma Güncelle

**PUT** `/api/contacts/:id`

**Authentication:** Gerekli

**Parameters:**
- `id` (UUID): Kişi/Firma ID'si

**Request Body:**
```json
{
  "name": "Ahmet Yılmaz",
  "phone": "05371234567",
  "email": "ahmet@example.com",
  "address": "İstanbul, Türkiye",
  "notes": "Notlar buraya"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Kişi/Firma başarıyla güncellendi.",
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "name": "Ahmet Yılmaz",
    "phone": "05371234567",
    "email": "ahmet@example.com",
    "address": "İstanbul, Türkiye",
    "notes": "Notlar buraya",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 5. Kişi/Firma Sil

**DELETE** `/api/contacts/:id`

**Authentication:** Gerekli

**Parameters:**
- `id` (UUID): Kişi/Firma ID'si

**Response:**
```json
{
  "success": true,
  "message": "Kişi/Firma başarıyla silindi."
}
```

**Not:** İlişkili borç/alacak kayıtları da silinir (CASCADE).

---

## Debt Transaction Endpoints

### 1. Tüm Borç/Alacak Kayıtlarını Listele

**GET** `/api/debt-transactions`

**Authentication:** Gerekli

**Query Parameters:**
- `status` (opsiyonel): "active" veya "closed"
- `type` (opsiyonel): "debt" veya "receivable"

**Example:**
```
GET /api/debt-transactions?status=active&type=receivable
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "contact_id": "uuid",
      "contact_name": "Ahmet Yılmaz",
      "contact_phone": "05371234567",
      "contact_email": "ahmet@example.com",
      "type": "receivable",
      "amount": "5000.00",
      "remaining_amount": "3000.00",
      "due_date": "2024-02-01",
      "description": "Açıklama",
      "status": "active",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 2. Borç/Alacak Detayı

**GET** `/api/debt-transactions/:id`

**Authentication:** Gerekli

**Parameters:**
- `id` (UUID): Borç/Alacak ID'si

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "contact_id": "uuid",
    "contact_name": "Ahmet Yılmaz",
    "contact_phone": "05371234567",
    "contact_email": "ahmet@example.com",
    "contact_address": "İstanbul, Türkiye",
    "contact_notes": "Notlar",
    "type": "receivable",
    "amount": "5000.00",
    "remaining_amount": "3000.00",
    "due_date": "2024-02-01",
    "description": "Açıklama",
    "status": "active",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 3. Bugün Vadesi Gelen İşlemler

**GET** `/api/debt-transactions/today-due`

**Authentication:** Gerekli

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "contact_name": "Ahmet Yılmaz",
      "contact_phone": "05371234567",
      "contact_email": "ahmet@example.com",
      "type": "receivable",
      "amount": "5000.00",
      "remaining_amount": "3000.00",
      "due_date": "2024-01-15",
      "description": "Açıklama",
      "status": "active"
    }
  ]
}
```

---

### 4. Toplam Alacak

**GET** `/api/debt-transactions/total-receivable`

**Authentication:** Gerekli

**Response:**
```json
{
  "success": true,
  "data": {
    "total_receivable": 50000.50
  }
}
```

---

### 5. Toplam Borç

**GET** `/api/debt-transactions/total-debt`

**Authentication:** Gerekli

**Response:**
```json
{
  "success": true,
  "data": {
    "total_debt": 25000.00
  }
}
```

---

### 6. Kişi/Firmaya Ait İşlemler

**GET** `/api/debt-transactions/contact/:contactId`

**Authentication:** Gerekli

**Parameters:**
- `contactId` (UUID): Kişi/Firma ID'si

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "receivable",
      "amount": "5000.00",
      "remaining_amount": "3000.00",
      "due_date": "2024-02-01",
      "status": "active"
    }
  ]
}
```

---

### 7. Yeni Borç/Alacak Oluştur

**POST** `/api/debt-transactions`

**Authentication:** Gerekli

**Request Body:**
```json
{
  "contact_id": "uuid",
  "type": "receivable",
  "amount": 5000.00,
  "due_date": "2024-02-01",
  "description": "Açıklama"
}
```

**Validation:**
- `contact_id`: UUID, zorunlu
- `type`: "debt" veya "receivable", zorunlu
- `amount`: Pozitif sayı, 2 ondalık basamak, zorunlu
- `due_date`: ISO date format (YYYY-MM-DD), zorunlu
- `description`: Max 5000 karakter (opsiyonel)

**Response:**
```json
{
  "success": true,
  "message": "Borç/Alacak kaydı başarıyla oluşturuldu.",
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "contact_id": "uuid",
    "type": "receivable",
    "amount": "5000.00",
    "remaining_amount": "5000.00",
    "due_date": "2024-02-01",
    "description": "Açıklama",
    "status": "active",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Not:** `remaining_amount` başlangıçta `amount` ile aynı değere set edilir.

---

### 8. Borç/Alacak Güncelle

**PUT** `/api/debt-transactions/:id`

**Authentication:** Gerekli

**Parameters:**
- `id` (UUID): Borç/Alacak ID'si

**Request Body:**
```json
{
  "contact_id": "uuid",
  "type": "receivable",
  "amount": 5000.00,
  "remaining_amount": 3000.00,
  "due_date": "2024-02-01",
  "status": "active",
  "description": "Açıklama"
}
```

**Validation:**
- `remaining_amount`: Toplam tutardan fazla olamaz
- `status`: "active" veya "closed", zorunlu

**Response:**
```json
{
  "success": true,
  "message": "Borç/Alacak kaydı başarıyla güncellendi.",
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "contact_id": "uuid",
    "type": "receivable",
    "amount": "5000.00",
    "remaining_amount": "3000.00",
    "due_date": "2024-02-01",
    "description": "Açıklama",
    "status": "active",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 9. Borç/Alacak Sil

**DELETE** `/api/debt-transactions/:id`

**Authentication:** Gerekli

**Parameters:**
- `id` (UUID): Borç/Alacak ID'si

**Response:**
```json
{
  "success": true,
  "message": "Borç/Alacak kaydı başarıyla silindi."
}
```

**Not:** İlişkili ödemeler de silinir (CASCADE).

---

## Payment Endpoints

### 1. Bir İşleme Ait Ödemeleri Listele

**GET** `/api/payments/transaction/:transactionId`

**Authentication:** Gerekli

**Parameters:**
- `transactionId` (UUID): Borç/Alacak ID'si

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "transaction_id": "uuid",
      "amount": "2000.00",
      "payment_date": "2024-01-15",
      "description": "İlk ödeme",
      "created_at": "2024-01-15T00:00:00.000Z"
    }
  ]
}
```

---

### 2. Ödeme Detayı

**GET** `/api/payments/:id`

**Authentication:** Gerekli

**Parameters:**
- `id` (UUID): Ödeme ID'si

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "transaction_id": "uuid",
    "amount": "2000.00",
    "payment_date": "2024-01-15",
    "description": "İlk ödeme",
    "created_at": "2024-01-15T00:00:00.000Z"
  }
}
```

---

### 3. Yeni Ödeme Ekle

**POST** `/api/payments`

**Authentication:** Gerekli

**Request Body:**
```json
{
  "transaction_id": "uuid",
  "amount": 2000.00,
  "payment_date": "2024-01-15",
  "description": "İlk ödeme"
}
```

**Validation:**
- `transaction_id`: UUID, zorunlu
- `amount`: Pozitif sayı, 2 ondalık basamak, zorunlu
- `payment_date`: ISO date format (YYYY-MM-DD), zorunlu
- `description`: Max 5000 karakter (opsiyonel)

**Response:**
```json
{
  "success": true,
  "message": "Ödeme kaydı başarıyla oluşturuldu.",
  "data": {
    "id": "uuid",
    "transaction_id": "uuid",
    "amount": "2000.00",
    "payment_date": "2024-01-15",
    "description": "İlk ödeme",
    "created_at": "2024-01-15T00:00:00.000Z"
  }
}
```

**Not:** 
- Ödeme eklendikten sonra `debt_transactions.remaining_amount` otomatik olarak güncellenir.
- Eğer `remaining_amount = 0` olursa, transaction'ın `status`'u otomatik olarak `closed` yapılır.
- Kapalı bir transaction'a ödeme eklenemez.

---

### 4. Ödeme Sil

**DELETE** `/api/payments/:id`

**Authentication:** Gerekli

**Parameters:**
- `id` (UUID): Ödeme ID'si

**Response:**
```json
{
  "success": true,
  "message": "Ödeme kaydı başarıyla silindi."
}
```

**Not:** Ödeme silindikten sonra `debt_transactions.remaining_amount` otomatik olarak yeniden hesaplanır ve güncellenir.

---

## Dashboard Endpoints

### 1. Dashboard Verileri

**GET** `/api/dashboard`

**Authentication:** Gerekli

**Response:**
```json
{
  "success": true,
  "data": {
    "today_due": [
      {
        "id": "uuid",
        "contact_name": "Ahmet Yılmaz",
        "contact_phone": "05371234567",
        "contact_email": "ahmet@example.com",
        "type": "receivable",
        "amount": "5000.00",
        "remaining_amount": "3000.00",
        "due_date": "2024-01-15",
        "description": "Açıklama",
        "status": "active"
      }
    ],
    "total_receivable": 50000.50,
    "total_debt": 25000.00,
    "net_position": 25000.50
  }
}
```

**Açıklama:**
- `today_due`: Bugün vadesi gelen aktif borç/alacak kayıtları
- `total_receivable`: Toplam alacak (aktif, receivable tipindeki kayıtların remaining_amount toplamı)
- `total_debt`: Toplam borç (aktif, debt tipindeki kayıtların remaining_amount toplamı)
- `net_position`: Net pozisyon (total_receivable - total_debt)

---

## Veri Tipleri

### UUID Format
Tüm ID'ler UUID v4 formatındadır:
```
550e8400-e29b-41d4-a716-446655440000
```

### Decimal Format
Para tutarları DECIMAL(15,2) formatındadır:
```json
"5000.00"
```

### Date Format
Tarihler ISO 8601 formatındadır (YYYY-MM-DD):
```
"2024-01-15"
```

### Timestamp Format
Zaman damgaları ISO 8601 formatındadır:
```
"2024-01-01T00:00:00.000Z"
```

---

## Hata Mesajları

### Genel Hatalar

| HTTP Kodu | Mesaj | Açıklama |
|-----------|-------|----------|
| 400 | Geçersiz istek | Request body veya parametreler geçersiz |
| 401 | Erişim token'ı bulunamadı | Authentication gerekli |
| 401 | Token süresi dolmuş | Token'ı yenilemeniz gerekiyor |
| 403 | Geçersiz token | Token doğrulaması başarısız |
| 404 | Kayıt bulunamadı | İstenen kayıt mevcut değil |
| 409 | Email/Telefon zaten kullanılıyor | Kayıt işlemi için unique constraint hatası |
| 429 | Çok fazla istek | Rate limit aşıldı |
| 500 | Sunucu hatası | Beklenmeyen bir hata oluştu |

### Özel Hata Mesajları

- **Şifre validasyonu hatası:** "Şifre en az 8 karakter olmalıdır"
- **Email formatı hatası:** "Geçerli bir e-posta adresi giriniz"
- **Telefon formatı hatası:** "Geçerli bir telefon numarası giriniz (örn: 05551234567)"
- **Kalan tutar hatası:** "Kalan tutar toplam tutardan fazla olamaz"
- **Kapalı transaction hatası:** "Kapalı bir borç/alacak kaydına ödeme eklenemez"

---

## Rate Limiting

Bazı endpoint'ler rate limiting ile korunmaktadır:

- **Auth endpoints** (`/api/auth/login`, `/api/auth/register`, `/api/auth/forgot-password`): `authRateLimiter`
- **Genel API endpoint'leri**: `generalRateLimiter`

Rate limit aşıldığında `429 Too Many Requests` hatası döner.

---

## Notlar

1. **Transaction Yönetimi:** Ödeme ekleme/silme işlemleri transaction içinde yapılır. Hata durumunda tüm işlemler geri alınır (rollback).

2. **Otomatik Status Güncelleme:** `remaining_amount = 0` olduğunda transaction status'u otomatik olarak `closed` yapılır.

3. **Cascade Delete:** 
   - Kullanıcı silindiğinde tüm ilişkili kayıtlar silinir
   - Kişi/Firma silindiğinde tüm borç/alacak kayıtları silinir
   - Borç/Alacak kaydı silindiğinde tüm ödemeler silinir

4. **Veri Bütünlüğü:** Tüm işlemler kullanıcıya özeldir. Bir kullanıcı sadece kendi verilerine erişebilir (user_id kontrolü).

5. **Password Hashing:** Şifreler bcrypt ile hash'lenir (cost factor: 10).

6. **JWT Tokens:** Access token ve refresh token mekanizması kullanılır. Token'lar cookie ve header üzerinden gönderilebilir.

---

## Örnek Kullanım Senaryoları

### Senaryo 1: Yeni Bir Alacak Kaydı Oluşturma

1. Kişi/Firma oluştur: `POST /api/contacts`
2. Alacak kaydı oluştur: `POST /api/debt-transactions` (type: "receivable")
3. Ödeme ekle: `POST /api/payments` (remaining_amount otomatik güncellenir)

### Senaryo 2: Bugün Vadesi Gelen İşlemleri Kontrol Etme

1. Dashboard'u kontrol et: `GET /api/dashboard` (today_due listesi)

### Senaryo 3: Toplam Risk Görünümü

1. Dashboard'u kontrol et: `GET /api/dashboard` (total_receivable: "X ₺ içeride")
   veya
2. Sadece toplam alacak: `GET /api/debt-transactions/total-receivable`

---

**Son Güncelleme:** 2026-01-01  
**Versiyon:** 1.0.0


# 🌐 TechCorp - Kurumsal Web Sitesi

## 📋 Proje Genel Bakış

Bu proje, teknik danışmanlık ve CRM çözümleri sunan kurumsal bir şirket için geliştirilmiş modern, çok dilli ve SEO uyumlu bir web sitesidir. Astro framework kullanılarak inşa edilmiş, React bileşenleri ve Tailwind CSS ile stillendirilmiştir.

### 🎯 Proje Hedefleri
- Profesyonel kurumsal kimlik yansıtma
- Çok dilli destek (Türkçe/İngilizce)
- Yüksek performans ve SEO optimizasyonu
- Mobil-first responsive tasarım
- KVKK/GDPR uyumlu veri koruma
- Kolay içerik yönetimi

## 🏗️ Teknik Mimari

### Framework ve Teknolojiler
- **Frontend Framework**: Astro 5.2.5
- **UI Framework**: React 19.1.0
- **Styling**: Tailwind CSS 3.4.17
- **Icons**: Lucide React 0.525.0
- **TypeScript**: Full type safety
- **Build Tool**: Vite (Astro entegreli)

### Proje Yapısı
```
src/
├── components/          # React ve Astro bileşenleri
│   ├── ContactForm.tsx         # İletişim formu (React)
│   ├── ContactFormComponent.tsx # Ana sayfa iletişim formu
│   ├── CookieBanner.tsx        # Çerez onay banner'ı
│   ├── DetailedServicesSection.astro # Detaylı hizmetler
│   ├── Footer.astro            # Site alt bilgi
│   ├── Hero.astro              # Ana sayfa hero bölümü
│   ├── HomeContactForm.astro   # Ana sayfa iletişim formu wrapper
│   ├── LanguageToggle.tsx      # Dil değiştirme butonu
│   ├── Navigation.astro        # Ana navigasyon menüsü
│   ├── ReferencesSection.astro # Referanslar bölümü
│   ├── ServicesCtaSection.astro # Hizmetler CTA bölümü
│   ├── ServicesSection.astro   # Hizmetler genel bakış
│   └── WhyChooseUsSection.astro # Neden biz bölümü
├── i18n/               # Çok dilli destek
│   ├── languages.ts    # Dil tanımları
│   ├── utils.ts        # Çeviri yardımcı fonksiyonları
│   ├── tr.json         # Türkçe çeviriler
│   └── en.json         # İngilizce çeviriler
├── layouts/            # Sayfa şablonları
│   └── Layout.astro    # Ana layout şablonu
└── pages/              # Sayfa dosyaları
    ├── index.astro     # Ana sayfa (TR)
    ├── about.astro     # Hakkımızda (TR)
    ├── services.astro  # Hizmetler (TR)
    ├── references.astro # Referanslar (TR)
    ├── contact.astro   # İletişim (TR)
    ├── faq.astro       # SSS (TR)
    ├── blog.astro      # Blog (TR)
    ├── privacy.astro   # Gizlilik Politikası (TR)
    └── en/             # İngilizce sayfalar
        ├── index.astro
        ├── about.astro
        ├── services.astro
        ├── references.astro
        ├── contact.astro
        ├── faq.astro
        ├── blog.astro
        └── privacy.astro
```

## 🌐 Çok Dilli Yapı

### Dil Yönetimi
- **Varsayılan Dil**: Türkçe (tr)
- **Desteklenen Diller**: Türkçe (tr), İngilizce (en)
- **URL Yapısı**: 
  - Türkçe: `/` (prefix yok)
  - İngilizce: `/en/`

### Çeviri Sistemi
- JSON tabanlı çeviri dosyaları
- Dinamik dil algılama
- URL tabanlı dil yönlendirme
- Bileşen seviyesinde çeviri desteği

### Dil Değiştirme
- Sağ üst köşede dil toggle butonu
- Mevcut sayfa korunarak dil değişimi
- Bayrak ikonları ile görsel destek

## 📄 Sayfa Yapısı ve İçerik

### 1. Ana Sayfa (/)
**Bölümler:**
- Hero Section: Etkileyici başlık ve CTA
- Hizmetler Özeti: 6 ana hizmet kartı
- Neden Biz: 4 temel avantaj
- Referanslar: 3 başarı hikayesi
- İstatistikler: Sayısal başarılar
- İletişim Formu: Hızlı iletişim

**Özellikler:**
- Animasyonlu hero bölümü
- Hover efektleri
- Responsive grid yapısı
- CTA butonları

### 2. Hakkımızda (/about)
**İçerik:**
- Şirket tanıtımı ve vizyon
- Deneyim ve uzmanlık alanları
- Sertifikalar ve yetkinlikler
- Çalışma yaklaşımı (5 adım)
- İstatistiksel veriler

**Tasarım:**
- İki kolonlu layout
- İnfografik tarzı süreç gösterimi
- Sertifika rozetleri
- CTA bölümü

### 3. Hizmetler (/services)
**Hizmet Kategorileri:**
1. Web Sitesi Kurulumu
2. Form ve CRM Entegrasyonu
3. CRM Seçimi ve Kurulumu
4. Otomasyon Sistemleri
5. SEO ve Teknik İyileştirme
6. Teknik Danışmanlık

**Her Hizmet İçin:**
- Detaylı açıklama
- Süreç adımları
- Paket detayları
- Teknoloji etiketleri
- Fiyat teklifi CTA

### 4. Referanslar (/references)
**Vaka Analizleri:**
- TechFlow Yazılım A.Ş. (Teknoloji)
- MediCare Özel Hastanesi (Sağlık)
- RetailMax Mağaza Zinciri (Perakende)

**Her Referans:**
- Şirket bilgileri
- Meydan okuma
- Sunulan çözüm
- Elde edilen sonuçlar
- Müşteri testimonialı
- Kullanılan teknolojiler

### 5. SSS (/faq)
**8 Temel Soru:**
- CRM nedir ve önemi
- Zoho CRM özellikleri
- Entegrasyon süreleri
- SEO uyumluluk
- Proje sonrası destek
- Fiyatlandırma modeli
- Sektörel deneyim
- Uzaktan çalışma

**Özellikler:**
- Açılır/kapanır animasyon
- Arama dostu yapı
- İletişim CTA

### 6. Blog (/blog)
**İçerik Kategorileri:**
- CRM Stratejileri
- Otomasyon İpuçları
- SEO Rehberleri
- Dijital Dönüşüm
- Vaka Analizleri

**Blog Özellikleri:**
- Kategori ve etiket sistemi
- Okuma süresi hesaplama
- Sidebar navigasyon
- SEO optimizasyonu

### 7. İletişim (/contact)
**Form Alanları:**
- Ad Soyad (zorunlu)
- E-posta (zorunlu)
- Şirket Adı (opsiyonel)
- İlgilenilen Hizmetler (çoklu seçim)
- Mesaj (opsiyonel)
- KVKK Onayı (zorunlu)

**İletişim Bilgileri:**
- E-posta adresleri
- Telefon numaraları
- Fiziksel adres
- Harita placeholder

### 8. Gizlilik Politikası (/privacy)
**KVKK/GDPR Uyumlu İçerik:**
- Veri sorumlusu bilgileri
- Toplanan veri türleri
- Veri kullanım amaçları
- Güvenlik önlemleri
- Kullanıcı hakları
- Çerez politikası
- İletişim bilgileri

## 🎨 Tasarım Sistemi

### Renk Paleti
```css
/* Primary Colors (Mavi) */
primary-50: #eff6ff
primary-100: #dbeafe
primary-200: #bfdbfe
primary-300: #93c5fd
primary-400: #60a5fa
primary-500: #3b82f6  /* Ana mavi */
primary-600: #2563eb
primary-700: #1d4ed8
primary-800: #1e40af
primary-900: #1e3a8a

/* Secondary Colors (Gri) */
secondary-50: #f8fafc
secondary-100: #f1f5f9
secondary-200: #e2e8f0
secondary-300: #cbd5e1
secondary-400: #94a3b8
secondary-500: #64748b  /* Ana gri */
secondary-600: #475569
secondary-700: #334155
secondary-800: #1e293b
secondary-900: #0f172a
```

### Tipografi
- **Font Ailesi**: Inter (Google Fonts)
- **Ağırlıklar**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Başlık Boyutları**: 
  - H1: 4xl (36px) - 6xl (60px)
  - H2: 3xl (30px) - 4xl (36px)
  - H3: 2xl (24px) - 3xl (30px)
  - H4: xl (20px) - 2xl (24px)

### Spacing System
- **8px Grid System**: Tüm spacing değerleri 8'in katları
- **Container**: max-w-7xl (1280px)
- **Padding**: px-4 sm:px-6 lg:px-8
- **Sections**: py-20 (160px dikey padding)

### Animasyonlar
```css
/* Özel Animasyonlar */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
```

### Responsive Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1280px

## 🔧 Geliştirme ve Deployment

### Geliştirme Komutları
```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build

# Build önizleme
npm run preview
```

### Build Optimizasyonları
- **Code Splitting**: Otomatik sayfa bazlı bölme
- **Image Optimization**: WebP format desteği
- **CSS Purging**: Kullanılmayan CSS temizleme
- **Minification**: HTML, CSS, JS sıkıştırma
- **Tree Shaking**: Kullanılmayan kod temizleme

### Performance Metrikleri
- **Lighthouse Score**: 95+ (tüm kategoriler)
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.5s

## 🔍 SEO Optimizasyonu

### Meta Tags
```html
<!-- Her sayfa için özelleştirilmiş -->
<title>Sayfa Başlığı | TechCorp</title>
<meta name="description" content="Sayfa açıklaması">
<meta name="keywords" content="anahtar, kelimeler">

<!-- Open Graph -->
<meta property="og:title" content="Sayfa Başlığı">
<meta property="og:description" content="Sayfa açıklaması">
<meta property="og:type" content="website">
<meta property="og:url" content="https://techcorp.com/sayfa">
<meta property="og:image" content="https://techcorp.com/og-image.jpg">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Sayfa Başlığı">
<meta name="twitter:description" content="Sayfa açıklaması">
<meta name="twitter:image" content="https://techcorp.com/twitter-image.jpg">
```

### Schema Markup (JSON-LD)
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "TechCorp",
  "url": "https://techcorp.com",
  "logo": "https://techcorp.com/logo.png",
  "description": "Teknik danışmanlık ve CRM çözümleri",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Maslak Mahallesi Büyükdere Caddesi No: 123",
    "addressLocality": "İstanbul",
    "postalCode": "34485",
    "addressCountry": "TR"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+90-212-123-45-67",
    "contactType": "customer service"
  }
}
```

### URL Yapısı
```
# Türkçe (Varsayılan)
https://techcorp.com/
https://techcorp.com/hakkimizda
https://techcorp.com/hizmetlerimiz
https://techcorp.com/referanslar
https://techcorp.com/iletisim
https://techcorp.com/sss
https://techcorp.com/blog
https://techcorp.com/gizlilik-politikasi

# İngilizce
https://techcorp.com/en/
https://techcorp.com/en/about
https://techcorp.com/en/services
https://techcorp.com/en/references
https://techcorp.com/en/contact
https://techcorp.com/en/faq
https://techcorp.com/en/blog
https://techcorp.com/en/privacy
```

### Sitemap ve Robots
```xml
<!-- sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://techcorp.com/</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Diğer sayfalar -->
</urlset>
```

```txt
# robots.txt
User-agent: *
Allow: /
Disallow: /admin/
Sitemap: https://techcorp.com/sitemap.xml
```

### Anahtar Kelime Stratejisi
**Ana Anahtar Kelimeler:**
- CRM danışmanlığı
- Zoho CRM kurulumu
- İş süreci otomasyonu
- Web sitesi geliştirme
- Teknik danışmanlık
- Dijital dönüşüm

**Uzun Kuyruk Anahtar Kelimeler:**
- "KOBİ için CRM çözümleri"
- "Zapier otomasyon hizmetleri"
- "Zoho CRM entegrasyon uzmanı"
- "İstanbul teknik danışmanlık"

## 🛡️ Güvenlik ve Uyumluluk

### KVKK/GDPR Uyumluluğu
- **Çerez Onay Sistemi**: Kullanıcı onayı ile çerez yönetimi
- **Gizlilik Politikası**: Detaylı veri işleme bilgileri
- **Veri Minimizasyonu**: Sadece gerekli veriler toplanır
- **Kullanıcı Hakları**: Erişim, düzeltme, silme hakları
- **Veri Güvenliği**: Şifreleme ve güvenli depolama

### Güvenlik Önlemleri
```javascript
// Content Security Policy
const csp = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  'img-src': ["'self'", "data:", "https:"],
  'font-src': ["'self'", "https://fonts.gstatic.com"]
};
```

### SSL/HTTPS
- **Zorunlu HTTPS**: Tüm sayfalar SSL ile korunur
- **HSTS Header**: HTTP Strict Transport Security
- **Secure Cookies**: Çerezler secure flag ile
- **Mixed Content**: HTTP içerik engelleme

## 📊 Analytics ve İzleme

### Google Analytics 4
```javascript
// GA4 Kurulumu
gtag('config', 'GA_MEASUREMENT_ID', {
  page_title: document.title,
  page_location: window.location.href,
  language: document.documentElement.lang
});
```

### Özel Etkinlik İzleme
- Form gönderileri
- CTA buton tıklamaları
- Sayfa kaydırma derinliği
- Dil değiştirme
- İndirme işlemleri

### Performans İzleme
- Core Web Vitals
- Sayfa yükleme süreleri
- Hata raporlama
- Kullanıcı deneyimi metrikleri

## 🚀 Gelecek Geliştirmeler

### Planlanan Özellikler
1. **CMS Entegrasyonu**: Headless CMS ile içerik yönetimi
2. **Blog Arama**: Gelişmiş arama ve filtreleme
3. **Canlı Chat**: Müşteri destek sistemi
4. **A/B Testing**: Dönüşüm optimizasyonu
5. **PWA Desteği**: Offline çalışma kabiliyeti
6. **API Entegrasyonu**: CRM sistemleri ile otomatik entegrasyon

### Teknik İyileştirmeler
- **Image Optimization**: Next-gen formatlar (AVIF)
- **Edge Computing**: CDN optimizasyonu
- **Database Integration**: Dinamik içerik yönetimi
- **Automated Testing**: Unit ve E2E testler
- **CI/CD Pipeline**: Otomatik deployment

## 📞 Destek ve İletişim

### Geliştirici Desteği
- **E-posta**: dev@techcorp.com
- **Dokümantasyon**: /docs klasörü
- **Issue Tracking**: GitHub Issues
- **Code Review**: Pull Request süreci

### Kullanıcı Desteği
- **E-posta**: support@techcorp.com
- **Telefon**: +90 212 123 45 67
- **Canlı Destek**: Web sitesi üzerinden
- **SSS**: Sık sorulan sorular bölümü

---

Bu README dosyası, projenin tüm teknik ve işlevsel detaylarını kapsamaktadır. Herhangi bir geliştirici veya yapay zeka sistemi bu dokümantasyon ile projeyi kolayca anlayabilir ve üzerinde çalışabilir.
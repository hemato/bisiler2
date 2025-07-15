# 🔍 SEO Optimizasyonları - Uygulama Rehberi

Bu dokümanda TechCorp projesi için eklenen SEO optimizasyonları ve bunların nasıl kullanılacağı açıklanmaktadır.

## 📋 Eklenen SEO Özellikleri

### 1. Sitemap.xml Oluşturma
- **Dosya**: `src/utils/sitemap.ts` ve `src/pages/sitemap.xml.ts`
- **URL**: `https://yourdomain.com/sitemap.xml`
- **Özellikler**:
  - Tüm sayfalar için otomatik sitemap oluşturma
  - Türkçe ve İngilizce sayfalar dahil
  - Priority ve changefreq ayarları
  - Blog yazıları için genişletilebilir yapı

### 2. Robots.txt
- **Dosya**: `public/robots.txt`
- **URL**: `https://yourdomain.com/robots.txt`
- **Özellikler**:
  - Arama motorları için yönlendirmeler
  - Sitemap referansı
  - Spam bot engellemeleri
  - Crawl-delay ayarları

### 3. Structured Data (JSON-LD)
- **Dosya**: `src/utils/structured-data.ts`
- **Özellikler**:
  - Organization schema (şirket bilgileri)
  - Website schema (site bilgileri)
  - Service schema (hizmet bilgileri)
  - FAQ schema (SSS sayfası için)
  - Breadcrumb schema (sayfa navigasyonu)

### 4. Gelişmiş Meta Tags ve Social Media
- **Open Graph Meta Tags**: Facebook ve diğer sosyal medya platformları için
- **Twitter Card Meta Tags**: Twitter için optimize edilmiş kartlar
- **Canonical URL**: Duplicate content önleme
- **Social Media Images**: Open Graph ve Twitter için özel görseller
- **Multi-language Support**: Dil bazlı meta tag optimizasyonu

### 5. Gelişmiş Meta Descriptions
- Ana sayfa için optimize edilmiş açıklamalar
- Her sayfa için özel meta descriptions
- Dil bazlı farklı açıklamalar

## 🚀 Kullanım Kılavuzu

### Sitemap Güncelleme
```typescript
// src/utils/sitemap.ts dosyasında SITE_URL'yi güncelleyin
const SITE_URL = 'https://yourdomain.com'; // Gerçek domain ile değiştirin

// Yeni sayfa eklemek için pages array'ine ekleyin:
const pages = [
  // ... mevcut sayfalar
  { url: '/new-page', priority: 0.7, changefreq: 'monthly' },
];
```

### Structured Data Kullanımı
```astro
---
// Herhangi bir .astro sayfasında
import { generateServiceSchema, generateBreadcrumbSchema } from '../utils/structured-data';

// Breadcrumb oluşturma
const breadcrumbs = [
  { name: 'Home', url: '/' },
  { name: 'Services', url: '/services' }
];
const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

// Layout'a geçirme
---
<Layout 
  title="Page Title"
  description="Page description"
  structuredData={breadcrumbSchema}
>
```

### Yeni Sayfa SEO Optimizasyonu
```astro
---
import Layout from '../layouts/Layout.astro';
import { generateBreadcrumbSchema } from '../utils/structured-data';

// Breadcrumb ve diğer structured data'ları oluşturun
const breadcrumbs = [
  { name: 'Home', url: '/' },
  { name: 'Current Page', url: '/current-page' }
];
const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
---

<Layout
  title="Specific Page Title | TechCorp"
  description="Detailed description for this specific page, optimized for search engines"
  structuredData={breadcrumbSchema}
  ogImage="/custom-og-image.jpg"
  twitterImage="/custom-twitter-image.jpg"
  canonical="https://techcorp.com/current-page"
>
  <!-- Sayfa içeriği -->
</Layout>
```

### Social Media Görselleri Kullanımı
```astro
---
// Özel sosyal medya görselleri ile sayfa
---
<Layout
  title="Hizmetlerimiz | TechCorp"
  description="CRM danışmanlığı, web geliştirme ve otomasyon hizmetleri"
  ogImage="/images/services-og.jpg"
  twitterImage="/images/services-twitter.jpg"
>
  <!-- Sayfa içeriği -->
</Layout>
```

### Canonical URL Kullanımı
```astro
---
// Duplicate content önleme için canonical URL
---
<Layout
  title="Blog Yazısı | TechCorp"
  description="CRM hakkında detaylı bilgiler"
  canonical="https://techcorp.com/blog/crm-rehberi"
>
  <!-- Blog içeriği -->
</Layout>
```

## 🔧 Geliştirme Notları

### Domain Güncelleme
Projeyi canlıya alırken aşağıdaki dosyalarda domain güncellemesi yapın:
1. `src/utils/sitemap.ts` - SITE_URL değişkeni
2. `public/robots.txt` - Sitemap URL'si
3. `src/utils/structured-data.ts` - URL referansları

### Blog Entegrasyonu
Blog sistemi eklendiğinde:
```typescript
// src/utils/sitemap.ts içinde generateBlogSitemap fonksiyonunu kullanın
const blogPosts = await getBlogPosts(); // CMS'den blog yazıları
const blogSitemap = generateBlogSitemap(blogPosts);
```

### Test Etme
1. **Sitemap Test**: `https://yourdomain.com/sitemap.xml` adresini ziyaret edin
2. **Robots Test**: `https://yourdomain.com/robots.txt` adresini kontrol edin
3. **Structured Data Test**: Google'ın Rich Results Test aracını kullanın
4. **SEO Audit**: Lighthouse veya SEMrush ile sayfa analizi yapın

## 📊 Performans İzleme

### Google Search Console
1. Sitemap'i Google Search Console'a ekleyin
2. Indexing durumunu takip edin
3. Structured data hatalarını kontrol edin

### Analytics
```javascript
// Google Analytics 4 event tracking (gelecekte eklenecek)
gtag('event', 'page_view', {
  page_title: document.title,
  page_location: window.location.href,
  language: document.documentElement.lang
});
```

## 🎯 Sonraki Adımlar

1. **Google Analytics 4** entegrasyonu
2. **Google Tag Manager** kurulumu
3. **Schema.org** genişletmeleri
4. **Open Graph** optimizasyonları
5. **Twitter Cards** iyileştirmeleri

## 🔍 SEO Checklist

- [x] Sitemap.xml oluşturuldu
- [x] Robots.txt eklendi
- [x] Structured data (JSON-LD) implementasyonu
- [x] Meta descriptions optimize edildi
- [x] Breadcrumb schema eklendi
- [x] FAQ schema eklendi
- [ ] Google Analytics entegrasyonu
- [ ] Open Graph meta tags
- [ ] Twitter Card meta tags
- [ ] Image alt text optimizasyonu
- [ ] Internal linking strategy

Bu SEO optimizasyonları ile TechCorp web sitesi arama motorlarında daha iyi performans gösterecek ve organik trafik artışı sağlayacaktır.
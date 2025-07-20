// Advanced SEO utilities and structured data generators
export interface AdvancedSEOConfig {
  enableFAQSchema: boolean;
  enableLocalBusinessSchema: boolean;
  enableServiceSchema: boolean;
  enableReviewSchema: boolean;
  enableBlogSchema: boolean;
  enableWebPageSchema: boolean;
}

export const DEFAULT_ADVANCED_SEO_CONFIG: AdvancedSEOConfig = {
  enableFAQSchema: true,
  enableLocalBusinessSchema: true,
  enableServiceSchema: true,
  enableReviewSchema: true,
  enableBlogSchema: true,
  enableWebPageSchema: true
};

// FAQ Schema Generator - Business FAQ utilities
export const faqSchema = {
  // Generate FAQ for common business questions - uses generateFAQSchema from structured-data.ts
  generateBusinessFAQSchema(language: 'tr' | 'en' = 'tr'): object {
    const businessFAQs = language === 'en' ? [
      {
        question: "What services do you offer?",
        answer: "We offer CRM consulting, website setup, digital transformation consulting, and business automation solutions."
      },
      {
        question: "How long does a typical project take?",
        answer: "Project duration varies depending on complexity. CRM implementations typically take 2-4 weeks, while website projects take 1-2 weeks."
      },
      {
        question: "Do you provide ongoing support?",
        answer: "Yes, we provide comprehensive ongoing support and maintenance for all our solutions."
      },
      {
        question: "What is your pricing structure?",
        answer: "We offer competitive, transparent pricing based on project scope. Contact us for a customized quote."
      }
    ] : [
      {
        question: "Hangi hizmetleri sunuyorsunuz?",
        answer: "CRM danışmanlığı, web sitesi kurulumu, dijital dönüşüm danışmanlığı ve iş otomasyon çözümleri sunuyoruz."
      },
      {
        question: "Tipik bir proje ne kadar sürer?",
        answer: "Proje süresi karmaşıklığa bağlı olarak değişir. CRM uygulamaları genellikle 2-4 hafta, web sitesi projeleri 1-2 hafta sürer."
      },
      {
        question: "Sürekli destek sağlıyor musunuz?",
        answer: "Evet, tüm çözümlerimiz için kapsamlı sürekli destek ve bakım hizmeti sağlıyoruz."
      },
      {
        question: "Fiyatlandırma yapınız nasıl?",
        answer: "Proje kapsamına göre rekabetçi, şeffaf fiyatlandırma sunuyoruz. Özelleştirilmiş teklif için bizimle iletişime geçin."
      }
    ];

    // Import and use generateFAQSchema from structured-data.ts
    return { businessFAQs }; // Return data that can be used with generateFAQSchema
  }
};

// Service Schema Generator - Enhanced service utilities
export const serviceSchema = {

  // Generate CRM Consulting Service Schema - returns structured service data
  generateCRMServiceSchema(language: 'tr' | 'en' = 'tr', baseUrl: string): object {
    return {
      name: language === 'en' ? "CRM Consulting Services" : "CRM Danışmanlık Hizmetleri",
      description: language === 'en' 
        ? "Professional CRM consulting and implementation services to optimize your customer relationship management."
        : "Müşteri ilişkileri yönetiminizi optimize etmek için profesyonel CRM danışmanlık ve uygulama hizmetleri.",
      provider: "TechCorp",
      serviceType: language === 'en' ? "Business Consulting" : "İş Danışmanlığı",
      category: "CRM Services",
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5.0',
        reviewCount: '50'
      }
    };
  },

  // Generate Website Setup Service Schema - returns structured service data  
  generateWebsiteServiceSchema(language: 'tr' | 'en' = 'tr', baseUrl: string): object {
    return {
      name: language === 'en' ? "Website Setup Services" : "Web Sitesi Kurulum Hizmetleri",
      description: language === 'en'
        ? "Professional website design, development, and setup services for businesses."
        : "İşletmeler için profesyonel web sitesi tasarım, geliştirme ve kurulum hizmetleri.",
      provider: "TechCorp",
      serviceType: language === 'en' ? "Web Development" : "Web Geliştirme",
      category: "Website Services",
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5.0',
        reviewCount: '50'
      }
    };
  }
};

// Blog/Article Schema Generator
export const blogSchema = {
  // Generate Article schema for blog posts
  generateArticleSchema(article: {
    headline: string;
    description: string;
    author: {
      name: string;
      url?: string;
    };
    publisher: {
      name: string;
      url: string;
      logo?: string;
    };
    datePublished: string;
    dateModified?: string;
    url: string;
    image?: string;
    wordCount?: number;
    articleSection?: string;
    keywords?: string[];
  }): object {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.headline,
      "description": article.description,
      "author": {
        "@type": "Person",
        "name": article.author.name,
        ...(article.author.url && { "url": article.author.url })
      },
      "publisher": {
        "@type": "Organization",
        "name": article.publisher.name,
        "url": article.publisher.url,
        ...(article.publisher.logo && {
          "logo": {
            "@type": "ImageObject",
            "url": article.publisher.logo
          }
        })
      },
      "datePublished": article.datePublished,
      "dateModified": article.dateModified || article.datePublished,
      "url": article.url,
      ...(article.image && {
        "image": {
          "@type": "ImageObject",
          "url": article.image
        }
      }),
      ...(article.wordCount && { "wordCount": article.wordCount }),
      ...(article.articleSection && { "articleSection": article.articleSection }),
      ...(article.keywords && { "keywords": article.keywords.join(", ") })
    };
  },

  // Generate Blog schema for blog listing pages
  generateBlogSchema(blog: {
    name: string;
    description: string;
    url: string;
    publisher: {
      name: string;
      url: string;
    };
    posts?: Array<{
      headline: string;
      url: string;
      datePublished: string;
    }>;
  }): object {
    return {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": blog.name,
      "description": blog.description,
      "url": blog.url,
      "publisher": {
        "@type": "Organization",
        "name": blog.publisher.name,
        "url": blog.publisher.url
      },
      ...(blog.posts && {
        "blogPost": blog.posts.map(post => ({
          "@type": "BlogPosting",
          "headline": post.headline,
          "url": post.url,
          "datePublished": post.datePublished
        }))
      })
    };
  }
};

// LocalBusiness Schema Enhancement
export const localBusinessSchema = {
  // Enhanced LocalBusiness schema with more details
  generateEnhancedLocalBusinessSchema(business: {
    name: string;
    description: string;
    url: string;
    telephone?: string;
    email?: string;
    address?: {
      streetAddress?: string;
      addressLocality?: string;
      addressRegion?: string;
      postalCode?: string;
      addressCountry?: string;
    };
    geo?: {
      latitude: number;
      longitude: number;
    };
    openingHours?: string[];
    services?: string[];
    paymentAccepted?: string[];
    priceRange?: string;
    areaServed?: string;
    foundingDate?: string;
    numberOfEmployees?: string;
    slogan?: string;
    awards?: string[];
  }): object {
    return {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": business.name,
      "description": business.description,
      "url": business.url,
      ...(business.telephone && { "telephone": business.telephone }),
      ...(business.email && { "email": business.email }),
      ...(business.address && {
        "address": {
          "@type": "PostalAddress",
          ...(business.address.streetAddress && { "streetAddress": business.address.streetAddress }),
          ...(business.address.addressLocality && { "addressLocality": business.address.addressLocality }),
          ...(business.address.addressRegion && { "addressRegion": business.address.addressRegion }),
          ...(business.address.postalCode && { "postalCode": business.address.postalCode }),
          ...(business.address.addressCountry && { "addressCountry": business.address.addressCountry })
        }
      }),
      ...(business.geo && {
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": business.geo.latitude,
          "longitude": business.geo.longitude
        }
      }),
      ...(business.openingHours && { "openingHours": business.openingHours }),
      ...(business.services && { "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Services",
        "itemListElement": business.services.map(service => ({
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": service
          }
        }))
      }}),
      ...(business.paymentAccepted && { "paymentAccepted": business.paymentAccepted }),
      ...(business.priceRange && { "priceRange": business.priceRange }),
      ...(business.areaServed && { "areaServed": business.areaServed }),
      ...(business.foundingDate && { "foundingDate": business.foundingDate }),
      ...(business.numberOfEmployees && { "numberOfEmployees": business.numberOfEmployees }),
      ...(business.slogan && { "slogan": business.slogan }),
      ...(business.awards && { "award": business.awards })
    };
  }
};

// WebPage Schema Generator
export const webPageSchema = {
  // Generate WebPage schema for specific pages
  generateWebPageSchema(page: {
    name: string;
    description: string;
    url: string;
    breadcrumb?: Array<{
      name: string;
      url: string;
    }>;
    lastReviewed?: string;
    reviewedBy?: {
      name: string;
      url?: string;
    };
    mainEntity?: object;
    relatedPages?: string[];
    primaryImageOfPage?: string;
  }): object {
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": page.name,
      "description": page.description,
      "url": page.url,
      ...(page.breadcrumb && {
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": page.breadcrumb.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
          }))
        }
      }),
      ...(page.lastReviewed && { "lastReviewed": page.lastReviewed }),
      ...(page.reviewedBy && {
        "reviewedBy": {
          "@type": "Person",
          "name": page.reviewedBy.name,
          ...(page.reviewedBy.url && { "url": page.reviewedBy.url })
        }
      }),
      ...(page.mainEntity && { "mainEntity": page.mainEntity }),
      ...(page.relatedPages && { "relatedLink": page.relatedPages }),
      ...(page.primaryImageOfPage && {
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": page.primaryImageOfPage
        }
      })
    };
  }
};

// Review Schema Generator - Advanced rating utilities
export const reviewSchema = {
  // Generate AggregateRating schema - unique advanced function
  generateAggregateRatingSchema(rating: {
    itemReviewed: {
      name: string;
      type: string;
    };
    ratingValue: number;
    bestRating: number;
    worstRating: number;
    ratingCount: number;
    reviewCount?: number;
  }): object {
    return {
      "@context": "https://schema.org",
      "@type": "AggregateRating",
      "itemReviewed": {
        "@type": rating.itemReviewed.type,
        "name": rating.itemReviewed.name
      },
      "ratingValue": rating.ratingValue,
      "bestRating": rating.bestRating,
      "worstRating": rating.worstRating,
      "ratingCount": rating.ratingCount,
      ...(rating.reviewCount && { "reviewCount": rating.reviewCount })
    };
  }
  // Note: generateReviewSchema moved to structured-data.ts to avoid duplication
};

// Core Web Vitals and Performance SEO
export const performanceSEO = {
  // Generate performance insights
  getPerformanceInsights(): {
    criticalResources: string[];
    recommendations: string[];
    score: number;
  } {
    const criticalResources: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    if (typeof window === 'undefined') {
      return {
        criticalResources: ['Cannot analyze performance server-side'],
        recommendations: ['Performance analysis requires client-side execution'],
        score: 0
      };
    }

    // Check for render-blocking resources
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    const syncScripts = document.querySelectorAll('script[src]:not([async]):not([defer])');

    if (stylesheets.length > 3) {
      criticalResources.push(`${stylesheets.length} stylesheets found`);
      recommendations.push('Consider inlining critical CSS and loading non-critical styles asynchronously');
      score -= 10;
    }

    if (syncScripts.length > 2) {
      criticalResources.push(`${syncScripts.length} synchronous scripts found`);
      recommendations.push('Add async or defer attributes to non-critical scripts');
      score -= 15;
    }

    // Check for large images
    const images = document.querySelectorAll('img');
    let largeImages = 0;
    images.forEach((img: HTMLImageElement) => {
      if (img.naturalWidth > 1920 || img.naturalHeight > 1080) {
        largeImages++;
      }
    });

    if (largeImages > 0) {
      criticalResources.push(`${largeImages} large images found`);
      recommendations.push('Optimize images and use responsive formats like WebP');
      score -= 20;
    }

    // Check for Web Vitals support
    if (!('PerformanceObserver' in window)) {
      recommendations.push('Browser does not support Performance Observer API');
      score -= 5;
    }

    return {
      criticalResources,
      recommendations,
      score: Math.max(0, score)
    };
  },

  // Generate critical CSS suggestions
  getCriticalCSSSuggestions(): string[] {
    if (typeof document === 'undefined') return [];

    const suggestions: string[] = [];
    const viewportHeight = window.innerHeight;
    
    // Find above-the-fold elements
    const aboveFoldElements = [];
    const allElements = document.querySelectorAll('*');
    
    for (const element of Array.from(allElements)) {
      const rect = element.getBoundingClientRect();
      if (rect.top < viewportHeight && rect.height > 0) {
        aboveFoldElements.push(element);
      }
    }

    suggestions.push(`Found ${aboveFoldElements.length} above-the-fold elements`);
    suggestions.push('Consider inlining styles for these elements');
    
    // Check for font loading
    const fontFaces = Array.from(document.fonts);
    if (fontFaces.length > 0) {
      suggestions.push(`${fontFaces.length} web fonts detected`);
      suggestions.push('Use font-display: swap for better loading performance');
    }

    return suggestions;
  }
};

// SEO Manager Class
export class AdvancedSEOManager {
  private config: AdvancedSEOConfig;

  constructor(config: Partial<AdvancedSEOConfig> = {}) {
    this.config = { ...DEFAULT_ADVANCED_SEO_CONFIG, ...config };
  }

  // Generate all appropriate schemas for a page
  generateSchemasForPage(pageType: string, data: any, language: 'tr' | 'en' = 'tr'): object[] {
    const schemas: object[] = [];

    switch (pageType) {
      case 'homepage':
        if (this.config.enableLocalBusinessSchema) {
          schemas.push(localBusinessSchema.generateEnhancedLocalBusinessSchema(data.business));
        }
        if (this.config.enableWebPageSchema) {
          schemas.push(webPageSchema.generateWebPageSchema(data.page));
        }
        break;

      case 'services':
        if (this.config.enableServiceSchema) {
          schemas.push(serviceSchema.generateCRMServiceSchema(language, data.baseUrl));
          schemas.push(serviceSchema.generateWebsiteServiceSchema(language, data.baseUrl));
        }
        if (this.config.enableWebPageSchema) {
          schemas.push(webPageSchema.generateWebPageSchema(data.page));
        }
        break;

      case 'faq':
        if (this.config.enableFAQSchema) {
          schemas.push(faqSchema.generateBusinessFAQSchema(language));
        }
        if (this.config.enableWebPageSchema) {
          schemas.push(webPageSchema.generateWebPageSchema(data.page));
        }
        break;

      case 'blog':
        if (this.config.enableBlogSchema) {
          schemas.push(blogSchema.generateBlogSchema(data.blog));
        }
        if (this.config.enableWebPageSchema) {
          schemas.push(webPageSchema.generateWebPageSchema(data.page));
        }
        break;

      case 'blog-post':
        if (this.config.enableBlogSchema) {
          schemas.push(blogSchema.generateArticleSchema(data.article));
        }
        if (this.config.enableWebPageSchema) {
          schemas.push(webPageSchema.generateWebPageSchema(data.page));
        }
        break;

      default:
        if (this.config.enableWebPageSchema) {
          schemas.push(webPageSchema.generateWebPageSchema(data.page));
        }
        break;
    }

    return schemas;
  }

  // Get performance recommendations
  getPerformanceRecommendations(): ReturnType<typeof performanceSEO.getPerformanceInsights> {
    return performanceSEO.getPerformanceInsights();
  }

  // Get critical CSS suggestions
  getCriticalCSSSuggestions(): string[] {
    return performanceSEO.getCriticalCSSSuggestions();
  }

  // Update configuration
  updateConfig(newConfig: Partial<AdvancedSEOConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Get current configuration
  getConfig(): AdvancedSEOConfig {
    return { ...this.config };
  }
}

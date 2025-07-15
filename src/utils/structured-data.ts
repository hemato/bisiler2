// Structured Data (JSON-LD) utilities for SEO

export interface OrganizationSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  logo: string;
  description: string;
  address: {
    '@type': string;
    streetAddress: string;
    addressLocality: string;
    postalCode: string;
    addressCountry: string;
  };
  contactPoint: {
    '@type': string;
    telephone: string;
    contactType: string;
    availableLanguage: string[];
  };
  sameAs: string[];
  foundingDate: string;
  numberOfEmployees: string;
  areaServed: string[];
  serviceType: string[];
}

export interface WebsiteSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  description: string;
  inLanguage: string[];
  publisher: {
    '@type': string;
    name: string;
  };
}

export interface ServiceSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  provider: {
    '@type': string;
    name: string;
    url: string;
  };
  areaServed: string;
  serviceType: string;
  offers: {
    '@type': string;
    availability: string;
    priceRange: string;
  };
}

export function generateOrganizationSchema(lang: string = 'tr'): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TechCorp',
    url: 'https://techcorp.com',
    logo: 'https://techcorp.com/logo.png',
    description: lang === 'en' 
      ? 'Technical consulting and CRM solutions to enhance your digital processes.'
      : 'Dijital süreçlerinizi güçlendiren CRM çözümleri ve teknik danışmanlık hizmetleri.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Maslak Mahallesi Büyükdere Caddesi No: 123',
      addressLocality: 'İstanbul',
      postalCode: '34485',
      addressCountry: 'TR'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+90-212-123-45-67',
      contactType: 'customer service',
      availableLanguage: ['Turkish', 'English']
    },
    sameAs: [
      'https://linkedin.com/company/techcorp',
      'https://twitter.com/techcorp'
    ],
    foundingDate: '2019',
    numberOfEmployees: '10-50',
    areaServed: ['Turkey', 'Europe'],
    serviceType: [
      'CRM Consulting',
      'Web Development',
      'Business Automation',
      'SEO Services',
      'Technical Consulting'
    ]
  };
}

export function generateWebsiteSchema(lang: string = 'tr'): WebsiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'TechCorp',
    url: 'https://techcorp.com',
    description: lang === 'en'
      ? 'Technical consulting and CRM solutions company'
      : 'Teknik danışmanlık ve CRM çözümleri şirketi',
    inLanguage: ['tr', 'en'],
    publisher: {
      '@type': 'Organization',
      name: 'TechCorp'
    }
  };
}

export function generateServiceSchema(
  serviceName: string, 
  serviceDescription: string, 
  lang: string = 'tr'
): ServiceSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceName,
    description: serviceDescription,
    provider: {
      '@type': 'Organization',
      name: 'TechCorp',
      url: 'https://techcorp.com'
    },
    areaServed: 'Turkey',
    serviceType: 'Professional Service',
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceRange: lang === 'en' ? 'Contact for pricing' : 'Fiyat için iletişime geçin'
    }
  };
}

export function generateBreadcrumbSchema(breadcrumbs: Array<{name: string, url: string}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `https://techcorp.com${crumb.url}`
    }))
  };
}

export function generateFAQSchema(faqs: Array<{question: string, answer: string}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

export interface ReviewSchema {
  '@context': string;
  '@type': string;
  itemReviewed: {
    '@type': string;
    name: string;
  };
  reviewRating: {
    '@type': string;
    ratingValue: string;
    bestRating: string;
  };
  author: {
    '@type': string;
    name: string;
  };
  reviewBody: string;
  datePublished: string;
}

export interface ContactPageSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  description: string;
  mainEntity: {
    '@type': string;
    name: string;
    telephone: string;
    email: string;
    address: {
      '@type': string;
      streetAddress: string;
      addressLocality: string;
      postalCode: string;
      addressCountry: string;
    };
  };
}

export interface LocalBusinessSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  telephone: string;
  email: string;
  address: {
    '@type': string;
    streetAddress: string;
    addressLocality: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: {
    '@type': string;
    latitude: string;
    longitude: string;
  };
  openingHours: string[];
  priceRange: string;
  areaServed: string[];
}

export function generateReviewSchema(
  companyName: string,
  rating: string,
  reviewText: string,
  authorName: string,
  date: string,
  lang: string = 'tr'
): ReviewSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'Organization',
      name: companyName
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: rating,
      bestRating: '5'
    },
    author: {
      '@type': 'Person',
      name: authorName
    },
    reviewBody: reviewText,
    datePublished: date
  };
}

export function generateContactPageSchema(lang: string = 'tr'): ContactPageSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: lang === 'en' ? 'Contact Us - TechCorp' : 'İletişim - TechCorp',
    url: `https://techcorp.com${lang === 'en' ? '/en/contact' : '/iletisim'}`,
    description: lang === 'en'
      ? 'Contact TechCorp for technical consulting and CRM solutions'
      : 'Teknik danışmanlık ve CRM çözümleri için TechCorp ile iletişime geçin',
    mainEntity: {
      '@type': 'Organization',
      name: 'TechCorp',
      telephone: '+90-212-123-45-67',
      email: 'info@techcorp.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Maslak Mahallesi Büyükdere Caddesi No: 123',
        addressLocality: 'İstanbul',
        postalCode: '34485',
        addressCountry: 'TR'
      }
    }
  };
}

export function generateLocalBusinessSchema(lang: string = 'tr'): LocalBusinessSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'TechCorp',
    description: lang === 'en'
      ? 'Technical consulting and CRM solutions company in Istanbul'
      : 'İstanbul\'da teknik danışmanlık ve CRM çözümleri şirketi',
    url: 'https://techcorp.com',
    telephone: '+90-212-123-45-67',
    email: 'info@techcorp.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Maslak Mahallesi Büyükdere Caddesi No: 123',
      addressLocality: 'İstanbul',
      postalCode: '34485',
      addressCountry: 'TR'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '41.1079',
      longitude: '29.0106'
    },
    openingHours: [
      'Mo-Fr 09:00-18:00'
    ],
    priceRange: lang === 'en' ? 'Contact for pricing' : 'Fiyat için iletişime geçin',
    areaServed: ['Istanbul', 'Turkey', 'Europe']
  };
}

// Helper function to inject structured data into HTML head
export function injectStructuredData(schema: any): string {
  return `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`;
}
// Structured Data (JSON-LD) utilities for SEO
import { COMPANY_INFO, COMPANY_STATS } from '../config/company';
import { CONTACT_INFO } from '../config/contact';
import { DOMAIN_CONFIG, getUrl } from '../config/domain';
import { getRoute } from './routes';

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
    name: COMPANY_INFO.name,
    url: DOMAIN_CONFIG.baseUrl,
    logo: getUrl(DOMAIN_CONFIG.images.logo),
    description: COMPANY_INFO.description[lang as keyof typeof COMPANY_INFO.description],
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACT_INFO.address.street,
      addressLocality: CONTACT_INFO.address.city,
      postalCode: CONTACT_INFO.address.postalCode,
      addressCountry: CONTACT_INFO.address.country
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: CONTACT_INFO.phone.formatted.primary,
      contactType: 'customer service',
      availableLanguage: ['Turkish', 'English']
    },
    sameAs: [
      CONTACT_INFO.social.linkedin,
      CONTACT_INFO.social.twitter
    ],
    foundingDate: COMPANY_INFO.foundingYear,
    numberOfEmployees: COMPANY_INFO.employeeCount,
    areaServed: COMPANY_INFO.serviceAreas[lang as keyof typeof COMPANY_INFO.serviceAreas],
    serviceType: COMPANY_INFO.services[lang as keyof typeof COMPANY_INFO.services]
  };
}

export function generateWebsiteSchema(lang: string = 'tr'): WebsiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: COMPANY_INFO.name,
    url: DOMAIN_CONFIG.baseUrl,
    description: COMPANY_INFO.description[lang as keyof typeof COMPANY_INFO.description],
    inLanguage: ['tr', 'en'],
    publisher: {
      '@type': 'Organization',
      name: COMPANY_INFO.name
    }
  };
}

export function generateServiceSchema(
  service: {
    name: string;
    description: string;
    provider?: string;
    offers?: {
      '@type': string;
      price?: string;
      priceCurrency?: string;
      availability?: string;
    };
    areaServed?: string | string[];
    serviceType?: string;
    category?: string;
    aggregateRating?: {
      '@type': string;
      ratingValue: string;
      reviewCount: string;
    };
  },
  lang: string = 'tr'
): ServiceSchema {
  const baseService = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: service.provider || COMPANY_INFO.name,
      url: DOMAIN_CONFIG.baseUrl
    },
    areaServed: service.areaServed || COMPANY_INFO.serviceAreas[lang as keyof typeof COMPANY_INFO.serviceAreas][0],
    serviceType: service.serviceType || 'Professional Service',
    offers: service.offers || {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceRange: lang === 'en' ? 'Contact for pricing' : 'Fiyat için iletişime geçin'
    }
  };

  // Add optional enhanced properties
  const enhanced: any = { ...baseService };
  
  if (service.category) {
    enhanced.category = service.category;
  }
  
  if (service.aggregateRating) {
    enhanced.aggregateRating = service.aggregateRating;
  }

  return enhanced;
}

export function generateBreadcrumbSchema(breadcrumbs: Array<{name: string, url: string}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: getUrl(crumb.url)
    }))
  };
}

export function generateFAQSchema(faqs: Array<{question: string, answer: string}>, options?: {
  author?: string;
  datePublished?: string;
  mainEntity?: {
    name?: string;
    description?: string;
  };
}) {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq, index) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
        ...(options?.author && {
          author: {
            '@type': 'Organization',
            name: options.author
          }
        }),
        ...(options?.datePublished && { datePublished: options.datePublished })
      },
      position: index + 1
    }))
  };

  // Add enhanced properties if provided
  if (options?.mainEntity) {
    return {
      ...baseSchema,
      ...options.mainEntity
    };
  }

  return baseSchema;
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
  const contactUrl = getRoute(lang as 'tr' | 'en', 'contact');
  
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: `${lang === 'en' ? 'Contact Us' : 'İletişim'} - ${COMPANY_INFO.name}`,
    url: getUrl(contactUrl),
    description: lang === 'en'
      ? `Contact ${COMPANY_INFO.name} for technical consulting and CRM solutions`
      : `Teknik danışmanlık ve CRM çözümleri için ${COMPANY_INFO.name} ile iletişime geçin`,
    mainEntity: {
      '@type': 'Organization',
      name: COMPANY_INFO.name,
      telephone: CONTACT_INFO.phone.formatted.primary,
      email: CONTACT_INFO.email.primary,
      address: {
        '@type': 'PostalAddress',
        streetAddress: CONTACT_INFO.address.street,
        addressLocality: CONTACT_INFO.address.city,
        postalCode: CONTACT_INFO.address.postalCode,
        addressCountry: CONTACT_INFO.address.country
      }
    }
  };
}

export function generateLocalBusinessSchema(lang: string = 'tr'): LocalBusinessSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: COMPANY_INFO.name,
    description: COMPANY_INFO.description[lang as keyof typeof COMPANY_INFO.description],
    url: DOMAIN_CONFIG.baseUrl,
    telephone: CONTACT_INFO.phone.formatted.primary,
    email: CONTACT_INFO.email.primary,
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACT_INFO.address.street,
      addressLocality: CONTACT_INFO.address.city,
      postalCode: CONTACT_INFO.address.postalCode,
      addressCountry: CONTACT_INFO.address.country
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: CONTACT_INFO.coordinates.latitude,
      longitude: CONTACT_INFO.coordinates.longitude
    },
    openingHours: [
      'Mo-Fr 09:00-18:00'
    ],
    priceRange: lang === 'en' ? 'Contact for pricing' : 'Fiyat için iletişime geçin',
    areaServed: COMPANY_INFO.serviceAreas[lang as keyof typeof COMPANY_INFO.serviceAreas]
  };
}

// Helper function to inject structured data into HTML head
export function injectStructuredData(schema: any): string {
  return `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`;
}

// Centralized contact information
export const CONTACT_INFO = {
  // Primary Contact
  email: {
    primary: 'info@techcorp.com',
    support: 'support@techcorp.com',
    privacy: 'privacy@techcorp.com',
    admin: 'emre.hemato.1995@gmail.com' // Used for EmailJS notifications
  },
  
  phone: {
    primary: '+90 212 123 45 67',
    mobile: '+90 555 555 55 55',
    whatsapp: '+905555555555',
    formatted: {
      primary: '+90-212-123-45-67',
      mobile: '+90-555-555-55-55'
    }
  },

  // Physical Address
  address: {
    street: 'Maslak Mahallesi Büyükdere Caddesi No: 123',
    district: 'Maslak',
    city: 'İstanbul',
    postalCode: '34485',
    country: 'TR',
    countryName: {
      tr: 'Türkiye',
      en: 'Turkey'
    },
    full: {
      tr: 'Maslak Mahallesi Büyükdere Caddesi No: 123, 34485 İstanbul, Türkiye',
      en: 'Maslak Mahallesi Büyükdere Caddesi No: 123, 34485 Istanbul, Turkey'
    }
  },

  // Geographic Coordinates
  coordinates: {
    latitude: '41.1079',
    longitude: '29.0106'
  },

  // Social Media
  social: {
    linkedin: 'https://linkedin.com/company/techcorp',
    twitter: 'https://twitter.com/techcorp',
    facebook: 'https://facebook.com/techcorp',
    instagram: 'https://instagram.com/techcorp',
    youtube: 'https://youtube.com/@techcorp',
    twitterHandle: '@techcorp'
  },

  // WhatsApp Configuration
  whatsapp: {
    number: '905555555555',
    url: 'https://wa.me/905555555555',
    message: {
      tr: 'Merhaba! Web sitenizden geliyorum. Size nasıl yardımcı olabilirim?',
      en: 'Hello! I am coming from your website. How can I help you?'
    }
  }
};

// Contact Actions - for consistent usage across the app
export const CONTACT_ACTIONS = {
  whatsapp: {
    url: 'https://wa.me/905555555555',
    displayNumber: '+90 555 555 55 55',
    title: {
      tr: 'WhatsApp ile iletişime geçin',
      en: 'Contact us via WhatsApp'
    }
  },
  phone: {
    action: 'tel:+905555555555',
    display: '+90 555 555 55 55',
    title: {
      tr: 'Hemen arayın',
      en: 'Call now'
    }
  },
  email: {
    action: 'mailto:info@techcorp.com',
    display: 'info@techcorp.com',
    title: {
      tr: 'Email gönderin',
      en: 'Send email'
    }
  }
};

// Privacy Policy Links
export const PRIVACY_LINKS = {
  tr: '/gizlilik-politikasi',
  en: '/en/privacy'
};

// Import routes from centralized config
import { getRoute } from '../utils/routes';

// Route Mappings for consistent navigation - now dynamic
export const getRouteMapping = (lang: 'tr' | 'en') => ({
  home: getRoute(lang, 'home'),
  about: getRoute(lang, 'about'),
  services: getRoute(lang, 'services'),
  references: getRoute(lang, 'references'),
  contact: getRoute(lang, 'contact'),
  faq: getRoute(lang, 'faq'),
  blog: getRoute(lang, 'blog'),
  privacy: getRoute(lang, 'privacy')
});

// Contact Form Configuration
export const CONTACT_FORM = {
  subjects: {
    tr: [
      'Genel Bilgi',
      'CRM Danışmanlığı',
      'Web Sitesi Kurulumu',
      'Teknik Destek',
      'Fiyat Teklifi',
      'Diğer'
    ],
    en: [
      'General Information',
      'CRM Consulting',
      'Website Setup',
      'Technical Support',
      'Quote Request',
      'Other'
    ]
  },

  // Auto-response settings
  autoResponse: {
    enabled: true,
    responseTime: {
      tr: '24 saat içinde',
      en: 'within 24 hours'
    }
  }
};

// Office Hours
export const OFFICE_HOURS = {
  monday: '09:00-18:00',
  tuesday: '09:00-18:00',
  wednesday: '09:00-18:00',
  thursday: '09:00-18:00',
  friday: '09:00-18:00',
  saturday: 'Kapalı/Closed',
  sunday: 'Kapalı/Closed',
  timezone: 'Europe/Istanbul'
};

import { CONTACT_INFO } from './contact';

// EmailJS Configuration
export const EMAIL_CONFIG = {
  // EmailJS Service Configuration
  service: {
    serviceId: 'service_su0px4o',
    userId: '4oHjUgCkeANtR0_ob',
    publicKey: '4oHjUgCkeANtR0_ob'
  },

  // Email Templates
  templates: {
    tr: {
      customerResponse: 'template_v9wtw99',
      adminNotification: 'template_2gqnorr'
    },
    en: {
      customerResponse: 'template_v9wtw99',
      adminNotification: 'template_2gqnorr'
    }
  },

  // Email Recipients
  recipients: {
    admin: CONTACT_INFO.email.admin,
    support: CONTACT_INFO.email.support,
    primary: CONTACT_INFO.email.primary
  },

  // Email Subject Lines
  subjects: {
    tr: {
      contact: 'Yeni İletişim Formu Mesajı',
      crmConsulting: 'Yeni CRM Danışmanlığı Talebi',
      websiteSetup: 'Yeni Web Sitesi Kurulum Talebi',
      customerResponse: 'Mesajınız Alındı - TechCorp'
    },
    en: {
      contact: 'New Contact Form Message',
      crmConsulting: 'New CRM Consulting Request',
      websiteSetup: 'New Website Setup Request',
      customerResponse: 'Your Message Received - TechCorp'
    }
  },

  // Auto-response settings
  autoResponse: {
    enabled: true,
    delay: 0, // Immediate response
    responseTime: {
      tr: '24 saat içinde',
      en: 'within 24 hours'
    }
  },

  // Email signature
  signature: {
    tr: `
En iyi dileklerle,
TechCorp Ekibi
${CONTACT_INFO.email.primary}
${CONTACT_INFO.phone.primary}
${CONTACT_INFO.address.full.tr}
    `,
    en: `
Best regards,
TechCorp Team
${CONTACT_INFO.email.primary}
${CONTACT_INFO.phone.primary}
${CONTACT_INFO.address.full.en}
    `
  }
};

// Email Validation
export const EMAIL_VALIDATION = {
  patterns: {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^(\+90|0)?[5][0-9]{9}$/,
    name: /^[a-zA-ZçÇğĞıİöÖşŞüÜ\s]{2,50}$/
  },
  
  required: {
    contact: ['name', 'email', 'services'],
    crmConsulting: ['name', 'email', 'phone', 'company'],
    websiteSetup: ['name', 'email', 'phone', 'company', 'websiteType']
  }
};

// Form Type Configuration
export const FORM_TYPES = {
  contact: 'contact',
  crmConsulting: 'crm-consulting',
  websiteSetup: 'website-setup'
} as const;

export type FormType = typeof FORM_TYPES[keyof typeof FORM_TYPES];

// Service Name Mapping
export const SERVICE_NAMES = {
  [FORM_TYPES.contact]: {
    tr: 'Genel İletişim',
    en: 'General Contact'
  },
  [FORM_TYPES.crmConsulting]: {
    tr: 'CRM Danışmanlığı',
    en: 'CRM Consulting'
  },
  [FORM_TYPES.websiteSetup]: {
    tr: 'Web Sitesi Kurulumu',
    en: 'Website Setup'
  }
} as const;

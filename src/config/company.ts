// Centralized company information
export const COMPANY_INFO = {
  name: 'TechCorp',
  legalName: 'TechCorp Teknik Danışmanlık Ltd. Şti.',
  tagline: {
    tr: 'Dijital Süreçlerinizi Güçlendirin',
    en: 'Empower Your Digital Processes'
  },
  description: {
    tr: 'Dijital süreçlerinizi güçlendiren CRM çözümleri, web sitesi geliştirme ve teknik danışmanlık hizmetleri.',
    en: 'CRM solutions, web development, and technical consulting services to enhance your digital processes.'
  },
  foundingYear: '2019',
  employeeCount: '10-50',
  industry: 'Technical Consulting',
  
  // Services
  services: {
    tr: [
      'CRM Danışmanlığı',
      'Web Geliştirme',
      'İş Otomasyonu',
      'SEO Hizmetleri',
      'Teknik Danışmanlık'
    ],
    en: [
      'CRM Consulting',
      'Web Development',
      'Business Automation',
      'SEO Services',
      'Technical Consulting'
    ]
  },

  // Certifications
  certifications: [
    'Zoho Certified Consultant',
    'Google Analytics Certified',
    'Google Ads Certified',
    'Zapier Certified Expert',
    'AWS Cloud Practitioner'
  ],

  // Service Areas
  serviceAreas: {
    tr: ['Türkiye', 'Avrupa'],
    en: ['Turkey', 'Europe']
  }
};

// Business Hours
export const BUSINESS_HOURS = {
  weekdays: 'Mo-Fr 09:00-18:00',
  timezone: 'Europe/Istanbul',
  display: {
    tr: 'Pazartesi-Cuma 09:00-18:00',
    en: 'Monday-Friday 09:00-18:00'
  }
};

// Company Statistics
export const COMPANY_STATS = {
  projectsCompleted: 100,
  clientsSatisfied: 50,
  yearsExperience: 5,
  certificates: 5
};

// Stats for different sections
export const STATS_SECTIONS = {
  homepage: {
    tr: [
      { value: '50+', label: 'Tamamlanan Proje' },
      { value: '100%', label: 'Müşteri Memnuniyeti' },
      { value: '24/7', label: 'Teknik Destek' }
    ],
    en: [
      { value: '50+', label: 'Completed Projects' },
      { value: '100%', label: 'Customer Satisfaction' },
      { value: '24/7', label: 'Technical Support' }
    ]
  },
  about: {
    tr: [
      { value: '5+', label: 'Yıl Deneyim' },
      { value: '50+', label: 'Mutlu Müşteri' },
      { value: '100+', label: 'Proje Tamamlandı' },
      { value: '24/7', label: 'Destek' }
    ],
    en: [
      { value: '5+', label: 'Years Experience' },
      { value: '50+', label: 'Happy Clients' },
      { value: '100+', label: 'Projects Completed' },
      { value: '24/7', label: 'Support' }
    ]
  }
};

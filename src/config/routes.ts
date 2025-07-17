export const ROUTES = {
  tr: {
    home: '/',
    about: '/hakkimizda',
    services: '/hizmetlerimiz',
    references: '/referanslar',
    contact: '/iletisim',
    faq: '/sss',
    blog: '/blog',
    privacy: '/gizlilik-politikasi',
    // Landing pages
    crmConsulting: '/crm-danismanligi',
    crmConsultingV2: '/crm-danismanligi-v2',
    websiteSetup: '/web-sitesi-kurulumu',
    websiteSetupV2: '/web-sitesi-kurulumu-v2'
  },
  en: {
    home: '/en',
    about: '/en/about',
    services: '/en/services', 
    references: '/en/references',
    contact: '/en/contact',
    faq: '/en/faq',
    blog: '/en/blog',
    privacy: '/en/privacy',
    // Landing pages
    crmConsulting: '/en/crm-consulting',
    crmConsultingV2: '/en/crm-consulting-v2',
    websiteSetup: '/en/website-setup',
    websiteSetupV2: '/en/website-setup-v2'
  }
} as const;

export type RouteKey = keyof typeof ROUTES.tr;
export type Language = keyof typeof ROUTES;

// Route metadata for SEO and sitemap
export interface RouteConfig {
  priority: number;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  requiresAuth?: boolean;
  isLanding?: boolean;
}

export const ROUTE_METADATA: Record<RouteKey, RouteConfig> = {
  home: { priority: 1.0, changefreq: 'weekly' },
  about: { priority: 0.8, changefreq: 'monthly' },
  services: { priority: 0.9, changefreq: 'weekly' },
  references: { priority: 0.7, changefreq: 'monthly' },
  contact: { priority: 0.8, changefreq: 'monthly' },
  faq: { priority: 0.6, changefreq: 'monthly' },
  blog: { priority: 0.7, changefreq: 'weekly' },
  privacy: { priority: 0.3, changefreq: 'yearly' },
  // Landing pages
  crmConsulting: { priority: 0.9, changefreq: 'weekly', isLanding: true },
  crmConsultingV2: { priority: 0.9, changefreq: 'weekly', isLanding: true },
  websiteSetup: { priority: 0.9, changefreq: 'weekly', isLanding: true },
  websiteSetupV2: { priority: 0.9, changefreq: 'weekly', isLanding: true }
};

// Route validation
export function validateRouteConfig(): void {
  const trRoutes = Object.keys(ROUTES.tr);
  const enRoutes = Object.keys(ROUTES.en);
  const metadataKeys = Object.keys(ROUTE_METADATA);
  
  // Check if all routes have metadata
  const missingMetadata = trRoutes.filter(route => !metadataKeys.includes(route));
  if (missingMetadata.length > 0) {
    throw new Error(`Missing metadata for routes: ${missingMetadata.join(', ')}`);
  }
  
  // Check if TR and EN routes match
  const missingEnRoutes = trRoutes.filter(route => !enRoutes.includes(route));
  if (missingEnRoutes.length > 0) {
    throw new Error(`Missing English routes: ${missingEnRoutes.join(', ')}`);
  }
  
  console.log('✅ Route configuration validated successfully');
}

// Export route arrays for easy iteration
export const ROUTE_KEYS = Object.keys(ROUTES.tr) as RouteKey[];
export const LANGUAGES = Object.keys(ROUTES) as Language[];

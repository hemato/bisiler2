// Centralized domain and URL configuration
export const DOMAIN_CONFIG = {
  // Primary Domain
  domain: 'techcorp.com',
  protocol: 'https',
  baseUrl: 'https://techcorp.com',
  
  // Development URLs (for local testing)
  dev: {
    baseUrl: 'http://localhost:4321',
    port: 4321
  },

  // CDN Configuration
  cdn: {
    images: 'https://techcorp.com/images',
    assets: 'https://techcorp.com/assets'
  },

  // Default Images
  images: {
    logo: '/logo.png',
    favicon: '/favicon.svg',
    ogImage: '/og-image.jpg',
    twitterImage: '/twitter-image.jpg',
    defaultHero: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800',
    // External Images
    external: {
      techTeam: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800',
      aboutUs: 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=800',
      websiteDesign: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
      blog: {
        crm: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
        automation: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
        seo: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800',
        caseStudy: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
        integration: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
        dataManagement: 'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      portfolio: {
        tech: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600',
        healthcare: 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=600',
        retail: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=600',
        education: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=600',
        energy: 'https://images.pexels.com/photos/9875380/pexels-photo-9875380.jpeg?auto=compress&cs=tinysrgb&w=600'
      }
    }
  },

  // Sitemap Configuration
  sitemap: {
    changefreq: 'weekly',
    priority: {
      home: 1.0,
      landingPages: 0.9,
      services: 0.8,
      about: 0.7,
      blog: 0.6,
      other: 0.5
    }
  }
};

// Import routes from centralized config
import { getRoute } from '../utils/routes';
import type { RouteKey, Language } from '../config/routes';

// URL Helper Functions
export const getUrl = (path: string = '') => {
  return `${DOMAIN_CONFIG.baseUrl}${path}`;
};

export const getRouteUrl = (routeName: RouteKey, lang: Language = 'tr') => {
  return getUrl(getRoute(lang, routeName));
};

export const getLandingPageUrl = (routeName: RouteKey, lang: Language = 'tr') => {
  return getUrl(getRoute(lang, routeName));
};

// Canonical URL helper
export const getCanonicalUrl = (pathname: string) => {
  return `${DOMAIN_CONFIG.baseUrl}${pathname}`;
};

// Hreflang helper
export const getHreflangUrls = (pathname: string) => {
  // Convert between TR and EN paths
  const trPath = pathname.startsWith('/en') ? pathname.replace('/en', '') || '/' : pathname;
  const enPath = pathname.startsWith('/en') ? pathname : `/en${pathname === '/' ? '' : pathname}`;
  
  return [
    { lang: 'tr', url: getUrl(trPath) },
    { lang: 'en', url: getUrl(enPath) }
  ];
};

// Social Media URLs
export const getSocialShareUrls = (url: string, title: string) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle} ${encodedUrl}`
  };
};

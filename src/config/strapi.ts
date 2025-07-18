// Environment configuration type
interface StrapiEnvironmentConfig {
  url: string;
  apiUrl: string;
}

// Strapi CMS Configuration
export const STRAPI_CONFIG = {
  // Local development
  dev: {
    url: 'http://localhost:1337',
    apiUrl: 'http://localhost:1337/api'
  },
  
  // Production (replace with your Strapi deployment URL)
  prod: {
    url: process.env.STRAPI_URL || 'https://your-strapi-domain.com',
    apiUrl: process.env.STRAPI_API_URL || 'https://your-strapi-domain.com/api'
  },
  
  // API endpoints
  endpoints: {
    blogPosts: '/blog-posts',
    categories: '/categories',
    tags: '/tags'
  },
  
  // Default query parameters
  defaultParams: {
    populate: '*',
    sort: 'publishedAt:desc',
    pagination: {
      pageSize: 10
    }
  }
} as const;

// Helper function to get current environment
export const getCurrentEnvironment = (): 'dev' | 'prod' => {
  return process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
};

// Helper function to get the current API URL
export const getStrapiUrl = () => {
  const env = getCurrentEnvironment();
  const config = STRAPI_CONFIG[env];
  return config.apiUrl;
};

// Helper function to get the current base URL
export const getStrapiBaseUrl = () => {
  const env = getCurrentEnvironment();
  const config = STRAPI_CONFIG[env];
  return config.url;
};

// Helper function to build API URLs
export const buildApiUrl = (endpoint: string, params?: Record<string, any>) => {
  const baseUrl = getStrapiUrl();
  const url = new URL(`${baseUrl}${endpoint}`);
  
  // Add default parameters
  Object.entries(STRAPI_CONFIG.defaultParams).forEach(([key, value]) => {
    if (key === 'pagination' && typeof value === 'object') {
      Object.entries(value).forEach(([pKey, pValue]) => {
        url.searchParams.append(`pagination[${pKey}]`, String(pValue));
      });
    } else if (key === 'populate') {
      url.searchParams.append(key, String(value));
    } else {
      url.searchParams.append(key, String(value));
    }
  });
  
  // Add custom parameters
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => url.searchParams.append(key, String(v)));
      } else if (typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([subKey, subValue]) => {
          url.searchParams.append(`${key}[${subKey}]`, String(subValue));
        });
      } else {
        url.searchParams.append(key, String(value));
      }
    });
  }
  
  return url.toString();
};

// Content type definitions for TypeScript
export interface StrapiMedia {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    large?: StrapiImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
}

export interface StrapiImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  url: string;
}

export interface StrapiBlogPost {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  language: 'tr' | 'en';
  featuredImage: StrapiMedia;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  locale: string;
}

export interface StrapiCategory {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string;
  language: 'tr' | 'en';
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
}

export interface StrapiTag {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  language: 'tr' | 'en';
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
}

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiSingleResponse<T> {
  data: T;
}

// Helper function to get media URL
export const getMediaUrl = (media: StrapiMedia | null, size: 'thumbnail' | 'small' | 'medium' | 'large' | 'original' = 'original') => {
  if (!media) return null;
  
  const baseUrl = getStrapiBaseUrl();
  
  if (size === 'original') {
    return `${baseUrl}${media.url}`;
  }
  
  const format = media.formats[size];
  if (format) {
    return `${baseUrl}${format.url}`;
  }
  
  // Fallback to original if size not available
  return `${baseUrl}${media.url}`;
};

// Helper function to format date
export const formatDate = (dateString: string, locale: 'tr' | 'en' = 'tr') => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  return date.toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', options);
};

// Helper function to calculate reading time
export const calculateReadingTime = (content: string, locale: 'tr' | 'en' = 'tr') => {
  const wordsPerMinute = 200; // Average reading speed
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  
  return locale === 'tr' ? `${minutes} dk` : `${minutes} min`;
};

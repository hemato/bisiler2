import { 
  STRAPI_CONFIG, 
  buildApiUrl, 
  type StrapiBlogPost, 
  type StrapiCategory, 
  type StrapiTag, 
  type StrapiResponse, 
  type StrapiSingleResponse 
} from '../config/strapi';
import { strapiCache, httpCache } from './cache';
import { createError } from './error-handler';

// Generic fetch function for Strapi API
async function fetchFromStrapi<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
  const url = buildApiUrl(endpoint, params);
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching from Strapi:', error);
    throw error;
  }
}

// Blog Posts API
export const blogAPI = {
  // Get all blog posts
  async getAll(params?: {
    page?: number;
    pageSize?: number;
    locale?: 'tr' | 'en';
    category?: string;
    tag?: string;
    search?: string;
  }): Promise<StrapiResponse<StrapiBlogPost[]>> {
    const queryParams: Record<string, any> = {};
    
    if (params?.page) {
      queryParams.pagination = { page: params.page, pageSize: params.pageSize || 10 };
    }
    
    if (params?.locale) {
      queryParams.filters = { 
        ...queryParams.filters,
        locale: { $eq: params.locale }
      };
    }
    
    if (params?.category) {
      queryParams.filters = { 
        ...queryParams.filters,
        category: { $eq: params.category }
      };
    }
    
    if (params?.tag) {
      queryParams.filters = { 
        ...queryParams.filters,
        tags: { $contains: params.tag }
      };
    }
    
    if (params?.search) {
      queryParams.filters = { 
        ...queryParams.filters,
        $or: [
          { title: { $containsi: params.search } },
          { content: { $containsi: params.search } },
          { excerpt: { $containsi: params.search } }
        ]
      };
    }
    
    return fetchFromStrapi<StrapiResponse<StrapiBlogPost[]>>(
      STRAPI_CONFIG.endpoints.blogPosts,
      queryParams
    );
  },

  // Get blog post by slug
  async getBySlug(slug: string, locale?: 'tr' | 'en'): Promise<StrapiSingleResponse<StrapiBlogPost>> {
    const queryParams: Record<string, any> = {
      filters: { slug: { $eq: slug } }
    };
    
    if (locale) {
      queryParams.filters.locale = { $eq: locale };
    }
    
    const response = await fetchFromStrapi<StrapiResponse<StrapiBlogPost[]>>(
      STRAPI_CONFIG.endpoints.blogPosts,
      queryParams
    );
    
    if (!response.data || response.data.length === 0) {
      throw new Error(`Blog post with slug "${slug}" not found`);
    }
    
    return { data: response.data[0] };
  },

  // Get blog post by documentId
  async getById(documentId: string): Promise<StrapiSingleResponse<StrapiBlogPost>> {
    return fetchFromStrapi<StrapiSingleResponse<StrapiBlogPost>>(
      `${STRAPI_CONFIG.endpoints.blogPosts}/${documentId}`
    );
  },

  // Get recent blog posts
  async getRecent(limit = 5, locale?: 'tr' | 'en'): Promise<StrapiResponse<StrapiBlogPost[]>> {
    const queryParams: Record<string, any> = {
      pagination: { pageSize: limit },
      sort: 'publishedAt:desc'
    };
    
    if (locale) {
      queryParams.filters = { locale: { $eq: locale } };
    }
    
    return fetchFromStrapi<StrapiResponse<StrapiBlogPost[]>>(
      STRAPI_CONFIG.endpoints.blogPosts,
      queryParams
    );
  },

  // Get related blog posts
  async getRelated(currentPostId: string, category: string, limit = 3, locale?: 'tr' | 'en'): Promise<StrapiResponse<StrapiBlogPost[]>> {
    const queryParams: Record<string, any> = {
      filters: {
        category: { $eq: category },
        documentId: { $ne: currentPostId }
      },
      pagination: { pageSize: limit },
      sort: 'publishedAt:desc'
    };
    
    if (locale) {
      queryParams.filters.locale = { $eq: locale };
    }
    
    return fetchFromStrapi<StrapiResponse<StrapiBlogPost[]>>(
      STRAPI_CONFIG.endpoints.blogPosts,
      queryParams
    );
  }
};

// Categories API
export const categoriesAPI = {
  // Get all categories
  async getAll(locale?: 'tr' | 'en'): Promise<StrapiResponse<StrapiCategory[]>> {
    const queryParams: Record<string, any> = {};
    
    if (locale) {
      queryParams.filters = { locale: { $eq: locale } };
    }
    
    return fetchFromStrapi<StrapiResponse<StrapiCategory[]>>(
      STRAPI_CONFIG.endpoints.categories,
      queryParams
    );
  },

  // Get category by slug
  async getBySlug(slug: string, locale?: 'tr' | 'en'): Promise<StrapiSingleResponse<StrapiCategory>> {
    const queryParams: Record<string, any> = {
      filters: { slug: { $eq: slug } }
    };
    
    if (locale) {
      queryParams.filters.locale = { $eq: locale };
    }
    
    const response = await fetchFromStrapi<StrapiResponse<StrapiCategory[]>>(
      STRAPI_CONFIG.endpoints.categories,
      queryParams
    );
    
    if (!response.data || response.data.length === 0) {
      throw new Error(`Category with slug "${slug}" not found`);
    }
    
    return { data: response.data[0] };
  }
};

// Tags API
export const tagsAPI = {
  // Get all tags
  async getAll(locale?: 'tr' | 'en'): Promise<StrapiResponse<StrapiTag[]>> {
    const queryParams: Record<string, any> = {};
    
    if (locale) {
      queryParams.filters = { locale: { $eq: locale } };
    }
    
    return fetchFromStrapi<StrapiResponse<StrapiTag[]>>(
      STRAPI_CONFIG.endpoints.tags,
      queryParams
    );
  },

  // Get tag by slug
  async getBySlug(slug: string, locale?: 'tr' | 'en'): Promise<StrapiSingleResponse<StrapiTag>> {
    const queryParams: Record<string, any> = {
      filters: { slug: { $eq: slug } }
    };
    
    if (locale) {
      queryParams.filters.locale = { $eq: locale };
    }
    
    const response = await fetchFromStrapi<StrapiResponse<StrapiTag[]>>(
      STRAPI_CONFIG.endpoints.tags,
      queryParams
    );
    
    if (!response.data || response.data.length === 0) {
      throw new Error(`Tag with slug "${slug}" not found`);
    }
    
    return { data: response.data[0] };
  }
};

// Utility functions for static site generation
export const strapiUtils = {
  // Get all blog post slugs for static generation
  async getAllBlogSlugs(locale?: 'tr' | 'en'): Promise<string[]> {
    const queryParams: Record<string, any> = {
      fields: ['slug'],
      pagination: { pageSize: 1000 } // Get all posts
    };
    
    if (locale) {
      queryParams.filters = { locale: { $eq: locale } };
    }
    
    const response = await fetchFromStrapi<StrapiResponse<Pick<StrapiBlogPost, 'slug'>[]>>(
      STRAPI_CONFIG.endpoints.blogPosts,
      queryParams
    );
    
    return response.data.map(post => post.slug);
  },

  // Get all category slugs for static generation
  async getAllCategorySlugs(locale?: 'tr' | 'en'): Promise<string[]> {
    const queryParams: Record<string, any> = {
      fields: ['slug'],
      pagination: { pageSize: 1000 }
    };
    
    if (locale) {
      queryParams.filters = { locale: { $eq: locale } };
    }
    
    const response = await fetchFromStrapi<StrapiResponse<Pick<StrapiCategory, 'slug'>[]>>(
      STRAPI_CONFIG.endpoints.categories,
      queryParams
    );
    
    return response.data.map(category => category.slug);
  },

  // Get all tag slugs for static generation
  async getAllTagSlugs(locale?: 'tr' | 'en'): Promise<string[]> {
    const queryParams: Record<string, any> = {
      fields: ['slug'],
      pagination: { pageSize: 1000 }
    };
    
    if (locale) {
      queryParams.filters = { locale: { $eq: locale } };
    }
    
    const response = await fetchFromStrapi<StrapiResponse<Pick<StrapiTag, 'slug'>[]>>(
      STRAPI_CONFIG.endpoints.tags,
      queryParams
    );
    
    return response.data.map(tag => tag.slug);
  }
};

// Error handling utility
export class StrapiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'StrapiError';
  }
}

// Helper function to handle API errors
export const handleStrapiError = (error: any) => {
  if (error instanceof StrapiError) {
    return error;
  }
  
  if (error.response) {
    return new StrapiError(
      `Strapi API Error: ${error.response.status} - ${error.response.statusText}`,
      error.response.status
    );
  }
  
  return new StrapiError(`Strapi API Error: ${error.message}`);
};

// Modernized cached API functions using central cache system
export const cachedBlogAPI = {
  async getAll(params?: Parameters<typeof blogAPI.getAll>[0]) {
    const cacheKey = `strapi:blog-posts:${JSON.stringify(params)}`;
    
    return strapiCache.getOrSet(cacheKey, () => blogAPI.getAll(params));
  },

  async getBySlug(slug: string, locale?: 'tr' | 'en') {
    const cacheKey = `strapi:blog-post:${slug}:${locale || 'all'}`;
    
    return strapiCache.getOrSet(cacheKey, () => blogAPI.getBySlug(slug, locale));
  },

  async getRecent(limit = 5, locale?: 'tr' | 'en') {
    const cacheKey = `strapi:blog-recent:${limit}:${locale || 'all'}`;
    
    return strapiCache.getOrSet(cacheKey, () => blogAPI.getRecent(limit, locale));
  },

  async getRelated(currentPostId: string, category: string, limit = 3, locale?: 'tr' | 'en') {
    const cacheKey = `strapi:blog-related:${currentPostId}:${category}:${limit}:${locale || 'all'}`;
    
    return strapiCache.getOrSet(cacheKey, () => blogAPI.getRelated(currentPostId, category, limit, locale));
  }
};

export const cachedCategoriesAPI = {
  async getAll(locale?: 'tr' | 'en') {
    const cacheKey = `strapi:categories:${locale || 'all'}`;
    
    return strapiCache.getOrSet(cacheKey, () => categoriesAPI.getAll(locale));
  },

  async getBySlug(slug: string, locale?: 'tr' | 'en') {
    const cacheKey = `strapi:category:${slug}:${locale || 'all'}`;
    
    return strapiCache.getOrSet(cacheKey, () => categoriesAPI.getBySlug(slug, locale));
  }
};

export const cachedTagsAPI = {
  async getAll(locale?: 'tr' | 'en') {
    const cacheKey = `strapi:tags:${locale || 'all'}`;
    
    return strapiCache.getOrSet(cacheKey, () => tagsAPI.getAll(locale));
  },

  async getBySlug(slug: string, locale?: 'tr' | 'en') {
    const cacheKey = `strapi:tag:${slug}:${locale || 'all'}`;
    
    return strapiCache.getOrSet(cacheKey, () => tagsAPI.getBySlug(slug, locale));
  }
};

// Cache invalidation utilities for Strapi content
export const strapiCacheUtils = {
  // Invalidate all blog-related cache
  invalidateBlogCache() {
    const stats = strapiCache.getStats();
    stats.keys
      .filter(key => key.startsWith('strapi:blog'))
      .forEach(key => strapiCache.delete(key));
  },

  // Invalidate specific blog post cache
  invalidateBlogPost(slug: string) {
    const stats = strapiCache.getStats();
    stats.keys
      .filter(key => key.includes(`blog-post:${slug}`))
      .forEach(key => strapiCache.delete(key));
  },

  // Invalidate category cache
  invalidateCategoryCache() {
    const stats = strapiCache.getStats();
    stats.keys
      .filter(key => key.startsWith('strapi:categor'))
      .forEach(key => strapiCache.delete(key));
  },

  // Invalidate tag cache
  invalidateTagCache() {
    const stats = strapiCache.getStats();
    stats.keys
      .filter(key => key.startsWith('strapi:tag'))
      .forEach(key => strapiCache.delete(key));
  },

  // Full cache invalidation
  invalidateAll() {
    const stats = strapiCache.getStats();
    stats.keys
      .filter(key => key.startsWith('strapi:'))
      .forEach(key => strapiCache.delete(key));
  }
};

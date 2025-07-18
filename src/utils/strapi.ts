import { 
  STRAPI_CONFIG, 
  buildApiUrl, 
  type StrapiBlogPost, 
  type StrapiCategory, 
  type StrapiTag, 
  type StrapiResponse, 
  type StrapiSingleResponse 
} from '../config/strapi';

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

// Cache utilities for development
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const cacheUtils = {
  get<T>(key: string): T | null {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    cache.delete(key);
    return null;
  },

  set<T>(key: string, data: T): void {
    cache.set(key, { data, timestamp: Date.now() });
  },

  clear(): void {
    cache.clear();
  }
};

// Cached versions of API functions (for development)
export const cachedBlogAPI = {
  async getAll(params?: Parameters<typeof blogAPI.getAll>[0]) {
    const cacheKey = `blog-posts-${JSON.stringify(params)}`;
    const cached = cacheUtils.get<StrapiResponse<StrapiBlogPost[]>>(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    const result = await blogAPI.getAll(params);
    cacheUtils.set(cacheKey, result);
    return result;
  },

  async getBySlug(slug: string, locale?: 'tr' | 'en') {
    const cacheKey = `blog-post-${slug}-${locale}`;
    const cached = cacheUtils.get<StrapiSingleResponse<StrapiBlogPost>>(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    const result = await blogAPI.getBySlug(slug, locale);
    cacheUtils.set(cacheKey, result);
    return result;
  }
};

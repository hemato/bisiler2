import type { APIRoute } from 'astro';

// Site configuration
import { DOMAIN_CONFIG } from '../config/domain';
import { getAllRouteKeys, getRoute, getRouteMetadata } from './routes';

const SITE_URL = DOMAIN_CONFIG.baseUrl;

export function generateSitemap(): string {
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Generate URLs for all routes in both languages
  const urlElements = getAllRouteKeys().map(routeKey => {
    const metadata = getRouteMetadata(routeKey);
    const trUrl = getRoute('tr', routeKey);
    const enUrl = getRoute('en', routeKey);
    
    return `
  <url>
    <loc>${SITE_URL}${trUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${metadata.changefreq}</changefreq>
    <priority>${metadata.priority}</priority>
  </url>
  <url>
    <loc>${SITE_URL}${enUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${metadata.changefreq}</changefreq>
    <priority>${metadata.priority}</priority>
  </url>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}

// Enhanced blog posts sitemap generation
export function generateBlogSitemap(blogPosts: Array<{
  slug: string;
  updatedAt?: string;
  lang?: 'tr' | 'en';
  featured?: boolean;
  category?: string;
}> = []): string {
  const currentDate = new Date().toISOString().split('T')[0];
  
  if (blogPosts.length === 0) {
    // Return empty string if no posts available
    return '';
  }
  
  const blogUrls = blogPosts.map(post => {
    const lastmod = post.updatedAt ?
      new Date(post.updatedAt).toISOString().split('T')[0] :
      currentDate;
    
    // Determine priority based on post properties
    const priority = post.featured ? '0.8' : '0.6';
    
    // Determine change frequency based on recency
    const postDate = new Date(post.updatedAt || currentDate);
    const daysSinceUpdate = Math.floor((Date.now() - postDate.getTime()) / (1000 * 60 * 60 * 24));
    
    let changefreq = 'monthly';
    if (daysSinceUpdate < 7) changefreq = 'weekly';
    else if (daysSinceUpdate < 30) changefreq = 'monthly';
    else if (daysSinceUpdate < 90) changefreq = 'yearly';
    else changefreq = 'never';
    
    // Generate URL based on language
    const baseUrl = post.lang === 'en' ? `${SITE_URL}/en/blog` : `${SITE_URL}/blog`;
    
    return `
  <url>
    <loc>${baseUrl}/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join('');

  return blogUrls;
}

// Generate category pages sitemap
export function generateCategorySitemap(categories: Array<{
  slug: string;
  updatedAt?: string;
  lang?: 'tr' | 'en';
}> = []): string {
  const currentDate = new Date().toISOString().split('T')[0];
  
  if (categories.length === 0) {
    return '';
  }
  
  const categoryUrls = categories.map(category => {
    const lastmod = category.updatedAt ?
      new Date(category.updatedAt).toISOString().split('T')[0] :
      currentDate;
    
    const baseUrl = category.lang === 'en' ? `${SITE_URL}/en/blog/category` : `${SITE_URL}/blog/category`;
    
    return `
  <url>
    <loc>${baseUrl}/${category.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`;
  }).join('');

  return categoryUrls;
}

// Generate image sitemap for SEO
export function generateImageSitemap(images: Array<{
  url: string;
  title?: string;
  caption?: string;
  location?: string; // Page where image appears
}> = []): string {
  if (images.length === 0) {
    return '';
  }
  
  const imageUrls = images.map(image => `
  <url>
    <loc>${image.location || SITE_URL}</loc>
    <image:image>
      <image:loc>${image.url}</image:loc>
      ${image.title ? `<image:title><![CDATA[${image.title}]]></image:title>` : ''}
      ${image.caption ? `<image:caption><![CDATA[${image.caption}]]></image:caption>` : ''}
    </image:image>
  </url>`).join('');

  return imageUrls;
}

// Generate news sitemap for recent blog posts
export function generateNewsSitemap(newsItems: Array<{
  title: string;
  publishDate: string;
  url: string;
  language: 'tr' | 'en';
  keywords?: string[];
}> = []): string {
  if (newsItems.length === 0) {
    return '';
  }
  
  // Only include news from the last 2 days (Google requirement)
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  
  const recentNews = newsItems.filter(item =>
    new Date(item.publishDate) >= twoDaysAgo
  );
  
  if (recentNews.length === 0) {
    return '';
  }
  
  const newsUrls = recentNews.map(item => `
  <url>
    <loc>${item.url}</loc>
    <news:news>
      <news:publication>
        <news:name>TechCorp</news:name>
        <news:language>${item.language}</news:language>
      </news:publication>
      <news:publication_date>${item.publishDate}</news:publication_date>
      <news:title><![CDATA[${item.title}]]></news:title>
      ${item.keywords ? `<news:keywords>${item.keywords.join(', ')}</news:keywords>` : ''}
    </news:news>
  </url>`).join('');

  return newsUrls;
}

// Generate complete sitemap index
export function generateSitemapIndex(): string {
  const currentDate = new Date().toISOString().split('T')[0];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-images.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-news.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`;
}

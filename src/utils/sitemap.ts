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

// For future blog posts - this can be extended when CMS is integrated
export function generateBlogSitemap(blogPosts: any[] = []): string {
  const currentDate = new Date().toISOString().split('T')[0];
  
  const blogUrls = blogPosts.map(post => `
  <url>
    <loc>${SITE_URL}/blog/${post.slug}</loc>
    <lastmod>${post.updatedAt || currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${SITE_URL}/en/blog/${post.slug}</loc>
    <lastmod>${post.updatedAt || currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('');

  return blogUrls;
}

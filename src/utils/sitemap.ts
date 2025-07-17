import type { APIRoute } from 'astro';

// Site configuration
import { DOMAIN_CONFIG } from '../config/domain';

const SITE_URL = DOMAIN_CONFIG.baseUrl;

// All available pages with their priorities and change frequencies
const pages = [
  // Turkish pages (default) - consolidated URLs
  { url: '/', priority: 1.0, changefreq: 'weekly' },
  { url: '/hakkimizda', priority: 0.8, changefreq: 'monthly' },
  { url: '/hizmetlerimiz', priority: 0.9, changefreq: 'weekly' },
  { url: '/referanslar', priority: 0.7, changefreq: 'monthly' },
  { url: '/iletisim', priority: 0.8, changefreq: 'monthly' },
  { url: '/sss', priority: 0.6, changefreq: 'monthly' },
  { url: '/blog', priority: 0.7, changefreq: 'weekly' },
  { url: '/gizlilik-politikasi', priority: 0.3, changefreq: 'yearly' },
  
  // English pages - consolidated URLs
  { url: '/en/', priority: 1.0, changefreq: 'weekly' },
  { url: '/en/about', priority: 0.8, changefreq: 'monthly' },
  { url: '/en/services', priority: 0.9, changefreq: 'weekly' },
  { url: '/en/references', priority: 0.7, changefreq: 'monthly' },
  { url: '/en/contact', priority: 0.8, changefreq: 'monthly' },
  { url: '/en/faq', priority: 0.6, changefreq: 'monthly' },
  { url: '/en/blog', priority: 0.7, changefreq: 'weekly' },
  { url: '/en/privacy', priority: 0.3, changefreq: 'yearly' },
];

export function generateSitemap(): string {
  const currentDate = new Date().toISOString().split('T')[0];
  
  const urlElements = pages.map(page => `
  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('');

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

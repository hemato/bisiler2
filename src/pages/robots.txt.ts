import { DOMAIN_CONFIG } from '../config/domain';

export async function GET() {
  const robotsContent = `User-agent: *
Allow: /

# Disallow admin and private areas (future use)
Disallow: /admin/
Disallow: /api/
Disallow: /_astro/

# Allow all search engines to access sitemap
Sitemap: ${DOMAIN_CONFIG.baseUrl}/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Specific rules for major search engines
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 1

# Block common spam bots
User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /`;

  return new Response(robotsContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    },
  });
}

import { generateSitemap, generateBlogSitemap } from '../utils/sitemap';
import { cachedBlogAPI, strapiUtils, type BlogPost } from '../utils/strapi';

export async function GET() {
  try {
    // Generate basic sitemap
    const baseSitemap = generateSitemap();
    
    // Try to get blog posts for dynamic sitemap
    let blogUrls = '';
    try {
      // Get all blog slugs for both languages
      const [trSlugs, enSlugs] = await Promise.all([
        strapiUtils.getAllBlogSlugs('tr'),
        strapiUtils.getAllBlogSlugs('en')
      ]);
      
      // Get recent blog posts data for last modified dates
      const [trPosts, enPosts] = await Promise.all([
        cachedBlogAPI.getRecent(100, 'tr'), // Get up to 100 recent posts
        cachedBlogAPI.getRecent(100, 'en')
      ]);
      
      // Create blog posts array with proper data structure
      const blogPosts = [
        ...trPosts.data.map((post: BlogPost) => ({
          slug: post.slug,
          updatedAt: post.updatedAt || post.publishedAt,
          lang: 'tr'
        })),
        ...enPosts.data.map((post: BlogPost) => ({
          slug: post.slug,
          updatedAt: post.updatedAt || post.publishedAt,
          lang: 'en'
        }))
      ];
      
      blogUrls = generateBlogSitemap(blogPosts);
    } catch (error) {
      console.warn('Could not fetch blog posts for sitemap (CMS not available):', error instanceof Error ? error.message : 'Unknown error');
      // Generate static blog sitemap without real data
      blogUrls = generateBlogSitemap([]);
    }
    
    // Combine base sitemap with blog URLs
    const fullSitemap = baseSitemap.replace(
      '</urlset>',
      `${blogUrls}\n</urlset>`
    );
    
    return new Response(fullSitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'X-Robots-Tag': 'noindex', // Prevent indexing of sitemap itself
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Fallback to basic sitemap
    const fallbackSitemap = generateSitemap();
    return new Response(fallbackSitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=1800', // Shorter cache on error
      },
    });
  }
}
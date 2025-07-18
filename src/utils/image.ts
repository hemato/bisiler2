// Image optimization utilities
export interface ImageOptions {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpg' | 'png';
  loading?: 'lazy' | 'eager';
  sizes?: string;
  className?: string;
}

export interface ResponsiveImageSet {
  src: string;
  srcset: string;
  sizes: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  loading?: 'lazy' | 'eager';
}

// Generate responsive image URLs for external images
export function generateResponsiveImageUrls(
  baseUrl: string,
  widths: number[] = [400, 600, 800, 1200, 1600],
  format: 'webp' | 'jpg' = 'webp'
): string[] {
  // For Pexels images, we can add parameters
  if (baseUrl.includes('pexels.com')) {
    return widths.map(width => {
      const url = new URL(baseUrl);
      url.searchParams.set('w', width.toString());
      url.searchParams.set('auto', 'compress');
      url.searchParams.set('cs', 'tinysrgb');
      if (format === 'webp') {
        url.searchParams.set('fm', 'webp');
      }
      return url.toString();
    });
  }
  
  // For other images, return the original URL
  return widths.map(() => baseUrl);
}

// Generate srcset string
export function generateSrcset(
  baseUrl: string,
  widths: number[] = [400, 600, 800, 1200, 1600]
): string {
  const urls = generateResponsiveImageUrls(baseUrl, widths);
  return widths.map((width, index) => `${urls[index]} ${width}w`).join(', ');
}

// Generate sizes string for responsive images
export function generateSizes(
  breakpoints: Array<{ query: string; size: string }> = [
    { query: '(max-width: 640px)', size: '100vw' },
    { query: '(max-width: 1024px)', size: '50vw' },
    { query: '(max-width: 1280px)', size: '33vw' },
    { query: '', size: '25vw' }
  ]
): string {
  return breakpoints
    .filter(bp => bp.query) // Remove empty queries
    .map(bp => `${bp.query} ${bp.size}`)
    .join(', ') + 
    (breakpoints.find(bp => !bp.query)?.size || '100vw');
}

// Create responsive image set
export function createResponsiveImageSet(
  src: string,
  alt: string,
  options: {
    widths?: number[];
    sizes?: string;
    className?: string;
    loading?: 'lazy' | 'eager';
    aspectRatio?: number; // width/height ratio
  } = {}
): ResponsiveImageSet {
  const {
    widths = [400, 600, 800, 1200, 1600],
    sizes = generateSizes(),
    className,
    loading = 'lazy',
    aspectRatio = 16/9
  } = options;

  const srcset = generateSrcset(src, widths);
  const maxWidth = Math.max(...widths);
  const height = Math.round(maxWidth / aspectRatio);

  return {
    src,
    srcset,
    sizes,
    alt,
    width: maxWidth,
    height,
    className,
    loading
  };
}

// Predefined image sets for common use cases
export const IMAGE_PRESETS = {
  hero: {
    widths: [600, 800, 1200, 1600, 2000],
    sizes: '100vw',
    aspectRatio: 16/9,
    loading: 'eager' as const
  },
  
  card: {
    widths: [300, 400, 600, 800],
    sizes: generateSizes([
      { query: '(max-width: 640px)', size: '100vw' },
      { query: '(max-width: 1024px)', size: '50vw' },
      { query: '', size: '33vw' }
    ]),
    aspectRatio: 16/9,
    loading: 'lazy' as const
  },
  
  thumbnail: {
    widths: [150, 200, 300, 400],
    sizes: generateSizes([
      { query: '(max-width: 640px)', size: '150px' },
      { query: '', size: '200px' }
    ]),
    aspectRatio: 1,
    loading: 'lazy' as const
  },
  
  gallery: {
    widths: [400, 600, 800, 1200],
    sizes: generateSizes([
      { query: '(max-width: 640px)', size: '100vw' },
      { query: '(max-width: 1024px)', size: '50vw' },
      { query: '', size: '33vw' }
    ]),
    aspectRatio: 4/3,
    loading: 'lazy' as const
  }
};

// Generate alt text for images
export function generateAltText(
  imageName: string,
  context: string,
  lang: 'tr' | 'en' = 'tr'
): string {
  const templates = {
    tr: {
      team: `${context} - TechCorp uzman ekibi`,
      service: `${context} hizmeti görseli - TechCorp`,
      result: `${context} sonuçları - TechCorp başarı hikayesi`,
      process: `${context} sürecini gösteren diagram`,
      hero: `${context} - TechCorp dijital çözümleri`,
      portfolio: `${context} - TechCorp portföy projesi`,
      general: `${context} - TechCorp ${imageName}`
    },
    en: {
      team: `${context} - TechCorp expert team`,
      service: `${context} service image - TechCorp`,
      result: `${context} results - TechCorp success story`,
      process: `Diagram showing ${context} process`,
      hero: `${context} - TechCorp digital solutions`,
      portfolio: `${context} - TechCorp portfolio project`,
      general: `${context} - TechCorp ${imageName}`
    }
  };
  
  const type = imageName.toLowerCase().includes('team') ? 'team' :
               imageName.toLowerCase().includes('service') ? 'service' :
               imageName.toLowerCase().includes('result') ? 'result' :
               imageName.toLowerCase().includes('process') ? 'process' :
               imageName.toLowerCase().includes('hero') ? 'hero' :
               imageName.toLowerCase().includes('portfolio') ? 'portfolio' : 'general';
  
  return templates[lang][type];
}

// Lazy loading configuration
export const LAZY_LOADING_CONFIG = {
  // Intersection Observer options
  rootMargin: '50px',
  threshold: 0.1,
  
  // Placeholder options
  placeholder: {
    color: '#f3f4f6',
    blur: 'blur(10px)',
    fadeIn: 'opacity 0.3s ease-in-out'
  },
  
  // Loading animation
  skeleton: {
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    background: 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)'
  }
};

// Image optimization recommendations
export const IMAGE_OPTIMIZATION_TIPS = {
  formats: {
    webp: 'Use WebP for better compression (25-35% smaller than JPEG)',
    avif: 'Use AVIF for next-gen browsers (50% smaller than JPEG)',
    jpg: 'Use JPEG for photos with many colors',
    png: 'Use PNG for images with transparency or few colors'
  },
  
  sizes: {
    hero: 'Max 2000px wide, 80-90% quality',
    card: 'Max 800px wide, 75-85% quality',
    thumbnail: 'Max 400px wide, 70-80% quality',
    icon: 'Max 200px wide, 90-95% quality'
  },
  
  performance: {
    loading: 'Use loading="lazy" for images below the fold',
    preload: 'Preload critical images (hero, above-the-fold)',
    cdn: 'Use CDN for external images',
    compression: 'Compress images before upload'
  }
};

// WebP support detection
export function detectWebPSupport(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}

// AVIF support detection
export function detectAVIFSupport(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    
    const avif = new Image();
    avif.onload = avif.onerror = () => {
      resolve(avif.height === 2);
    };
    avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  });
}

// Get best image format based on browser support
export async function getBestImageFormat(
  originalFormat: 'jpg' | 'png' = 'jpg'
): Promise<'avif' | 'webp' | 'jpg' | 'png'> {
  if (typeof window === 'undefined') {
    return originalFormat;
  }
  
  const [avifSupported, webpSupported] = await Promise.all([
    detectAVIFSupport(),
    detectWebPSupport()
  ]);
  
  if (avifSupported) return 'avif';
  if (webpSupported) return 'webp';
  return originalFormat;
}

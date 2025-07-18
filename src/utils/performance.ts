// Performance optimization utilities
export interface PerformanceConfig {
  enableMetrics: boolean;
  enableLazyLoading: boolean;
  enablePreloading: boolean;
  enableCompression: boolean;
  enableCaching: boolean;
}

export const PERFORMANCE_CONFIG: PerformanceConfig = {
  enableMetrics: true,
  enableLazyLoading: true,
  enablePreloading: true,
  enableCompression: true,
  enableCaching: true
};

// Core Web Vitals tracking
export interface WebVitalsMetrics {
  FCP: number; // First Contentful Paint
  LCP: number; // Largest Contentful Paint
  FID: number; // First Input Delay
  CLS: number; // Cumulative Layout Shift
  TTFB: number; // Time to First Byte
}

// Performance monitoring
export class PerformanceMonitor {
  private metrics: Partial<WebVitalsMetrics> = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    if (typeof window !== 'undefined' && PERFORMANCE_CONFIG.enableMetrics) {
      this.initializeObservers();
    }
  }

  private initializeObservers() {
    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry;
        this.metrics.LCP = lastEntry.startTime;
        this.reportMetric('LCP', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.FID = entry.processingStart - entry.startTime;
          this.reportMetric('FID', entry.processingStart - entry.startTime);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.metrics.CLS = clsValue;
        this.reportMetric('CLS', clsValue);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    }

    // First Contentful Paint
    if ('performance' in window && 'getEntriesByType' in performance) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.FCP = entry.startTime;
            this.reportMetric('FCP', entry.startTime);
          }
        });
      });
      observer.observe({ entryTypes: ['paint'] });
      this.observers.push(observer);
    }

    // Time to First Byte
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.metrics.TTFB = navigation.responseStart - navigation.requestStart;
        this.reportMetric('TTFB', navigation.responseStart - navigation.requestStart);
      }
    });
  }

  private reportMetric(name: string, value: number) {
    // Report to Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'web_vitals', {
        event_category: 'performance',
        event_label: name,
        value: Math.round(value),
        custom_parameter_1: name,
        custom_parameter_2: 'web_vitals'
      });
    }

    // Report to console for debugging
    if (PERFORMANCE_CONFIG.enableMetrics) {
      console.log(`[Performance] ${name}: ${value}ms`);
    }
  }

  public getMetrics(): Partial<WebVitalsMetrics> {
    return { ...this.metrics };
  }

  public disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Lazy loading utilities
export interface LazyLoadOptions {
  rootMargin: string;
  threshold: number;
  enableNativeLoading: boolean;
}

export const LAZY_LOAD_CONFIG: LazyLoadOptions = {
  rootMargin: '50px',
  threshold: 0.1,
  enableNativeLoading: true
};

export class LazyLoader {
  private observer: IntersectionObserver | null = null;
  private elements: Set<Element> = new Set();

  constructor(options: Partial<LazyLoadOptions> = {}) {
    const config = { ...LAZY_LOAD_CONFIG, ...options };
    
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        {
          rootMargin: config.rootMargin,
          threshold: config.threshold
        }
      );
    }
  }

  private handleIntersection(entries: IntersectionObserverEntry[]) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadElement(entry.target);
        this.observer?.unobserve(entry.target);
        this.elements.delete(entry.target);
      }
    });
  }

  private loadElement(element: Element) {
    if (element instanceof HTMLImageElement) {
      const dataSrc = element.dataset.src;
      if (dataSrc) {
        element.src = dataSrc;
        element.classList.add('loaded');
      }
    } else if (element instanceof HTMLIFrameElement) {
      const dataSrc = element.dataset.src;
      if (dataSrc) {
        element.src = dataSrc;
      }
    }
  }

  public observe(element: Element) {
    if (this.observer) {
      this.observer.observe(element);
      this.elements.add(element);
    }
  }

  public disconnect() {
    if (this.observer) {
      this.observer.disconnect();
      this.elements.clear();
    }
  }
}

// Critical resource preloading
export interface PreloadResource {
  href: string;
  as: 'script' | 'style' | 'image' | 'font' | 'fetch';
  type?: string;
  crossorigin?: boolean;
  integrity?: string;
}

export const CRITICAL_RESOURCES: PreloadResource[] = [
  {
    href: 'https://fonts.gstatic.com/s/inter/v18/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2',
    as: 'font',
    type: 'font/woff2',
    crossorigin: true
  }
];

export function preloadCriticalResources() {
  if (typeof document === 'undefined') return;

  CRITICAL_RESOURCES.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    
    if (resource.type) link.type = resource.type;
    if (resource.crossorigin) link.crossOrigin = 'anonymous';
    if (resource.integrity) link.integrity = resource.integrity;
    
    document.head.appendChild(link);
  });
}

// Cache management
export interface CacheConfig {
  version: string;
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum cache size in bytes
}

export const CACHE_CONFIG: CacheConfig = {
  version: '1.0.0',
  ttl: 24 * 60 * 60 * 1000, // 24 hours
  maxSize: 10 * 1024 * 1024 // 10MB
};

export class CacheManager {
  private cache: Map<string, { data: any; timestamp: number; size: number }> = new Map();
  private totalSize: number = 0;

  constructor(private config: CacheConfig = CACHE_CONFIG) {}

  public set(key: string, data: any): void {
    const size = this.calculateSize(data);
    const timestamp = Date.now();
    
    // Remove expired entries
    this.cleanup();
    
    // Remove old entry if exists
    if (this.cache.has(key)) {
      this.totalSize -= this.cache.get(key)!.size;
    }
    
    // Check if we need to make space
    while (this.totalSize + size > this.config.maxSize && this.cache.size > 0) {
      this.evictOldest();
    }
    
    this.cache.set(key, { data, timestamp, size });
    this.totalSize += size;
  }

  public get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    // Check if expired
    if (Date.now() - entry.timestamp > this.config.ttl) {
      this.cache.delete(key);
      this.totalSize -= entry.size;
      return null;
    }
    
    return entry.data;
  }

  private cleanup(): void {
    const now = Date.now();
    const expired: string[] = [];
    
    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > this.config.ttl) {
        expired.push(key);
      }
    });
    
    expired.forEach(key => {
      const entry = this.cache.get(key)!;
      this.cache.delete(key);
      this.totalSize -= entry.size;
    });
  }

  private evictOldest(): void {
    let oldestKey = '';
    let oldestTime = Infinity;
    
    this.cache.forEach((entry, key) => {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    });
    
    if (oldestKey) {
      const entry = this.cache.get(oldestKey)!;
      this.cache.delete(oldestKey);
      this.totalSize -= entry.size;
    }
  }

  private calculateSize(data: any): number {
    // Rough estimation of object size
    return JSON.stringify(data).length * 2; // 2 bytes per character
  }

  public clear(): void {
    this.cache.clear();
    this.totalSize = 0;
  }

  public getStats(): { size: number; count: number; totalSize: number } {
    return {
      size: this.cache.size,
      count: this.cache.size,
      totalSize: this.totalSize
    };
  }
}

// Initialize performance monitoring
export const performanceMonitor = new PerformanceMonitor();
export const lazyLoader = new LazyLoader();
export const cacheManager = new CacheManager();

// Performance best practices
export const PERFORMANCE_TIPS = {
  images: {
    formats: ['webp', 'avif', 'jpg', 'png'],
    sizes: 'Use responsive images with srcset',
    loading: 'Use loading="lazy" for below-the-fold images',
    compression: 'Optimize images to 80-90% quality'
  },
  fonts: {
    preload: 'Preload critical fonts',
    display: 'Use font-display: swap',
    subset: 'Use font subsets for better performance'
  },
  scripts: {
    async: 'Use async/defer for non-critical scripts',
    bundling: 'Bundle and minify JavaScript',
    treeshaking: 'Remove unused code'
  },
  css: {
    critical: 'Inline critical CSS',
    minification: 'Minify CSS files',
    unused: 'Remove unused CSS'
  }
};

// Export utilities for global use
export default {
  PerformanceMonitor,
  LazyLoader,
  CacheManager,
  performanceMonitor,
  lazyLoader,
  cacheManager,
  preloadCriticalResources,
  PERFORMANCE_CONFIG,
  LAZY_LOAD_CONFIG,
  CACHE_CONFIG,
  PERFORMANCE_TIPS
};

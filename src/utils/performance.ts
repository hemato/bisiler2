// Performance optimization utilities
export interface PerformanceMetrics {
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay  
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
}

export interface OptimizationConfig {
  enableLazyLoading: boolean;
  enableImageOptimization: boolean;
  enableCriticalCSS: boolean;
  enableCodeSplitting: boolean;
  preloadCriticalResources: boolean;
}

// Default optimization configuration
export const DEFAULT_OPTIMIZATION_CONFIG: OptimizationConfig = {
  enableLazyLoading: true,
  enableImageOptimization: true,
  enableCriticalCSS: true,
  enableCodeSplitting: true,
  preloadCriticalResources: true
};

// Critical resources that should be preloaded
export const CRITICAL_RESOURCES = {
  fonts: [
    'https://fonts.gstatic.com/s/inter/v18/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2'
  ],
  scripts: [],
  styles: []
};

// Performance monitoring
export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObservers();
    }
  }

  private initializeObservers(): void {
    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        this.metrics.lcp = lastEntry.startTime;
      });

      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (e) {
        console.warn('LCP observer not supported');
      }

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.fid = entry.processingStart - entry.startTime;
        });
      });

      try {
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (e) {
        console.warn('FID observer not supported');
      }

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.metrics.cls = clsValue;
      });

      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (e) {
        console.warn('CLS observer not supported');
      }
    }

    // Navigation timing metrics
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (perfData) {
          this.metrics.fcp = perfData.responseStart - perfData.fetchStart;
          this.metrics.ttfb = perfData.responseStart - perfData.requestStart;
        }
      }, 0);
    });
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  disconnect(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }

  // Send metrics to analytics
  sendMetrics(endpoint?: string): void {
    if (!endpoint) return;

    const metrics = this.getMetrics();
    
    // Use sendBeacon for reliability
    if ('sendBeacon' in navigator) {
      navigator.sendBeacon(endpoint, JSON.stringify(metrics));
    } else {
      // Fallback to fetch
      fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(metrics),
        headers: {
          'Content-Type': 'application/json'
        },
        keepalive: true
      }).catch(console.error);
    }
  }
}

// Resource loading utilities
export const resourceLoader = {
  // Preload critical resources
  preloadResource(href: string, as: string, type?: string): void {
    if (typeof document === 'undefined') return;

    const existing = document.querySelector(`link[href="${href}"]`);
    if (existing) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    link.crossOrigin = 'anonymous';
    
    document.head.appendChild(link);
  },

  // Prefetch resources for future navigation
  prefetchResource(href: string): void {
    if (typeof document === 'undefined') return;

    const existing = document.querySelector(`link[href="${href}"]`);
    if (existing) return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    
    document.head.appendChild(link);
  },

  // DNS prefetch for external domains
  dnsPrefetch(domain: string): void {
    if (typeof document === 'undefined') return;

    const existing = document.querySelector(`link[href="${domain}"]`);
    if (existing) return;

    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    
    document.head.appendChild(link);
  },

  // Preconnect to important external origins
  preconnect(origin: string, crossorigin = false): void {
    if (typeof document === 'undefined') return;

    const existing = document.querySelector(`link[href="${origin}"]`);
    if (existing) return;

    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    if (crossorigin) link.crossOrigin = 'anonymous';
    
    document.head.appendChild(link);
  }
};

// Image lazy loading utility
export const imageLoader = {
  // Intersection Observer for lazy loading
  lazyObserver: null as IntersectionObserver | null,

  initLazyLoading(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    this.lazyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const dataSrc = img.dataset.src;
            
            if (dataSrc) {
              img.src = dataSrc;
              img.removeAttribute('data-src');
              this.lazyObserver?.unobserve(img);
            }
          }
        });
      },
      {
        rootMargin: '50px 0px', // Load images 50px before they come into view
        threshold: 0.01
      }
    );

    // Observe all images with data-src
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => this.lazyObserver?.observe(img));
  },

  // Add image to lazy loading queue
  observeImage(img: HTMLImageElement): void {
    if (this.lazyObserver) {
      this.lazyObserver.observe(img);
    }
  }
};

// Code splitting utilities
export const codeSplitting = {
  // Dynamic import with error handling
  async loadModule<T>(
    importFn: () => Promise<T>,
    fallback?: () => T,
    retries = 3
  ): Promise<T> {
    for (let i = 0; i < retries; i++) {
      try {
        return await importFn();
      } catch (error) {
        if (i === retries - 1) {
          console.error('Failed to load module after retries:', error);
          if (fallback) {
            return fallback();
          }
          throw error;
        }
        // Wait before retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
    throw new Error('Module loading failed');
  },

  // Load component only when needed
  async loadComponent(componentName: string): Promise<any> {
    const components: Record<string, () => Promise<any>> = {
      'ContactForm': () => import('../components/ContactForm'),
      'CRMConsultingForm': () => import('../components/CRMConsultingForm'),
      'WebsiteSetupForm': () => import('../components/WebsiteSetupForm')
    };

    const loader = components[componentName];
    if (!loader) {
      throw new Error(`Component ${componentName} not found`);
    }

    return this.loadModule(loader);
  }
};

// Critical CSS utilities
export const criticalCSS = {
  // Extract critical CSS for above-the-fold content
  extractCritical(): string[] {
    if (typeof document === 'undefined') return [];

    const criticalElements = document.querySelectorAll(
      'header, nav, main > section:first-child, .hero, .above-fold'
    );

    const criticalClasses: string[] = [];
    criticalElements.forEach(element => {
      const classes = Array.from(element.classList);
      criticalClasses.push(...classes);
    });

    return [...new Set(criticalClasses)];
  },

  // Inline critical CSS
  inlineCritical(css: string): void {
    if (typeof document === 'undefined') return;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }
};

// Bundle analyzer utilities (for development)
export const bundleAnalyzer = {
  // Analyze bundle size
  analyzeBundleSize(): void {
    if (typeof window === 'undefined') return;

    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));

    console.group('📦 Bundle Analysis');
    console.log('Scripts:', scripts.length);
    console.log('Stylesheets:', styles.length);
    
    // Log largest scripts
    scripts.forEach((script: any) => {
      if (script.src) {
        fetch(script.src)
          .then(response => response.text())
          .then(text => {
            console.log(`${script.src}: ${(text.length / 1024).toFixed(2)}KB`);
          })
          .catch(() => {});
      }
    });
    
    console.groupEnd();
  },

  // Check for unused CSS
  checkUnusedCSS(): void {
    if (typeof document === 'undefined') return;

    const allRules: string[] = [];
    const usedRules: string[] = [];

    // Get all CSS rules
    Array.from(document.styleSheets).forEach(sheet => {
      try {
        Array.from(sheet.cssRules || []).forEach((rule: any) => {
          if (rule.selectorText) {
            allRules.push(rule.selectorText);
            try {
              if (document.querySelector(rule.selectorText)) {
                usedRules.push(rule.selectorText);
              }
            } catch (e) {
              // Invalid selector
            }
          }
        });
      } catch (e) {
        // CORS or other issues with stylesheet
      }
    });

    const unusedRules = allRules.filter(rule => !usedRules.includes(rule));
    console.log(`📊 CSS Usage: ${usedRules.length}/${allRules.length} rules used`);
    console.log('🗑️ Unused rules:', unusedRules.slice(0, 10));
  }
};

// Performance optimization initialization
export function initPerformanceOptimizations(config: Partial<OptimizationConfig> = {}): PerformanceMonitor {
  const fullConfig = { ...DEFAULT_OPTIMIZATION_CONFIG, ...config };
  const monitor = new PerformanceMonitor();

  if (typeof window !== 'undefined') {
    // Initialize lazy loading
    if (fullConfig.enableLazyLoading) {
      imageLoader.initLazyLoading();
    }

    // Preload critical resources
    if (fullConfig.preloadCriticalResources) {
      // Preload critical font
      CRITICAL_RESOURCES.fonts.forEach(font => {
        resourceLoader.preloadResource(font, 'font', 'font/woff2');
      });

      // DNS prefetch for external domains
      resourceLoader.dnsPrefetch('//fonts.googleapis.com');
      resourceLoader.dnsPrefetch('//fonts.gstatic.com');
      resourceLoader.dnsPrefetch('//images.pexels.com');
    }

    // Send performance metrics after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        // Send metrics to analytics endpoint if configured
        // monitor.sendMetrics('/api/analytics/performance');
      }, 5000);
    });
  }

  return monitor;
}

// Utility to measure function performance
export function measurePerformance<T>(
  fn: () => T,
  label?: string
): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  if (label) {
    console.log(`⏱️ ${label}: ${(end - start).toFixed(2)}ms`);
  }
  
  return result;
}

// Async version
export async function measureAsyncPerformance<T>(
  fn: () => Promise<T>,
  label?: string
): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  
  if (label) {
    console.log(`⏱️ ${label}: ${(end - start).toFixed(2)}ms`);
  }
  
  return result;
}

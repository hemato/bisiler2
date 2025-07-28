import { ROUTES, ROUTE_METADATA, type RouteKey, type Language } from '../config/routes';
import { DOMAIN_CONFIG } from '../config/domain';
import { apiCache } from './cache';
import { trackEvent } from '../config/analytics';

// Route cache for performance
const routeCache = new Map<string, string>();
const routeKeyCache = new Map<string, RouteKey | null>();

// Type-safe route getter with caching
export function getRoute(lang: Language, route: RouteKey): string {
  const cacheKey = `${lang}:${route}`;
  
  if (routeCache.has(cacheKey)) {
    return routeCache.get(cacheKey)!;
  }
  
  const routePath = ROUTES[lang][route];
  routeCache.set(cacheKey, routePath);
  return routePath;
}

// Get full URL with domain
export function getFullUrl(lang: Language, route: RouteKey): string {
  const cacheKey = `full:${lang}:${route}`;
  
  if (routeCache.has(cacheKey)) {
    return routeCache.get(cacheKey)!;
  }
  
  const fullUrl = `${DOMAIN_CONFIG.baseUrl}${getRoute(lang, route)}`;
  routeCache.set(cacheKey, fullUrl);
  return fullUrl;
}

// Route mapping between languages
export function getLocalizedRoute(currentPath: string, targetLang: Language): string {
  // Find the route key for the current path
  const routeKey = getRouteKey(currentPath);
  
  if (!routeKey) {
    // If no route key found, try to convert manually for common cases
    return convertPathToTargetLang(currentPath, targetLang);
  }
  
  return getRoute(targetLang, routeKey);
}

// Get route key from path with caching
export function getRouteKey(path: string): RouteKey | null {
  // Check cache first
  if (routeKeyCache.has(path)) {
    return routeKeyCache.get(path)!;
  }
  
  // Remove trailing slash for comparison
  const normalizedPath = path.replace(/\/$/, '') || '/';
  
  let foundKey: RouteKey | null = null;
  
  // Check Turkish routes
  for (const [key, route] of Object.entries(ROUTES.tr)) {
    if (route === normalizedPath) {
      foundKey = key as RouteKey;
      break;
    }
  }
  
  // Check English routes if not found
  if (!foundKey) {
    for (const [key, route] of Object.entries(ROUTES.en)) {
      if (route === normalizedPath) {
        foundKey = key as RouteKey;
        break;
      }
    }
  }
  
  // Cache the result
  routeKeyCache.set(path, foundKey);
  return foundKey;
}

// Convert path to target language (fallback method)
function convertPathToTargetLang(currentPath: string, targetLang: Language): string {
  // No more hardcoded mappings! Use the centralized ROUTES config
  // This is a fallback for paths not found in route config
  
  // For common patterns, try to find route key by searching all routes
  const currentLang = targetLang === 'en' ? 'tr' : 'en';
  
  // Search in the opposite language routes
  for (const [key, route] of Object.entries(ROUTES[currentLang])) {
    if (route === currentPath) {
      return getRoute(targetLang, key as RouteKey);
    }
  }
  
  // If no match found, return default
  return targetLang === 'en' ? '/en' : '/';
}

// Generate hreflang data for SEO
export function generateHrefLang(route: RouteKey): Array<{lang: string, url: string}> {
  return [
    { lang: 'tr', url: getFullUrl('tr', route) },
    { lang: 'en', url: getFullUrl('en', route) }
  ];
}

// Route validation
export function isValidRoute(path: string): boolean {
  return getRouteKey(path) !== null;
}

// Get route metadata
export function getRouteMetadata(route: RouteKey) {
  return ROUTE_METADATA[route];
}

// Get all routes for a language
export function getRoutesForLanguage(lang: Language): Record<RouteKey, string> {
  return ROUTES[lang];
}

// Get all route keys
export function getAllRouteKeys(): RouteKey[] {
  return Object.keys(ROUTES.tr) as RouteKey[];
}

// Get landing page routes
export function getLandingPageRoutes(): RouteKey[] {
  return getAllRouteKeys().filter(route => 
    getRouteMetadata(route).isLanding
  );
}

// Get regular page routes (non-landing)
export function getRegularPageRoutes(): RouteKey[] {
  return getAllRouteKeys().filter(route => 
    !getRouteMetadata(route).isLanding
  );
}

// Debug helper: log all routes
export function debugRoutes(): void {
  console.group('🔍 Route Debug Information');
  
  console.log('Turkish Routes:');
  Object.entries(ROUTES.tr).forEach(([key, path]) => {
    const metadata = getRouteMetadata(key as RouteKey);
    console.log(`  ${key}: ${path} (priority: ${metadata.priority}, landing: ${metadata.isLanding || false})`);
  });
  
  console.log('\nEnglish Routes:');
  Object.entries(ROUTES.en).forEach(([key, path]) => {
    const metadata = getRouteMetadata(key as RouteKey);
    console.log(`  ${key}: ${path} (priority: ${metadata.priority}, landing: ${metadata.isLanding || false})`);
  });
  
  console.groupEnd();
}

// Generate navigation items for a language
export function generateNavigation(lang: Language, includeLanding: boolean = false): Array<{name: string, href: string, key: RouteKey}> {
  const routesToInclude = includeLanding ? getAllRouteKeys() : getRegularPageRoutes();
  
  return routesToInclude.map(route => ({
    name: route, // This should be replaced with actual translation
    href: getRoute(lang, route),
    key: route
  }));
}

// Check if current path matches route
export function isCurrentRoute(currentPath: string, targetRoute: RouteKey): boolean {
  const normalizedCurrentPath = currentPath.replace(/\/$/, '') || '/';
  const trPath = getRoute('tr', targetRoute);
  const enPath = getRoute('en', targetRoute);
  
  return normalizedCurrentPath === trPath || normalizedCurrentPath === enPath;
}

// Advanced route matching with wildcards
export function matchRoute(
  path: string,
  pattern: string,
  exact: boolean = true
): { matches: boolean; params: Record<string, string> } {
  const params: Record<string, string> = {};
  
  if (exact && path === pattern) {
    return { matches: true, params };
  }
  
  // Handle wildcard patterns like /blog/:slug
  const patternParts = pattern.split('/');
  const pathParts = path.split('/');
  
  if (patternParts.length !== pathParts.length && exact) {
    return { matches: false, params };
  }
  
  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const pathPart = pathParts[i];
    
    if (patternPart?.startsWith(':')) {
      // Dynamic parameter
      const paramName = patternPart.slice(1);
      params[paramName] = pathPart || '';
    } else if (patternPart !== pathPart) {
      return { matches: false, params };
    }
  }
  
  return { matches: true, params };
}

// Route analytics tracking
export function trackRouteChange(
  fromPath: string,
  toPath: string,
  lang: Language,
  timing?: number
): void {
  if (typeof window === 'undefined') return;
  
  const fromRouteKey = getRouteKey(fromPath);
  const toRouteKey = getRouteKey(toPath);
  
  trackEvent('route_change', {
    from_path: fromPath,
    to_path: toPath,
    from_route_key: fromRouteKey,
    to_route_key: toRouteKey,
    language: lang,
    timing: timing || 0,
    timestamp: new Date().toISOString()
  });
}

// Route performance monitoring
export function measureRoutePerformance(routeKey: RouteKey, action: () => void): void {
  if (typeof window === 'undefined' || !window.performance) {
    action();
    return;
  }
  
  const startTime = performance.now();
  action();
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  trackEvent('route_performance', {
    route_key: routeKey,
    duration: Math.round(duration),
    timestamp: new Date().toISOString()
  });
}

// Preload route resources
export function preloadRoute(lang: Language, route: RouteKey): void {
  if (typeof window === 'undefined') return;
  
  const routePath = getRoute(lang, route);
  
  // Create link element for prefetching
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = routePath;
  document.head.appendChild(link);
  
  // Track preload action
  trackEvent('route_preload', {
    route_key: route,
    route_path: routePath,
    language: lang
  });
}

// Route breadcrumb generation
export function generateBreadcrumbs(
  currentPath: string,
  lang: Language
): Array<{ name: string; href: string; key: RouteKey }> {
  const pathParts = currentPath.split('/').filter(Boolean);
  const breadcrumbs: Array<{ name: string; href: string; key: RouteKey }> = [];
  
  // Always start with home
  breadcrumbs.push({
    name: lang === 'en' ? 'Home' : 'Anasayfa',
    href: getRoute(lang, 'home'),
    key: 'home'
  });
  
  // Build breadcrumb path
  let currentPath_build = lang === 'en' ? '/en' : '';
  
  for (const part of pathParts) {
    if (part === 'en') continue; // Skip language prefix
    
    currentPath_build += `/${part}`;
    const routeKey = getRouteKey(currentPath_build);
    
    if (routeKey && routeKey !== 'home') {
      breadcrumbs.push({
        name: part.charAt(0).toUpperCase() + part.slice(1), // Capitalize first letter
        href: currentPath_build,
        key: routeKey
      });
    }
  }
  
  return breadcrumbs;
}

// Route validation with detailed feedback
export function validateRoute(path: string): {
  isValid: boolean;
  routeKey: RouteKey | null;
  suggestions: string[];
  language: Language | null;
} {
  const routeKey = getRouteKey(path);
  const isValid = routeKey !== null;
  
  let language: Language | null = null;
  const suggestions: string[] = [];
  
  if (isValid && routeKey) {
    // Determine language
    language = path.startsWith('/en') ? 'en' : 'tr';
  } else {
    // Generate suggestions for similar routes
    const allRoutes = [...Object.values(ROUTES.tr), ...Object.values(ROUTES.en)];
    const similarRoutes = allRoutes.filter(route =>
      route.includes(path.split('/').pop() || '') ||
      path.includes(route.split('/').pop() || '')
    );
    suggestions.push(...similarRoutes.slice(0, 3));
  }
  
  return {
    isValid,
    routeKey,
    suggestions,
    language
  };
}

// Clear route caches (useful for hot reloading in development)
export function clearRouteCache(): void {
  routeCache.clear();
  routeKeyCache.clear();
  console.log('🗑️ Route cache cleared');
}

// Get route performance statistics
export function getRouteStats(): {
  cacheSize: number;
  cacheHitRate: number;
  totalRoutes: number;
} {
  return {
    cacheSize: routeCache.size + routeKeyCache.size,
    cacheHitRate: 0, // Would need actual tracking to calculate
    totalRoutes: getAllRouteKeys().length * 2 // tr + en
  };
}

// Export route utilities as namespace
export const RouteUtils = {
  cache: {
    clear: clearRouteCache,
    stats: getRouteStats
  },
  analytics: {
    trackChange: trackRouteChange,
    measurePerformance: measureRoutePerformance,
    preload: preloadRoute
  },
  matching: {
    match: matchRoute,
    validate: validateRoute
  },
  navigation: {
    breadcrumbs: generateBreadcrumbs
  }
};

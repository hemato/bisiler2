import { ROUTES, ROUTE_METADATA, type RouteKey, type Language } from '../config/routes';
import { DOMAIN_CONFIG } from '../config/domain';

// Type-safe route getter
export function getRoute(lang: Language, route: RouteKey): string {
  return ROUTES[lang][route];
}

// Get full URL with domain
export function getFullUrl(lang: Language, route: RouteKey): string {
  return `${DOMAIN_CONFIG.baseUrl}${getRoute(lang, route)}`;
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

// Get route key from path
export function getRouteKey(path: string): RouteKey | null {
  // Remove trailing slash for comparison
  const normalizedPath = path.replace(/\/$/, '') || '/';
  
  // Check Turkish routes
  for (const [key, route] of Object.entries(ROUTES.tr)) {
    if (route === normalizedPath) {
      return key as RouteKey;
    }
  }
  
  // Check English routes
  for (const [key, route] of Object.entries(ROUTES.en)) {
    if (route === normalizedPath) {
      return key as RouteKey;
    }
  }
  
  return null;
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

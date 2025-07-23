// Security utilities for application hardening
export interface SecurityConfig {
  csp: {
    enabled: boolean;
    reportOnly: boolean;
    nonce?: string;
  };
  xss: {
    enabled: boolean;
    escapeHtml: boolean;
    sanitizeUrls: boolean;
  };
  rateLimit: {
    enabled: boolean;
    windowMs: number;
    maxRequests: number;
  };
  honeypot: {
    enabled: boolean;
    fieldName: string;
    delay: number;
  };
}

// Default security configuration
export const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  csp: {
    enabled: process.env.NODE_ENV === 'production', // Only enable in production
    reportOnly: false
  },
  xss: {
    enabled: true,
    escapeHtml: true,
    sanitizeUrls: true
  },
  rateLimit: {
    enabled: true,
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100
  },
  honeypot: {
    enabled: true,
    fieldName: 'website_url',
    delay: 3000 // 3 seconds
  }
};

// Content Security Policy utilities
export const cspUtils = {
  // Generate CSP directive
  generateCSP(nonce?: string): string {
    const directives = [
      "default-src 'self'",
      // More permissive script-src for Astro hydration - allow unsafe-eval and unsafe-inline for dev/prod compatibility
      `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${nonce ? `'nonce-${nonce}'` : ''} https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://js.emailjs.com data:`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: https: blob:",
      "media-src 'self' https:",
      "object-src 'none'",
      "frame-src 'none'",
      "connect-src 'self' https://api.emailjs.com https://www.google-analytics.com https://analytics.google.com https://your-strapi-domain.com",
      "form-action 'self'",
      "base-uri 'self'",
      "manifest-src 'self'"
    ];

    return directives.join('; ');
  },

  // Generate nonce for inline scripts
  generateNonce(): string {
    const array = new Uint8Array(16);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(array);
    } else {
      // Fallback for server-side
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    return btoa(String.fromCharCode(...array));
  },

  // Check if CSP is supported
  isSupported(): boolean {
    return typeof document !== 'undefined' && 'securityPolicy' in document;
  }
};

// XSS Protection utilities
export const xssProtection = {
  // HTML entity encoding
  escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;'
    };

    return text.replace(/[&<>"'`=\/]/g, (s) => map[s] || s);
  },

  // Unescape HTML entities
  unescapeHtml(html: string): string {
    const map: Record<string, string> = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#039;': "'",
      '&#x2F;': '/',
      '&#x60;': '`',
      '&#x3D;': '='
    };

    return html.replace(/&(amp|lt|gt|quot|#039|#x2F|#x60|#x3D);/g, (match) => map[match] || match);
  },

  // Strip HTML tags
  stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  },

  // Sanitize URL to prevent javascript: and data: schemes
  sanitizeUrl(url: string): string {
    if (!url) return '';
    
    const trimmed = url.trim().toLowerCase();
    
    // Block dangerous protocols
    const dangerousProtocols = [
      'javascript:',
      'data:',
      'vbscript:',
      'file:',
      'about:',
      'chrome:',
      'chrome-extension:',
      'chrome-devtools:'
    ];

    for (const protocol of dangerousProtocols) {
      if (trimmed.startsWith(protocol)) {
        return '#';
      }
    }

    // Allow relative URLs and safe protocols
    if (trimmed.startsWith('http://') || 
        trimmed.startsWith('https://') || 
        trimmed.startsWith('mailto:') ||
        trimmed.startsWith('tel:') ||
        trimmed.startsWith('/') ||
        trimmed.startsWith('#')) {
      return url;
    }

    // Default to safe URL for anything else
    return '#';
  },

  // Sanitize form input
  sanitizeInput(input: string, options: {
    maxLength?: number;
    allowHtml?: boolean;
    stripScripts?: boolean;
  } = {}): string {
    if (!input) return '';

    let sanitized = input.trim();

    // Apply length limit
    if (options.maxLength && sanitized.length > options.maxLength) {
      sanitized = sanitized.substring(0, options.maxLength);
    }

    // Strip script tags by default
    if (options.stripScripts !== false) {
      sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }

    // Escape HTML if not allowing it
    if (!options.allowHtml) {
      sanitized = this.escapeHtml(sanitized);
    }

    return sanitized;
  },

  // Validate email format
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate phone number format
  isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },

  // Check for SQL injection patterns
  hasSqlInjection(input: string): boolean {
    const sqlPatterns = [
      /(\bselect\b|\binsert\b|\bupdate\b|\bdelete\b|\bdrop\b|\bunion\b)/i,
      /(\bor\b|\band\b)\s*\d+\s*[=<>]/i,
      /['"]\s*[;,]\s*['"]/,
      /\/\*.*?\*\//,
      /--[^\r\n]*/,
      /\bexec\b|\bexecute\b/i
    ];

    return sqlPatterns.some(pattern => pattern.test(input));
  }
};

// Rate limiting simulation (client-side)
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number = 15 * 60 * 1000, maxRequests: number = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  // Check if request is allowed
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // Clean old requests
    const validRequests = requests.filter(timestamp => 
      now - timestamp < this.windowMs
    );

    // Check if under limit
    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    // Add current request
    validRequests.push(now);
    this.requests.set(identifier, validRequests);

    return true;
  }

  // Get remaining requests
  getRemainingRequests(identifier: string): number {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    const validRequests = requests.filter(timestamp => 
      now - timestamp < this.windowMs
    );

    return Math.max(0, this.maxRequests - validRequests.length);
  }

  // Get reset time
  getResetTime(identifier: string): number {
    const requests = this.requests.get(identifier) || [];
    if (requests.length === 0) return 0;

    const oldestRequest = Math.min(...requests);
    return oldestRequest + this.windowMs;
  }

  // Clear all requests for identifier
  clear(identifier: string): void {
    this.requests.delete(identifier);
  }

  // Clear all requests
  clearAll(): void {
    this.requests.clear();
  }
}

// Honeypot utilities for spam protection
export const honeypotUtils = {
  // Generate honeypot field HTML
  generateHoneypotField(fieldName: string = 'website_url'): string {
    return `
      <div style="position: absolute; left: -9999px; visibility: hidden;" aria-hidden="true">
        <input type="text" name="${fieldName}" tabindex="-1" autocomplete="off" />
      </div>
    `;
  },

  // Check if honeypot was triggered
  isHoneypotTriggered(formData: FormData | Record<string, any>, fieldName: string = 'website_url'): boolean {
    if (formData instanceof FormData) {
      return formData.has(fieldName) && formData.get(fieldName) !== '';
    }
    return fieldName in formData && formData[fieldName] !== '';
  },

  // Simulate processing delay for suspicious requests
  async simulateProcessingDelay(delay: number = 3000): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, delay));
  }
};

// Security headers utilities
export const securityHeaders = {
  // Generate security headers object
  generateHeaders(nonce?: string): Record<string, string> {
    return {
      // Content Security Policy
      'Content-Security-Policy': cspUtils.generateCSP(nonce),
      
      // XSS Protection
      'X-XSS-Protection': '1; mode=block',
      
      // Prevent MIME sniffing
      'X-Content-Type-Options': 'nosniff',
      
      // Frame options
      'X-Frame-Options': 'DENY',
      
      // Referrer Policy
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      
      // HSTS (HTTP Strict Transport Security)
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      
      // Permissions Policy
      'Permissions-Policy': 'camera=(), microphone=(), location=(), payment=(), usb=()',
      
      // Cross-Origin Policies
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    };
  },

  // Generate meta tags for security
  generateMetaTags(nonce?: string): string {
    const headers = this.generateHeaders(nonce);
    
    return Object.entries(headers)
      .map(([name, value]) => `<meta http-equiv="${name}" content="${value}">`)
      .join('\n    ');
  }
};

// Security validation for forms
export const formSecurity = {
  // Validate form submission
  validateSubmission(formData: Record<string, any>, options: {
    checkHoneypot?: boolean;
    checkRateLimit?: boolean;
    identifier?: string;
    honeypotField?: string;
  } = {}): {
    isValid: boolean;
    errors: string[];
    isSpam: boolean;
  } {
    const errors: string[] = [];
    let isSpam = false;

    // Check honeypot
    if (options.checkHoneypot !== false) {
      const honeypotField = options.honeypotField || DEFAULT_SECURITY_CONFIG.honeypot.fieldName;
      if (honeypotUtils.isHoneypotTriggered(formData, honeypotField)) {
        isSpam = true;
        errors.push('Spam detected');
      }
    }

    // Check for XSS attempts
    for (const [key, value] of Object.entries(formData)) {
      if (typeof value === 'string') {
        if (xssProtection.hasSqlInjection(value)) {
          errors.push(`Invalid content detected in ${key}`);
        }
      }
    }

    // Validate required fields format
    if (formData.email && !xssProtection.isValidEmail(formData.email)) {
      errors.push('Invalid email format');
    }

    if (formData.phone && !xssProtection.isValidPhone(formData.phone)) {
      errors.push('Invalid phone format');
    }

    return {
      isValid: errors.length === 0,
      errors,
      isSpam
    };
  },

  // Sanitize form data
  sanitizeFormData(formData: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(formData)) {
      if (typeof value === 'string') {
        sanitized[key] = xssProtection.sanitizeInput(value, {
          maxLength: key === 'message' ? 2000 : 500,
          allowHtml: false,
          stripScripts: true
        });
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }
};

// Global rate limiter instance
export const globalRateLimiter = new RateLimiter();

// Security audit utilities
export const securityAudit = {
  // Check current page security
  auditCurrentPage(): {
    score: number;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];

    if (typeof window === 'undefined') {
      return { score: 0, issues: ['Cannot audit server-side'], recommendations: [] };
    }

    // Check HTTPS
    if (window.location.protocol !== 'https:') {
      issues.push('Page not served over HTTPS');
      recommendations.push('Use HTTPS for all pages');
    }

    // Check CSP
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!cspMeta) {
      issues.push('Content Security Policy not found');
      recommendations.push('Add Content Security Policy');
    }

    // Check for inline scripts without nonce
    const inlineScripts = document.querySelectorAll('script:not([src]):not([nonce])');
    if (inlineScripts.length > 0) {
      issues.push(`${inlineScripts.length} inline script(s) without nonce`);
      recommendations.push('Add nonce to inline scripts or move to external files');
    }

    // Check for forms without CSRF protection
    const forms = document.querySelectorAll('form');
    forms.forEach((form, index) => {
      const hasHoneypot = form.querySelector('input[name="website_url"]');
      if (!hasHoneypot) {
        issues.push(`Form ${index + 1} lacks honeypot protection`);
        recommendations.push('Add honeypot fields to forms');
      }
    });

    // Calculate security score
    const totalChecks = 4;
    const score = Math.max(0, (totalChecks - issues.length) * 25);

    return { score, issues, recommendations };
  },

  // Generate security report
  generateReport(): string {
    const audit = this.auditCurrentPage();
    
    return `
# Security Audit Report

## Score: ${audit.score}/100

## Issues Found (${audit.issues.length}):
${audit.issues.map(issue => `- ${issue}`).join('\n')}

## Recommendations (${audit.recommendations.length}):
${audit.recommendations.map(rec => `- ${rec}`).join('\n')}

Generated: ${new Date().toISOString()}
    `.trim();
  }
};

// Export default security manager
export class SecurityManager {
  private config: SecurityConfig;
  private rateLimiter: RateLimiter;

  constructor(config: Partial<SecurityConfig> = {}) {
    this.config = { ...DEFAULT_SECURITY_CONFIG, ...config };
    this.rateLimiter = new RateLimiter(
      this.config.rateLimit.windowMs,
      this.config.rateLimit.maxRequests
    );
  }

  // Initialize security features
  initialize(): void {
    if (typeof window === 'undefined') return;

    // Add security event listeners
    this.addSecurityEventListeners();
    
    // Initialize rate limiting
    if (this.config.rateLimit.enabled) {
      this.initializeRateLimiting();
    }

    // Log security initialization
    console.log('🔒 Security features initialized');
  }

  private addSecurityEventListeners(): void {
    // Monitor for potential XSS attempts
    document.addEventListener('DOMContentLoaded', () => {
      const inputs = document.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        input.addEventListener('input', (event) => {
          const target = event.target as HTMLInputElement;
          if (xssProtection.hasSqlInjection(target.value)) {
            console.warn('Potential XSS attempt detected');
            // Could add more sophisticated handling here
          }
        });
      });
    });

    // Monitor form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      const formData = new FormData(form);
      const validation = formSecurity.validateSubmission(
        Object.fromEntries(formData),
        { checkHoneypot: this.config.honeypot.enabled }
      );

      if (!validation.isValid || validation.isSpam) {
        event.preventDefault();
        console.warn('Form submission blocked due to security concerns');
      }
    });
  }

  private initializeRateLimiting(): void {
    // Client-side rate limiting for API calls
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const identifier = 'global'; // Could be more sophisticated
      
      if (!this.rateLimiter.isAllowed(identifier)) {
        throw new Error('Rate limit exceeded');
      }

      return originalFetch(...args);
    };
  }

  // Get current security config
  getConfig(): SecurityConfig {
    return { ...this.config };
  }

  // Update security config
  updateConfig(newConfig: Partial<SecurityConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Generate security headers
  getSecurityHeaders(): Record<string, string> {
    const nonce = this.config.csp.nonce || cspUtils.generateNonce();
    return securityHeaders.generateHeaders(nonce);
  }

  // Run security audit
  audit(): ReturnType<typeof securityAudit.auditCurrentPage> {
    return securityAudit.auditCurrentPage();
  }
}

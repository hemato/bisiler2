// Centralized error handling utilities
export interface AppError {
  type: 'form' | 'api' | 'network' | 'validation' | 'system';
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  lang: 'tr' | 'en';
}

export interface ErrorState {
  hasError: boolean;
  errors: AppError[];
  isRetryable: boolean;
  retryCount: number;
}

// Error messages in multiple languages
export const ERROR_MESSAGES = {
  tr: {
    // Network errors
    networkError: 'İnternet bağlantı hatası. Lütfen bağlantınızı kontrol edin.',
    timeoutError: 'İşlem zaman aşımına uğradı. Lütfen tekrar deneyin.',
    serverError: 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.',
    
    // Form errors
    formSubmissionError: 'Form gönderilirken bir hata oluştu.',
    emailDeliveryError: 'E-posta gönderilirken hata oluştu. Lütfen direkt bizimle iletişime geçin.',
    validationError: 'Form bilgilerinde hata var. Lütfen kontrol edin.',
    
    // API errors
    apiError: 'Servis hatası oluştu.',
    unauthorizedError: 'Yetki hatası.',
    forbiddenError: 'Bu işlem için yetkiniz yok.',
    notFoundError: 'Aranılan kaynak bulunamadı.',
    rateLimitError: 'Çok fazla istek gönderdiniz. Lütfen bekleyin.',
    
    // System errors
    systemError: 'Sistem hatası oluştu.',
    unknownError: 'Bilinmeyen bir hata oluştu.',
    
    // User actions
    retryAction: 'Tekrar Dene',
    contactAction: 'İletişime Geç',
    refreshAction: 'Sayfayı Yenile',
    backAction: 'Geri Dön'
  },
  en: {
    // Network errors
    networkError: 'Network connection error. Please check your connection.',
    timeoutError: 'Request timed out. Please try again.',
    serverError: 'Server error. Please try again later.',
    
    // Form errors
    formSubmissionError: 'An error occurred while submitting the form.',
    emailDeliveryError: 'Error sending email. Please contact us directly.',
    validationError: 'Form contains errors. Please check your input.',
    
    // API errors
    apiError: 'Service error occurred.',
    unauthorizedError: 'Authorization error.',
    forbiddenError: 'You do not have permission for this action.',
    notFoundError: 'Requested resource not found.',
    rateLimitError: 'Too many requests. Please wait.',
    
    // System errors
    systemError: 'System error occurred.',
    unknownError: 'An unknown error occurred.',
    
    // User actions
    retryAction: 'Try Again',
    contactAction: 'Contact Us',
    refreshAction: 'Refresh Page',
    backAction: 'Go Back'
  }
} as const;

// Error codes and their properties
export const ERROR_CONFIGS = {
  // Network errors
  NETWORK_ERROR: { type: 'network' as const, retryable: true, severity: 'high' },
  TIMEOUT_ERROR: { type: 'network' as const, retryable: true, severity: 'medium' },
  SERVER_ERROR: { type: 'api' as const, retryable: true, severity: 'high' },
  
  // Form errors
  FORM_SUBMISSION_ERROR: { type: 'form' as const, retryable: true, severity: 'medium' },
  EMAIL_DELIVERY_ERROR: { type: 'form' as const, retryable: true, severity: 'high' },
  VALIDATION_ERROR: { type: 'validation' as const, retryable: false, severity: 'low' },
  
  // API errors
  API_ERROR: { type: 'api' as const, retryable: true, severity: 'medium' },
  UNAUTHORIZED_ERROR: { type: 'api' as const, retryable: false, severity: 'high' },
  FORBIDDEN_ERROR: { type: 'api' as const, retryable: false, severity: 'high' },
  NOT_FOUND_ERROR: { type: 'api' as const, retryable: false, severity: 'medium' },
  RATE_LIMIT_ERROR: { type: 'api' as const, retryable: true, severity: 'medium' },
  
  // System errors
  SYSTEM_ERROR: { type: 'system' as const, retryable: false, severity: 'high' },
  UNKNOWN_ERROR: { type: 'system' as const, retryable: true, severity: 'medium' }
} as const;

type ErrorCode = keyof typeof ERROR_CONFIGS;

// Error factory functions
export function createError(
  code: ErrorCode,
  lang: 'tr' | 'en' = 'tr',
  details?: any
): AppError {
  const config = ERROR_CONFIGS[code];
  const messages = ERROR_MESSAGES[lang];
  
  // Map error codes to messages
  const messageMap: Record<ErrorCode, string> = {
    NETWORK_ERROR: messages.networkError,
    TIMEOUT_ERROR: messages.timeoutError,
    SERVER_ERROR: messages.serverError,
    FORM_SUBMISSION_ERROR: messages.formSubmissionError,
    EMAIL_DELIVERY_ERROR: messages.emailDeliveryError,
    VALIDATION_ERROR: messages.validationError,
    API_ERROR: messages.apiError,
    UNAUTHORIZED_ERROR: messages.unauthorizedError,
    FORBIDDEN_ERROR: messages.forbiddenError,
    NOT_FOUND_ERROR: messages.notFoundError,
    RATE_LIMIT_ERROR: messages.rateLimitError,
    SYSTEM_ERROR: messages.systemError,
    UNKNOWN_ERROR: messages.unknownError
  };
  
  return {
    type: config.type,
    code,
    message: messageMap[code],
    details,
    timestamp: new Date().toISOString(),
    lang
  };
}

// Error classification from HTTP status codes
export function classifyHttpError(status: number, lang: 'tr' | 'en' = 'tr'): AppError {
  switch (true) {
    case status === 401:
      return createError('UNAUTHORIZED_ERROR', lang, { status });
    case status === 403:
      return createError('FORBIDDEN_ERROR', lang, { status });
    case status === 404:
      return createError('NOT_FOUND_ERROR', lang, { status });
    case status === 429:
      return createError('RATE_LIMIT_ERROR', lang, { status });
    case status >= 500:
      return createError('SERVER_ERROR', lang, { status });
    case status >= 400:
      return createError('API_ERROR', lang, { status });
    default:
      return createError('UNKNOWN_ERROR', lang, { status });
  }
}

// Network error classification
export function classifyNetworkError(error: any, lang: 'tr' | 'en' = 'tr'): AppError {
  const message = error.message?.toLowerCase() || '';
  
  if (message.includes('timeout') || message.includes('timed out')) {
    return createError('TIMEOUT_ERROR', lang, error);
  }
  
  if (message.includes('network') || message.includes('fetch') || 
      message.includes('connection') || message.includes('offline')) {
    return createError('NETWORK_ERROR', lang, error);
  }
  
  return createError('SYSTEM_ERROR', lang, error);
}

// Error logging utility
export function logError(error: AppError): void {
  const logData = {
    timestamp: error.timestamp,
    type: error.type,
    code: error.code,
    message: error.message,
    details: error.details,
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
    url: typeof window !== 'undefined' ? window.location.href : 'unknown'
  };
  
  // Console logging for development
  console.error('Application Error:', logData);
  
  // In production, you might want to send to logging service
  // sendToLoggingService(logData);
}

// Error retry logic
export function shouldRetry(error: AppError, retryCount: number, maxRetries: number = 3): boolean {
  if (retryCount >= maxRetries) return false;
  
  const config = ERROR_CONFIGS[error.code as ErrorCode];
  return config?.retryable || false;
}

// Exponential backoff for retry delays
export function getRetryDelay(retryCount: number): number {
  return Math.min(1000 * Math.pow(2, retryCount), 10000); // Max 10 seconds
}

// Error state management
export class ErrorManager {
  private errors: AppError[] = [];
  private retryCount = 0;
  private maxRetries = 3;
  
  addError(error: AppError): void {
    this.errors.push(error);
    logError(error);
  }
  
  clearErrors(): void {
    this.errors = [];
    this.retryCount = 0;
  }
  
  hasErrors(): boolean {
    return this.errors.length > 0;
  }
  
  getErrors(): AppError[] {
    return [...this.errors];
  }
  
  getLatestError(): AppError | null {
    return this.errors[this.errors.length - 1] || null;
  }
  
  canRetry(): boolean {
    const latestError = this.getLatestError();
    if (!latestError) return false;
    
    return shouldRetry(latestError, this.retryCount, this.maxRetries);
  }
  
  incrementRetry(): void {
    this.retryCount++;
  }
  
  getRetryDelay(): number {
    return getRetryDelay(this.retryCount);
  }
}

// Form-specific error handling
export interface FormErrorState {
  hasError: boolean;
  isSubmitting: boolean;
  submitError: AppError | null;
  validationErrors: any[];
}

export function createFormErrorState(): FormErrorState {
  return {
    hasError: false,
    isSubmitting: false,
    submitError: null,
    validationErrors: []
  };
}

// React hook-style error handler (for use in React components)
export function useErrorHandler(lang: 'tr' | 'en' = 'tr') {
  const errorManager = new ErrorManager();
  
  const handleError = (error: any, context?: string) => {
    let appError: AppError;
    
    // Classify the error
    if (error.status) {
      appError = classifyHttpError(error.status, lang);
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      appError = classifyNetworkError(error, lang);
    } else if (error.code && ERROR_CONFIGS[error.code as ErrorCode]) {
      appError = createError(error.code as ErrorCode, lang, { context });
    } else {
      appError = createError('UNKNOWN_ERROR', lang, { originalError: error, context });
    }
    
    errorManager.addError(appError);
    return appError;
  };
  
  const clearErrors = () => {
    errorManager.clearErrors();
  };
  
  const retry = () => {
    if (errorManager.canRetry()) {
      errorManager.incrementRetry();
      return errorManager.getRetryDelay();
    }
    return null;
  };
  
  return {
    handleError,
    clearErrors,
    retry,
    hasErrors: () => errorManager.hasErrors(),
    getErrors: () => errorManager.getErrors(),
    getLatestError: () => errorManager.getLatestError(),
    canRetry: () => errorManager.canRetry()
  };
}

// Global error boundary for catching unhandled errors
export function setupGlobalErrorHandler(lang: 'tr' | 'en' = 'tr'): void {
  if (typeof window === 'undefined') return;
  
  // Handle JavaScript errors
  window.addEventListener('error', (event) => {
    const error = createError('SYSTEM_ERROR', lang, {
      message: event.message,
      filename: event.filename,
      line: event.lineno,
      column: event.colno
    });
    logError(error);
  });
  
  // Handle Promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = createError('SYSTEM_ERROR', lang, {
      reason: event.reason
    });
    logError(error);
  });
}

// Utility functions for common error scenarios
export const errorUtils = {
  isNetworkError: (error: AppError) => error.type === 'network',
  isFormError: (error: AppError) => error.type === 'form',
  isValidationError: (error: AppError) => error.type === 'validation',
  isApiError: (error: AppError) => error.type === 'api',
  isRetryable: (error: AppError) => ERROR_CONFIGS[error.code as ErrorCode]?.retryable || false,
  getSeverity: (error: AppError) => ERROR_CONFIGS[error.code as ErrorCode]?.severity || 'low'
};

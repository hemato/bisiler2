// Centralized form validation utilities
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
}

export interface ValidationError {
  field: string;
  message: string;
  type: 'required' | 'format' | 'length' | 'custom';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Validation patterns
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: {
    tr: /^(\+90|0)?[5][0-9]{9}$/,
    international: /^\+?[1-9]\d{1,14}$/
  },
  name: /^[a-zA-ZçÇğĞıİöÖşŞüÜ\s]{2,50}$/,
  company: /^[a-zA-Z0-9çÇğĞıİöÖşŞüÜ\s&.-]{2,100}$/,
  url: /^https?:\/\/.+\..+/,
  noSpecialChars: /^[a-zA-Z0-9çÇğĞıİöÖşŞüÜ\s]*$/
} as const;

// Error messages in multiple languages
export const VALIDATION_MESSAGES = {
  tr: {
    required: 'Bu alan zorunludur',
    email: 'Geçerli bir e-posta adresi girin',
    phone: 'Geçerli bir telefon numarası girin',
    name: 'Geçerli bir isim girin (2-50 karakter)',
    company: 'Geçerli bir şirket adı girin',
    minLength: (min: number) => `En az ${min} karakter olmalıdır`,
    maxLength: (max: number) => `En fazla ${max} karakter olmalıdır`,
    url: 'Geçerli bir URL girin',
    custom: 'Geçersiz değer'
  },
  en: {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    phone: 'Please enter a valid phone number',
    name: 'Please enter a valid name (2-50 characters)',
    company: 'Please enter a valid company name',
    minLength: (min: number) => `Must be at least ${min} characters`,
    maxLength: (max: number) => `Must be no more than ${max} characters`,
    url: 'Please enter a valid URL',
    custom: 'Invalid value'
  }
} as const;

// Field validation schema
export interface FormSchema {
  [fieldName: string]: ValidationRule;
}

// Common form schemas
export const FORM_SCHEMAS = {
  contact: {
    name: {
      required: true,
      pattern: VALIDATION_PATTERNS.name
    },
    email: {
      required: false,
      pattern: VALIDATION_PATTERNS.email
    },
    phone: {
      required: true,
      custom: (value: string) => {
        if (!value || value.trim() === '') return false; // Required field
        
        // Sadece rakam, +, boşluk, tire, parantez kabul et
        const allowedChars = /^[0-9+\s\-()]*$/;
        if (!allowedChars.test(value)) return false;
        
        // Rakamları çıkar ve uzunluk kontrol et
        const digitsOnly = value.replace(/\D/g, '');
        const length = digitsOnly.length;
        
        // 7-15 rakam arası kabul et (sabit hat + mobil)
        return length >= 7 && length <= 15;
      }
    },
    company: {
      required: false,
      pattern: VALIDATION_PATTERNS.company
    },
    services: {
      required: true,
      custom: (value: string[]) => Array.isArray(value) && value.length > 0
    },
    message: {
      required: false,
      minLength: 10,
      maxLength: 1000
    }
  },
  
  crmConsulting: {
    name: {
      required: true,
      pattern: VALIDATION_PATTERNS.name
    },
    email: {
      required: false,
      pattern: VALIDATION_PATTERNS.email
    },
    phone: {
      required: true,
      custom: (value: string) => {
        if (!value || value.trim() === '') return false;
        
        // Sadece rakam, +, boşluk, tire, parantez kabul et
        const allowedChars = /^[0-9+\s\-()]*$/;
        if (!allowedChars.test(value)) return false;
        
        // Rakamları çıkar ve uzunluk kontrol et
        const digitsOnly = value.replace(/\D/g, '');
        const length = digitsOnly.length;
        
        // 7-15 rakam arası kabul et (sabit hat + mobil)
        return length >= 7 && length <= 15;
      }
    },
    company: {
      required: false,
      pattern: VALIDATION_PATTERNS.company
    },
    employeeCount: {
      required: false
    },
    currentSystem: {
      required: false
    },
    mainChallenge: {
      required: false
    },
    preferredCrm: {
      required: false
    },
    budgetRange: {
      required: false
    },
    timeline: {
      required: false
    },
    message: {
      required: false,
      maxLength: 500
    }
  },
  
  websiteSetup: {
    name: {
      required: true,
      pattern: VALIDATION_PATTERNS.name
    },
    email: {
      required: false,
      pattern: VALIDATION_PATTERNS.email
    },
    phone: {
      required: true,
      custom: (value: string) => {
        if (!value || value.trim() === '') return false;
        
        // Sadece rakam, +, boşluk, tire, parantez kabul et
        const allowedChars = /^[0-9+\s\-()]*$/;
        if (!allowedChars.test(value)) return false;
        
        // Rakamları çıkar ve uzunluk kontrol et
        const digitsOnly = value.replace(/\D/g, '');
        const length = digitsOnly.length;
        
        // 7-15 rakam arası kabul et (sabit hat + mobil)
        return length >= 7 && length <= 15;
      }
    },
    company: {
      required: false,
      pattern: VALIDATION_PATTERNS.company
    },
    websiteType: {
      required: false
    },
    currentWebsite: {
      required: false
    },
    timeline: {
      required: false
    },
    budget: {
      required: false
    },
    message: {
      required: false,
      maxLength: 500
    }
  }
} as const;

// Single field validation
export function validateField(
  fieldName: string, 
  value: any, 
  rule: ValidationRule, 
  lang: 'tr' | 'en' = 'tr'
): ValidationError | null {
  const messages = VALIDATION_MESSAGES[lang];
  
  // Required check - handle arrays specially
  if (rule.required) {
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return {
          field: fieldName,
          message: messages.required,
          type: 'required'
        };
      }
    } else if (!value || (typeof value === 'string' && value.trim() === '')) {
      return {
        field: fieldName,
        message: messages.required,
        type: 'required'
      };
    }
  }
  
  // Skip other validations if field is empty and not required
  if (Array.isArray(value)) {
    if (value.length === 0 && !rule.required) return null;
  } else if (!value || (typeof value === 'string' && value.trim() === '')) {
    return null;
  }
  
  // Length validations
  if (typeof value === 'string') {
    if (rule.minLength && value.length < rule.minLength) {
      return {
        field: fieldName,
        message: messages.minLength(rule.minLength),
        type: 'length'
      };
    }
    
    if (rule.maxLength && value.length > rule.maxLength) {
      return {
        field: fieldName,
        message: messages.maxLength(rule.maxLength),
        type: 'length'
      };
    }
  }
  
  // Pattern validation
  if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
    // Specific error messages for common patterns
    if (rule.pattern === VALIDATION_PATTERNS.email) {
      return {
        field: fieldName,
        message: messages.email,
        type: 'format'
      };
    }
    if (rule.pattern === VALIDATION_PATTERNS.phone.tr) {
      return {
        field: fieldName,
        message: messages.phone,
        type: 'format'
      };
    }
    if (rule.pattern === VALIDATION_PATTERNS.name) {
      return {
        field: fieldName,
        message: messages.name,
        type: 'format'
      };
    }
    if (rule.pattern === VALIDATION_PATTERNS.company) {
      return {
        field: fieldName,
        message: messages.company,
        type: 'format'
      };
    }
    
    return {
      field: fieldName,
      message: messages.custom,
      type: 'format'
    };
  }
  
  // Custom validation
  if (rule.custom && !rule.custom(value)) {
    return {
      field: fieldName,
      message: messages.custom,
      type: 'custom'
    };
  }
  
  return null;
}

// Form validation
export function validateForm(
  formData: Record<string, any>,
  schema: FormSchema,
  lang: 'tr' | 'en' = 'tr'
): ValidationResult {
  const errors: ValidationError[] = [];
  
  // Validate each field according to schema
  for (const [fieldName, rule] of Object.entries(schema)) {
    const value = formData[fieldName];
    const error = validateField(fieldName, value, rule, lang);
    
    if (error) {
      errors.push(error);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Specific form validators using schemas
export const validateContactForm = (formData: Record<string, any>, lang: 'tr' | 'en' = 'tr') => 
  validateForm(formData, FORM_SCHEMAS.contact, lang);

export const validateCRMConsultingForm = (formData: Record<string, any>, lang: 'tr' | 'en' = 'tr') => 
  validateForm(formData, FORM_SCHEMAS.crmConsulting, lang);

export const validateWebsiteSetupForm = (formData: Record<string, any>, lang: 'tr' | 'en' = 'tr') => 
  validateForm(formData, FORM_SCHEMAS.websiteSetup, lang);

// Utility functions
export const getFieldError = (errors: ValidationError[], fieldName: string): ValidationError | undefined => 
  errors.find(error => error.field === fieldName);

export const hasFieldError = (errors: ValidationError[], fieldName: string): boolean => 
  errors.some(error => error.field === fieldName);

export const getFieldErrorMessage = (errors: ValidationError[], fieldName: string): string | undefined => 
  getFieldError(errors, fieldName)?.message;

// Real-time validation helper
export const createFieldValidator = (schema: FormSchema, lang: 'tr' | 'en' = 'tr') => 
  (fieldName: string, value: any) => {
    const rule = schema[fieldName];
    if (!rule) return null;
    return validateField(fieldName, value, rule, lang);
  };

// Phone formatting utilities
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Handle Turkish phone numbers
  if (digits.startsWith('90')) {
    const number = digits.substring(2);
    if (number.length === 10) {
      return `+90 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6, 8)} ${number.substring(8)}`;
    }
  }
  
  if (digits.startsWith('0') && digits.length === 11) {
    const number = digits.substring(1);
    return `0${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6, 8)} ${number.substring(8)}`;
  }
  
  if (digits.length === 10) {
    return `${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6, 8)} ${digits.substring(8)}`;
  }
  
  return phone; // Return original if can't format
};

// Real-time field validation state
export interface FieldValidationState {
  value: string;
  isValid: boolean | null; // null = untouched, true = valid, false = invalid
  error: string | null;
  touched: boolean;
}

// Real-time validation result
export interface RealTimeValidationResult {
  isValid: boolean | null;
  error: string | null;
}

// Real-time single field validator
export function validateFieldRealTime(
  fieldName: string,
  value: any,
  rule: ValidationRule,
  lang: 'tr' | 'en' = 'tr'
): RealTimeValidationResult {
  // If field is empty and not required, show neutral state
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    if (rule.required) {
      return {
        isValid: false,
        error: VALIDATION_MESSAGES[lang].required
      };
    }
    return {
      isValid: null,
      error: null
    };
  }
  
  const error = validateField(fieldName, value, rule, lang);
  
  return {
    isValid: error === null,
    error: error?.message || null
  };
}

// Form field state management helper
export function createFormStateManager<T extends Record<string, any>>(
  initialData: T,
  schema: FormSchema,
  lang: 'tr' | 'en' = 'tr'
) {
  const initialState: Record<string, FieldValidationState> = {};
  
  // Initialize field states
  for (const fieldName of Object.keys(initialData)) {
    initialState[fieldName] = {
      value: initialData[fieldName] || '',
      isValid: null,
      error: null,
      touched: false
    };
  }
  
  const validateField = (fieldName: string, value: any): FieldValidationState => {
    const rule = schema[fieldName];
    if (!rule) {
      return {
        value,
        isValid: null,
        error: null,
        touched: true
      };
    }
    
    const validation = validateFieldRealTime(fieldName, value, rule, lang);
    
    return {
      value,
      isValid: validation.isValid,
      error: validation.error,
      touched: true
    };
  };
  
  const isFormValid = (fieldStates: Record<string, FieldValidationState>): boolean => {
    return Object.values(fieldStates).every(state => 
      state.isValid === true || (state.isValid === null && !schema[Object.keys(fieldStates).find(key => fieldStates[key] === state) || '']?.required)
    );
  };
  
  return {
    initialState,
    validateField,
    isFormValid
  };
}

// CSS class helpers for visual feedback
export const getFieldValidationClasses = (fieldState: FieldValidationState, baseClasses: string = '') => {
  const base = baseClasses || 'w-full px-4 py-3 border rounded-lg transition-all duration-200';
  
  if (!fieldState.touched || fieldState.isValid === null) {
    return `${base} border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500`;
  }
  
  if (fieldState.isValid) {
    return `${base} border-green-500 bg-green-50 focus:border-green-600 focus:ring-2 focus:ring-green-500`;
  }
  
  return `${base} border-red-500 bg-red-50 focus:border-red-600 focus:ring-2 focus:ring-red-500`;
};

// Email validation with better UX
export const validateEmail = (email: string): RealTimeValidationResult => {
  if (!email || email.trim() === '') {
    return { isValid: null, error: null };
  }
  
  const isValid = VALIDATION_PATTERNS.email.test(email.trim());
  return {
    isValid,
    error: isValid ? null : 'Geçerli bir e-posta adresi girin'
  };
};

// Phone validation with better UX
export const validatePhone = (phone: string): RealTimeValidationResult => {
  if (!phone || phone.trim() === '') {
    return { isValid: null, error: null };
  }
  
  // Remove formatting for validation
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Check various Turkish phone formats
  const isValid = 
    VALIDATION_PATTERNS.phone.tr.test(phone) ||
    /^[5][0-9]{9}$/.test(digitsOnly) ||
    /^0[5][0-9]{9}$/.test(digitsOnly) ||
    /^\+90[5][0-9]{9}$/.test(phone);
  
  return {
    isValid,
    error: isValid ? null : 'Geçerli bir telefon numarası girin'
  };
};

// Sanitization utilities
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

export const sanitizeFormData = (formData: Record<string, any>): Record<string, any> => {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

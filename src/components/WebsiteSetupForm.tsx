import { useState, useEffect } from 'react';
import { Send, CheckCircle, User, Mail, Phone, Building, Globe, Code, Calendar, MessageSquare, DollarSign } from 'lucide-react';
import { sendEmails, detectLanguage, detectPageSource } from '../utils/email';
import { CONTACT_ACTIONS, PRIVACY_LINKS } from '../config/contact';
import { 
  validateWebsiteSetupForm, 
  getFieldError, 
  hasFieldError, 
  sanitizeFormData, 
  type ValidationError,
  type FieldValidationState,
  getFieldValidationClasses,
  validateFieldRealTime,
  formatPhoneNumber,
  FORM_SCHEMAS
} from '../utils/validation';
import { useErrorHandler, createFormErrorState } from '../utils/error-handler';
import { Alert, Spinner, ValidatedField } from './ui';
import { formSecurity, honeypotUtils, globalRateLimiter, xssProtection } from '../utils/security';
import { trackEvent, trackFormSubmit, getUTMParameters } from '../config/analytics';

// Automatic language detection
const detectCurrentLanguage = (): 'tr' | 'en' => {
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname;
    return pathname.startsWith('/en') ? 'en' : 'tr';
  }
  return 'tr';
};

// Enhanced interface for proper i18n support
interface WebsiteSetupFormProps {
  // Legacy support
  translations?: {
    websiteSetup: {
      form: {
        title: string;
        fields: {
          name: string;
          email: string;
          phone: string;
          company: string;
          websiteType: string;
          currentWebsite: string;
          timeline: string;
          budget: string;
          message: string;
        };
        options: {
          websiteType: string[];
          currentWebsite: string[];
          timeline: string[];
          budget: string[];
        };
        submit: string;
      };
    };
  };
  lang?: string;
  // New i18n structure
  i18n?: {
    forms: {
      websiteSetup: any;
      common: any;
      validation: any;
      security: any;
      analytics: any;
    };
  };
}

// Default translations for fallback
const getDefaultTranslations = (lang: 'tr' | 'en') => {
  const translations = {
    tr: {
      title: "Ücretsiz Web Sitesi Teklifi Alın",
      description: "Web sitesi ihtiyaçlarınızı değerlendirelim",
      labels: {
        name: "Ad Soyad",
        email: "E-posta Adresi",
        phone: "Telefon Numarası",
        company: "Şirket Adı",
        websiteType: "Web Sitesi Türü",
        currentWebsite: "Mevcut Web Sitesi",
        timeline: "Proje Zamanlaması",
        budget: "Bütçe Aralığı",
        message: "Ek Bilgiler"
      },
      placeholders: {
        name: "Adınızı ve soyadınızı girin",
        email: "E-posta adresinizi girin",
        phone: "Telefon numaranızı girin",
        company: "Şirket adınızı girin",
        message: "Web sitesi hedefleriniz, tercih ettiğiniz tasarım tarzı, ihtiyaç duyduğunuz özellikler hakkında bize bilgi verin..."
      },
      options: {
        websiteType: [
          "Kurumsal Web Sitesi",
          "E-ticaret Sitesi",
          "Blog / Haber Sitesi",
          "Portfolyo Sitesi",
          "Landing Page",
          "Özel Proje"
        ],
        currentWebsite: [
          "Hiç web sitem yok",
          "Eski bir sitem var",
          "WordPress sitesi var",
          "Sosyal medya hesapları var",
          "E-ticaret sitesi var"
        ],
        timeline: [
          "Hemen",
          "1 ay içinde",
          "2-3 ay içinde",
          "6 ay içinde"
        ],
        budget: [
          "5.000-15.000 TL",
          "15.000-30.000 TL",
          "30.000-50.000 TL",
          "50.000+ TL"
        ]
      },
      submit: "Ücretsiz Teklif Al",
      selectOption: "Seçin...",
      success: {
        title: "Teşekkürler!",
        message: "Web sitesi kurulum talebiniz başarıyla gönderildi. Tasarım ekibimiz 24 saat içinde özel teklif ile size dönüş yapacak.",
        button: "Başka Talep Gönder"
      },
      validation: {
        fillRequired: "Lütfen tüm gerekli alanları doğru şekilde doldurun",
        acceptPrivacy: "Devam etmek için lütfen Gizlilik Politikasını kabul edin"
      },
      privacy: {
        text: "nı okudum, kabul ediyorum ve kişisel verilerimin işlenmesine onay veriyorum.",
        link: "Gizlilik Politikası",
        required: "Gizlilik Politikası kabulü"
      },
      hints: {
        title: "Lütfen aşağıdaki zorunlu alanları tamamlayın:",
        name: "Ad Soyad",
        phone: "Telefon Numarası",
        privacy: "Gizlilik Politikası kabulü"
      }
    },
    en: {
      title: "Get Free Website Quote",
      description: "Let's evaluate your website needs",
      labels: {
        name: "Full Name",
        email: "Email Address",
        phone: "Phone Number",
        company: "Company Name",
        websiteType: "Website Type",
        currentWebsite: "Current Website",
        timeline: "Project Timeline",
        budget: "Budget Range",
        message: "Additional Information"
      },
      placeholders: {
        name: "Enter your full name",
        email: "Enter your email address",
        phone: "Enter your phone number",
        company: "Enter your company name",
        message: "Tell us about your website goals, preferred design style, features needed..."
      },
      options: {
        websiteType: [
          "Corporate Website",
          "E-commerce Site",
          "Blog / News Site",
          "Portfolio Site",
          "Landing Page",
          "Custom Project"
        ],
        currentWebsite: [
          "No website",
          "Old website exists",
          "WordPress site exists",
          "Social media accounts exist",
          "E-commerce site exists"
        ],
        timeline: [
          "Immediately",
          "Within 1 month",
          "Within 2-3 months",
          "Within 6 months"
        ],
        budget: [
          "$2,000-6,000",
          "$6,000-12,000",
          "$12,000-20,000",
          "$20,000+"
        ]
      },
      submit: "Get Free Quote",
      selectOption: "Select...",
      success: {
        title: "Thank You!",
        message: "Your website setup request has been sent successfully. Our design team will contact you within 24 hours with a custom proposal.",
        button: "Send Another Request"
      },
      validation: {
        fillRequired: "Please fill in all required fields correctly",
        acceptPrivacy: "Please accept the Privacy Policy to continue"
      },
      privacy: {
        text: " and consent to the processing of my personal data.",
        link: "Privacy Policy",
        required: "Privacy Policy acceptance"
      },
      hints: {
        title: "Please complete the following required fields:",
        name: "Full Name",
        phone: "Phone Number",
        privacy: "Privacy Policy acceptance"
      }
    }
  };
  
  return translations[lang];
};

export default function WebsiteSetupForm({ translations, lang, i18n }: WebsiteSetupFormProps) {
  // Detect current language
  const currentLang = detectCurrentLanguage();
  const formLang = (lang as 'tr' | 'en') || currentLang;
  
  // Get translations from various sources with fallbacks
  const getTranslations = () => {
    // Priority: i18n > legacy translations > defaults
    if (i18n?.forms?.websiteSetup) {
      return i18n.forms.websiteSetup;
    }
    
    if (translations) {
      // Convert legacy format to new format
      return {
        title: translations.websiteSetup.form.title,
        labels: translations.websiteSetup.form.fields,
        options: translations.websiteSetup.form.options,
        submit: translations.websiteSetup.form.submit,
        selectOption: formLang === 'en' ? 'Select...' : 'Seçin...',
        success: {
          title: formLang === 'en' ? 'Thank You!' : 'Teşekkürler!',
          message: formLang === 'en'
            ? 'Your website setup request has been sent successfully. Our design team will contact you within 24 hours with a custom proposal.'
            : 'Web sitesi kurulum talebiniz başarıyla gönderildi. Tasarım ekibimiz 24 saat içinde özel teklif ile size dönüş yapacak.',
          button: formLang === 'en' ? 'Send Another Request' : 'Başka Talep Gönder'
        }
      };
    }
    
    return getDefaultTranslations(formLang);
  };

  const t = getTranslations();

  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    websiteType: '',
    currentWebsite: '',
    timeline: '',
    budget: '',
    message: '',
    privacyAccepted: false
  });

  // Field validation states for real-time feedback
  const [fieldStates, setFieldStates] = useState<Record<string, FieldValidationState>>({
    name: { value: '', isValid: null, error: null, touched: false },
    email: { value: '', isValid: null, error: null, touched: false },
    phone: { value: '', isValid: null, error: null, touched: false },
    company: { value: '', isValid: null, error: null, touched: false },
    websiteType: { value: '', isValid: null, error: null, touched: false },
    message: { value: '', isValid: null, error: null, touched: false }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string>('');

  const errorHandler = useErrorHandler(formLang);
  const schema = FORM_SCHEMAS.websiteSetup;

  // Analytics tracking
  useEffect(() => {
    // Track form start
    trackEvent('form_start', {
      form_type: 'website_setup',
      page_language: formLang,
      utm_parameters: getUTMParameters()
    });
  }, [formLang]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Clear previous errors
      setFormError('');
      
      // Security checks first
      const identifier = 'website_form_submission';
      if (!globalRateLimiter.isAllowed(identifier)) {
        setFormError(formLang === 'en' 
          ? 'Too many requests. Please wait before trying again.' 
          : 'Çok fazla istek gönderdiniz. Lütfen bekleyin.'
        );
        return;
      }

      // Honeypot and security validation
      const securityValidation = formSecurity.validateSubmission(formData, {
        checkHoneypot: true,
        honeypotField: 'website_url'
      });

      if (!securityValidation.isValid || securityValidation.isSpam) {
        console.warn('Security validation failed', securityValidation);
        if (securityValidation.isSpam) {
          await honeypotUtils.simulateProcessingDelay();
          return;
        }
        setSubmitError(formLang === 'en' ? 'Security validation failed' : 'Güvenlik doğrulaması başarısız');
        return;
      }

      // Sanitize form data
      const sanitizedData = formSecurity.sanitizeFormData(formData);
      
      // Priority-based validation for better UX
      const validation = validateWebsiteSetupForm(sanitizedData, formLang);
      
      // Priority 1: Field validation (name, email, phone, company, websiteType)
      if (!validation.isValid) {
        console.log('❌ Form validation failed:', validation.errors);
        
        // Update field states with validation errors
        validation.errors.forEach(error => {
          setFieldStates(prev => ({
            ...prev,
            [error.field]: {
              ...prev[error.field],
              isValid: false,
              error: error.message,
              touched: true
            }
          }));
        });
        
        setFormError(t.validation?.fillRequired || (formLang === 'en' 
          ? 'Please fill in all required fields correctly.' 
          : 'Lütfen tüm gerekli alanları doğru şekilde doldurun.')
        );
        
        // Auto-scroll to validation hints
        setTimeout(() => {
          const hintsElement = document.querySelector('[data-validation-hints]');
          if (hintsElement) {
            hintsElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }
        }, 100);
        
        return;
      }

      // Priority 2: Privacy validation
      if (!formData.privacyAccepted) {
        setFormError(t.validation?.acceptPrivacy || (formLang === 'en'
          ? 'Please accept the Privacy Policy to continue.'
          : 'Devam etmek için lütfen Gizlilik Politikasını kabul edin.')
        );
        
        setTimeout(() => {
          const hintsElement = document.querySelector('[data-validation-hints]');
          if (hintsElement) {
            hintsElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }
        }, 100);
        
        return;
      }
      
      console.log('✅ Form validation passed');

      // Prepare form data for submission
      const submitData = {
        ...sanitizedData,
        formType: 'website-setup' as const,
        pageSource: detectPageSource(),
        timestamp: new Date().toISOString(),
        language: formLang,
        utm_parameters: getUTMParameters()
      };

      console.log('Website Setup Form submitted:', submitData);
      
      // Track form submission
      trackFormSubmit('website_setup', submitData);
      
      // Send emails
      const emailResult = await sendEmails(submitData as any);
      
      if (emailResult.success) {
        setIsSubmitted(true);
        
        // Track successful completion
        trackEvent('form_complete', {
          form_type: 'website_setup',
          page_language: formLang,
          success: true
        });
        
        // Auto-scroll to success message
        setTimeout(() => {
          const successElement = document.querySelector('[data-success-message]');
          if (successElement) {
            successElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }
        }, 100);
        
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          websiteType: '',
          currentWebsite: '',
          timeline: '',
          budget: '',
          message: '',
          privacyAccepted: false
        });
      } else {
        // Track failed submission
        trackEvent('form_error', {
          form_type: 'website_setup',
          error_type: 'email_delivery',
          page_language: formLang
        });
        
        const errorMessage = formLang === 'en' 
          ? 'An error occurred while sending emails. Please try again.' 
          : 'Email gönderilirken bir hata oluştu. Lütfen tekrar deneyin.';
        setSubmitError(errorMessage);
        console.error('Email sending failed', emailResult);
      }
      
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Track error
      trackEvent('form_error', {
        form_type: 'website_setup',
        error_type: 'submission',
        error_details: error instanceof Error ? error.message : 'Unknown error',
        page_language: formLang
      });
      
      const handledError = errorHandler.handleError(error, 'website_setup_form_submission');
      setFormError(handledError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Real-time field validation handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time validation for this field
    const rule = schema[name as keyof typeof schema];
    if (rule) {
      const validation = validateFieldRealTime(name, value, rule, formLang);
      
      setFieldStates(prev => ({
        ...prev,
        [name]: {
          value,
          isValid: validation.isValid,
          error: validation.error,
          touched: true
        }
      }));
    }

    // Special handling for phone formatting
    if (name === 'phone' && value) {
      const formatted = formatPhoneNumber(value);
      if (formatted !== value) {
        setFormData(prev => ({ ...prev, phone: formatted }));
      }
    }
  };

  // onBlur validation handler
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    const rule = schema[name as keyof typeof schema];
    if (rule) {
      const validation = validateFieldRealTime(name, value, rule, formLang);
      
      setFieldStates(prev => ({
        ...prev,
        [name]: {
          ...prev[name],
          isValid: validation.isValid,
          error: validation.error,
          touched: true
        }
      }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center" data-success-message>
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-secondary-900 mb-4">
          {t.success?.title}
        </h3>
        <p className="text-secondary-600 mb-8">
          {t.success?.message}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setIsSubmitted(false)}
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            {t.success?.button}
          </button>
          <a
            href={CONTACT_ACTIONS.whatsapp.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-secondary-900 mb-4">
          {t.title}
        </h2>
        <p className="text-secondary-600">
          {t.description || (formLang === 'en' 
            ? 'Fill out the form below and our design experts will prepare a customized website proposal for your business.'
            : 'Aşağıdaki formu doldurun, tasarım uzmanlarımız işletmeniz için özelleştirilmiş web sitesi önerisi hazırlasın.'
          )}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Inline Error Message */}
        {formError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4" data-error-message>
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800 font-medium">{formError}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ValidatedField
            fieldState={fieldStates.name}
            label={t.labels?.name}
            required={true}
          >
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldValidationClasses(fieldStates.name, "w-full px-4 py-3 pr-12 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200")}
              placeholder={t.placeholders?.name}
              aria-describedby={fieldStates.name.error ? "name-error" : undefined}
              aria-invalid={fieldStates.name.isValid === false}
            />
          </ValidatedField>
          
          <ValidatedField
            fieldState={fieldStates.email}
            label={t.labels?.email}
            required={false}
          >
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldValidationClasses(fieldStates.email, "w-full px-4 py-3 pr-12 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200")}
              placeholder={t.placeholders?.email}
              aria-describedby={fieldStates.email.error ? "email-error" : undefined}
              aria-invalid={fieldStates.email.isValid === false}
            />
          </ValidatedField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ValidatedField
            fieldState={fieldStates.phone}
            label={t.labels?.phone}
            required={true}
          >
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldValidationClasses(fieldStates.phone, "w-full px-4 py-3 pr-12 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200")}
              placeholder={t.placeholders?.phone}
              aria-describedby={fieldStates.phone.error ? "phone-error" : undefined}
              aria-invalid={fieldStates.phone.isValid === false}
            />
          </ValidatedField>
          
          <ValidatedField
            fieldState={fieldStates.company}
            label={t.labels?.company}
            required={false}
          >
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldValidationClasses(fieldStates.company, "w-full px-4 py-3 pr-12 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200")}
              placeholder={t.placeholders?.company}
              aria-describedby={fieldStates.company.error ? "company-error" : undefined}
              aria-invalid={fieldStates.company.isValid === false}
            />
          </ValidatedField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ValidatedField
            fieldState={fieldStates.websiteType}
            label={t.labels?.websiteType}
            required={false}
          >
            <select
              name="websiteType"
              value={formData.websiteType}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldValidationClasses(fieldStates.websiteType, "w-full px-4 py-3 pr-12 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200")}
              aria-describedby={fieldStates.websiteType.error ? "websiteType-error" : undefined}
              aria-invalid={fieldStates.websiteType.isValid === false}
            >
              <option value="">{t.selectOption}</option>
              {(t.options?.websiteType || []).map((option: string) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </ValidatedField>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              <Code className="w-4 h-4 inline mr-2" />
              {t.labels?.currentWebsite}
            </label>
            <select
              name="currentWebsite"
              value={formData.currentWebsite}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
            >
              <option value="">{t.selectOption}</option>
              {(t.options?.currentWebsite || []).map((option: string) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              {t.labels?.timeline}
            </label>
            <select
              name="timeline"
              value={formData.timeline}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
            >
              <option value="">{t.selectOption}</option>
              {(t.options?.timeline || []).map((option: string) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-2" />
              {t.labels?.budget}
            </label>
            <select
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
            >
              <option value="">{t.selectOption}</option>
              {(t.options?.budget || []).map((option: string) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            <MessageSquare className="w-4 h-4 inline mr-2" />
            {t.labels?.message}
          </label>
          <textarea
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
            placeholder={t.placeholders?.message}
          />
        </div>

        {/* Honeypot field for spam protection */}
        <div style={{ position: 'absolute', left: '-9999px', visibility: 'hidden' }} aria-hidden="true">
          <input
            type="text"
            name="website_url"
            tabIndex={-1}
            autoComplete="off"
            onChange={() => {}} // Empty handler to prevent React warnings
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
        >
          {isSubmitting ? (
            <Spinner size="sm" className="text-white" />
          ) : (
            <>
              {t.submit}
              <Send className="ml-2 w-5 h-5" />
            </>
          )}
        </button>

        {/* Form validation hints */}
        {(isSubmitting === false) && (
          <div className="text-sm text-secondary-500 space-y-1">
            {(!formData.name.trim() || !formData.phone.trim() || !formData.privacyAccepted) && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3" data-validation-hints>
                <p className="text-amber-800 font-medium mb-2">
                  {t.hints?.title}
                </p>
                <ul className="space-y-1 text-amber-700">
                  {!formData.name.trim() && (
                    <li>• {t.hints?.name}</li>
                  )}
                  {!formData.phone.trim() && (
                    <li>• {t.hints?.phone}</li>
                  )}
                  {!formData.privacyAccepted && (
                    <li>• {t.hints?.privacy}</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="flex items-start">
          <input
            type="checkbox"
            id="privacyAccepted"
            checked={formData.privacyAccepted}
            onChange={(e) => setFormData(prev => ({ ...prev, privacyAccepted: e.target.checked }))}
            className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2 mt-1"
          />
          <label htmlFor="privacyAccepted" className="ml-2 text-sm text-secondary-700">
            {formLang === 'en' ? (
              <>
                I have read and accept the{' '}
                <a href={PRIVACY_LINKS.en} target="_blank" className="text-primary-600 hover:underline">
                  {t.privacy?.link || 'Privacy Policy'}
                </a>
                {t.privacy?.text || ' and consent to the processing of my personal data.'} *
              </>
            ) : (
              <>
                <a href={PRIVACY_LINKS.tr} target="_blank" className="text-primary-600 hover:underline">
                  {t.privacy?.link || 'Gizlilik Politikası'}
                </a>
                {t.privacy?.text || 'nı okudum, kabul ediyorum ve kişisel verilerimin işlenmesine onay veriyorum.'} *
              </>
            )}
          </label>
        </div>
      </form>
    </div>
  );
}

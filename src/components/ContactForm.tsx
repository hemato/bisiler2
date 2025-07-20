import { useState } from 'react';
import { Send, CheckCircle, User, Mail, Building, Briefcase, MessageSquare } from 'lucide-react';
import { sendEmails, detectLanguage, detectPageSource } from '../utils/email';
import { 
  validateContactForm, 
  getFieldError, 
  hasFieldError, 
  sanitizeFormData,
  type FieldValidationState,
  getFieldValidationClasses,
  validateFieldRealTime,
  validateField,
  FORM_SCHEMAS
} from '../utils/validation';
import { useErrorHandler } from '../utils/error-handler';
import { Alert, Spinner, ValidatedField } from './ui';
import { formSecurity, honeypotUtils } from '../utils/security';

interface ContactFormProps {
  translations: {
    contact: {
      form: {
        name: string;
        email: string;
        phone?: string;
        company: string;
        services: string;
        message: string;
        submit: string;
        serviceOptions: string[];
      };
    };
  };
}

export default function ContactForm({ translations }: ContactFormProps) {
  // Form data state - single source of truth
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    services: [] as string[],
    message: '',
    otherService: '',
    privacyAccepted: false
  });

  // Field validation states for real-time feedback
  const [fieldStates, setFieldStates] = useState<Record<string, FieldValidationState>>({
    name: { value: '', isValid: null, error: null, touched: false },
    email: { value: '', isValid: null, error: null, touched: false },
    phone: { value: '', isValid: null, error: null, touched: false },
    company: { value: '', isValid: null, error: null, touched: false },
    message: { value: '', isValid: null, error: null, touched: false },
    services: { value: '', isValid: null, error: null, touched: false }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<any[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string>('');

  const lang = translations.contact.form.submit === 'Send' ? 'en' : 'tr';
  const schema = FORM_SCHEMAS.contact;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const language = typeof window !== 'undefined' && window.location.pathname.includes('/en') ? 'en' : 'tr';
      
      // Clear previous errors
      setFormError('');
      
      // Priority-based validation for better UX
      const validation = validateContactForm(formData, language);
      
      // Priority 1: Field validation (name, email, services)
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
        
        // Show inline error message instead of alert
        setFormError(language === 'en' 
          ? 'Please fill in all required fields correctly.' 
          : 'Lütfen tüm gerekli alanları doğru şekilde doldurun.'
        );
        
        // Auto-scroll to validation hints (more detailed info)
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

      // Priority 2: Privacy validation (only if all fields are valid)
      if (!formData.privacyAccepted) {
        setFormError(language === 'en'
          ? 'Please accept the Privacy Policy to continue.'
          : 'Devam etmek için lütfen Gizlilik Politikasını kabul edin.'
        );
        
        // Auto-scroll to validation hints (more detailed info)
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
        ...formData,
        services: formData.services.includes('Diğer') || formData.services.includes('Other')
          ? [...formData.services.filter(s => s !== 'Diğer' && s !== 'Other'), formData.otherService].filter(Boolean)
          : formData.services,
        formType: 'contact' as const,
        pageSource: detectPageSource(),
        timestamp: new Date().toISOString(),
        language: language as 'tr' | 'en'
      };

      console.log('Contact Form submitted:', submitData);
      
      // Send emails
      const emailResult = await sendEmails(submitData);
      
      if (emailResult.success) {
        setIsSubmitted(true);
        
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
          services: [],
          message: '',
          otherService: '',
          privacyAccepted: false
        });
        
        // Clear field states
        setFieldStates({
          name: { value: '', isValid: null, error: null, touched: false },
          email: { value: '', isValid: null, error: null, touched: false },
          phone: { value: '', isValid: null, error: null, touched: false },
          company: { value: '', isValid: null, error: null, touched: false },
          message: { value: '', isValid: null, error: null, touched: false },
          services: { value: '', isValid: null, error: null, touched: false }
        });
        
        // Clear any errors
        setFormError('');
      } else {
        // Show specific error based on what failed
        let errorMessage = language === 'en' 
          ? 'An error occurred while sending emails. Please try again.' 
          : 'Email gönderilirken bir hata oluştu. Lütfen tekrar deneyin.';
          
        if (!emailResult.customerEmailSent && !emailResult.adminEmailSent) {
          errorMessage = language === 'en' 
            ? 'Failed to send confirmation emails. Please contact us directly.' 
            : 'Onay emaili gönderilemedi. Lütfen direkt bizimle iletişime geçin.';
        }
        
        setFormError(errorMessage);
      }
      
    } catch (error) {
      console.error('Form submission error:', error);
      const language = typeof window !== 'undefined' && window.location.pathname.includes('/en') ? 'en' : 'tr';
      setFormError(language === 'en' ? 'An error occurred while submitting the form. Please try again.' : 'Form gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Real-time field validation handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time validation for this field
    const rule = schema[name as keyof typeof schema];
    
    if (rule) {
      const validation = validateFieldRealTime(name, value, rule, lang as 'tr' | 'en');
      
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
  };

  // onBlur validation handler
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    const rule = schema[name as keyof typeof schema];
    if (rule) {
      const validation = validateFieldRealTime(name, value, rule, lang as 'tr' | 'en');
      
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

  const handleServiceChange = (service: string, checked: boolean) => {
    const newServices = checked 
      ? [...formData.services, service]
      : formData.services.filter(s => s !== service);
    
    setFormData(prev => ({
      ...prev,
      services: newServices
    }));

    // Update services field validation state
    const rule = schema.services;
    if (rule) {
      const validation = validateFieldRealTime('services', newServices, rule, lang as 'tr' | 'en');
      
      setFieldStates(prev => ({
        ...prev,
        services: {
          value: newServices.join(', '), // Convert array to string for display
          isValid: validation.isValid,
          error: validation.error,
          touched: true
        }
      }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12" data-success-message>
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-secondary-900 mb-4">
          {translations.contact.form.submit === 'Send' ? 'Thank You!' : 'Teşekkürler!'}
        </h3>
        <p className="text-secondary-600 mb-8">
          {translations.contact.form.submit === 'Send'
            ? 'Your message has been sent successfully. We will get back to you soon.'
            : 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.'
          }
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          {translations.contact.form.submit === 'Send' ? 'Send Another Message' : 'Başka Mesaj Gönder'}
        </button>
      </div>
    );
  }

  return (
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
          label={translations.contact.form.name}
          required={true}
        >
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getFieldValidationClasses(fieldStates.name, "w-full px-4 py-3 pr-12 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200")}
            placeholder={translations.contact.form.name}
            aria-describedby={fieldStates.name.error ? "name-error" : undefined}
            aria-invalid={fieldStates.name.isValid === false}
          />
        </ValidatedField>
        
        <ValidatedField
          fieldState={fieldStates.email}
          label={translations.contact.form.email}
          required={false}
        >
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getFieldValidationClasses(fieldStates.email, "w-full px-4 py-3 pr-12 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200")}
            placeholder={translations.contact.form.email}
            aria-describedby={fieldStates.email.error ? "email-error" : undefined}
            aria-invalid={fieldStates.email.isValid === false}
          />
        </ValidatedField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ValidatedField
          fieldState={fieldStates.company}
          label={translations.contact.form.company}
          required={false}
        >
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getFieldValidationClasses(fieldStates.company, "w-full px-4 py-3 pr-12 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200")}
            placeholder={translations.contact.form.company}
            aria-describedby={fieldStates.company.error ? "company-error" : undefined}
            aria-invalid={fieldStates.company.isValid === false}
          />
        </ValidatedField>

        <ValidatedField
          fieldState={fieldStates.phone}
          label={translations.contact.form.phone || (translations.contact.form.submit === 'Send' ? 'Phone Number' : 'Telefon Numarası')}
          required={true}
        >
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getFieldValidationClasses(fieldStates.phone, "w-full px-4 py-3 pr-12 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200")}
            placeholder={translations.contact.form.phone || (translations.contact.form.submit === 'Send' ? 'Phone Number' : 'Telefon Numarası')}
            aria-describedby={fieldStates.phone.error ? "phone-error" : undefined}
            aria-invalid={fieldStates.phone.isValid === false}
          />
        </ValidatedField>
      </div>

      <ValidatedField
        fieldState={fieldStates.services}
        label={translations.contact.form.services}
        required={true}
      >
        <div className={`space-y-3 p-4 rounded-lg transition-all duration-200 ${
          fieldStates.services.isValid === false 
            ? 'border-2 border-red-500 bg-red-50' 
            : fieldStates.services.isValid === true 
            ? 'border-2 border-green-500 bg-green-50'
            : 'border border-secondary-300'
        }`}>
          {translations.contact.form.serviceOptions.map((option) => (
            <label key={option} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.services.includes(option)}
                onChange={(e) => handleServiceChange(option, e.target.checked)}
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
              />
              <span className="ml-2 text-sm text-secondary-700">{option}</span>
            </label>
          ))}
        </div>
      </ValidatedField>

      {(formData.services.includes('Diğer') || formData.services.includes('Other')) && (
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            {translations.contact.form.submit === 'Send' ? 'Please specify' : 'Lütfen belirtin'}
          </label>
          <input
            type="text"
            name="otherService"
            value={formData.otherService}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            placeholder={translations.contact.form.submit === 'Send' ? 'Describe your needs...' : 'İhtiyaçlarınızı açıklayın...'}
          />
        </div>
      )}

      <ValidatedField
        fieldState={fieldStates.message}
        label={translations.contact.form.message}
        required={false}
      >
        <textarea
          name="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          onBlur={handleBlur}
          className={getFieldValidationClasses(fieldStates.message, "w-full px-4 py-3 pr-12 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200")}
          placeholder={translations.contact.form.submit === 'Send' ? 'Tell us about your project...' : 'Projeniz hakkında bize bilgi verin...'}
          aria-describedby={fieldStates.message.error ? "message-error" : undefined}
          aria-invalid={fieldStates.message.isValid === false}
        />
      </ValidatedField>

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
              {translations.contact.form.submit}
              <Send className="ml-2 w-5 h-5" />
            </>
          )}
        </button>

        {/* Form validation hints */}
        {(isSubmitting === false) && (
          <div className="text-sm text-secondary-500 space-y-1">
            {(!formData.name.trim() || !formData.phone.trim() || formData.services.length === 0 || !formData.privacyAccepted) && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3" data-validation-hints>
                <p className="text-amber-800 font-medium mb-2">
                  {translations.contact.form.submit === 'Send' ? 'Please complete the following required fields:' : 'Lütfen aşağıdaki zorunlu alanları tamamlayın:'}
                </p>
                <ul className="space-y-1 text-amber-700">
                  {!formData.name.trim() && (
                    <li>• {translations.contact.form.name}</li>
                  )}
                  {!formData.phone.trim() && (
                    <li>• {translations.contact.form.phone || (translations.contact.form.submit === 'Send' ? 'Phone Number' : 'Telefon Numarası')}</li>
                  )}
                  {formData.services.length === 0 && (
                    <li>• {translations.contact.form.services}</li>
                  )}
                  {!formData.privacyAccepted && (
                    <li>• {translations.contact.form.submit === 'Send' ? 'Privacy Policy acceptance' : 'Gizlilik Politikası kabulü'}</li>
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
          {translations.contact.form.submit === 'Send' ? (
            <>
              I have read and accept the{' '}
              <a href="/en/privacy" target="_blank" className="text-primary-600 hover:underline">
                Privacy Policy
              </a>
              {' '}and consent to the processing of my personal data. *
            </>
          ) : (
            <>
              <a href="/gizlilik-politikasi" target="_blank" className="text-primary-600 hover:underline">
                Gizlilik Politikası
              </a>
              'nı okudum, kabul ediyorum ve kişisel verilerimin işlenmesine onay veriyorum. *
            </>
          )}
        </label>
      </div>
    </form>
  );
}

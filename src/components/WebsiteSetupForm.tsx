import { useState } from 'react';
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
import { useErrorHandler } from '../utils/error-handler';
import { Alert, Spinner, ValidatedField } from './ui';
import { formSecurity, honeypotUtils } from '../utils/security';

interface WebsiteSetupFormProps {
  translations: {
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
  lang: string;
}

export default function WebsiteSetupForm({ translations, lang }: WebsiteSetupFormProps) {
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

  const errorHandler = useErrorHandler(lang as 'tr' | 'en');
  const schema = FORM_SCHEMAS.websiteSetup;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Clear previous errors
      setFormError('');
      
      // Priority-based validation for better UX
      const validation = validateWebsiteSetupForm(formData, lang as 'tr' | 'en');
      
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
        
        // Show inline error message instead of alert
        setFormError(lang === 'en' 
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
        setFormError(lang === 'en'
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

      // Security checks
      const securityValidation = formSecurity.validateSubmission(formData, {
        checkHoneypot: true,
        honeypotField: 'website_url'
      });

      if (!securityValidation.isValid || securityValidation.isSpam) {
        console.warn('Security validation failed', securityValidation);
        // For spam, don't show error to user - just fail silently
        if (securityValidation.isSpam) {
          await honeypotUtils.simulateProcessingDelay();
          return;
        }
        setSubmitError(lang === 'en' ? 'Security validation failed' : 'Güvenlik doğrulaması başarısız');
        return;
      }

      // Sanitize form data
      const sanitizedData = sanitizeFormData(formData);
      
      // Prepare form data for submission
      const submitData = {
        ...sanitizedData,
        formType: 'website-setup' as const,
        pageSource: detectPageSource(),
        timestamp: new Date().toISOString(),
        language: lang as 'tr' | 'en'
      };

      console.log('Website Setup Form submitted:', submitData);
      
      // Send emails
      const emailResult = await sendEmails(submitData as any);
      
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
          websiteType: '',
          currentWebsite: '',
          timeline: '',
          budget: '',
          message: '',
          privacyAccepted: false
        });
      } else {
        // Show specific error based on what failed
        const errorMessage = lang === 'en' 
          ? 'An error occurred while sending emails. Please try again.' 
          : 'Email gönderilirken bir hata oluştu. Lütfen tekrar deneyin.';
        setSubmitError(errorMessage);
        console.error('Email sending failed', emailResult);
      }
      
    } catch (error) {
      console.error('Form submission error:', error);
      const errorMessage = lang === 'en' 
        ? 'An error occurred while submitting the form. Please try again.' 
        : 'Form gönderilirken bir hata oluştu. Lütfen tekrar deneyin.';
      setSubmitError(errorMessage);
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

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center" data-success-message>
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-secondary-900 mb-4">
          {lang === 'en' ? 'Thank You!' : 'Teşekkürler!'}
        </h3>
        <p className="text-secondary-600 mb-8">
          {lang === 'en'
            ? 'Your website setup request has been sent successfully. Our design team will contact you within 24 hours with a custom proposal.'
            : 'Web sitesi kurulum talebiniz başarıyla gönderildi. Tasarım ekibimiz 24 saat içinde özel teklif ile size dönüş yapacak.'
          }
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setIsSubmitted(false)}
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            {lang === 'en' ? 'Send Another Request' : 'Başka Talep Gönder'}
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
          {translations.websiteSetup.form.title}
        </h2>
        <p className="text-secondary-600">
          {lang === 'en' 
            ? 'Fill out the form below and our design experts will prepare a customized website proposal for your business.'
            : 'Aşağıdaki formu doldurun, tasarım uzmanlarımız işletmeniz için özelleştirilmiş web sitesi önerisi hazırlasın.'
          }
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
            label={translations.websiteSetup.form.fields.name}
            required={true}
          >
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldValidationClasses(fieldStates.name, "w-full px-4 py-3 pr-12 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200")}
              placeholder={translations.websiteSetup.form.fields.name}
              aria-describedby={fieldStates.name.error ? "name-error" : undefined}
              aria-invalid={fieldStates.name.isValid === false}
            />
          </ValidatedField>
          
          <ValidatedField
            fieldState={fieldStates.email}
            label={translations.websiteSetup.form.fields.email}
            required={false}
          >
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldValidationClasses(fieldStates.email, "w-full px-4 py-3 pr-12 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200")}
              placeholder={translations.websiteSetup.form.fields.email}
              aria-describedby={fieldStates.email.error ? "email-error" : undefined}
              aria-invalid={fieldStates.email.isValid === false}
            />
          </ValidatedField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ValidatedField
            fieldState={fieldStates.phone}
            label={translations.websiteSetup.form.fields.phone}
            required={true}
          >
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldValidationClasses(fieldStates.phone, "w-full px-4 py-3 pr-12 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200")}
              placeholder={translations.websiteSetup.form.fields.phone}
              aria-describedby={fieldStates.phone.error ? "phone-error" : undefined}
              aria-invalid={fieldStates.phone.isValid === false}
            />
          </ValidatedField>
          
          <ValidatedField
            fieldState={fieldStates.company}
            label={translations.websiteSetup.form.fields.company}
            required={false}
          >
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldValidationClasses(fieldStates.company, "w-full px-4 py-3 pr-12 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200")}
              placeholder={translations.websiteSetup.form.fields.company}
              aria-describedby={fieldStates.company.error ? "company-error" : undefined}
              aria-invalid={fieldStates.company.isValid === false}
            />
          </ValidatedField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ValidatedField
            fieldState={fieldStates.websiteType}
            label={translations.websiteSetup.form.fields.websiteType}
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
              <option value="">{lang === 'en' ? 'Select...' : 'Seçin...'}</option>
              {translations.websiteSetup.form.options.websiteType.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </ValidatedField>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              <Code className="w-4 h-4 inline mr-2" />
              {translations.websiteSetup.form.fields.currentWebsite}
            </label>
            <select
              name="currentWebsite"
              value={formData.currentWebsite}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
            >
              <option value="">{lang === 'en' ? 'Select...' : 'Seçin...'}</option>
              {translations.websiteSetup.form.options.currentWebsite.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              {translations.websiteSetup.form.fields.timeline}
            </label>
            <select
              name="timeline"
              value={formData.timeline}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
            >
              <option value="">{lang === 'en' ? 'Select...' : 'Seçin...'}</option>
              {translations.websiteSetup.form.options.timeline.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-2" />
              {translations.websiteSetup.form.fields.budget}
            </label>
            <select
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
            >
              <option value="">{lang === 'en' ? 'Select...' : 'Seçin...'}</option>
              {translations.websiteSetup.form.options.budget.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            <MessageSquare className="w-4 h-4 inline mr-2" />
            {translations.websiteSetup.form.fields.message}
          </label>
          <textarea
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
            placeholder={lang === 'en' ? 'Tell us about your website goals, preferred design style, features needed...' : 'Web sitesi hedefleriniz, tercih ettiğiniz tasarım tarzı, ihtiyaç duyduğunuz özellikler hakkında bize bilgi verin...'}
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
              {translations.websiteSetup.form.submit}
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
                  {lang === 'en' ? 'Please complete the following required fields:' : 'Lütfen aşağıdaki zorunlu alanları tamamlayın:'}
                </p>
                <ul className="space-y-1 text-amber-700">
                  {!formData.name.trim() && (
                    <li>• {translations.websiteSetup.form.fields.name}</li>
                  )}
                  {!formData.phone.trim() && (
                    <li>• {translations.websiteSetup.form.fields.phone}</li>
                  )}
                  {!formData.privacyAccepted && (
                    <li>• {lang === 'en' ? 'Privacy Policy acceptance' : 'Gizlilik Politikası kabulü'}</li>
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
            {lang === 'en' ? (
              <>
                I have read and accept the{' '}
                <a href={PRIVACY_LINKS.en} target="_blank" className="text-primary-600 hover:underline">
                  Privacy Policy
                </a>
                {' '}and consent to the processing of my personal data. *
              </>
            ) : (
              <>
                <a href={PRIVACY_LINKS.tr} target="_blank" className="text-primary-600 hover:underline">
                  Gizlilik Politikası
                </a>
                'nı okudum, kabul ediyorum ve kişisel verilerimin işlenmesine onay veriyorum. *
              </>
            )}
          </label>
        </div>
      </form>
    </div>
  );
}

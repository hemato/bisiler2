import { useState, useEffect } from 'react';
import { Mail, Phone, Building, User, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';

// Declare global analytics functions
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
  budget: string;
  timeline: string;
  source: string;
}

interface LandingPageFormProps {
  translations: any;
  formType: 'website' | 'crm';
  onSubmit: (data: FormData) => void;
  variant?: 'inline' | 'popup' | 'sidebar';
  className?: string;
}

export default function LandingPageForm({ 
  translations, 
  formType, 
  onSubmit, 
  variant = 'inline',
  className = ""
}: LandingPageFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: '',
    budget: '',
    timeline: '',
    source: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [leadScore, setLeadScore] = useState(0);

  // Form validation
  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = translations.form?.validation?.name || 'Ad soyad gerekli';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = translations.form?.validation?.email || 'E-posta gerekli';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = translations.form?.validation?.email_invalid || 'Geçersiz e-posta';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = translations.form?.validation?.phone || 'Telefon gerekli';
    } else if (!/^[\d\s\-\+\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = translations.form?.validation?.phone_invalid || 'Geçersiz telefon';
    }
    
    if (!formData.service) {
      newErrors.service = translations.form?.validation?.service || 'Hizmet seçimi gerekli';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate lead score
  useEffect(() => {
    let score = 0;
    
    if (formData.name) score += 10;
    if (formData.email) score += 15;
    if (formData.phone) score += 20;
    if (formData.company) score += 25;
    if (formData.service) score += 15;
    if (formData.message) score += 10;
    if (formData.budget) score += 30;
    if (formData.timeline) score += 20;
    
    setLeadScore(score);
  }, [formData]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const submissionData = {
        ...formData,
        leadScore,
        formType,
        timestamp: new Date().toISOString(),
        source: window.location.href
      };
      
      await onSubmit(submissionData);
      setIsSubmitted(true);
      
      // Track conversion
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'conversion', {
          send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL',
          value: 1.0,
          currency: 'TRY'
        });
      }
      
      // Facebook Pixel
      if (typeof window.fbq !== 'undefined') {
        window.fbq('track', 'Lead', {
          content_name: formType === 'website' ? 'Website Quote' : 'CRM Consultation',
          content_category: formType,
          value: leadScore,
          currency: 'TRY'
        });
      }
      
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Service options based on form type
  const serviceOptions = formType === 'website' 
    ? [
        { value: 'basic', label: translations.form?.services?.website?.basic || 'Temel Web Sitesi' },
        { value: 'ecommerce', label: translations.form?.services?.website?.ecommerce || 'E-ticaret Sitesi' },
        { value: 'corporate', label: translations.form?.services?.website?.corporate || 'Kurumsal Web Sitesi' },
        { value: 'custom', label: translations.form?.services?.website?.custom || 'Özel Geliştirme' }
      ]
    : [
        { value: 'setup', label: translations.form?.services?.crm?.setup || 'CRM Kurulumu' },
        { value: 'migration', label: translations.form?.services?.crm?.migration || 'CRM Migrasyonu' },
        { value: 'consultation', label: translations.form?.services?.crm?.consultation || 'CRM Danışmanlığı' },
        { value: 'training', label: translations.form?.services?.crm?.training || 'CRM Eğitimi' }
      ];

  const budgetOptions = [
    { value: '2500-5000', label: '₺2.500 - ₺5.000' },
    { value: '5000-10000', label: '₺5.000 - ₺10.000' },
    { value: '10000-25000', label: '₺10.000 - ₺25.000' },
    { value: '25000+', label: '₺25.000+' }
  ];

  const timelineOptions = [
    { value: 'asap', label: translations.form?.timeline?.asap || 'En kısa sürede' },
    { value: '1-2weeks', label: translations.form?.timeline?.weeks || '1-2 hafta içinde' },
    { value: '1month', label: translations.form?.timeline?.month || '1 ay içinde' },
    { value: '3months', label: translations.form?.timeline?.months || '3 ay içinde' }
  ];

  // Success message
  if (isSubmitted) {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-lg p-6 text-center ${className}`}>
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          {translations.form?.success?.title || 'Teşekkürler!'}
        </h3>
        <p className="text-green-700 mb-4">
          {translations.form?.success?.message || 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.'}
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="tel:+905321234567"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            {translations.form?.success?.call || 'Hemen Ara'}
          </a>
          <a
            href="https://wa.me/905321234567"
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            {translations.form?.success?.whatsapp || 'WhatsApp'}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-lg p-6 ${className}`}>
      {/* Form Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {translations.form?.title || 'Ücretsiz Teklif Alın'}
        </h3>
        <p className="text-gray-600">
          {translations.form?.subtitle || 'Size özel çözüm önerisini 24 saat içinde hazırlayalım'}
        </p>
        
        {/* Lead Score Indicator */}
        <div className="mt-4 bg-gray-100 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(leadScore, 100)}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {translations.form?.completion || 'Form tamamlanma'}: {Math.min(leadScore, 100)}%
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <User className="w-4 h-4 inline mr-1" />
                  {translations.form?.fields?.name || 'Ad Soyad'} *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={translations.form?.placeholders?.name || 'Adınız ve soyadınız'}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail className="w-4 h-4 inline mr-1" />
                  {translations.form?.fields?.email || 'E-posta'} *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={translations.form?.placeholders?.email || 'ornek@email.com'}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone className="w-4 h-4 inline mr-1" />
                  {translations.form?.fields?.phone || 'Telefon'} *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={translations.form?.placeholders?.phone || '0532 123 45 67'}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Building className="w-4 h-4 inline mr-1" />
                  {translations.form?.fields?.company || 'Şirket'}
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={translations.form?.placeholders?.company || 'Şirket adınız'}
                />
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                {translations.form?.buttons?.next || 'Devam Et'}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Service Details */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {translations.form?.fields?.service || 'Hizmet Türü'} *
              </label>
              <select
                value={formData.service}
                onChange={(e) => setFormData({...formData, service: e.target.value})}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.service ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">{translations.form?.placeholders?.service || 'Hizmet seçin'}</option>
                {serviceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {translations.form?.fields?.budget || 'Bütçe'}
                </label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">{translations.form?.placeholders?.budget || 'Bütçe seçin'}</option>
                  {budgetOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {translations.form?.fields?.timeline || 'Zaman Dilimi'}
                </label>
                <select
                  value={formData.timeline}
                  onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">{translations.form?.placeholders?.timeline || 'Zaman dilimi seçin'}</option>
                  {timelineOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MessageCircle className="w-4 h-4 inline mr-1" />
                {translations.form?.fields?.message || 'Mesaj'}
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={translations.form?.placeholders?.message || 'Proje detayları, özel istekler...'}
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                {translations.form?.buttons?.back || 'Geri'}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (translations.form?.buttons?.submitting || 'Gönderiliyor...') : (translations.form?.buttons?.submit || 'Teklif Al')}
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Trust Indicators */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
            <span>{translations.form?.trust?.secure || 'Güvenli'}</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
            <span>{translations.form?.trust?.fast || 'Hızlı Yanıt'}</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-1"></div>
            <span>{translations.form?.trust?.free || 'Ücretsiz'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
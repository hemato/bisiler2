import { useState, useEffect } from 'react';
import { Download, FileText, CheckCircle, Mail, Lock, Users, Clock, Star } from 'lucide-react';

interface LeadMagnetProps {
  translations: any;
  type: 'ebook' | 'checklist' | 'template' | 'guide' | 'webinar' | 'consultation';
  title: string;
  description: string;
  benefits: string[];
  formFields: {
    name: boolean;
    email: boolean;
    phone: boolean;
    company: boolean;
  };
  downloadUrl?: string;
  className?: string;
}

export default function LeadMagnet({
  translations,
  type,
  title,
  description,
  benefits,
  formFields,
  downloadUrl,
  className = ''
}: LeadMagnetProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [downloadCount, setDownloadCount] = useState(0);

  useEffect(() => {
    // Simulate download count
    const baseCount = type === 'ebook' ? 1247 : type === 'checklist' ? 892 : 654;
    setDownloadCount(baseCount + Math.floor(Math.random() * 100));
  }, [type]);

  const getTypeIcon = () => {
    switch (type) {
      case 'ebook':
        return <FileText className="w-8 h-8 text-primary-600" />;
      case 'checklist':
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case 'template':
        return <FileText className="w-8 h-8 text-blue-600" />;
      case 'guide':
        return <FileText className="w-8 h-8 text-purple-600" />;
      case 'webinar':
        return <Users className="w-8 h-8 text-red-600" />;
      case 'consultation':
        return <Clock className="w-8 h-8 text-orange-600" />;
      default:
        return <Download className="w-8 h-8 text-gray-600" />;
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    
    if (formFields.name && !formData.name.trim()) {
      newErrors.name = translations.leadMagnet?.validation?.name || 'İsim gerekli';
    }
    
    if (formFields.email && !formData.email.trim()) {
      newErrors.email = translations.leadMagnet?.validation?.email || 'E-posta gerekli';
    } else if (formFields.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = translations.leadMagnet?.validation?.emailInvalid || 'Geçersiz e-posta';
    }
    
    if (formFields.phone && !formData.phone.trim()) {
      newErrors.phone = translations.leadMagnet?.validation?.phone || 'Telefon gerekli';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Send to CRM/email system
      const response = await fetch('/api/lead-magnet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          type,
          title,
          timestamp: new Date().toISOString()
        }),
      });
      
      if (response.ok) {
        setIsSubmitted(true);
        
        // Track conversion
        if (window.gtag) {
          window.gtag('event', 'lead_magnet_download', {
            event_category: 'lead_generation',
            event_label: type,
            value: 1
          });
        }
        
        // Auto-download if URL provided
        if (downloadUrl) {
          setTimeout(() => {
            window.open(downloadUrl, '_blank');
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Lead magnet submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-lg p-8 text-center ${className}`}>
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-800 mb-2">
          {translations.leadMagnet?.success?.title || 'Teşekkürler!'}
        </h3>
        <p className="text-green-700 mb-6">
          {translations.leadMagnet?.success?.message || 'İndirme bağlantısı e-posta adresinize gönderildi.'}
        </p>
        
        {downloadUrl && (
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-5 h-5 mr-2" />
            {translations.leadMagnet?.success?.download || 'Hemen İndir'}
          </a>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white p-6">
        <div className="flex items-center mb-4">
          {getTypeIcon()}
          <div className="ml-4">
            <div className="text-sm font-medium opacity-90">
              {translations.leadMagnet?.labels?.[type] || type.toUpperCase()}
            </div>
            <div className="text-xs opacity-75">
              {translations.leadMagnet?.free || 'Ücretsiz'}
            </div>
          </div>
        </div>
        
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-sm opacity-90">{description}</p>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Benefits */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">
            {translations.leadMagnet?.benefits?.title || 'Bu içerikte neler var?'}
          </h4>
          <ul className="space-y-2">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Proof */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-1" />
              <span>{downloadCount.toLocaleString()} kişi indirdi</span>
            </div>
            <div className="flex items-center text-yellow-600">
              <Star className="w-4 h-4 mr-1" />
              <span>4.8/5 değerlendirme</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {formFields.name && (
            <div>
              <input
                type="text"
                placeholder={translations.leadMagnet?.placeholders?.name || 'Adınız'}
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
          )}

          {formFields.email && (
            <div>
              <input
                type="email"
                placeholder={translations.leadMagnet?.placeholders?.email || 'E-posta adresiniz'}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
          )}

          {formFields.phone && (
            <div>
              <input
                type="tel"
                placeholder={translations.leadMagnet?.placeholders?.phone || 'Telefon numaranız'}
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
          )}

          {formFields.company && (
            <div>
              <input
                type="text"
                placeholder={translations.leadMagnet?.placeholders?.company || 'Şirket adınız'}
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {translations.leadMagnet?.buttons?.submitting || 'Gönderiliyor...'}
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                {translations.leadMagnet?.buttons?.download || 'Ücretsiz İndir'}
              </>
            )}
          </button>
        </form>

        {/* Trust indicators */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center">
              <Lock className="w-3 h-3 mr-1" />
              <span>{translations.leadMagnet?.trust?.secure || 'Güvenli'}</span>
            </div>
            <div className="flex items-center">
              <Mail className="w-3 h-3 mr-1" />
              <span>{translations.leadMagnet?.trust?.noSpam || 'Spam yok'}</span>
            </div>
            <div className="flex items-center">
              <Download className="w-3 h-3 mr-1" />
              <span>{translations.leadMagnet?.trust?.instant || 'Anında erişim'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
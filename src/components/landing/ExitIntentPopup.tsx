import { useState, useEffect } from 'react';
import { X, Gift, Download } from 'lucide-react';

interface ExitIntentPopupProps {
  type: 'website' | 'crm';
  translations: any;
}

export default function ExitIntentPopup({ type, translations }: ExitIntentPopupProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    let mouseLeaveTimer: NodeJS.Timeout;
    
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !showPopup && !isSubmitted) {
        mouseLeaveTimer = setTimeout(() => {
          setShowPopup(true);
        }, 500);
      }
    };

    const handleMouseEnter = () => {
      clearTimeout(mouseLeaveTimer);
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      clearTimeout(mouseLeaveTimer);
    };
  }, [showPopup, isSubmitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store email in localStorage for future use
      localStorage.setItem('exit_intent_email', email);
      localStorage.setItem('exit_intent_timestamp', new Date().toISOString());
      
      setIsSubmitted(true);
      setIsSubmitting(false);
      
      // Auto close after 3 seconds
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    } catch (error) {
      console.error('Exit intent form submission error:', error);
      setIsSubmitting(false);
    }
  };

  const getContent = () => {
    if (type === 'website') {
      return {
        title: translations.exit_intent?.website?.title || 'Bekleyin! 🎁',
        subtitle: translations.exit_intent?.website?.subtitle || 'Web Sitesi Kontrol Listesi PDF\'ini ücretsiz alın',
        leadMagnet: translations.exit_intent?.website?.lead_magnet || 'Web Sitesi Kontrol Listesi PDF',
        cta: translations.exit_intent?.website?.cta || 'Ücretsiz PDF\'i İndir',
        icon: <Download className="w-8 h-8 text-blue-500" />
      };
    } else {
      return {
        title: translations.exit_intent?.crm?.title || 'Dur! 🎯',
        subtitle: translations.exit_intent?.crm?.subtitle || 'CRM Seçim Kılavuzu PDF\'ini ücretsiz alın',
        leadMagnet: translations.exit_intent?.crm?.lead_magnet || 'CRM Seçim Kılavuzu PDF',
        cta: translations.exit_intent?.crm?.cta || 'Ücretsiz Kılavuzu İndir',
        icon: <Gift className="w-8 h-8 text-purple-500" />
      };
    }
  };

  const content = getContent();

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full mx-4 transform animate-bounce-in">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center">
              {content.icon}
              <h3 className="text-2xl font-bold text-secondary-900 ml-3">
                {content.title}
              </h3>
            </div>
            <button 
              onClick={() => setShowPopup(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {!isSubmitted ? (
            <>
              <p className="text-secondary-600 mb-6 leading-relaxed">
                {content.subtitle}
              </p>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg mb-6">
                <p className="text-sm font-medium text-secondary-800">
                  🎁 {content.leadMagnet}
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={translations.exit_intent?.email_placeholder || 'E-posta adresiniz'}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-primary-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-primary-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {translations.exit_intent?.submitting || 'Gönderiliyor...'}
                    </div>
                  ) : (
                    content.cta
                  )}
                </button>
              </form>
              
              <p className="text-xs text-gray-500 mt-4 text-center">
                {translations.exit_intent?.privacy_note || 'E-posta adresiniz güvende. Spam göndermeyiz.'}
              </p>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-2">
                {translations.exit_intent?.success?.title || 'Teşekkürler!'}
              </h3>
              <p className="text-secondary-600">
                {translations.exit_intent?.success?.message || 'PDF\'iniz e-posta adresinize gönderildi.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
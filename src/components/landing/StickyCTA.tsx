import { useState, useEffect } from 'react';
import { ArrowRight, Phone, MessageCircle, X } from 'lucide-react';

interface StickyCTAProps {
  translations: any;
  primaryAction: {
    text: string;
    href: string;
    type: 'internal' | 'external' | 'phone' | 'whatsapp';
  };
  secondaryAction?: {
    text: string;
    href: string;
    type: 'internal' | 'external' | 'phone' | 'whatsapp';
  };
  showDelay?: number;
  className?: string;
}

export default function StickyCTA({ 
  translations, 
  primaryAction, 
  secondaryAction, 
  showDelay = 3000,
  className = ""
}: StickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, showDelay);

    return () => clearTimeout(timer);
  }, [showDelay]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Show when user scrolls down 20% of the page
      if (scrollY > windowHeight * 0.2 && !isDismissed) {
        setIsVisible(true);
      }
      
      // Hide when user reaches footer (last 10% of page)
      if (scrollY + windowHeight > documentHeight * 0.9) {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  const handleAction = (action: typeof primaryAction) => {
    switch (action.type) {
      case 'phone':
        window.open(`tel:${action.href}`, '_self');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/${action.href}`, '_blank');
        break;
      case 'external':
        window.open(action.href, '_blank');
        break;
      default:
        window.location.href = action.href;
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'phone':
        return <Phone className="w-5 h-5" />;
      case 'whatsapp':
        return <MessageCircle className="w-5 h-5" />;
      default:
        return <ArrowRight className="w-5 h-5" />;
    }
  };

  if (!isVisible || isDismissed) {
    return null;
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 transform transition-all duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-full'} ${className}`}>
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
      
      {/* CTA Container */}
      <div className="relative bg-white border-t border-gray-200 shadow-lg">
        {/* Dismiss Button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="max-w-6xl mx-auto px-4 py-3">
          {/* Mobile View */}
          <div className="block md:hidden">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {translations.sticky_cta?.mobile?.title || 'Hemen Başlayın!'}
                </p>
                <p className="text-xs text-gray-600">
                  {translations.sticky_cta?.mobile?.subtitle || 'Ücretsiz danışmanlık alın'}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAction(primaryAction)}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary-700 transition-colors flex items-center space-x-1"
                >
                  {getActionIcon(primaryAction.type)}
                  <span>{primaryAction.text}</span>
                </button>
                {secondaryAction && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                  >
                    •••
                  </button>
                )}
              </div>
            </div>
            
            {/* Expanded mobile options */}
            {isExpanded && secondaryAction && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <button
                  onClick={() => handleAction(secondaryAction)}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
                >
                  {getActionIcon(secondaryAction.type)}
                  <span>{secondaryAction.text}</span>
                </button>
              </div>
            )}
          </div>

          {/* Desktop View */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {translations.sticky_cta?.desktop?.title || 'Hazır mısınız? Hemen başlayalım!'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {translations.sticky_cta?.desktop?.subtitle || 'Ücretsiz danışmanlık için iletişime geçin'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {secondaryAction && (
                <button
                  onClick={() => handleAction(secondaryAction)}
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  {getActionIcon(secondaryAction.type)}
                  <span>{secondaryAction.text}</span>
                </button>
              )}
              
              <button
                onClick={() => handleAction(primaryAction)}
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center space-x-2 shadow-lg"
              >
                {getActionIcon(primaryAction.type)}
                <span>{primaryAction.text}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
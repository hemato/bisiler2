import { useState, useEffect } from 'react';
import { MessageCircle, X, Phone, Mail } from 'lucide-react';

interface LiveChatWidgetProps {
  translations: any;
}

export default function LiveChatWidget({ translations }: LiveChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    // Show pulse animation after 5 seconds
    const timer = setTimeout(() => {
      setShowPulse(true);
      setHasNewMessage(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setHasNewMessage(false);
      setShowPulse(false);
    }
  }, [isOpen]);

  const contactOptions = [
    {
      type: 'whatsapp',
      icon: '💬',
      title: translations.live_chat?.whatsapp?.title || 'WhatsApp ile Mesaj',
      subtitle: translations.live_chat?.whatsapp?.subtitle || 'Hemen yanıt alın',
      action: () => window.open('https://wa.me/905321234567?text=Merhaba, web sitesi/CRM hakkında bilgi almak istiyorum.', '_blank'),
      bgColor: 'bg-green-50 hover:bg-green-100',
      textColor: 'text-green-700'
    },
    {
      type: 'phone',
      icon: '📞',
      title: translations.live_chat?.phone?.title || 'Telefon ile Ara',
      subtitle: translations.live_chat?.phone?.subtitle || 'Direkt görüşelim',
      action: () => window.open('tel:+905321234567', '_self'),
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      textColor: 'text-blue-700'
    },
    {
      type: 'email',
      icon: '✉️',
      title: translations.live_chat?.email?.title || 'E-posta Gönder',
      subtitle: translations.live_chat?.email?.subtitle || 'Detaylı bilgi alın',
      action: () => window.open('mailto:info@techcorp.com?subject=Web Sitesi/CRM Danışmanlığı', '_self'),
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      textColor: 'text-purple-700'
    }
  ];

  return (
    <>
      {/* Chat Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 bg-primary-600 text-white p-4 rounded-full shadow-lg z-50 hover:bg-primary-700 transition-all duration-200 transform hover:scale-110 ${showPulse ? 'animate-pulse' : ''}`}
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6" />
          {hasNewMessage && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
          )}
        </div>
      </button>
      
      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 bg-white rounded-2xl shadow-2xl border border-gray-200 w-80 z-50 transform animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white p-4 rounded-t-2xl">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">
                  {translations.live_chat?.header?.title || 'Uzmanla Konuş'}
                </h3>
                <p className="text-sm text-primary-100">
                  {translations.live_chat?.header?.subtitle || 'Hemen yanıt alın'}
                </p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-4">
            <div className="mb-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700">
                  {translations.live_chat?.welcome_message || 'Merhaba! Size nasıl yardımcı olabilirim?'}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              {contactOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={option.action}
                  className={`w-full p-3 rounded-lg transition-all duration-200 transform hover:scale-105 ${option.bgColor}`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{option.icon}</span>
                    <div className="text-left">
                      <div className={`font-medium ${option.textColor}`}>
                        {option.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {option.subtitle}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-center text-xs text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                {translations.live_chat?.status || 'Çevrimiçi - Hemen yanıt alın'}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
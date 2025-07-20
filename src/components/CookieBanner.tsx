import { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowBanner(false);
  };

  const rejectCookies = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg border-t border-secondary-200 p-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Cookie className="w-6 h-6 text-primary-600 flex-shrink-0" />
          <p className="text-secondary-700 text-sm">
            Bu web sitesi, deneyiminizi geliştirmek için çerezler kullanır. 
            Detaylar için <a href="/gizlilik-politikasi" className="text-primary-600 hover:underline">gizlilik politikamızı</a> inceleyin.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={rejectCookies}
            className="px-4 py-2 text-sm font-medium text-secondary-600 hover:text-secondary-800 transition-colors"
          >
            Reddet
          </button>
          <button
            onClick={acceptCookies}
            className="px-6 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Kabul Et
          </button>
        </div>
      </div>
    </div>
  );
}

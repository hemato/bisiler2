import { useState } from 'react';
import { Globe } from 'lucide-react';

interface LanguageToggleProps {
  currentLang: string;
  pathname: string;
}

// URL mapping between Turkish and English slugs
const urlMapping = {
  // Turkish to English
  '/hakkimizda': '/en/about',
  '/hizmetlerimiz': '/en/services',
  '/referanslar': '/en/references',
  '/iletisim': '/en/contact',
  '/blog': '/en/blog',
  '/sss': '/en/faq',
  '/gizlilik-politikasi': '/en/privacy',
  '/': '/en/',
  
  // English to Turkish
  '/en/about': '/hakkimizda',
  '/en/services': '/hizmetlerimiz',
  '/en/references': '/referanslar',
  '/en/contact': '/iletisim',
  '/en/blog': '/blog',
  '/en/faq': '/sss',
  '/en/privacy': '/gizlilik-politikasi',
  '/en/': '/',
  '/en': '/'
};

export default function LanguageToggle({ currentLang, pathname }: LanguageToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleLanguage = () => {
    const newLang = currentLang === 'tr' ? 'en' : 'tr';
    
    // Use URL mapping for proper slug conversion
    let newPath = pathname;
    
    if (currentLang === 'tr') {
      // Turkish to English
      newPath = urlMapping[pathname as keyof typeof urlMapping] || `/en${pathname}`;
    } else {
      // English to Turkish
      newPath = urlMapping[pathname as keyof typeof urlMapping] || pathname.replace('/en', '');
    }
    
    window.location.href = newPath;
  };

  return (
    <div className="relative">
      <button
        onClick={toggleLanguage}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-secondary-600 hover:text-primary-600 transition-colors"
      >
        <Globe className="w-4 h-4" />
        {currentLang === 'tr' ? '🇹🇷 TR' : '🇬🇧 EN'}
      </button>
    </div>
  );
}
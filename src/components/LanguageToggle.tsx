import { useState } from 'react';
import { Globe } from 'lucide-react';
import { getLocalizedRoute } from '../utils/routes';

interface LanguageToggleProps {
  currentLang: string;
  pathname: string;
}

export default function LanguageToggle({ currentLang, pathname }: LanguageToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleLanguage = () => {
    const newLang = currentLang === 'tr' ? 'en' : 'tr';
    
    // Use centralized route system for proper slug conversion
    const newPath = getLocalizedRoute(pathname, newLang);
    
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

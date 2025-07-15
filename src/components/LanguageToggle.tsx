import { useState } from 'react';
import { Globe } from 'lucide-react';

interface LanguageToggleProps {
  currentLang: string;
  pathname: string;
}

export default function LanguageToggle({ currentLang, pathname }: LanguageToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleLanguage = () => {
    const newLang = currentLang === 'tr' ? 'en' : 'tr';
    const newPath = currentLang === 'tr' ? `/en${pathname}` : pathname.replace('/en', '');
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
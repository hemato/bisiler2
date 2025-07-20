// Loading state component
import Spinner from './Spinner';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  lang?: 'tr' | 'en';
  className?: string;
}

export default function LoadingState({ 
  message, 
  size = 'md', 
  lang = 'tr',
  className = '' 
}: LoadingStateProps) {
  const defaultMessages = {
    tr: 'Yükleniyor...',
    en: 'Loading...'
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <Spinner size={size} className="text-primary-600" />
      <p className="mt-3 text-secondary-600 text-sm">
        {message || defaultMessages[lang]}
      </p>
    </div>
  );
}

import { trackContactAction } from '../config/analytics';

interface TrackingWrapperProps {
  actionType: 'phone' | 'whatsapp' | 'email';
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  title?: string;
  onClick?: () => void;
}

export default function TrackingWrapper({
  actionType,
  href,
  children,
  className = '',
  target,
  rel,
  title,
  onClick
}: TrackingWrapperProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Track the contact action
    trackContactAction(actionType);
    
    // Track Facebook Pixel event
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Contact', {
        content_category: 'contact_action',
        content_name: actionType,
        value: actionType === 'phone' ? 150 : actionType === 'whatsapp' ? 120 : 80,
        currency: 'TRY'
      });
    }
    
    // Track Google Tag Manager event
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'contact_action',
        contact_method: actionType,
        page_url: window.location.href,
        page_language: document.documentElement.lang || 'tr',
        conversion_value: actionType === 'phone' ? 150 : actionType === 'whatsapp' ? 120 : 80
      });
    }
    
    // Call additional onClick handler if provided
    if (onClick) {
      onClick();
    }
  };

  return (
    <a
      href={href}
      className={className}
      target={target}
      rel={rel}
      title={title}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}

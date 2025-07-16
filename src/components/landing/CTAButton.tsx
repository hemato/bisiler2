import { useState, useEffect } from 'react';
import { ArrowRight, Phone, MessageCircle, Mail, ExternalLink, Zap, Clock, CheckCircle } from 'lucide-react';

interface CTAButtonProps {
  translations: any;
  variant: 'primary' | 'secondary' | 'ghost' | 'outline';
  size: 'sm' | 'md' | 'lg' | 'xl';
  action: {
    type: 'phone' | 'whatsapp' | 'email' | 'form' | 'link';
    value: string;
    text: string;
  };
  urgency?: boolean;
  countdown?: {
    endDate: Date;
    text: string;
  };
  socialProof?: {
    count: number;
    text: string;
  };
  className?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  tracking?: {
    event: string;
    category: string;
    label: string;
  };
}

export default function CTAButton({
  translations,
  variant = 'primary',
  size = 'md',
  action,
  urgency = false,
  countdown,
  socialProof,
  className = '',
  fullWidth = false,
  disabled = false,
  tracking
}: CTAButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');

  // Countdown timer
  useEffect(() => {
    if (countdown) {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdown.endDate.getTime() - now;
        
        if (distance < 0) {
          setTimeLeft('Süresi doldu');
          clearInterval(timer);
        } else {
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          
          setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [countdown]);

  // Handle click action
  const handleClick = () => {
    if (disabled) return;
    
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);
    
    // Track event
    if (tracking && window.gtag) {
      window.gtag('event', tracking.event, {
        event_category: tracking.category,
        event_label: tracking.label,
        value: 1
      });
    }
    
    // Perform action
    switch (action.type) {
      case 'phone':
        window.open(`tel:${action.value}`, '_self');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/${action.value}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:${action.value}`, '_self');
        break;
      case 'link':
        window.open(action.value, '_blank');
        break;
      case 'form':
        // Scroll to form or open form modal
        const formElement = document.getElementById(action.value);
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      default:
        break;
    }
  };

  // Get icon for action type
  const getActionIcon = () => {
    switch (action.type) {
      case 'phone':
        return <Phone className="w-4 h-4" />;
      case 'whatsapp':
        return <MessageCircle className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'link':
        return <ExternalLink className="w-4 h-4" />;
      default:
        return <ArrowRight className="w-4 h-4" />;
    }
  };

  // Get button styles
  const getButtonStyles = () => {
    const baseStyles = 'relative inline-flex items-center justify-center font-semibold transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const variantStyles = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-lg hover:shadow-xl',
      secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500 shadow-lg hover:shadow-xl',
      ghost: 'bg-transparent text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
      outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white focus:ring-primary-500'
    };
    
    const sizeStyles = {
      sm: 'px-4 py-2 text-sm rounded-lg',
      md: 'px-6 py-3 text-base rounded-lg',
      lg: 'px-8 py-4 text-lg rounded-xl',
      xl: 'px-10 py-5 text-xl rounded-xl'
    };
    
    const urgencyStyles = urgency ? 'animate-pulse border-2 border-red-400' : '';
    const clickedStyles = isClicked ? 'scale-95' : 'hover:scale-105';
    const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
    const widthStyles = fullWidth ? 'w-full' : '';
    
    return `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${urgencyStyles} ${clickedStyles} ${disabledStyles} ${widthStyles} ${className}`;
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={disabled}
        className={getButtonStyles()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Urgency indicator */}
        {urgency && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
        )}
        
        {/* Button content */}
        <div className="flex items-center space-x-2">
          {getActionIcon()}
          <span>{action.text}</span>
          {urgency && <Zap className="w-4 h-4 text-yellow-300" />}
        </div>
        
        {/* Countdown overlay */}
        {countdown && timeLeft && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
            <Clock className="w-3 h-3 inline mr-1" />
            {timeLeft}
          </div>
        )}
      </button>
      
      {/* Social proof */}
      {socialProof && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex items-center text-xs text-gray-500 whitespace-nowrap">
          <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
          <span>{socialProof.count.toLocaleString()} {socialProof.text}</span>
        </div>
      )}
      
      {/* Hover tooltip */}
      {isHovered && (
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
          {translations.cta?.tooltips?.[action.type] || 'Tıklayın'}
        </div>
      )}
    </div>
  );
}
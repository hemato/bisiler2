import { useState, useEffect } from 'react';
import { Clock, Zap, Gift } from 'lucide-react';

interface CountdownTimerProps {
  translations: any;
  endDate?: Date;
  durationHours?: number;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaAction?: () => void;
  variant?: 'promo' | 'urgency' | 'launch';
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({
  translations,
  endDate,
  durationHours = 24,
  title,
  subtitle,
  ctaText,
  ctaAction,
  variant = 'promo',
  className = ""
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isExpired, setIsExpired] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show timer after 2 seconds
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    const targetDate = endDate || new Date(Date.now() + durationHours * 60 * 60 * 1000);
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        setIsExpired(true);
        clearInterval(timer);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate, durationHours]);

  const getVariantStyles = () => {
    switch (variant) {
      case 'urgency':
        return {
          containerBg: 'bg-gradient-to-r from-red-500 to-orange-500',
          textColor: 'text-white',
          timerBg: 'bg-white/20',
          timerText: 'text-white',
          ctaBg: 'bg-white text-red-600 hover:bg-gray-100'
        };
      case 'launch':
        return {
          containerBg: 'bg-gradient-to-r from-purple-600 to-blue-600',
          textColor: 'text-white',
          timerBg: 'bg-white/20',
          timerText: 'text-white',
          ctaBg: 'bg-white text-purple-600 hover:bg-gray-100'
        };
      default: // promo
        return {
          containerBg: 'bg-gradient-to-r from-green-500 to-teal-500',
          textColor: 'text-white',
          timerBg: 'bg-white/20',
          timerText: 'text-white',
          ctaBg: 'bg-white text-green-600 hover:bg-gray-100'
        };
    }
  };

  const getVariantIcon = () => {
    switch (variant) {
      case 'urgency':
        return <Zap className="w-6 h-6" />;
      case 'launch':
        return <Clock className="w-6 h-6" />;
      default:
        return <Gift className="w-6 h-6" />;
    }
  };

  const styles = getVariantStyles();

  if (!isVisible || isExpired) {
    return null;
  }

  return (
    <div className={`${styles.containerBg} ${styles.textColor} p-6 rounded-xl shadow-lg animate-fade-in ${className}`}>
      <div className="text-center">
        {/* Header */}
        <div className="flex items-center justify-center mb-4">
          {getVariantIcon()}
          <h3 className="text-2xl font-bold ml-2">
            {title || translations.countdown?.title || 'Sınırlı Süre Fırsatı!'}
          </h3>
        </div>

        {subtitle && (
          <p className="text-lg mb-6 opacity-90">
            {subtitle}
          </p>
        )}

        {/* Countdown Display */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {/* Days */}
          <div className={`${styles.timerBg} rounded-lg p-4`}>
            <div className={`text-3xl font-bold ${styles.timerText}`}>
              {String(timeLeft.days).padStart(2, '0')}
            </div>
            <div className={`text-sm ${styles.timerText} opacity-80`}>
              {translations.countdown?.days || 'Gün'}
            </div>
          </div>

          {/* Hours */}
          <div className={`${styles.timerBg} rounded-lg p-4`}>
            <div className={`text-3xl font-bold ${styles.timerText}`}>
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <div className={`text-sm ${styles.timerText} opacity-80`}>
              {translations.countdown?.hours || 'Saat'}
            </div>
          </div>

          {/* Minutes */}
          <div className={`${styles.timerBg} rounded-lg p-4`}>
            <div className={`text-3xl font-bold ${styles.timerText}`}>
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div className={`text-sm ${styles.timerText} opacity-80`}>
              {translations.countdown?.minutes || 'Dakika'}
            </div>
          </div>

          {/* Seconds */}
          <div className={`${styles.timerBg} rounded-lg p-4`}>
            <div className={`text-3xl font-bold ${styles.timerText} animate-pulse`}>
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className={`text-sm ${styles.timerText} opacity-80`}>
              {translations.countdown?.seconds || 'Saniye'}
            </div>
          </div>
        </div>

        {/* CTA Button */}
        {ctaAction && (
          <button
            onClick={ctaAction}
            className={`${styles.ctaBg} px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg`}
          >
            {ctaText || translations.countdown?.cta || 'Hemen Fırsatı Yakala!'}
          </button>
        )}

        {/* Additional Info */}
        <div className="mt-4 text-sm opacity-80">
          <p>
            {translations.countdown?.disclaimer || 'Bu fırsat sona erdiğinde tekrar sunulmayacaktır.'}
          </p>
        </div>
      </div>
    </div>
  );
}
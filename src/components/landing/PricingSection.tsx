import { useState } from 'react';
import { Check, X, Star, Zap, Crown, Shield, Clock } from 'lucide-react';

interface PricingPackage {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  currency: string;
  duration: string;
  description: string;
  features: string[];
  notIncluded?: string[];
  popular?: boolean;
  recommended?: boolean;
  badge?: string;
  buttonText?: string;
  buttonVariant?: 'primary' | 'secondary' | 'outline';
  discount?: number;
  savings?: string;
}

interface PricingSectionProps {
  translations: any;
  packages: PricingPackage[];
  title: string;
  subtitle: string;
  billingToggle?: boolean;
  onPackageSelect: (packageId: string) => void;
  className?: string;
}

export default function PricingSection({
  translations,
  packages,
  title,
  subtitle,
  billingToggle = false,
  onPackageSelect,
  className = ''
}: PricingSectionProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [hoveredPackage, setHoveredPackage] = useState<string | null>(null);

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'popular':
        return <Star className="w-4 h-4" />;
      case 'recommended':
        return <Crown className="w-4 h-4" />;
      case 'best-value':
        return <Zap className="w-4 h-4" />;
      case 'premium':
        return <Shield className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'popular':
        return 'bg-blue-500';
      case 'recommended':
        return 'bg-purple-500';
      case 'best-value':
        return 'bg-green-500';
      case 'premium':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getPackageCardStyles = (pkg: PricingPackage) => {
    const baseStyles = 'relative bg-white rounded-2xl border transition-all duration-300 transform hover:scale-105 hover:shadow-2xl';
    
    if (pkg.popular || pkg.recommended) {
      return `${baseStyles} border-primary-500 shadow-lg ring-2 ring-primary-500 ring-opacity-50`;
    }
    
    if (hoveredPackage === pkg.id) {
      return `${baseStyles} border-primary-300 shadow-lg`;
    }
    
    return `${baseStyles} border-gray-200 shadow-sm`;
  };

  const getButtonStyles = (variant: string = 'primary') => {
    const baseStyles = 'w-full py-4 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105';
    
    switch (variant) {
      case 'primary':
        return `${baseStyles} bg-primary-600 text-white hover:bg-primary-700 shadow-lg`;
      case 'secondary':
        return `${baseStyles} bg-gray-100 text-gray-700 hover:bg-gray-200`;
      case 'outline':
        return `${baseStyles} border-2 border-primary-600 text-primary-600 hover:bg-primary-50`;
      default:
        return `${baseStyles} bg-primary-600 text-white hover:bg-primary-700`;
    }
  };

  return (
    <div className={`py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
          
          {/* Billing Toggle */}
          {billingToggle && (
            <div className="mt-8 flex items-center justify-center">
              <div className="bg-gray-100 rounded-full p-1 flex">
                <button
                  onClick={() => setBillingPeriod('monthly')}
                  className={`px-6 py-2 rounded-full font-medium transition-colors ${
                    billingPeriod === 'monthly' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {translations.pricing?.monthly || 'Aylık'}
                </button>
                <button
                  onClick={() => setBillingPeriod('yearly')}
                  className={`px-6 py-2 rounded-full font-medium transition-colors ${
                    billingPeriod === 'yearly' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {translations.pricing?.yearly || 'Yıllık'}
                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {translations.pricing?.save || '%20 Tasarruf'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={getPackageCardStyles(pkg)}
              onMouseEnter={() => setHoveredPackage(pkg.id)}
              onMouseLeave={() => setHoveredPackage(null)}
            >
              {/* Badge */}
              {pkg.badge && (
                <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 ${getBadgeColor(pkg.badge)} text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1`}>
                  {getBadgeIcon(pkg.badge)}
                  <span>{translations.pricing?.badges?.[pkg.badge] || pkg.badge}</span>
                </div>
              )}

              <div className="p-8">
                {/* Package Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                  <p className="text-gray-600 mb-4">{pkg.description}</p>
                  
                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-center justify-center">
                      {pkg.originalPrice && (
                        <span className="text-2xl text-gray-400 line-through mr-2">
                          {pkg.currency}{pkg.originalPrice}
                        </span>
                      )}
                      <span className="text-5xl font-bold text-gray-900">
                        {pkg.currency}{pkg.price}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-2">{pkg.duration}</p>
                    
                    {/* Discount */}
                    {pkg.discount && (
                      <div className="mt-2 inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                        %{pkg.discount} {translations.pricing?.discount || 'İndirim'}
                      </div>
                    )}
                    
                    {/* Savings */}
                    {pkg.savings && (
                      <div className="mt-2 text-green-600 font-medium">
                        {pkg.savings} {translations.pricing?.savings || 'tasarruf'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-8">
                  <ul className="space-y-3">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                    
                    {pkg.notIncluded && pkg.notIncluded.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <X className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => onPackageSelect(pkg.id)}
                  className={getButtonStyles(pkg.buttonVariant)}
                >
                  {pkg.buttonText || translations.pricing?.selectPackage || 'Paketi Seç'}
                </button>

                {/* Additional Info */}
                <div className="mt-4 text-center text-xs text-gray-500">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{translations.pricing?.instantAccess || 'Anında erişim'}</span>
                    </div>
                    <div className="flex items-center">
                      <Shield className="w-3 h-3 mr-1" />
                      <span>{translations.pricing?.moneyBack || '30 gün garanti'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {translations.pricing?.stillUnsure || 'Hala emin değil misiniz?'}
            </h3>
            <p className="text-gray-600 mb-6">
              {translations.pricing?.freeConsultation || 'Ücretsiz danışmanlık alın ve size en uygun paketi belirleyin'}
            </p>
            <button
              onClick={() => onPackageSelect('consultation')}
              className="bg-white text-primary-600 border-2 border-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              {translations.pricing?.bookConsultation || 'Ücretsiz Danışmanlık Al'}
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            {translations.pricing?.faqTitle || 'Sık Sorulan Sorular'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-2">
                {translations.pricing?.faq?.payment || 'Ödeme nasıl yapılır?'}
              </h4>
              <p className="text-gray-600 text-sm">
                {translations.pricing?.faq?.paymentAnswer || 'Kredi kartı, banka havalesi veya kapıda ödeme seçenekleri mevcuttur.'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-2">
                {translations.pricing?.faq?.refund || 'Para iade garantisi var mı?'}
              </h4>
              <p className="text-gray-600 text-sm">
                {translations.pricing?.faq?.refundAnswer || 'Evet, 30 gün içinde %100 para iade garantisi sunuyoruz.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
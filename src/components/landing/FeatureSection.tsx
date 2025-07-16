import { useState } from 'react';
import { Check, ArrowRight, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';

interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
  benefits: string[];
  image?: string;
  video?: string;
  demo?: string;
}

interface FeatureSectionProps {
  translations: any;
  features: Feature[];
  title: string;
  subtitle: string;
  layout: 'grid' | 'tabs' | 'accordion' | 'carousel';
  variant?: 'default' | 'centered' | 'alternating' | 'cards';
  showNumbers?: boolean;
  showBenefits?: boolean;
  className?: string;
}

export default function FeatureSection({
  translations,
  features,
  title,
  subtitle,
  layout = 'grid',
  variant = 'default',
  showNumbers = false,
  showBenefits = true,
  className = ''
}: FeatureSectionProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const renderIcon = (iconName: string) => {
    // This would typically be replaced with actual icon components
    return (
      <div className="w-6 h-6 flex items-center justify-center">
        <span className="text-2xl">{iconName}</span>
      </div>
    );
  };

  const FeatureCard = ({ feature, index }: { feature: Feature; index: number }) => (
    <div className={`group ${variant === 'cards' ? 'bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow' : 'p-6'}`}>
      {/* Number */}
      {showNumbers && (
        <div className="flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full font-bold text-lg mb-4">
          {index + 1}
        </div>
      )}
      
      {/* Icon */}
      <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-lg mb-4 group-hover:bg-primary-200 transition-colors">
        {renderIcon(feature.icon)}
      </div>
      
      {/* Content */}
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
      <p className="text-gray-600 mb-4">{feature.description}</p>
      
      {/* Benefits */}
      {showBenefits && feature.benefits && (
        <ul className="space-y-2 mb-4">
          {feature.benefits.map((benefit, idx) => (
            <li key={idx} className="flex items-start">
              <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">{benefit}</span>
            </li>
          ))}
        </ul>
      )}
      
      {/* Media */}
      {feature.image && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <img 
            src={feature.image} 
            alt={feature.title}
            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      {feature.video && (
        <div className="mb-4 relative">
          <div className="bg-gray-900 rounded-lg p-4 text-center">
            <button
              onClick={() => setPlayingVideo(playingVideo === feature.id ? null : feature.id)}
              className="flex items-center justify-center w-12 h-12 bg-primary-600 text-white rounded-full mx-auto hover:bg-primary-700 transition-colors"
            >
              {playingVideo === feature.id ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            <p className="text-white mt-2 text-sm">{translations.features?.watchDemo || 'Demo İzle'}</p>
          </div>
        </div>
      )}
      
      {/* Demo Link */}
      {feature.demo && (
        <div className="mt-4">
          <a
            href={feature.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            {translations.features?.tryDemo || 'Demo Dene'}
            <ArrowRight className="w-4 h-4 ml-1" />
          </a>
        </div>
      )}
    </div>
  );

  const renderGrid = () => (
    <div className={`grid gap-8 ${
      variant === 'cards' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    }`}>
      {features.map((feature, index) => (
        <FeatureCard key={feature.id} feature={feature} index={index} />
      ))}
    </div>
  );

  const renderTabs = () => (
    <div>
      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center mb-8 border-b border-gray-200">
        {features.map((feature, index) => (
          <button
            key={feature.id}
            onClick={() => setActiveTab(index)}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === index
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {feature.title}
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      <div className="max-w-4xl mx-auto">
        <FeatureCard feature={features[activeTab]} index={activeTab} />
      </div>
    </div>
  );

  const renderAccordion = () => (
    <div className="max-w-4xl mx-auto space-y-4">
      {features.map((feature, index) => (
        <div key={feature.id} className="border border-gray-200 rounded-lg">
          <button
            onClick={() => setActiveAccordion(activeAccordion === feature.id ? null : feature.id)}
            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              {showNumbers && (
                <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold mr-4">
                  {index + 1}
                </span>
              )}
              <div className="flex items-center mr-4">
                {renderIcon(feature.icon)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </div>
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
              activeAccordion === feature.id ? 'rotate-90' : ''
            }`} />
          </button>
          
          {activeAccordion === feature.id && (
            <div className="px-6 pb-4">
              <FeatureCard feature={feature} index={index} />
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderCarousel = () => (
    <div className="relative max-w-4xl mx-auto">
      {/* Carousel Content */}
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {features.map((feature, index) => (
            <div key={feature.id} className="w-full flex-shrink-0">
              <FeatureCard feature={feature} index={index} />
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
          disabled={currentSlide === 0}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        {/* Dots */}
        <div className="flex space-x-2">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentSlide === index ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        
        <button
          onClick={() => setCurrentSlide(Math.min(features.length - 1, currentSlide + 1))}
          disabled={currentSlide === features.length - 1}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );

  const renderAlternating = () => (
    <div className="space-y-16">
      {features.map((feature, index) => (
        <div key={feature.id} className={`flex items-center ${
          index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
        } gap-12`}>
          <div className="flex-1">
            <FeatureCard feature={feature} index={index} />
          </div>
          {feature.image && (
            <div className="flex-1">
              <img 
                src={feature.image} 
                alt={feature.title}
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (layout) {
      case 'tabs':
        return renderTabs();
      case 'accordion':
        return renderAccordion();
      case 'carousel':
        return renderCarousel();
      default:
        return variant === 'alternating' ? renderAlternating() : renderGrid();
    }
  };

  return (
    <div className={`py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
        </div>
        
        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
}
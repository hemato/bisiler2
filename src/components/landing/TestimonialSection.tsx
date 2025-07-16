import { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  rating: number;
  content: string;
  results?: string[];
  video?: string;
  verified?: boolean;
  date?: string;
  tags?: string[];
}

interface TestimonialSectionProps {
  translations: any;
  testimonials: Testimonial[];
  title: string;
  subtitle: string;
  layout: 'grid' | 'carousel' | 'masonry' | 'featured';
  showRating?: boolean;
  showResults?: boolean;
  showVideo?: boolean;
  autoPlay?: boolean;
  className?: string;
}

export default function TestimonialSection({
  translations,
  testimonials,
  title,
  subtitle,
  layout = 'grid',
  showRating = true,
  showResults = true,
  showVideo = false,
  autoPlay = false,
  className = ''
}: TestimonialSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [autoPlayActive, setAutoPlayActive] = useState(autoPlay);

  // Auto-play functionality
  useEffect(() => {
    if (autoPlayActive && layout === 'carousel') {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [autoPlayActive, testimonials.length, layout]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const TestimonialCard = ({ testimonial, featured = false }: { testimonial: Testimonial; featured?: boolean }) => (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow ${
      featured ? 'ring-2 ring-primary-500' : ''
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-12 h-12 rounded-full object-cover mr-4"
          />
          <div>
            <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
            <p className="text-sm text-gray-600">{testimonial.title}</p>
            <p className="text-sm text-primary-600 font-medium">{testimonial.company}</p>
          </div>
        </div>
        
        {/* Verified badge */}
        {testimonial.verified && (
          <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {translations.testimonials?.verified || 'Doğrulanmış'}
          </div>
        )}
      </div>

      {/* Rating */}
      {showRating && (
        <div className="flex items-center mb-4">
          <div className="flex mr-2">
            {renderStars(testimonial.rating)}
          </div>
          <span className="text-sm text-gray-600">
            {testimonial.rating}/5
          </span>
          {testimonial.date && (
            <span className="text-sm text-gray-400 ml-2">
              • {testimonial.date}
            </span>
          )}
        </div>
      )}

      {/* Quote */}
      <div className="relative mb-4">
        <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary-200" />
        <blockquote className="text-gray-700 italic pl-6">
          "{testimonial.content}"
        </blockquote>
      </div>

      {/* Results */}
      {showResults && testimonial.results && (
        <div className="mb-4">
          <h5 className="font-medium text-gray-900 mb-2">
            {translations.testimonials?.results || 'Elde Edilen Sonuçlar:'}
          </h5>
          <ul className="space-y-1">
            {testimonial.results.map((result, index) => (
              <li key={index} className="text-sm text-green-600 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {result}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Video */}
      {showVideo && testimonial.video && (
        <div className="mb-4">
          <div className="bg-gray-900 rounded-lg p-4 text-center">
            <button
              onClick={() => setPlayingVideo(playingVideo === testimonial.id ? null : testimonial.id)}
              className="flex items-center justify-center w-12 h-12 bg-primary-600 text-white rounded-full mx-auto hover:bg-primary-700 transition-colors"
            >
              {playingVideo === testimonial.id ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            <p className="text-white mt-2 text-sm">
              {translations.testimonials?.watchVideo || 'Video Yorumu İzle'}
            </p>
          </div>
        </div>
      )}

      {/* Tags */}
      {testimonial.tags && (
        <div className="flex flex-wrap gap-2">
          {testimonial.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  const renderGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {testimonials.map((testimonial) => (
        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
      ))}
    </div>
  );

  const renderCarousel = () => (
    <div className="relative">
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="p-2 rounded-full bg-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        {/* Auto-play control */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setAutoPlayActive(!autoPlayActive)}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
          >
            {autoPlayActive ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
            {autoPlayActive ? 'Durdur' : 'Otomatik Oynat'}
          </button>
          
          {/* Dots */}
          <div className="flex space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentIndex === index ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
        
        <button
          onClick={() => setCurrentIndex(Math.min(testimonials.length - 1, currentIndex + 1))}
          disabled={currentIndex === testimonials.length - 1}
          className="p-2 rounded-full bg-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );

  const renderMasonry = () => (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
      {testimonials.map((testimonial) => (
        <div key={testimonial.id} className="break-inside-avoid mb-6">
          <TestimonialCard testimonial={testimonial} />
        </div>
      ))}
    </div>
  );

  const renderFeatured = () => (
    <div className="space-y-8">
      {/* Featured testimonial */}
      <div className="max-w-4xl mx-auto">
        <TestimonialCard testimonial={testimonials[0]} featured={true} />
      </div>
      
      {/* Other testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.slice(1, 5).map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (layout) {
      case 'carousel':
        return renderCarousel();
      case 'masonry':
        return renderMasonry();
      case 'featured':
        return renderFeatured();
      default:
        return renderGrid();
    }
  };

  return (
    <div className={`py-16 bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
          
          {/* Overall rating */}
          <div className="mt-6 flex items-center justify-center">
            <div className="flex mr-2">
              {renderStars(5)}
            </div>
            <span className="text-lg font-semibold text-gray-900 mr-2">4.9/5</span>
            <span className="text-gray-600">
              ({testimonials.length} {translations.testimonials?.reviews || 'değerlendirme'})
            </span>
          </div>
        </div>
        
        {/* Content */}
        {renderContent()}
        
        {/* CTA */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {translations.testimonials?.ctaTitle || 'Siz de Başarı Hikayenizi Yazın'}
            </h3>
            <p className="text-gray-600 mb-6">
              {translations.testimonials?.ctaSubtitle || 'Müşterilerimizin başarısı bizim motivasyonumuz. Siz de bu başarıya ortak olun.'}
            </p>
            <button className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
              {translations.testimonials?.ctaButton || 'Hemen Başlayın'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
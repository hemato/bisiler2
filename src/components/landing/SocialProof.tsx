import { useState, useEffect } from 'react';
import { Users, CheckCircle, Award, Shield, Clock, Eye, TrendingUp, Star, MapPin } from 'lucide-react';

interface SocialProofProps {
  translations: any;
  variant: 'stats' | 'logos' | 'live-activity' | 'trust-badges' | 'media-mentions' | 'certifications';
  data: any;
  className?: string;
}

export default function SocialProof({ translations, variant, data, className = '' }: SocialProofProps) {
  const [liveCount, setLiveCount] = useState(0);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);

  // Simulate live activity updates
  useEffect(() => {
    if (variant === 'live-activity') {
      const interval = setInterval(() => {
        setLiveCount(prev => prev + Math.floor(Math.random() * 3));
        
        // Add new activity
        const activities = [
          { name: 'Ahmet K.', action: 'form_submitted', location: 'İstanbul', time: 'şimdi' },
          { name: 'Zeynep M.', action: 'quote_requested', location: 'Ankara', time: '2 dk önce' },
          { name: 'Can S.', action: 'consultation_booked', location: 'İzmir', time: '5 dk önce' },
          { name: 'Elif T.', action: 'package_purchased', location: 'Bursa', time: '8 dk önce' }
        ];
        
        setRecentActivities(prev => [
          activities[Math.floor(Math.random() * activities.length)],
          ...prev.slice(0, 4)
        ]);
      }, 8000);
      
      return () => clearInterval(interval);
    }
  }, [variant]);

  // Rotate activities
  useEffect(() => {
    if (recentActivities.length > 0) {
      const interval = setInterval(() => {
        setCurrentActivityIndex(prev => (prev + 1) % recentActivities.length);
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [recentActivities.length]);

  const renderStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {data.stats.map((stat: any, index: number) => (
        <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {stat.icon === 'users' && <Users className="w-6 h-6 text-primary-600" />}
            {stat.icon === 'check' && <CheckCircle className="w-6 h-6 text-green-600" />}
            {stat.icon === 'award' && <Award className="w-6 h-6 text-yellow-600" />}
            {stat.icon === 'trending' && <TrendingUp className="w-6 h-6 text-blue-600" />}
            {stat.icon === 'clock' && <Clock className="w-6 h-6 text-purple-600" />}
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
          <div className="text-sm text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
  );

  const renderLogos = () => (
    <div className="text-center">
      <h3 className="text-lg font-semibold text-gray-900 mb-8">
        {translations.socialProof?.trustedBy || 'Güvenilir Markalar Tarafından Tercih Ediliyor'}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60 hover:opacity-80 transition-opacity">
        {data.logos.map((logo: any, index: number) => (
          <div key={index} className="flex items-center justify-center">
            <img
              src={logo.src}
              alt={logo.alt}
              className="max-h-12 w-auto grayscale hover:grayscale-0 transition-all"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderLiveActivity = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">
          {translations.socialProof?.liveActivity || 'Canlı Aktivite'}
        </h3>
        <div className="flex items-center text-green-600 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          <span>{liveCount} {translations.socialProof?.online || 'çevrimiçi'}</span>
        </div>
      </div>
      
      <div className="space-y-3">
        {recentActivities.slice(0, 3).map((activity, index) => (
          <div
            key={index}
            className={`flex items-center p-3 rounded-lg transition-all ${
              index === currentActivityIndex ? 'bg-primary-50 border border-primary-200' : 'bg-gray-50'
            }`}
          >
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
              {activity.action === 'form_submitted' && <CheckCircle className="w-4 h-4 text-green-600" />}
              {activity.action === 'quote_requested' && <Eye className="w-4 h-4 text-blue-600" />}
              {activity.action === 'consultation_booked' && <Clock className="w-4 h-4 text-purple-600" />}
              {activity.action === 'package_purchased' && <Award className="w-4 h-4 text-yellow-600" />}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">{activity.name}</div>
              <div className="text-xs text-gray-600 flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {activity.location} • {activity.time}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center text-xs text-gray-500">
        {translations.socialProof?.recentActivity || 'Son aktiviteler'}
      </div>
    </div>
  );

  const renderTrustBadges = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {data.badges.map((badge: any, index: number) => (
        <div key={index} className="text-center p-4 bg-white rounded-lg shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            {badge.icon === 'shield' && <Shield className="w-8 h-8 text-green-600" />}
            {badge.icon === 'award' && <Award className="w-8 h-8 text-yellow-600" />}
            {badge.icon === 'check' && <CheckCircle className="w-8 h-8 text-blue-600" />}
            {badge.icon === 'star' && <Star className="w-8 h-8 text-purple-600" />}
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">{badge.title}</h4>
          <p className="text-xs text-gray-600">{badge.description}</p>
        </div>
      ))}
    </div>
  );

  const renderMediaMentions = () => (
    <div className="text-center">
      <h3 className="text-lg font-semibold text-gray-900 mb-8">
        {translations.socialProof?.mediaTitle || 'Medyada Bizden Bahsedilenler'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.mentions.map((mention: any, index: number) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-center mb-4">
              <img
                src={mention.logo}
                alt={mention.publication}
                className="max-h-8 w-auto"
              />
            </div>
            <blockquote className="text-gray-700 italic mb-4">
              "{mention.quote}"
            </blockquote>
            <div className="text-sm text-gray-500">
              {mention.publication} • {mention.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCertifications = () => (
    <div className="text-center">
      <h3 className="text-lg font-semibold text-gray-900 mb-8">
        {translations.socialProof?.certifications || 'Sertifikalar ve Ödüller'}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {data.certifications.map((cert: any, index: number) => (
          <div key={index} className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-10 h-10 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">{cert.title}</h4>
            <p className="text-xs text-gray-600 mb-2">{cert.issuer}</p>
            <p className="text-xs text-gray-500">{cert.date}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (variant) {
      case 'stats':
        return renderStats();
      case 'logos':
        return renderLogos();
      case 'live-activity':
        return renderLiveActivity();
      case 'trust-badges':
        return renderTrustBadges();
      case 'media-mentions':
        return renderMediaMentions();
      case 'certifications':
        return renderCertifications();
      default:
        return renderStats();
    }
  };

  return (
    <div className={`py-16 ${variant === 'logos' ? 'bg-gray-50' : 'bg-white'} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </div>
    </div>
  );
}
// Google Analytics 4 Configuration
export const ANALYTICS_CONFIG = {
  // Google Analytics 4
  ga4: {
    measurementId: 'G-XXXXXXXXXX', // Replace with your GA4 Measurement ID
    enabled: true,
    debugMode: false, // Set to true for development
    anonymizeIp: true,
    
    // Enhanced Ecommerce Events
    events: {
      // Form Events
      formSubmit: 'form_submit',
      formStart: 'form_start',
      formComplete: 'form_complete',
      
      // Contact Events
      phoneClick: 'phone_click',
      whatsappClick: 'whatsapp_click',
      emailClick: 'email_click',
      
      // Landing Page Events
      landingPageView: 'landing_page_view',
      ctaClick: 'cta_click',
      
      // Service Events
      serviceView: 'service_view',
      serviceInquiry: 'service_inquiry',
      
      // Custom Events
      scrollDepth: 'scroll_depth',
      videoPlay: 'video_play',
      fileDownload: 'file_download'
    },
    
    // Custom Parameters
    customParameters: {
      page_language: 'page_language',
      page_type: 'page_type',
      form_type: 'form_type',
      service_category: 'service_category',
      campaign_source: 'campaign_source'
    }
  },
  
  // Google Tag Manager
  gtm: {
    containerId: 'GTM-XXXXXXX', // Replace with your GTM Container ID
    enabled: true,
    
    // Data Layer Events
    dataLayerEvents: {
      pageView: 'page_view',
      formSubmission: 'form_submission',
      contactAction: 'contact_action',
      serviceInteraction: 'service_interaction'
    }
  },
  
  // Facebook Pixel
  fbPixel: {
    pixelId: '1234567890123456', // Replace with your Facebook Pixel ID
    enabled: true,
    
    // Facebook Events
    events: {
      pageView: 'PageView',
      lead: 'Lead',
      contact: 'Contact',
      completeRegistration: 'CompleteRegistration',
      viewContent: 'ViewContent',
      initiateCheckout: 'InitiateCheckout'
    }
  },
  
  // Conversion Tracking
  conversions: {
    // Google Ads Conversion IDs
    googleAds: {
      formSubmit: 'AW-XXXXXXXXX/XXXXXXXXX',
      phoneCall: 'AW-XXXXXXXXX/XXXXXXXXX',
      whatsappClick: 'AW-XXXXXXXXX/XXXXXXXXX'
    },
    
    // Goal Values (in TRY)
    goalValues: {
      formSubmit: 100,
      phoneCall: 150,
      whatsappClick: 120,
      emailClick: 80
    }
  },
  
  // UTM Parameters
  utm: {
    source: 'utm_source',
    medium: 'utm_medium',
    campaign: 'utm_campaign',
    term: 'utm_term',
    content: 'utm_content'
  }
};

// Analytics Helper Functions
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...parameters,
      timestamp: new Date().toISOString()
    });
  }
};

export const trackConversion = (conversionId: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: conversionId,
      value: value || 0,
      currency: 'TRY'
    });
  }
};

export const trackFormSubmit = (formType: string, formData: any) => {
  const eventData = {
    event_category: 'form',
    event_label: formType,
    form_type: formType,
    page_language: document.documentElement.lang || 'tr',
    ...formData
  };
  
  trackEvent(ANALYTICS_CONFIG.ga4.events.formSubmit, eventData);
  
  // Track conversion
  const conversionId = ANALYTICS_CONFIG.conversions.googleAds.formSubmit;
  const goalValue = ANALYTICS_CONFIG.conversions.goalValues.formSubmit;
  trackConversion(conversionId, goalValue);
};

export const trackContactAction = (actionType: 'phone' | 'whatsapp' | 'email') => {
  const eventData = {
    event_category: 'contact',
    event_label: actionType,
    page_language: document.documentElement.lang || 'tr',
    page_url: window.location.href
  };
  
  trackEvent(ANALYTICS_CONFIG.ga4.events[`${actionType}Click`], eventData);
  
  // Track conversion - map action types to correct keys
  const conversionKeyMap = {
    phone: 'phoneCall',
    whatsapp: 'whatsappClick',
    email: 'emailClick'
  };
  
  const goalValueKeyMap = {
    phone: 'phoneCall',
    whatsapp: 'whatsappClick',
    email: 'emailClick'
  };
  
  const conversionKey = conversionKeyMap[actionType] as keyof typeof ANALYTICS_CONFIG.conversions.googleAds;
  const goalValueKey = goalValueKeyMap[actionType] as keyof typeof ANALYTICS_CONFIG.conversions.goalValues;
  
  const conversionId = ANALYTICS_CONFIG.conversions.googleAds[conversionKey];
  const goalValue = ANALYTICS_CONFIG.conversions.goalValues[goalValueKey];
  
  if (conversionId) {
    trackConversion(conversionId, goalValue);
  }
};

export const trackPageView = (pageTitle: string, pageType: string) => {
  const eventData = {
    page_title: pageTitle,
    page_type: pageType,
    page_language: document.documentElement.lang || 'tr',
    page_url: window.location.href
  };
  
  trackEvent(ANALYTICS_CONFIG.ga4.events.landingPageView, eventData);
};

// UTM Parameter Helper
export const getUTMParameters = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  
  const urlParams = new URLSearchParams(window.location.search);
  const utm = ANALYTICS_CONFIG.utm;
  
  return {
    source: urlParams.get(utm.source) || 'direct',
    medium: urlParams.get(utm.medium) || 'none',
    campaign: urlParams.get(utm.campaign) || 'none',
    term: urlParams.get(utm.term) || 'none',
    content: urlParams.get(utm.content) || 'none'
  };
};

// Store UTM parameters in session storage
export const storeUTMParameters = () => {
  if (typeof window === 'undefined') return;
  
  const utm = getUTMParameters();
  sessionStorage.setItem('utm_parameters', JSON.stringify(utm));
};

// Get stored UTM parameters
export const getStoredUTMParameters = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  
  const stored = sessionStorage.getItem('utm_parameters');
  return stored ? JSON.parse(stored) : {};
};

// Global gtag interface
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void;
    dataLayer: any[];
    fbq: (command: string, eventName: string, parameters?: any) => void;
  }
}

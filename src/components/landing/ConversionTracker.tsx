import { useEffect, useState } from 'react';

interface ConversionTrackerProps {
  pageType: 'website' | 'crm';
  variant?: 'A' | 'B';
  userId?: string;
}

interface ConversionEvent {
  eventType: 'page_view' | 'form_start' | 'form_submit' | 'cta_click' | 'phone_call' | 'whatsapp_click' | 'heatmap_data' | 'performance_metrics';
  pageType: string;
  variant: string;
  timestamp: number;
  userId?: string;
  sessionId?: string;
  metadata?: any;
}

export default function ConversionTracker({ pageType, variant = 'A', userId }: ConversionTrackerProps) {
  const [sessionId] = useState(() => Math.random().toString(36).substr(2, 9));
  const [events, setEvents] = useState<ConversionEvent[]>([]);

  // Track page view on component mount
  useEffect(() => {
    trackEvent('page_view', {
      url: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      timestamp: Date.now()
    });
  }, []);

  // Track events
  const trackEvent = (eventType: ConversionEvent['eventType'], metadata?: any) => {
    const event: ConversionEvent = {
      eventType,
      pageType,
      variant,
      timestamp: Date.now(),
      userId,
      metadata: {
        ...metadata,
        sessionId,
        url: window.location.href
      }
    };

    setEvents(prev => [...prev, event]);

    // Send to analytics
    sendToAnalytics(event);
    
    // Send to internal tracking
    sendToInternalTracking(event);
  };

  // Send to Google Analytics
  const sendToAnalytics = (event: ConversionEvent) => {
    if (window.gtag) {
      window.gtag('event', event.eventType, {
        event_category: `landing_${event.pageType}`,
        event_label: `variant_${event.variant}`,
        custom_parameter_1: event.sessionId,
        custom_parameter_2: event.userId,
        value: getEventValue(event.eventType)
      });
    }
  };

  // Send to internal tracking API
  const sendToInternalTracking = async (event: ConversionEvent) => {
    try {
      await fetch('/api/track-conversion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.error('Failed to send tracking event:', error);
    }
  };

  // Get event value for analytics
  const getEventValue = (eventType: ConversionEvent['eventType']) => {
    const values = {
      page_view: 1,
      form_start: 5,
      form_submit: 50,
      cta_click: 10,
      phone_call: 100,
      whatsapp_click: 25,
      heatmap_data: 2,
      performance_metrics: 3
    };
    return values[eventType] || 1;
  };

  // Expose tracking function globally
  useEffect(() => {
    (window as any).trackConversion = trackEvent;
    
    // Track form interactions
    const trackFormStart = () => trackEvent('form_start');
    const trackFormSubmit = () => trackEvent('form_submit');
    const trackCTAClick = (e: Event) => {
      const target = e.target as HTMLElement;
      trackEvent('cta_click', {
        buttonText: target.innerText,
        buttonClass: target.className
      });
    };
    
    // Add event listeners
    document.addEventListener('focus', (e) => {
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
        trackFormStart();
      }
    }, { once: true });
    
    document.addEventListener('submit', trackFormSubmit);
    
    // Track CTA clicks
    document.querySelectorAll('button, a').forEach(element => {
      if (element.classList.contains('cta-button') || element.getAttribute('data-track') === 'cta') {
        element.addEventListener('click', trackCTAClick);
      }
    });
    
    return () => {
      document.removeEventListener('submit', trackFormSubmit);
      document.querySelectorAll('button, a').forEach(element => {
        element.removeEventListener('click', trackCTAClick);
      });
    };
  }, []);

  // A/B test variant selector
  const getVariant = () => {
    if (variant !== 'A') return variant;
    
    // Get variant from localStorage or randomly assign
    const storedVariant = localStorage.getItem(`ab_test_${pageType}`);
    if (storedVariant) return storedVariant;
    
    const randomVariant = Math.random() < 0.5 ? 'A' : 'B';
    localStorage.setItem(`ab_test_${pageType}`, randomVariant);
    return randomVariant;
  };

  // Heat map tracking
  useEffect(() => {
    let mouseMovements: { x: number; y: number; timestamp: number }[] = [];
    let clicks: { x: number; y: number; element: string; timestamp: number }[] = [];
    
    const trackMouseMove = (e: MouseEvent) => {
      mouseMovements.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
      });
      
      // Keep only last 100 movements
      if (mouseMovements.length > 100) {
        mouseMovements = mouseMovements.slice(-100);
      }
    };
    
    const trackClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      clicks.push({
        x: e.clientX,
        y: e.clientY,
        element: target.tagName + (target.className ? `.${target.className}` : ''),
        timestamp: Date.now()
      });
    };
    
    // Throttle mouse move tracking
    let mouseTimer: number;
    document.addEventListener('mousemove', (e) => {
      clearTimeout(mouseTimer);
      mouseTimer = window.setTimeout(() => trackMouseMove(e), 100);
    });
    
    document.addEventListener('click', trackClick);
    
    // Send heatmap data periodically
    const heatmapInterval = setInterval(() => {
      if (mouseMovements.length > 0 || clicks.length > 0) {
        trackEvent('heatmap_data', {
          mouseMovements: mouseMovements.slice(),
          clicks: clicks.slice()
        });
        mouseMovements = [];
        clicks = [];
      }
    }, 30000); // Send every 30 seconds
    
    return () => {
      clearInterval(heatmapInterval);
      document.removeEventListener('click', trackClick);
    };
  }, []);

  // Performance tracking
  useEffect(() => {
    const trackPerformance = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      trackEvent('performance_metrics', {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
        connectionType: (navigator as any).connection?.effectiveType,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      });
    };
    
    if (document.readyState === 'complete') {
      trackPerformance();
    } else {
      window.addEventListener('load', trackPerformance);
    }
  }, []);

  return (
    <>
      {/* Conversion tracking pixels */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Facebook Pixel
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', 'FB_PIXEL_ID');
            fbq('track', 'PageView', {
              content_name: '${pageType}_landing',
              content_category: 'landing_page',
              variant: '${getVariant()}'
            });
          `
        }}
      />
      
      {/* Google Ads conversion tracking */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            gtag('config', 'AW-CONVERSION_ID', {
              page_title: '${pageType} Landing Page',
              page_location: window.location.href,
              custom_parameter_1: '${getVariant()}',
              custom_parameter_2: '${sessionId}'
            });
          `
        }}
      />
      
      {/* LinkedIn Insight Tag */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            _linkedin_partner_id = "LINKEDIN_PARTNER_ID";
            window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
            window._linkedin_data_partner_ids.push(_linkedin_partner_id);
          `
        }}
      />
      
      {/* Hotjar tracking */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:HOTJAR_ID,hjsv:6};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `
        }}
      />
      
      {/* Custom tracking debug panel (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm max-h-64 overflow-auto opacity-80">
          <h4 className="font-bold mb-2">Conversion Tracking Debug</h4>
          <p>Page: {pageType}</p>
          <p>Variant: {getVariant()}</p>
          <p>Session: {sessionId}</p>
          <p>Events: {events.length}</p>
          <div className="mt-2 max-h-32 overflow-auto">
            {events.slice(-5).map((event, index) => (
              <div key={index} className="border-t border-gray-600 pt-1 mt-1">
                <div>{event.eventType}</div>
                <div className="text-gray-400">{new Date(event.timestamp).toLocaleTimeString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
import React, { useEffect, useRef } from 'react';
import {
  trackContactAction,
  trackEvent,
  getStoredUTMParameters,
  ANALYTICS_CONFIG
} from '../config/analytics';

interface TrackingWrapperProps {
  actionType: 'phone' | 'whatsapp' | 'email';
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  title?: string;
  onClick?: () => void;
  // Enhanced tracking options
  customEventName?: string;
  customParameters?: Record<string, any>;
  trackVisibility?: boolean; // Track when element becomes visible
  trackHover?: boolean; // Track hover events
}

export default function TrackingWrapper({
  actionType,
  href,
  children,
  className = '',
  target,
  rel,
  title,
  onClick,
  customEventName,
  customParameters = {},
  trackVisibility = false,
  trackHover = false
}: TrackingWrapperProps) {
  const elementRef = useRef<HTMLAnchorElement>(null);
  const hasTrackedVisibility = useRef(false);

  // Track visibility when element comes into view
  useEffect(() => {
    if (!trackVisibility || !elementRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTrackedVisibility.current) {
            hasTrackedVisibility.current = true;
            
            // Track element visibility
            trackEvent('element_visible', {
              element_type: 'contact_link',
              contact_method: actionType,
              page_url: window.location.href,
              page_language: document.documentElement.lang || 'tr',
              ...getStoredUTMParameters(),
              ...customParameters
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [actionType, trackVisibility, customParameters]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Get UTM parameters
    const utmParams = getStoredUTMParameters();
    
    // Enhanced event data
    const baseEventData = {
      contact_method: actionType,
      page_url: window.location.href,
      page_language: document.documentElement.lang || 'tr',
      element_position: getElementPosition(e.currentTarget),
      session_id: getSessionId(),
      ...utmParams,
      ...customParameters
    };

    // Track the contact action with enhanced data
    trackContactAction(actionType);
    
    // Track custom event if specified
    if (customEventName) {
      trackEvent(customEventName, baseEventData);
    }
    
    // Enhanced Facebook Pixel tracking
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Contact', {
        content_category: 'contact_action',
        content_name: actionType,
        value: getContactValue(actionType),
        currency: 'TRY',
        page_title: document.title,
        ...baseEventData
      });
      
      // Track custom Facebook event
      window.fbq('trackCustom', 'ContactMethodClick', baseEventData);
    }
    
    // Enhanced Google Tag Manager tracking
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'contact_action_enhanced',
        conversion_value: getContactValue(actionType),
        timestamp: new Date().toISOString(),
        ...baseEventData
      });
    }

    // Track performance timing
    if (window.performance && window.performance.now) {
      trackEvent('contact_interaction_timing', {
        page_load_time: Math.round(window.performance.now()),
        ...baseEventData
      });
    }
    
    // Call additional onClick handler if provided
    if (onClick) {
      onClick();
    }
  };

  const handleMouseEnter = () => {
    if (!trackHover) return;

    trackEvent('contact_hover', {
      contact_method: actionType,
      page_url: window.location.href,
      page_language: document.documentElement.lang || 'tr',
      ...getStoredUTMParameters(),
      ...customParameters
    });
  };

  return (
    <a
      ref={elementRef}
      href={href}
      className={className}
      target={target}
      rel={rel}
      title={title}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      data-analytics-action={actionType}
      data-analytics-category="contact"
    >
      {children}
    </a>
  );
}

// Helper functions
function getContactValue(actionType: 'phone' | 'whatsapp' | 'email'): number {
  const values = ANALYTICS_CONFIG.conversions.goalValues;
  switch (actionType) {
    case 'phone': return values.phoneCall;
    case 'whatsapp': return values.whatsappClick;
    case 'email': return values.emailClick;
    default: return 80;
  }
}

function getElementPosition(element: HTMLElement): Record<string, number> {
  const rect = element.getBoundingClientRect();
  return {
    x: Math.round(rect.left),
    y: Math.round(rect.top),
    width: Math.round(rect.width),
    height: Math.round(rect.height)
  };
}

function getSessionId(): string {
  if (typeof window === 'undefined') return 'unknown';
  
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

// Advanced Tracking HOC for wrapping any component
export function withAdvancedTracking<T extends object>(
  Component: React.ComponentType<T>,
  trackingConfig: {
    eventName: string;
    category: string;
    autoTrackClicks?: boolean;
    autoTrackVisibility?: boolean;
  }
) {
  return function TrackedComponent(props: T) {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!trackingConfig.autoTrackVisibility || !elementRef.current) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              trackEvent(`${trackingConfig.eventName}_visible`, {
                event_category: trackingConfig.category,
                page_url: window.location.href,
                page_language: document.documentElement.lang || 'tr',
                ...getStoredUTMParameters()
              });
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(elementRef.current);
      return () => observer.disconnect();
    }, []);

    const handleClick = () => {
      if (trackingConfig.autoTrackClicks) {
        trackEvent(`${trackingConfig.eventName}_click`, {
          event_category: trackingConfig.category,
          page_url: window.location.href,
          page_language: document.documentElement.lang || 'tr',
          ...getStoredUTMParameters()
        });
      }
    };

    return (
      <div
        ref={elementRef}
        onClick={handleClick}
        data-analytics-component={trackingConfig.eventName}
      >
        <Component {...props} />
      </div>
    );
  };
}

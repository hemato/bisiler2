import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG, SERVICE_NAMES } from '../config/email';
import type { FormType } from '../config/email';
import { trackFormSubmit, getStoredUTMParameters } from '../config/analytics';

// Initialize EmailJS
emailjs.init(EMAIL_CONFIG.service.userId);

interface FormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  services?: string[];
  message?: string;
  formType: 'contact' | 'crm-consulting' | 'website-setup';
  pageSource?: string;
  language: 'tr' | 'en';
  [key: string]: any;
}


// Get service name based on form type and language
function getServiceName(formType: string, language: string): string {
  const serviceName = SERVICE_NAMES[formType as keyof typeof SERVICE_NAMES];
  return serviceName?.[language as keyof typeof serviceName] || SERVICE_NAMES.contact[language as keyof typeof SERVICE_NAMES.contact] || 'General Contact';
}


// Create detailed form information for admin
function createFormDetails(formData: FormData): string {
  const { formType, language, pageSource } = formData;
  
  let details = `Form Type: ${formType}\nLanguage: ${language}\nPage Source: ${pageSource || 'Unknown'}\n\n`;
  
  // Add specific form fields based on type
  switch (formType) {
    case 'contact':
      details += `Selected Services: ${formData.services?.join(', ') || 'None'}\n`;
      if (formData.message) details += `Message: ${formData.message}\n`;
      break;
      
    case 'crm-consulting':
      if (formData.employeeCount) details += `Employee Count: ${formData.employeeCount}\n`;
      if (formData.currentSystem) details += `Current System: ${formData.currentSystem}\n`;
      if (formData.mainChallenge) details += `Main Challenge: ${formData.mainChallenge}\n`;
      if (formData.preferredCrm) details += `Preferred CRM: ${formData.preferredCrm}\n`;
      if (formData.budgetRange) details += `Budget Range: ${formData.budgetRange}\n`;
      if (formData.timeline) details += `Timeline: ${formData.timeline}\n`;
      if (formData.message) details += `Message: ${formData.message}\n`;
      break;
      
    case 'website-setup':
      if (formData.websiteType) details += `Website Type: ${formData.websiteType}\n`;
      if (formData.currentWebsite) details += `Current Website: ${formData.currentWebsite}\n`;
      if (formData.timeline) details += `Timeline: ${formData.timeline}\n`;
      if (formData.budget) details += `Budget: ${formData.budget}\n`;
      if (formData.message) details += `Message: ${formData.message}\n`;
      break;
  }
  
  return details;
}

// Send email to customer
export async function sendCustomerEmail(formData: FormData): Promise<boolean> {
  try {
    const templateId = EMAIL_CONFIG.templates[formData.language].customerResponse;
    
    // Using standard EmailJS parameter names
    const emailParams = {
      email: formData.email,
      name: formData.name,
      company: formData.company || '',
      phone: formData.phone || '',
      service: getServiceName(formData.formType, formData.language),
      message: createFormDetails(formData)
    };

    await emailjs.send(EMAIL_CONFIG.service.serviceId, templateId, emailParams);
    return true;
  } catch (error) {
    console.error('Customer email sending failed:', error);
    return false;
  }
}

// Send email to admin
export async function sendAdminEmail(formData: FormData): Promise<boolean> {
  try {
    // Using exact parameter names from your EmailJS template
    const emailParams = {
      email: EMAIL_CONFIG.recipients.admin,
      customer_name: formData.name,
      customer_email: formData.email,
      company: formData.company || 'Belirtilmemiş',
      phone: formData.phone || 'Belirtilmemiş',
      service_name: getServiceName(formData.formType, formData.language),
      timestamp: new Date().toLocaleString('tr-TR'),
      form_details: createFormDetails(formData)
    };

    await emailjs.send(EMAIL_CONFIG.service.serviceId, EMAIL_CONFIG.templates[formData.language].adminNotification, emailParams);
    return true;
  } catch (error) {
    console.error('Admin email sending failed:', error);
    return false;
  }
}

// Send both emails
export async function sendEmails(formData: FormData): Promise<{ success: boolean; customerEmailSent: boolean; adminEmailSent: boolean }> {
  const customerEmailSent = await sendCustomerEmail(formData);
  const adminEmailSent = await sendAdminEmail(formData);
  
  const result = {
    success: customerEmailSent && adminEmailSent,
    customerEmailSent,
    adminEmailSent
  };
  
  // Track successful form submissions
  if (result.success) {
    const utmParams = getStoredUTMParameters();
    
    // Prepare tracking data
    const trackingData = {
      form_type: formData.formType,
      page_source: formData.pageSource,
      language: formData.language,
      service_category: formData.services?.join(', ') || 'general',
      company: formData.company || 'not_specified',
      ...utmParams
    };
    
    // Track form submission
    trackFormSubmit(formData.formType, trackingData);
    
    // Track Facebook Pixel event
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Lead', {
        content_category: formData.formType,
        content_name: formData.pageSource,
        value: 100,
        currency: 'TRY',
        custom_form_type: formData.formType,
        custom_language: formData.language,
        custom_utm_source: utmParams.source,
        custom_utm_medium: utmParams.medium,
        custom_utm_campaign: utmParams.campaign
      });
    }
    
    // Track Google Tag Manager event
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'form_submission',
        form_type: formData.formType,
        page_source: formData.pageSource,
        language: formData.language,
        utm_source: utmParams.source,
        utm_medium: utmParams.medium,
        utm_campaign: utmParams.campaign,
        contact_method: 'form',
        conversion_value: 100
      });
    }
  }
  
  return result;
}

// Detect language from URL or form data
export function detectLanguage(): 'tr' | 'en' {
  if (typeof window !== 'undefined') {
    return window.location.pathname.includes('/en') ? 'en' : 'tr';
  }
  return 'tr';
}

// Detect page source from URL
export function detectPageSource(): string {
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname;
    const isEnglish = pathname.includes('/en');
    
    // Dynamic page mapping based on pathname analysis
    const getPageName = (path: string, lang: 'tr' | 'en'): string => {
      // Remove language prefix for analysis
      const cleanPath = path.replace('/en', '') || '/';
      
      const pageNames = {
        tr: {
          '/': 'Ana Sayfa (TR)',
          '/hakkimizda': 'Hakkımızda Sayfası (TR)',
          '/hizmetlerimiz': 'Hizmetlerimiz Sayfası (TR)',
          '/referanslar': 'Referanslar Sayfası (TR)',
          '/iletisim': 'İletişim Sayfası (TR)',
          '/sss': 'SSS Sayfası (TR)',
          '/blog': 'Blog Sayfası (TR)',
          '/gizlilik-politikasi': 'Gizlilik Politikası (TR)',
          '/crm-danismanligi': 'CRM Danışmanlığı LP (TR)',
          '/crm-danismanligi-v2': 'CRM Danışmanlığı LP v2 (TR)',
          '/web-sitesi-kurulumu': 'Web Sitesi Kurulumu LP (TR)',
          '/web-sitesi-kurulumu-v2': 'Web Sitesi Kurulumu LP v2 (TR)'
        },
        en: {
          '/': 'Home Page (EN)',
          '/about': 'About Page (EN)',
          '/services': 'Services Page (EN)',
          '/references': 'References Page (EN)',
          '/contact': 'Contact Page (EN)',
          '/faq': 'FAQ Page (EN)',
          '/blog': 'Blog Page (EN)',
          '/privacy': 'Privacy Policy (EN)',
          '/crm-consulting': 'CRM Consulting LP (EN)',
          '/crm-consulting-v2': 'CRM Consulting LP v2 (EN)',
          '/website-setup': 'Website Setup LP (EN)',
          '/website-setup-v2': 'Website Setup LP v2 (EN)'
        }
      };
      
      const pages = pageNames[lang];
      return (pages as any)[cleanPath] || `Unknown Page: ${path}`;
    };
    
    return getPageName(pathname, isEnglish ? 'en' : 'tr');
  }
  
  return 'Unknown Page';
}

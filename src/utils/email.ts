import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_su0px4o'; // You'll replace this with actual service ID
const EMAILJS_USER_ID = '4oHjUgCkeANtR0_ob'; // You'll replace this with actual public key

// Template IDs
const TEMPLATES = {
  TR_RESPONSE: 'template_v9wtw99', // You'll replace with actual template ID
  EN_RESPONSE: 'template_v9wtw99', // You'll replace with actual template ID
  ADMIN_NOTIFICATION: 'template_2gqnorr' // You'll replace with actual template ID
};

// Initialize EmailJS
emailjs.init(EMAILJS_USER_ID);

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
  const serviceNames: Record<string, Record<string, string>> = {
    'contact': {
      tr: 'Genel İletişim',
      en: 'General Contact'
    },
    'crm-consulting': {
      tr: 'CRM Danışmanlığı',
      en: 'CRM Consulting'
    },
    'website-setup': {
      tr: 'Web Sitesi Kurulumu',
      en: 'Website Setup'
    }
  };

  return serviceNames[formType]?.[language] || serviceNames['contact']?.[language] || 'General Contact';
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
    const templateId = formData.language === 'tr' ? TEMPLATES.TR_RESPONSE : TEMPLATES.EN_RESPONSE;
    
    // Using standard EmailJS parameter names
    const emailParams = {
      email: formData.email,
      name: formData.name,
      company: formData.company || '',
      phone: formData.phone || '',
      service: getServiceName(formData.formType, formData.language),
      message: createFormDetails(formData)
    };

    await emailjs.send(EMAILJS_SERVICE_ID, templateId, emailParams);
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
      email: 'emre.hemato.1995@gmail.com', // Admin email address
      customer_name: formData.name,
      customer_email: formData.email,
      company: formData.company || 'Belirtilmemiş',
      phone: formData.phone || 'Belirtilmemiş',
      service_name: getServiceName(formData.formType, formData.language),
      timestamp: new Date().toLocaleString('tr-TR'),
      form_details: createFormDetails(formData)
    };

    await emailjs.send(EMAILJS_SERVICE_ID, TEMPLATES.ADMIN_NOTIFICATION, emailParams);
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
  
  return {
    success: customerEmailSent && adminEmailSent,
    customerEmailSent,
    adminEmailSent
  };
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
    
    // Define page mappings
    const pageMap: Record<string, string> = {
      '/': 'Ana Sayfa (TR)',
      '/en': 'Home Page (EN)',
      '/iletisim': 'İletişim Sayfası (TR)',
      '/en/contact': 'Contact Page (EN)',
      '/crm-danismanligi': 'CRM Danışmanlığı LP (TR)',
      '/crm-danismanligi-v2': 'CRM Danışmanlığı LP v2 (TR)',
      '/en/crm-consulting': 'CRM Consulting LP (EN)',
      '/en/crm-consulting-v2': 'CRM Consulting LP v2 (EN)',
      '/web-sitesi-kurulumu': 'Web Sitesi Kurulumu LP (TR)',
      '/web-sitesi-kurulumu-v2': 'Web Sitesi Kurulumu LP v2 (TR)',
      '/en/website-setup': 'Website Setup LP (EN)',
      '/en/website-setup-v2': 'Website Setup LP v2 (EN)'
    };
    
    return pageMap[pathname] || `Unknown Page: ${pathname}`;
  }
  
  return 'Unknown Page';
}

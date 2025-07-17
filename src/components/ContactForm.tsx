import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { sendEmails, detectLanguage, detectPageSource } from '../utils/email';

interface ContactFormProps {
  translations: {
    contact: {
      form: {
        name: string;
        email: string;
        company: string;
        services: string;
        message: string;
        submit: string;
        serviceOptions: string[];
      };
    };
  };
}

export default function ContactForm({ translations }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    services: [] as string[],
    message: '',
    otherService: '',
    privacyAccepted: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const language = window.location.pathname.includes('/en') ? 'en' : 'tr';
      
      // Prepare form data for submission
      const submitData = {
        ...formData,
        services: formData.services.includes('Diğer') || formData.services.includes('Other')
          ? [...formData.services.filter(s => s !== 'Diğer' && s !== 'Other'), formData.otherService].filter(Boolean)
          : formData.services,
        formType: 'contact' as const,
        pageSource: detectPageSource(),
        timestamp: new Date().toISOString(),
        language: language as 'tr' | 'en'
      };

      console.log('Contact Form submitted:', submitData);
      
      // Send emails
      const emailResult = await sendEmails(submitData);
      
      if (emailResult.success) {
        setIsSubmitted(true);
        
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          company: '',
          services: [],
          message: '',
          otherService: '',
          privacyAccepted: false
        });
      } else {
        // Show specific error based on what failed
        let errorMessage = language === 'en' 
          ? 'An error occurred while sending emails. Please try again.' 
          : 'Email gönderilirken bir hata oluştu. Lütfen tekrar deneyin.';
          
        if (!emailResult.customerEmailSent && !emailResult.adminEmailSent) {
          errorMessage = language === 'en' 
            ? 'Failed to send confirmation emails. Please contact us directly.' 
            : 'Onay emaili gönderilemedi. Lütfen direkt bizimle iletişime geçin.';
        }
        
        alert(errorMessage);
      }
      
    } catch (error) {
      console.error('Form submission error:', error);
      const language = window.location.pathname.includes('/en') ? 'en' : 'tr';
      alert(language === 'en' ? 'An error occurred while submitting the form. Please try again.' : 'Form gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceChange = (service: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      services: checked 
        ? [...prev.services, service]
        : prev.services.filter(s => s !== service)
    }));
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-secondary-900 mb-4">
          {translations.contact.form.submit === 'Send' ? 'Thank You!' : 'Teşekkürler!'}
        </h3>
        <p className="text-secondary-600 mb-8">
          {translations.contact.form.submit === 'Send'
            ? 'Your message has been sent successfully. We will get back to you soon.'
            : 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.'
          }
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          {translations.contact.form.submit === 'Send' ? 'Send Another Message' : 'Başka Mesaj Gönder'}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            {translations.contact.form.name} *
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            placeholder={translations.contact.form.name}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            {translations.contact.form.email} *
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            placeholder={translations.contact.form.email}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          {translations.contact.form.company}
        </label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          placeholder={translations.contact.form.company}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          {translations.contact.form.services} *
        </label>
        <div className="space-y-3 p-4 border border-secondary-300 rounded-lg">
          {translations.contact.form.serviceOptions.map((option) => (
            <label key={option} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.services.includes(option)}
                onChange={(e) => handleServiceChange(option, e.target.checked)}
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
              />
              <span className="ml-2 text-sm text-secondary-700">{option}</span>
            </label>
          ))}
        </div>
        {formData.services.length === 0 && (
          <p className="mt-1 text-sm text-secondary-500">
            {translations.contact.form.submit === 'Send' ? 'Please select at least one service' : 'Lütfen en az bir hizmet seçin'}
          </p>
        )}
      </div>

      {(formData.services.includes('Diğer') || formData.services.includes('Other')) && (
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            {translations.contact.form.submit === 'Send' ? 'Please specify' : 'Lütfen belirtin'}
          </label>
          <input
            type="text"
            name="otherService"
            value={formData.otherService}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            placeholder={translations.contact.form.submit === 'Send' ? 'Describe your needs...' : 'İhtiyaçlarınızı açıklayın...'}
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          {translations.contact.form.message}
        </label>
        <textarea
          name="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          placeholder={translations.contact.form.submit === 'Send' ? 'Tell us about your project...' : 'Projeniz hakkında bize bilgi verin...'}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || formData.services.length === 0 || !formData.privacyAccepted}
        className="w-full flex items-center justify-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
      >
        {isSubmitting ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        ) : (
          <>
            {translations.contact.form.submit}
            <Send className="ml-2 w-5 h-5" />
          </>
        )}
      </button>

      <div className="flex items-start">
        <input
          type="checkbox"
          id="privacyAccepted"
          checked={formData.privacyAccepted}
          onChange={(e) => setFormData(prev => ({ ...prev, privacyAccepted: e.target.checked }))}
          className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2 mt-1"
          required
        />
        <label htmlFor="privacyAccepted" className="ml-2 text-sm text-secondary-700">
          {translations.contact.form.submit === 'Send' ? (
            <>
              I have read and accept the{' '}
              <a href="/en/privacy" target="_blank" className="text-primary-600 hover:underline">
                Privacy Policy
              </a>
              {' '}and consent to the processing of my personal data. *
            </>
          ) : (
            <>
              <a href="/gizlilik-politikasi" target="_blank" className="text-primary-600 hover:underline">
                Gizlilik Politikası
              </a>
              'nı okudum, kabul ediyorum ve kişisel verilerimin işlenmesine onay veriyorum. *
            </>
          )}
        </label>
      </div>
    </form>
  );
}

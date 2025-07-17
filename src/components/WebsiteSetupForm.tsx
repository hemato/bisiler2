import { useState } from 'react';
import { Send, CheckCircle, MessageCircle, Phone } from 'lucide-react';

interface WebsiteSetupFormProps {
  translations: any;
  lang: string;
}

export default function WebsiteSetupForm({ translations, lang }: WebsiteSetupFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    websiteType: '',
    currentWebsite: '',
    timeline: '',
    budget: '',
    message: '',
    privacyAccepted: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const submitData = {
        ...formData,
        timestamp: new Date().toISOString(),
        language: lang,
        formType: 'website-setup'
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Website Setup Form submitted:', submitData);
      
      setIsSubmitted(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        websiteType: '',
        currentWebsite: '',
        timeline: '',
        budget: '',
        message: '',
        privacyAccepted: false
      });
      
    } catch (error) {
      console.error('Form submission error:', error);
      alert(lang === 'en' ? 'An error occurred while submitting the form. Please try again.' : 'Form gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12 bg-green-50 rounded-2xl border border-green-200">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-secondary-900 mb-4">
          {lang === 'en' ? 'Thank You!' : 'Teşekkürler!'}
        </h3>
        <p className="text-secondary-600 mb-6">
          {lang === 'en'
            ? 'Your website project request has been received. Our team will send you a detailed proposal within 24 hours.'
            : 'Web sitesi proje talebiniz alınmıştır. Ekibimiz 24 saat içerisinde size detaylı teklif gönderecektir.'
          }
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://wa.me/905555555555"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            {lang === 'en' ? 'WhatsApp' : 'WhatsApp'}
          </a>
          <a
            href="tel:+905555555555"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Phone className="w-5 h-5 mr-2" />
            {lang === 'en' ? 'Call Now' : 'Hemen Ara'}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h3 className="text-2xl font-bold text-secondary-900 mb-6 text-center">
        {translations.websiteSetup.form.title}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              {translations.websiteSetup.form.fields.name} *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder={translations.websiteSetup.form.fields.name}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              {translations.websiteSetup.form.fields.email} *
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder={translations.websiteSetup.form.fields.email}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              {translations.websiteSetup.form.fields.phone} *
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder={translations.websiteSetup.form.fields.phone}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              {translations.websiteSetup.form.fields.company} *
            </label>
            <input
              type="text"
              name="company"
              required
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder={translations.websiteSetup.form.fields.company}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              {translations.websiteSetup.form.fields.websiteType} *
            </label>
            <select
              name="websiteType"
              required
              value={formData.websiteType}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              <option value="">{lang === 'en' ? 'Select...' : 'Seçiniz...'}</option>
              {translations.websiteSetup.form.options.websiteType.map((option: string) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              {translations.websiteSetup.form.fields.currentWebsite} *
            </label>
            <select
              name="currentWebsite"
              required
              value={formData.currentWebsite}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              <option value="">{lang === 'en' ? 'Select...' : 'Seçiniz...'}</option>
              {translations.websiteSetup.form.options.currentWebsite.map((option: string) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              {translations.websiteSetup.form.fields.timeline} *
            </label>
            <select
              name="timeline"
              required
              value={formData.timeline}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              <option value="">{lang === 'en' ? 'Select...' : 'Seçiniz...'}</option>
              {translations.websiteSetup.form.options.timeline.map((option: string) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              {translations.websiteSetup.form.fields.budget}
            </label>
            <select
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              <option value="">{lang === 'en' ? 'Select...' : 'Seçiniz...'}</option>
              {translations.websiteSetup.form.options.budget.map((option: string) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            {translations.websiteSetup.form.fields.message}
          </label>
          <textarea
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            placeholder={lang === 'en' ? 'Tell us about your website needs...' : 'Web sitesi ihtiyaçlarınızı anlatın...'}
          />
        </div>

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
            {lang === 'en' ? (
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

        <button
          type="submit"
          disabled={isSubmitting || !formData.privacyAccepted}
          className="w-full flex items-center justify-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
        >
          {isSubmitting ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              {translations.websiteSetup.form.submit}
              <Send className="ml-2 w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

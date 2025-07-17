import { useState } from 'react';
import { Send, CheckCircle, User, Mail, Phone, Building, Users, Database, Target, Zap, Calendar, MessageSquare } from 'lucide-react';
import { sendEmails, detectLanguage } from '../utils/email';

interface CRMConsultingFormProps {
  translations: {
    crmConsulting: {
      form: {
        title: string;
        fields: {
          name: string;
          email: string;
          phone: string;
          company: string;
          employeeCount: string;
          currentSystem: string;
          mainChallenge: string;
          preferredCrm: string;
          budgetRange: string;
          timeline: string;
          message: string;
        };
        options: {
          employeeCount: string[];
          currentSystem: string[];
          mainChallenge: string[];
          preferredCrm: string[];
          budgetRange: string[];
          timeline: string[];
        };
        submit: string;
      };
    };
  };
  lang: string;
}

export default function CRMConsultingForm({ translations, lang }: CRMConsultingFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    employeeCount: '',
    currentSystem: '',
    mainChallenge: '',
    preferredCrm: '',
    budgetRange: '',
    timeline: '',
    message: '',
    privacyAccepted: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Prepare form data for submission
      const submitData = {
        ...formData,
        formType: 'crm-consulting' as const,
        timestamp: new Date().toISOString(),
        language: lang as 'tr' | 'en'
      };

      console.log('CRM Consulting Form submitted:', submitData);
      
      // Send emails
      const emailResult = await sendEmails(submitData);
      
      if (emailResult.success) {
        setIsSubmitted(true);
        
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          employeeCount: '',
          currentSystem: '',
          mainChallenge: '',
          preferredCrm: '',
          budgetRange: '',
          timeline: '',
          message: '',
          privacyAccepted: false
        });
      } else {
        // Show specific error based on what failed
        let errorMessage = lang === 'en' 
          ? 'An error occurred while sending emails. Please try again.' 
          : 'Email gönderilirken bir hata oluştu. Lütfen tekrar deneyin.';
          
        if (!emailResult.customerEmailSent && !emailResult.adminEmailSent) {
          errorMessage = lang === 'en' 
            ? 'Failed to send confirmation emails. Please contact us directly.' 
            : 'Onay emaili gönderilemedi. Lütfen direkt bizimle iletişime geçin.';
        }
        
        alert(errorMessage);
      }
      
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
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-secondary-900 mb-4">
          {lang === 'en' ? 'Thank You!' : 'Teşekkürler!'}
        </h3>
        <p className="text-secondary-600 mb-8">
          {lang === 'en'
            ? 'Your CRM consulting request has been sent successfully. Our expert team will contact you within 24 hours.'
            : 'CRM danışmanlık talebiniz başarıyla gönderildi. Uzman ekibimiz 24 saat içinde size dönüş yapacak.'
          }
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setIsSubmitted(false)}
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            {lang === 'en' ? 'Send Another Request' : 'Başka Talep Gönder'}
          </button>
          <a
            href="https://wa.me/905555555555"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-secondary-900 mb-4">
          {translations.crmConsulting.form.title}
        </h2>
        <p className="text-secondary-600">
          {lang === 'en' 
            ? 'Fill out the form below and our CRM experts will prepare a customized solution for your business.'
            : 'Aşağıdaki formu doldurun, CRM uzmanlarımız işletmeniz için özelleştirilmiş çözüm hazırlasın.'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              {translations.crmConsulting.form.fields.name} *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder={translations.crmConsulting.form.fields.name}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              {translations.crmConsulting.form.fields.email} *
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder={translations.crmConsulting.form.fields.email}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              {translations.crmConsulting.form.fields.phone} *
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder={translations.crmConsulting.form.fields.phone}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              <Building className="w-4 h-4 inline mr-2" />
              {translations.crmConsulting.form.fields.company} *
            </label>
            <input
              type="text"
              name="company"
              required
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder={translations.crmConsulting.form.fields.company}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              <Users className="w-4 h-4 inline mr-2" />
              {translations.crmConsulting.form.fields.employeeCount}
            </label>
            <select
              name="employeeCount"
              value={formData.employeeCount}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              <option value="">{lang === 'en' ? 'Select...' : 'Seçin...'}</option>
              {translations.crmConsulting.form.options.employeeCount.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              <Database className="w-4 h-4 inline mr-2" />
              {translations.crmConsulting.form.fields.currentSystem}
            </label>
            <select
              name="currentSystem"
              value={formData.currentSystem}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              <option value="">{lang === 'en' ? 'Select...' : 'Seçin...'}</option>
              {translations.crmConsulting.form.options.currentSystem.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              <Target className="w-4 h-4 inline mr-2" />
              {translations.crmConsulting.form.fields.mainChallenge}
            </label>
            <select
              name="mainChallenge"
              value={formData.mainChallenge}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              <option value="">{lang === 'en' ? 'Select...' : 'Seçin...'}</option>
              {translations.crmConsulting.form.options.mainChallenge.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              <Zap className="w-4 h-4 inline mr-2" />
              {translations.crmConsulting.form.fields.preferredCrm}
            </label>
            <select
              name="preferredCrm"
              value={formData.preferredCrm}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              <option value="">{lang === 'en' ? 'Select...' : 'Seçin...'}</option>
              {translations.crmConsulting.form.options.preferredCrm.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              💰 {translations.crmConsulting.form.fields.budgetRange}
            </label>
            <select
              name="budgetRange"
              value={formData.budgetRange}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              <option value="">{lang === 'en' ? 'Select...' : 'Seçin...'}</option>
              {translations.crmConsulting.form.options.budgetRange.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              {translations.crmConsulting.form.fields.timeline}
            </label>
            <select
              name="timeline"
              value={formData.timeline}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              <option value="">{lang === 'en' ? 'Select...' : 'Seçin...'}</option>
              {translations.crmConsulting.form.options.timeline.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            <MessageSquare className="w-4 h-4 inline mr-2" />
            {translations.crmConsulting.form.fields.message}
          </label>
          <textarea
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            placeholder={lang === 'en' ? 'Tell us about your specific CRM needs...' : 'Özel CRM ihtiyaçlarınız hakkında bize bilgi verin...'}
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
          disabled={isSubmitting || !formData.privacyAccepted || !formData.name || !formData.email || !formData.phone || !formData.company}
          className="w-full flex items-center justify-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
        >
          {isSubmitting ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              {translations.crmConsulting.form.submit}
              <Send className="ml-2 w-5 h-5" />
            </>
          )}
        </button>

        <div className="text-center text-sm text-secondary-500">
          {lang === 'en' 
            ? 'Our CRM experts will contact you within 24 hours with a customized solution proposal.'
            : 'CRM uzmanlarımız 24 saat içinde özelleştirilmiş çözüm önerisi ile size dönüş yapacak.'
          }
        </div>
      </form>
    </div>
  );
}

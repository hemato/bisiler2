# EmailJS Setup Guide

This guide will help you set up EmailJS to enable email sending functionality for all forms on your website.

## 🚀 Step 1: Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## 📧 Step 2: Connect Gmail Service

1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Select **Gmail**
4. Follow the authentication process to connect your Gmail account
5. Note down the **Service ID** (e.g., `service_abc123`)

## 📝 Step 3: Create Email Templates

You need to create 3 templates:

### Template 1: Turkish Response (TR_RESPONSE)
```
Subject: Talebiniz Alındı - {{service_name}}

Merhaba {{customer_name}},

{{#if is_contact}}
İletişim talebiniz başarıyla alındı.
{{/if}}
{{#if is_crm}}
CRM danışmanlık talebiniz başarıyla alındı.
{{/if}}
{{#if is_website}}
Web sitesi kurulum talebiniz başarıyla alındı.
{{/if}}

Uzman ekibimiz 24 saat içinde size dönüş yapacak.

Talep Detayları:
- Şirket: {{company}}
- Telefon: {{phone}}
- Hizmet: {{service_type}}

Teşekkürler,
TechCorp Takımı
```

### Template 2: English Response (EN_RESPONSE)
```
Subject: Request Received - {{service_name}}

Hello {{customer_name}},

{{#if is_contact}}
Your contact request has been received.
{{/if}}
{{#if is_crm}}
Your CRM consulting request has been received.
{{/if}}
{{#if is_website}}
Your website setup request has been received.
{{/if}}

Our expert team will contact you within 24 hours.

Request Details:
- Company: {{company}}
- Phone: {{phone}}
- Service: {{service_type}}

Best regards,
TechCorp Team
```

### Template 3: Admin Notification (ADMIN_NOTIFICATION)
```
Subject: Yeni Form Gönderimi - {{service_name}}

Yeni bir form gönderimi alındı:

Müşteri Bilgileri:
- Ad: {{customer_name}}
- Email: {{customer_email}}
- Şirket: {{company}}
- Telefon: {{phone}}
- Hizmet: {{service_name}}
- Tarih: {{timestamp}}

Form Detayları:
{{form_details}}
```

**Note down the Template IDs** (e.g., `template_abc123`) for each template.

## 🔑 Step 4: Get Your Public Key

1. Go to **Account** → **General** in EmailJS dashboard
2. Find your **Public Key** (e.g., `your_public_key_here`)

## 🛠️ Step 5: Update Configuration

Open `src/utils/email.ts` and replace the placeholder values:

```typescript
// EmailJS configuration
const EMAILJS_SERVICE_ID = 'YOUR_ACTUAL_SERVICE_ID'; // Replace with your Service ID
const EMAILJS_USER_ID = 'YOUR_ACTUAL_PUBLIC_KEY'; // Replace with your Public Key

// Template IDs
const TEMPLATES = {
  TR_RESPONSE: 'YOUR_TR_TEMPLATE_ID', // Replace with Turkish template ID
  EN_RESPONSE: 'YOUR_EN_TEMPLATE_ID', // Replace with English template ID
  ADMIN_NOTIFICATION: 'YOUR_ADMIN_TEMPLATE_ID' // Replace with admin template ID
};
```

## ✉️ Step 6: Update Admin Email

In the same file, find this line and update it with your email:

```typescript
const emailParams = {
  to_email: 'emre.hemato.1995@gmail.com', // This is already correct
  // ... other params
};
```

## 🧪 Step 7: Test the Setup

1. Run your development server: `npm run dev`
2. Go to any form on your website
3. Fill out and submit the form
4. Check:
   - Console for any errors
   - Your email (emre.hemato.1995@gmail.com) for admin notification
   - The customer's email for confirmation

## 📋 EmailJS Free Plan Limits

- **200 emails/month** free
- If you need more, consider upgrading to a paid plan

## 🔍 Troubleshooting

### Common Issues:

1. **"Service ID not found"**
   - Double-check your Service ID in `src/utils/email.ts`

2. **"Template not found"**
   - Verify Template IDs are correct

3. **"Invalid public key"**
   - Check your Public Key in the configuration

4. **Emails not sending**
   - Check browser console for errors
   - Verify Gmail service is properly connected

### Debug Mode:
Add this to `src/utils/email.ts` for debugging:

```typescript
// Add at the top of sendCustomerEmail function
console.log('Sending email with:', {
  serviceId: EMAILJS_SERVICE_ID,
  templateId,
  emailParams
});
```

## 🎯 Final Check

After setup, all 4 forms should send emails:
- ✅ Landing Page: Web Sitesi Kurulumu
- ✅ Landing Page: CRM Danışmanlığı  
- ✅ Contact Page Form
- ✅ Home Page Contact Form

Both Turkish and English emails should work based on the page language.

## 📞 Support

If you encounter issues:
1. Check EmailJS dashboard for delivery logs
2. Review browser console for errors
3. Test with a simple template first

---

**Next Steps:** Once EmailJS is configured, your forms will automatically send emails to both the customer and admin (emre.hemato.1995@gmail.com) every time someone submits a form!

// SEO utility functions
export interface SEOValidation {
  isValid: boolean;
  length: number;
  errors: string[];
  suggestions: string[];
}

export function validateMetaDescription(description: string): SEOValidation {
  const length = description.length;
  const errors: string[] = [];
  const suggestions: string[] = [];
  
  if (length < 120) {
    errors.push('Meta description is too short');
    suggestions.push('Add more descriptive content (120-160 characters recommended)');
  }
  
  if (length > 160) {
    errors.push('Meta description is too long');
    suggestions.push('Trim content to stay under 160 characters');
  }
  
  if (!description.includes('CRM') && !description.includes('web') && !description.includes('dijital')) {
    suggestions.push('Include primary keywords like CRM, web, or dijital');
  }
  
  return {
    isValid: length >= 120 && length <= 160,
    length,
    errors,
    suggestions
  };
}

export function validateTitle(title: string): SEOValidation {
  const length = title.length;
  const errors: string[] = [];
  const suggestions: string[] = [];
  
  if (length < 30) {
    errors.push('Title is too short');
    suggestions.push('Add more descriptive content (30-60 characters recommended)');
  }
  
  if (length > 60) {
    errors.push('Title is too long');
    suggestions.push('Trim content to stay under 60 characters');
  }
  
  return {
    isValid: length >= 30 && length <= 60,
    length,
    errors,
    suggestions
  };
}

export function generateOptimizedMetaDescription(
  service: string,
  benefits: string[],
  location: string = 'Türkiye',
  lang: 'tr' | 'en' = 'tr'
): string {
  const templates = {
    tr: {
      crm: `${service} hizmetimizle ${benefits.slice(0, 2).join(', ')} sağlayın. ${location}'de uzman ekibimizle dijital dönüşümünüzü gerçekleştirin.`,
      web: `${service} hizmetimizle ${benefits.slice(0, 2).join(', ')} elde edin. ${location}'de profesyonel web çözümleri için bize ulaşın.`,
      general: `${service} hizmetimizle ${benefits.slice(0, 2).join(', ')} kazanın. ${location}'de uzman ekibimizle işinizi dijitalleştirin.`
    },
    en: {
      crm: `Get ${benefits.slice(0, 2).join(', ')} with our ${service} service. Digital transformation in ${location} with our expert team.`,
      web: `Achieve ${benefits.slice(0, 2).join(', ')} with our ${service} service. Professional web solutions in ${location}.`,
      general: `Gain ${benefits.slice(0, 2).join(', ')} with our ${service} service. Digitize your business in ${location} with our expert team.`
    }
  };
  
  const type = service.toLowerCase().includes('crm') ? 'crm' : 
               service.toLowerCase().includes('web') ? 'web' : 'general';
  
  return templates[lang][type];
}

export function optimizeInternalLinking(content: string, routes: Array<{title: string, url: string}>): string {
  // Simple internal linking optimization
  let optimizedContent = content;
  
  routes.forEach(route => {
    const regex = new RegExp(`\\b${route.title}\\b`, 'gi');
    const replacement = `<a href="${route.url}" class="text-primary-600 hover:text-primary-700 underline">${route.title}</a>`;
    optimizedContent = optimizedContent.replace(regex, replacement);
  });
  
  return optimizedContent;
}

export function generateStructuredDataFAQ(faqs: Array<{question: string, answer: string}>): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

export function generateOptimizedAltText(
  imageName: string,
  context: string,
  lang: 'tr' | 'en' = 'tr'
): string {
  const templates = {
    tr: {
      team: `${context} - TechCorp uzman ekibi`,
      service: `${context} hizmeti görseli - TechCorp`,
      result: `${context} sonuçları - TechCorp başarı hikayesi`,
      process: `${context} sürecini gösteren diagram`,
      general: `${context} - TechCorp ${imageName}`
    },
    en: {
      team: `${context} - TechCorp expert team`,
      service: `${context} service image - TechCorp`,
      result: `${context} results - TechCorp success story`,
      process: `Diagram showing ${context} process`,
      general: `${context} - TechCorp ${imageName}`
    }
  };
  
  const type = imageName.toLowerCase().includes('team') ? 'team' :
               imageName.toLowerCase().includes('service') ? 'service' :
               imageName.toLowerCase().includes('result') ? 'result' :
               imageName.toLowerCase().includes('process') ? 'process' : 'general';
  
  return templates[lang][type];
}

export const SEO_RECOMMENDATIONS = {
  metaDescription: {
    minLength: 120,
    maxLength: 160,
    mustInclude: ['CRM', 'web', 'dijital', 'TechCorp'],
    shouldInclude: ['uzman', 'profesyonel', 'hizmet', 'çözüm']
  },
  title: {
    minLength: 30,
    maxLength: 60,
    mustInclude: ['TechCorp'],
    shouldInclude: ['CRM', 'web', 'dijital']
  },
  headings: {
    h1: { count: 1, maxLength: 70 },
    h2: { count: '2-6', maxLength: 60 },
    h3: { count: '3-10', maxLength: 50 }
  },
  internalLinks: {
    minPerPage: 3,
    maxPerPage: 10,
    anchorTextVariation: true
  },
  images: {
    maxSizeKB: 100,
    formats: ['webp', 'jpg', 'png'],
    altTextRequired: true,
    lazyLoading: true
  }
};

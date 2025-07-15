import { languages, defaultLang } from './languages';

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang as keyof typeof languages;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof languages) {
  return function t(key: string) {
    const keys = key.split('.');
    const translations = getTranslations(lang);
    
    let value: any = translations;
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };
}

function getTranslations(lang: keyof typeof languages) {
  switch (lang) {
    case 'tr':
      return import('./tr.json').then(module => module.default);
    case 'en':
      return import('./en.json').then(module => module.default);
    default:
      return import('./tr.json').then(module => module.default);
  }
}

export async function getStaticPaths() {
  return Object.keys(languages).map((lang) => ({
    params: { lang }
  }));
}
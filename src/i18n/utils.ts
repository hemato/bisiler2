import { languages, defaultLang } from './languages';

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang as keyof typeof languages;
  return defaultLang;
}

export async function getTranslations(lang: keyof typeof languages) {
  switch (lang) {
    case 'tr':
      return (await import('./tr.json')).default;
    case 'en':
      return (await import('./en.json')).default;
    default:
      return (await import('./tr.json')).default;
  }
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

export async function getStaticPaths() {
  return Object.keys(languages).map((lang) => ({
    params: { lang }
  }));
}
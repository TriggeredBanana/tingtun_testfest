import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en/translation.json';
import noTranslation from './locales/no/translation.json';

// Get preferred language from localStorage or browser
const savedLang = typeof window !== 'undefined' ? localStorage.getItem('lang') : null;
const browserLang = typeof navigator !== 'undefined' ? (navigator.language || 'no').slice(0,2) : 'no';
const initialLang = savedLang || (browserLang === 'en' ? 'en' : 'no');

i18n
  .use(initReactI18next)
  .init({
    // Resources with translations
    resources: {
      en: { translation: enTranslation },
      no: { translation: noTranslation },
    },
    // Initial language based on saved value or browser language
    lng: initialLang,
    // Norwegian as fallback
    fallbackLng: 'no',
    interpolation: { escapeValue: false },
  });

// Save language choice in localStorage when user changes language
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('lang', lng);
});

export default i18n;
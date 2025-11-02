import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en/translation.json';
import noTranslation from './locales/no/translation.json';

// Hent foretrukket språk fra localStorage eller nettleseren
const savedLang = typeof window !== 'undefined' ? localStorage.getItem('lang') : null;
const browserLang = typeof navigator !== 'undefined' ? (navigator.language || 'no').slice(0,2) : 'no';
const initialLang = savedLang || (browserLang === 'en' ? 'en' : 'no');

i18n
  .use(initReactI18next)
  .init({
    // Ressurser med oversettelser
    resources: {
      en: { translation: enTranslation },
      no: { translation: noTranslation },
    },
    // Startspråk basert på lagret verdi eller nettleserspråk
    lng: initialLang,
    // Norsk som fallback
    fallbackLng: 'no',
    interpolation: { escapeValue: false },
  });

// Lagre språkvalg i localStorage når bruker bytter språk
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('lang', lng);
});

export default i18n;
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en/translation.json';
import noTranslation from './locales/no/translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      no: { translation: noTranslation },
    },
    lng: 'no', // default language
    fallbackLng: 'no',
    interpolation: { escapeValue: false },
  });

// Save preference in localStorage
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('lang', lng);
});

export default i18n;
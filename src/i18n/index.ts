import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import enTranslation from './locales/en';
import csTranslation from './locales/cs';
import esTranslation from './locales/es';
import deTranslation from './locales/de';

const resources = {
  en: {
    translation: enTranslation
  },
  cs: {
    translation: csTranslation
  },
  es: {
    translation: esTranslation
  },
  de: {
    translation: deTranslation
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already safes from XSS
    }
  });

export default i18n;

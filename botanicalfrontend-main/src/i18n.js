//i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './locales/en/translation.json';
import translationRO from './locales/ro/translation.json';
import translationFR from './locales/fr/translation.json';

const resources = {
  en: { translation: translationEN },
  ro: { translation: translationRO },
  fr: { translation: translationFR }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',          // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already safes from XSS
    }
  });

export default i18n;

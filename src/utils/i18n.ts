import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { DEFAULT_LANGUAGE, STORAGE_KEYS } from '../constants';

// Import translations
import uz from '../locales/uz.json';
import ru from '../locales/ru.json';
import en from '../locales/en.json';
import kaa from '../locales/kaa.json';

const resources = {
  uz: { translation: uz },
  ru: { translation: ru },
  en: { translation: en },
  kaa: { translation: kaa },
};

// Get saved language from sessionStorage
const savedLanguage = sessionStorage.getItem(STORAGE_KEYS.LANGUAGE) || DEFAULT_LANGUAGE;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: DEFAULT_LANGUAGE,
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    react: {
      useSuspense: false,
    },
  });

// Save language to sessionStorage when it changes
i18n.on('languageChanged', (lng) => {
  sessionStorage.setItem(STORAGE_KEYS.LANGUAGE, lng);
});

export default i18n;
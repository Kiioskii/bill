import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          welcome: "Welcome to my app",
        },
      },
      pl: {
        translation: {
          welcome: "Witaj w mojej aplikacji",
        },
      },
    },
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    detection: {
      order: ["path", "navigator"],
      lookupFromPathIndex: 0,
    },
  });

export default i18n;

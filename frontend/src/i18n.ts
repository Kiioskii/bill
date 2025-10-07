import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import quizzesEN from "./features/quizzes/translations/en.json";
import quizzesPL from "./features/quizzes/translations/pl.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        quizzes: quizzesEN,
      },
      pl: {
        quizzes: quizzesPL,
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

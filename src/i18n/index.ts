import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import de from "./locales/de.json";
import fr from "./locales/fr.json";
import it from "./locales/it.json";
import ta from "./locales/ta.json";

export const supportedLanguages = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
  it: "Italiano",
  ta: "தமிழ்",
} as const;

export type LanguageCode = keyof typeof supportedLanguages;

const resources = {
  en: {
    translation: en,
  },
  de: {
    translation: de,
  },
  fr: {
    translation: fr,
  },
  it: {
    translation: it,
  },
  ta: {
    translation: ta,
  },
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    fallbackLng: "en",
    supportedLngs: Object.keys(supportedLanguages),
    lng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18n;
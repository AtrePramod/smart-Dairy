import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// Marathi
import mrTranslation from "./Marathi/Marathi.json";
import commonMr from "./Marathi/Common.json";
import collectionmr from "./Marathi/MilkCollection.json";
// English
import enTranslation from "./English/English.json";
import commonEg from "./English/Common.json";
import collectioneg from "./English/MilkCollection.json";

i18n.use(initReactI18next).init({
  resources: {
    mr: {
      translation: mrTranslation,
      common: commonMr,
      milkcollection: collectionmr,
    },
    en: {
      translation: enTranslation,
      common: commonEg,
      milkcollection: collectioneg,
    },
  },
  lng: "mr", // Default language
  fallbackLng: "en", // Fallback to English if translation not found in Marathi
  ns: ["common", "milkcollection"], // Defined namespaces
  defaultNS: "translation", // Default namespace to use if none is specified
  interpolation: {
    escapeValue: false, // React already escapes values to prevent XSS
  },
});

export default i18n;

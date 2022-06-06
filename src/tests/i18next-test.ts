import i18next from "i18next";

i18next.init({
  lng: "en",
  debug: false,
  supportedLngs: ["en", "fr", "es", "fr-CA"], // ℹ️ base language is the first one, ie. "en"
  fallbackLng: ["en", "fr", "es", "fr-CA"],
  resources: {
    en: {
      translation: {
        hello: "Hello!",
        interpolationKey: "This is a <0>super cool</0> sentence!",
        interpolationKeyNoHTML:
          "This is a reference string without any HTML tags!",
      },
    },
    fr: {
      translation: {
        hello: "Bonjour !",
        interpolationKey: "Ceci est une phrase <0>super cool</0> !",
        interpolationKeyNoHTML:
          "Ceci est une chaîne de caractères de référence, sans aucune balise HTML !",
      },
    },
  },
});

export default i18next;

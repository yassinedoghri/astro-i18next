import type { AstroI18nextConfig } from "astro-i18next";

const config: AstroI18nextConfig = {
  defaultLanguage: "en",
  supportedLanguages: ["en", "fr"],
  i18next: {
    debug: true, // convenient during development to check for missing keys
    resources: {
      en: {
        translation: {
          helloReact: "Hello, React!",
          myCoolCounter: "My cool counter",
        },
      },
      fr: {
        translation: {
          helloReact: "Bonjour, React!",
          myCoolCounter: "Mon compteur stylé",
        },
      },
    },
  },
  i18nextPlugins: {
    "{initReactI18next}": "react-i18next",
  },
};

export default config;

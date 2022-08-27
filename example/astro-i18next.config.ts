import { AstroI18nextConfig } from "astro-i18next/index";

const config: AstroI18nextConfig = {
  defaultLanguage: "en",
  supportedLanguages: ["en", "fr"],
  i18next: {
    debug: true,
    initImmediate: false,
    backend: {
      loadPath: "./src/locales/{{lng}}.json",
    },
  },
  i18nextPlugins: { fsBackend: "i18next-fs-backend" },
};

export default config;

import type { AstroI18nextConfig } from "astro-i18next";

const config: AstroI18nextConfig = {
  defaultLocale: "en",
  locales: ["en", "fr"],
  routes: {
    fr: {
      about: "a-propos",
    },
  },
  i18nextServer: {
    debug: true,
  },
};

export default config;

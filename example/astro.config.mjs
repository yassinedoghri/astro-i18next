import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import astroI18next from "astro-i18next";

// https://astro.build/config
export default defineConfig({
  site: "https://astro-i18next.yassinedoghri.com/",
  experimental: {
    integrations: true,
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "en", // All urls that don't contain `es` or `fr` after `https://stargazers.club/` will be treated as default locale, i.e. `en`
        locales: {
          en: "en", // The `defaultLocale` value must present in `locales` keys
          fr: "fr",
        },
      },
    }),
    tailwind(),
    astroI18next(),
  ],
});

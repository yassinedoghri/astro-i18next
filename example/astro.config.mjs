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
    sitemap(),
    tailwind(),
    astroI18next({
      baseLocale: "en",
      supportedLocales: ["en", "fr"],
      i18next: {
        debug: true,
        initImmediate: false,
        backend: {
          loadPath: "./src/locales/{{lng}}.json",
        },
      },
      i18nextPlugins: { fsBackend: "i18next-fs-backend" },
    }),
  ],
});

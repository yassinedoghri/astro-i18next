import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import astroI18next from "astro-i18next";

// https://astro.build/config
export default defineConfig({
  site: "https://yassinedoghri.github.io/",
  base: "/astro-i18next",
  experimental: {
    integrations: true,
  },
  integrations: [
    tailwind(),
    astroI18next({
      resourcesPath: "./src/locales/",
      i18nextConfig: {
        debug: true,
        fallbackLng: ["en", "fr"],
        supportedLngs: ["en", "fr"],
      },
    }),
  ],
});

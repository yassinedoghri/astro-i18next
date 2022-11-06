import { defineConfig } from "astro/config";
import astroI18next from "astro-i18next";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }),
  integrations: [astroI18next()],
});

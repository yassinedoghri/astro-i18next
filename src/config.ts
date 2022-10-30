import { AstroI18nextConfig } from "./types";

const astroI18nextConfig: AstroI18nextConfig = {
  defaultLocale: "cimode",
  locales: [],
  namespaces: "translation",
  defaultNamespace: "translation",
  routes: {},
  showDefaultLocale: false,
};

export const getAstroI18nextConfig = () => astroI18nextConfig;

export const setAstroI18nextConfig = (config: AstroI18nextConfig) => {
  for (const key in config) {
    astroI18nextConfig[key] = config[key];
  }
};

import { AstroIntegration } from "astro";
import { InitOptions } from "i18next";
import { setAstroI18nextConfig } from "./config";
import { AstroI18nextConfig, AstroI18nextOptions } from "./types";
import {
  movedefaultLocaleToFirstIndex,
  deeplyStringifyObject,
  getUserConfig,
} from "./utils";

export default (options?: AstroI18nextOptions): AstroIntegration => {
  const customConfigPath = options?.configPath;

  return {
    name: "astro-i18next",
    hooks: {
      "astro:config:setup": async ({ config, injectScript }) => {
        /**
         * 0. Get user config
         */
        const userConfig = await getUserConfig(config.root, customConfigPath);

        if (customConfigPath && !userConfig?.value) {
          throw new Error(
            `[astro-i18next]: Could not find a config file at ${JSON.stringify(
              customConfigPath
            )}. Does the file exist?`
          );
        }

        const astroI18nextConfig: AstroI18nextConfig =
          userConfig?.value as AstroI18nextConfig;

        /**
         * 1. Validate and prepare config
         */
        if (
          !astroI18nextConfig.defaultLocale ||
          astroI18nextConfig.defaultLocale === ""
        ) {
          throw new Error(
            "[astro-i18next]: you must set a `defaultLocale` in your astroI18nextConfig!"
          );
        }

        if (!astroI18nextConfig.locales) {
          astroI18nextConfig.locales = [astroI18nextConfig.defaultLocale];
        }

        if (
          !astroI18nextConfig.locales.includes(astroI18nextConfig.defaultLocale)
        ) {
          astroI18nextConfig.locales.unshift(astroI18nextConfig.defaultLocale);
        }

        // make sure to have default locale set as first element in supportedLngs
        if (
          astroI18nextConfig.locales[0] !== astroI18nextConfig.defaultLocale
        ) {
          movedefaultLocaleToFirstIndex(
            astroI18nextConfig.locales as string[],
            astroI18nextConfig.defaultLocale
          );
        }

        // Build server side i18next config
        // set i18next supported and fallback languages (same as locales)
        const serverConfig: InitOptions = {
          supportedLngs: astroI18nextConfig.locales as string[],
          fallbackLng: astroI18nextConfig.locales as string[],
          ns: astroI18nextConfig.namespaces,
          defaultNS: astroI18nextConfig.defaultNamespace,
          initImmediate: false,
          backend: {
            loadPath: config.publicDir.pathname + "locales/{{lng}}/{{ns}}.json",
          },
          ...astroI18nextConfig.i18nextServer,
        };

        const clientConfig: InitOptions = {
          supportedLngs: astroI18nextConfig.locales as string[],
          fallbackLng: astroI18nextConfig.locales as string[],
          ns: astroI18nextConfig.namespaces,
          defaultNS: astroI18nextConfig.defaultNamespace,
          detection: {
            order: ["htmlTag"],
            caches: [],
          },
          backend: {
            loadPath: "/locales/{{lng}}/{{ns}}.json",
          },
          ...astroI18nextConfig.i18nextClient,
        };

        let serverImports = `import i18next from "i18next";import fsBackend from "i18next-fs-backend";`;
        let i18nextInitServer = `i18next.use(fsBackend)`;

        let clientImports = `import i18next from "i18next";import httpBackend from "i18next-http-backend";import LanguageDetector from "i18next-browser-languagedetector";`;
        let i18nextInitClient = `i18next.use(httpBackend).use(LanguageDetector)`;

        // Look for react integration and include react-i18next plugin import if found
        if (
          config.integrations.find(
            (integration) => integration.name === "@astrojs/react"
          )
        ) {
          serverImports += `import {initReactI18next} from "react-i18next";`;
          i18nextInitServer += `.use(initReactI18next)`;
          clientImports += `import {initReactI18next} from "react-i18next";`;
          i18nextInitClient += `.use(initReactI18next)`;
        }

        i18nextInitServer += `.init(${deeplyStringifyObject(serverConfig)});`;
        i18nextInitClient += `.init(${deeplyStringifyObject(clientConfig)});`;

        // initializing runtime astro-i18next config
        serverImports += `import {initAstroI18next} from "astro-i18next";`;
        const astroI18nextInit = `initAstroI18next(${JSON.stringify(
          astroI18nextConfig
        )});`;

        // client side i18next instance
        injectScript("before-hydration", clientImports + i18nextInitClient);

        // server side i18next instance
        injectScript(
          "page-ssr",
          serverImports + i18nextInitServer + astroI18nextInit
        );
      },
    },
  };
};

export function initAstroI18next(config: AstroI18nextConfig) {
  // init runtime config
  setAstroI18nextConfig(config);
}

export {
  interpolate,
  localizePath,
  localizeUrl,
  detectLocaleFromPath,
} from "./utils";

export { AstroI18nextConfig, AstroI18nextOptions } from "./types";

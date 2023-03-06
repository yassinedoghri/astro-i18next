import { AstroIntegration } from "astro";
import { InitOptions } from "i18next";
import { astroI18nextConfigBuilder, setAstroI18nextConfig } from "./config";
import { AstroI18nextConfig, AstroI18nextOptions, Plugins } from "./types";
import {
  moveDefaultLocaleToFirstIndex,
  deeplyStringifyObject,
  getUserConfig,
} from "./utils";
import { resolve } from "pathe";

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
          astroI18nextConfigBuilder(userConfig?.value as AstroI18nextConfig);

        /**
         * 1. Validate and prepare config
         */
        if (
          !astroI18nextConfig.defaultLocale ||
          astroI18nextConfig.defaultLocale === ""
        ) {
          throw new Error(
            "[astro-i18next]: you must set a `defaultLocale` in your astro-i18next config!"
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

        // make sure to have default locale set as first element in locales (for supportedLngs)
        if (
          astroI18nextConfig.locales[0] !== astroI18nextConfig.defaultLocale
        ) {
          moveDefaultLocaleToFirstIndex(
            astroI18nextConfig.locales as string[],
            astroI18nextConfig.defaultLocale
          );
        }

        // add trailingSlash config from astro if not set
        astroI18nextConfig.trailingSlash = config.trailingSlash;

        if (astroI18nextConfig.load.includes("server")) {
          // Build server side i18next config
          // set i18next supported and fallback languages (same as locales)
          const serverConfig: InitOptions = {
            supportedLngs: astroI18nextConfig.locales as string[],
            fallbackLng: astroI18nextConfig.locales as string[],
            ns: astroI18nextConfig.namespaces,
            defaultNS: astroI18nextConfig.defaultNamespace,
            initImmediate: false,
            backend: {
              loadPath: resolve(
                `${config.publicDir.pathname}/${astroI18nextConfig.resourcesBasePath}/{{lng}}/{{ns}}.json`
              ),
            },
            ...astroI18nextConfig.i18nextServer,
          };

          const defaultI18nextServerPlugins: Plugins = {
            fsBackend: "i18next-fs-backend",
          };

          const i18nextServerPlugins = {
            ...defaultI18nextServerPlugins,
            ...astroI18nextConfig.i18nextServerPlugins,
          };

          let { imports: serverImports, i18nextInit: i18nextInitServer } =
            i18nextScriptBuilder(serverConfig, i18nextServerPlugins);

          // initializing runtime astro-i18next config
          serverImports += `import {initAstroI18next} from "astro-i18next";`;
          const astroI18nextInit = `initAstroI18next(${deeplyStringifyObject(
            astroI18nextConfig
          )});`;

          // server side i18next instance
          injectScript(
            "page-ssr",
            serverImports + i18nextInitServer + astroI18nextInit
          );
        }

        if (astroI18nextConfig.load?.includes("client")) {
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
              loadPath: `${astroI18nextConfig.resourcesBasePath}/{{lng}}/{{ns}}.json`,
            },
            ...astroI18nextConfig.i18nextClient,
          };

          const defaultI18nextClientPlugins: Plugins = {
            httpBackend: "i18next-http-backend",
            LanguageDetector: "i18next-browser-languagedetector",
          };

          const i18nextClientPlugins = {
            ...defaultI18nextClientPlugins,
            ...astroI18nextConfig.i18nextClientPlugins,
          };

          let { imports: clientImports, i18nextInit: i18nextInitClient } =
            i18nextScriptBuilder(clientConfig, i18nextClientPlugins);

          // client side i18next instance
          injectScript("before-hydration", clientImports + i18nextInitClient);
        }
      },
    },
  };
};

const i18nextScriptBuilder = (config: InitOptions, plugins: Plugins) => {
  let imports = `import i18next from "i18next";`;
  let i18nextInit = "i18next";

  if (Object.keys(plugins).length > 0) {
    for (const key of Object.keys(plugins)) {
      // discard plugin if it does not have import name
      if (plugins[key] === null) {
        continue;
      }

      imports += `import ${key} from "${plugins[key]}";`;
      i18nextInit += `.use(${key.replace(/[{}]/g, "")})`;
    }
  }

  i18nextInit += `.init(${deeplyStringifyObject(config)});`;

  return { imports, i18nextInit };
};

export function initAstroI18next(config: AstroI18nextConfig) {
  // init runtime config
  setAstroI18nextConfig(config);
}

export { AstroI18next } from "./config";

export {
  createReferenceStringFromHTML,
  detectLocaleFromPath,
  interpolate,
  localizePath,
  localizeUrl,
} from "./utils";

export { AstroI18nextConfig, AstroI18nextOptions } from "./types";

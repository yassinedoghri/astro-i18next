import { AstroIntegration } from "astro";
import { AstroI18nextConfig, AstroI18nextOptions } from "./types";
import {
  moveBaseLanguageToFirstIndex,
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
          !astroI18nextConfig.defaultLanguage ||
          astroI18nextConfig.defaultLanguage === ""
        ) {
          throw new Error(
            "[astro-i18next]: you must set a `defaultLanguage` in your astroI18nextConfig!"
          );
        }

        if (!astroI18nextConfig.supportedLanguages) {
          astroI18nextConfig.supportedLanguages = [
            astroI18nextConfig.defaultLanguage,
          ];
        }

        if (
          !astroI18nextConfig.supportedLanguages.includes(
            astroI18nextConfig.defaultLanguage
          )
        ) {
          astroI18nextConfig.supportedLanguages.unshift(
            astroI18nextConfig.defaultLanguage
          );
        }

        // make sure to have base language set as first element in supportedLngs
        if (
          astroI18nextConfig.supportedLanguages[0] !==
          astroI18nextConfig.defaultLanguage
        ) {
          moveBaseLanguageToFirstIndex(
            astroI18nextConfig.supportedLanguages as string[],
            astroI18nextConfig.defaultLanguage
          );
        }

        // set i18next supported and fallback languages (same as supportedLocales)
        astroI18nextConfig.i18next.supportedLngs = [
          ...(astroI18nextConfig.supportedLanguages as string[]),
        ];
        astroI18nextConfig.i18next.fallbackLng = [
          ...(astroI18nextConfig.supportedLanguages as string[]),
        ];

        let imports = `import i18next from "i18next";`;
        let i18nextInit = `i18next`;
        if (
          astroI18nextConfig.i18nextPlugins &&
          Object.keys(astroI18nextConfig.i18nextPlugins).length > 0
        ) {
          // loop through plugins to import them
          for (const key of Object.keys(astroI18nextConfig.i18nextPlugins)) {
            imports += `import ${key} from "${astroI18nextConfig.i18nextPlugins[key]}";`;
          }

          // loop through plugins to use them
          for (const key of Object.keys(astroI18nextConfig.i18nextPlugins)) {
            i18nextInit += `.use(${key.replace(/[{}]/g, "")})`;
          }
        }
        i18nextInit += `.init(${deeplyStringifyObject(
          astroI18nextConfig.i18next
        )});`;

        injectScript("page-ssr", imports + i18nextInit);
      },
    },
  };
};

export {
  interpolate,
  localizePath,
  localizeUrl,
  detectLocaleFromPath,
} from "./utils";

export { AstroI18nextConfig, AstroI18nextOptions } from "./types";

import { AstroIntegration } from "astro";
import i18next, { i18n, InitOptions } from "i18next";
import { moveBaseLanguageToFirstIndex, deeplyStringifyObject } from "./utils";

export interface AstroI18nextOptions {
  /**
   * The default language for your website.
   *
   * @default undefined
   */
  baseLocale: string;

  /**
   * The locales that are supported by your website.
   *
   * @default undefined
   */
  supportedLocales: string[];

  /**
   * i18next config. See https://www.i18next.com/overview/configuration-options
   *
   * @default undefined
   */
  i18next: InitOptions;

  /**
   * i18next plugins. See https://www.i18next.com/overview/plugins-and-utils
   *
   * Include the plugins with the key being the import name and the value being the plugin name.
   *
   * Eg.:
   * ```
   * {
   *  "Backend": "i18next-fs-backend",
   * }
   * ```
   */
  i18nextPlugins: {
    [key: string]: string;
  };
}

export const aI18next: i18n = i18next;

export default (options: AstroI18nextOptions): AstroIntegration => {
  return {
    name: "astro-i18next",
    hooks: {
      "astro:config:setup": async ({ injectScript }) => {
        /**
         * 1. Validate and prepare config
         */
        if (!options.baseLocale || options.baseLocale === "") {
          throw new Error(
            "[astro-i18next]: you must set a `baseLanguage` in your config!"
          );
        }

        if (!options.supportedLocales) {
          options.supportedLocales = [options.baseLocale];
        }

        if (!options.supportedLocales.includes(options.baseLocale)) {
          options.supportedLocales.unshift(options.baseLocale);
        }

        // make sure to have base language set as first element in supportedLngs
        if (options.supportedLocales[0] !== options.baseLocale) {
          moveBaseLanguageToFirstIndex(
            options.supportedLocales as string[],
            options.baseLocale
          );
        }

        // set i18next supported and fallback languages (same as supportedLocales)
        options.i18next.supportedLngs = [
          ...(options.supportedLocales as string[]),
        ];
        options.i18next.fallbackLng = [
          ...(options.supportedLocales as string[]),
        ];

        let imports = `import i18next from "i18next";`;
        let i18nextInit = `i18next`;
        if (
          options.i18nextPlugins &&
          Object.keys(options.i18nextPlugins).length > 0
        ) {
          // loop through plugins to import them
          for (const key of Object.keys(options.i18nextPlugins)) {
            imports += `import ${key} from "${options.i18nextPlugins[key]}";`;
          }

          // loop through plugins to use them
          for (const key of Object.keys(options.i18nextPlugins)) {
            i18nextInit += `.use(${key})`;
          }
        }
        i18nextInit += `.init(${deeplyStringifyObject(options.i18next)});`;

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

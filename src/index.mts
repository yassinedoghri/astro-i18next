import { AstroIntegration } from "astro";
import { InitOptions } from "i18next";
import {
  moveBaseLanguageToFirstIndex,
  loadNamespaces,
  loadResources,
  loadResourcesNamespaced,
  deeplyStringifyObject,
} from "./utils";
import * as fs from "fs";

interface AstroI18nextOptions {
  baseLanguage: string;
  resourcesPath?: string;
  i18next: InitOptions;
}

export default (options: AstroI18nextOptions): AstroIntegration => {
  return {
    name: "astro-i18next",
    hooks: {
      "astro:config:setup": async ({ injectScript }) => {
        /**
         * 1. Validate and prepare config
         */
        if (!options.baseLanguage || options.baseLanguage === "") {
          throw new Error(
            "[astro-i18next]: you must set a `baseLanguage` in your config!"
          );
        }

        if (!options.i18next.supportedLngs) {
          throw new Error(
            "[astro-i18next]: i18next.supportedLngs must be set!"
          );
        }

        if (!options.i18next.supportedLngs.length) {
          throw new Error(
            "[astro-i18next]: i18next.supportedLngs must not be empty!"
          );
        }

        if (!options.i18next.supportedLngs.includes(options.baseLanguage)) {
          throw new Error(
            "[astro-i18next]: i18next.supportedLngs must include the base language!"
          );
        }

        if (options.resourcesPath) {
          // normalize resourcesPath: add trailing slash to resourcesPath if not present
          options.resourcesPath = options.resourcesPath.replace(/\/?$/, "/");
        } else {
          // set default resourcesPath if not defined
          options.resourcesPath = "src/locales/";
        }

        // make sure to have base language set as first element in supportedLngs
        if (options.i18next.supportedLngs[0] !== options.baseLanguage) {
          moveBaseLanguageToFirstIndex(
            options.i18next.supportedLngs as string[],
            options.baseLanguage
          );
        }

        // set i18next fallback languages (same as supportedLngs)
        options.i18next.fallbackLng = [
          ...(options.i18next.supportedLngs as string[]),
        ];

        /**
         * 2. Inject i18next translation resources based on config and contents of resourcesPath
         */

        // check if resourcesPath includes namespace directories or files (using the base language)
        if (fs.existsSync(options.resourcesPath + options.baseLanguage)) {
          // inject namespaces based on the ones set for baseLanguage in resourcesPath
          options.i18next.ns = loadNamespaces(
            options.resourcesPath,
            options.baseLanguage
          );

          // inject loaded namespaced resources to i18next.resources option
          options.i18next.resources = loadResourcesNamespaced(
            options.resourcesPath,
            options.i18next.supportedLngs as string[],
            options.i18next.ns as string[]
          );
        } else {
          // inject loaded resources to i18next.resources option
          options.i18next.resources = loadResources(
            options.resourcesPath,
            options.i18next.supportedLngs as string[]
          );
        }

        // init i18next
        injectScript(
          "page-ssr",
          `import i18next from "i18next";
           i18next.init(${deeplyStringifyObject(options.i18next)});`
        );
      },
    },
  };
};

export { interpolate, localizePath, localizeUrl } from "./utils";

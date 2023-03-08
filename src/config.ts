import { AstroI18nextConfig, AstroI18nextGlobal, Routes } from "./types";

export const AstroI18next: AstroI18nextGlobal = {
  config: {
    defaultLocale: "cimode",
    locales: [],
    namespaces: "translation",
    defaultNamespace: "translation",
    load: ["server"],
    routes: {},
    flatRoutes: {},
    showDefaultLocale: false,
    trailingSlash: "ignore",
    resourcesBasePath: "/locales",
  },
};

/* c8 ignore start */
export const setAstroI18nextConfig = (config: AstroI18nextConfig) => {
  let flatRoutes = {};
  for (const key in config) {
    if (key === "routes") {
      flatRoutes = flattenRoutes(config[key]);
    }

    AstroI18next.config[key] = config[key];
  }

  // @ts-ignore
  AstroI18next.config.flatRoutes = flatRoutes;
};

export const astroI18nextConfigBuilder = (
  config: AstroI18nextConfig
): AstroI18nextConfig => {
  return { ...AstroI18next.config, ...config };
};
/* c8 ignore stop */

/**
 * This will create a mapping of translated routes to search them easily.
 *
 * TODO: render all routes mappings in here (even those not translated),
 * this will help simplify utility functions logic
 */
export const flattenRoutes = (
  routes: AstroI18nextConfig["routes"],
  previous: string[] = [],
  translatedPrevious: string[] = [],
  prevResult: AstroI18nextConfig["flatRoutes"] = null
): AstroI18nextConfig["flatRoutes"] => {
  let result = prevResult || {};

  for (const i in routes) {
    if (typeof routes[i] === "object" && routes[i] !== null) {
      // Recursion on deeper objects
      flattenRoutes(
        routes[i] as Routes,
        [...previous, i],
        [
          ...translatedPrevious,
          Object.prototype.hasOwnProperty.call(routes[i], "index")
            ? routes[i]["index"]
            : i,
        ],
        result
      );
    } else {
      let key = "/" + previous.join("/");
      let value = "/" + translatedPrevious.join("/");

      if (i === "index") {
        result[key] = value;

        key += "/" + i;
        value += "/" + i;

        result[key] = value;
      } else {
        key += "/" + i;
        value += "/" + routes[i];

        result[key] = value;
      }
    }
  }

  return result;
};

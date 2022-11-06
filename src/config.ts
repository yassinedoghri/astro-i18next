import { AstroI18nextConfig, Routes } from "./types";

var astroI18nextConfig: AstroI18nextConfig = {
  defaultLocale: "cimode",
  locales: [],
  namespaces: "translation",
  defaultNamespace: "translation",
  routes: {},
  flatRoutes: {},
  showDefaultLocale: false,
};

export const getAstroI18nextConfig = () => astroI18nextConfig;

/* c8 ignore start */
export const setAstroI18nextConfig = (config: AstroI18nextConfig) => {
  for (const key in config) {
    if (key === "routes") {
      // @ts-ignore
      astroI18nextConfig["flatRoutes"] = flattenRoutes(config["routes"]);
    }

    astroI18nextConfig[key] = config[key];
  }
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

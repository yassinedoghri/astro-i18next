import { fileURLToPath } from "url";
import load from "@proload/core";
import { AstroI18nextConfig } from "./types";
import typescript from "@proload/plugin-tsm";

/**
 * Moves the default locale in the first index
 */
export const moveBaseLanguageToFirstIndex = (
  supportedLocales: string[],
  baseLocale: string
): void => {
  const baseLocaleIndex = supportedLocales.indexOf(baseLocale);
  supportedLocales.splice(baseLocaleIndex, 1);
  supportedLocales.unshift(baseLocale);
};

export const deeplyStringifyObject = (obj: object | Array<any>): string => {
  const isArray = Array.isArray(obj);
  let str = isArray ? "[" : "{";
  for (const key in obj) {
    if (obj[key] === null || obj[key] === undefined) {
      continue;
    }

    let value = null;

    // see typeof result: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof#description
    switch (typeof obj[key]) {
      case "string": {
        value = `"${obj[key]}"`;
        break;
      }
      case "number":
      case "boolean": {
        value = obj[key];
        break;
      }
      case "object": {
        value = deeplyStringifyObject(obj[key]);
        break;
      }
      case "function": {
        value = obj[key].toString().replace(/\s+/g, " ");
        break;
      }
      case "symbol": {
        value = `Symbol("${obj[key].description}")`;
        break;
      }
      /* c8 ignore start */
      default:
        break;
      /* c8 ignore stop */
    }

    str += isArray ? `${value},` : `"${key}": ${value},`;
  }
  return `${str}${isArray ? "]" : "}"}`;
};

/**
 * Adapted from astro's tailwind integration:
 * https://github.com/withastro/astro/tree/main/packages/integrations/tailwind
 */
/* c8 ignore start */
export const getUserConfig = async (
  root: URL,
  configPath?: string
): Promise<load.Config<AstroI18nextConfig>> => {
  const resolvedRoot = fileURLToPath(root);
  let userConfigPath: string | undefined;

  if (configPath) {
    const configPathWithLeadingSlash = /^\.*\//.test(configPath)
      ? configPath
      : `./${configPath}`;

    userConfigPath = fileURLToPath(new URL(configPathWithLeadingSlash, root));
  }

  load.use([typescript]);
  return (await load("astro-i18next", {
    mustExist: false,
    cwd: resolvedRoot,
    filePath: userConfigPath,
  })) as load.Config<AstroI18nextConfig>;
};
/* c8 ignore stop */

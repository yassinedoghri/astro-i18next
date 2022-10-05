import i18next, { type i18n, t } from "i18next";
import { fileURLToPath } from "url";
import load from "@proload/core";
import { AstroI18nextConfig } from "./types";
import typescript from "@proload/plugin-tsm";
import { I18NEXT_ROUTES_BUNDLE_NS } from "./constants";

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

/**
 * Interpolates a localized string (loaded with the i18nKey) to a given reference string.
 */
export const interpolate = (
  i18nKey: string,
  referenceString: string,
  namespace: string | null = null
): string => {
  const localizedString = t(i18nKey, { ns: namespace });

  if (localizedString === i18nKey) {
    console.warn(`WARNING(astro-i18next): missing translation key ${i18nKey}.`);
    return referenceString;
  }

  const tagsRegex = /<([\w\d]+)([^>]*)>/gi;

  const referenceStringMatches = referenceString.match(tagsRegex);

  if (!referenceStringMatches) {
    console.warn(
      "WARNING(astro-i18next): default slot does not include any HTML tag to interpolate! You should use the `t` function directly."
    );
    return localizedString;
  }

  const referenceTags = [];
  referenceStringMatches.forEach((tagNode) => {
    const [, name, attributes] = tagsRegex.exec(tagNode);
    referenceTags.push({ name, attributes });

    // reset regex state
    tagsRegex.exec("");
  });

  let interpolatedString = localizedString;
  for (let index = 0; index < referenceTags.length; index++) {
    const referencedTag = referenceTags[index];
    // Replace opening tags
    interpolatedString = interpolatedString.replaceAll(
      `<${index}>`,
      `<${referencedTag.name}${referencedTag.attributes}>`
    );
    // Replace closing tags
    interpolatedString = interpolatedString.replaceAll(
      `</${index}>`,
      `</${referencedTag.name}>`
    );
  }

  return interpolatedString;
};

/**
 * Creates a reference string from an HTML string. The reverse of interpolate(), for use
 * with <Trans> when not explicitly setting a key
 */
export const createReferenceStringFromHTML = (html: string) => {
  // Allow these tags to carry through to the output
  const allowedTags = ["strong", "br", "em", "i", "b"];

  let forbiddenStrings: { key: string; str: string }[] = [];
  if (i18next.options) {
    forbiddenStrings = [
      "keySeparator",
      "nsSeparator",
      "pluralSeparator",
      "contextSeparator",
    ]
      .map((key) => {
        const str = i18next.options[key];
        if (str) {
          return {
            key,
            str: i18next.options[key],
          };
        }
        return undefined;
      })
      .filter(function <T>(val: T | undefined): val is T {
        return typeof val !== "undefined";
      });
  }

  const tagsRegex = /<([\w\d]+)([^>]*)>/gi;

  const referenceStringMatches = html.match(tagsRegex);

  if (!referenceStringMatches) {
    console.warn(
      "WARNING(astro-i18next): default slot does not include any HTML tag to interpolate! You should use the `t` function directly."
    );
    return html;
  }

  const referenceTags = [];
  referenceStringMatches.forEach((tagNode) => {
    const [, name, attributes] = tagsRegex.exec(tagNode);
    referenceTags.push({ name, attributes });

    // reset regex state
    tagsRegex.exec("");
  });

  let sanitizedString = html.replace(/\s+/g, " ").trim();
  for (let index = 0; index < referenceTags.length; index++) {
    const referencedTag = referenceTags[index];
    if (
      allowedTags.includes(referencedTag.name) &&
      referencedTag.attributes.trim().length === 0
    ) {
      continue;
    }
    sanitizedString = sanitizedString.replaceAll(
      new RegExp(`<${referencedTag.name}[^>]*?\\s*\\/>`, "gi"),
      `<${index}/>`
    );
    sanitizedString = sanitizedString.replaceAll(
      `<${referencedTag.name}${referencedTag.attributes}>`,
      `<${index}>`
    );
    sanitizedString = sanitizedString.replaceAll(
      `</${referencedTag.name}>`,
      `</${index}>`
    );
  }

  for (let index = 0; index < forbiddenStrings.length; index++) {
    const { key, str } = forbiddenStrings[index];
    if (sanitizedString.includes(str)) {
      console.warn(
        `WARNING(astro-i18next): "${str}" was found in a <Trans> translation key, but it is also used as ${key}. Either explicitly set an i18nKey or change the value of ${key}.`
      );
    }
  }
  return sanitizedString;
};

/**
 * Injects the given locale to a path
 */
export const localizePath = (
  path: string = "/",
  locale: string | null = null,
  base: string = import.meta.env.BASE_URL
): string => {
  if (!locale) {
    locale = i18next.language;
  }

  // remove all leading slashes off of path
  path = path.replace(/^\/+|\/+$/g, "");
  path = path === "" ? "/" : "/" + path + "/";

  // remove leading and trailing slashes off of base path
  base = base.replace(/^\/+|\/+$/g, "");
  base = base === "" ? "/" : "/" + base + "/";

  // remove base path if found
  path = path.startsWith(base) ? path.slice(base.length) : path.slice(1);

  if (!(i18next.options.supportedLngs as string[]).includes(locale)) {
    console.warn(
      `WARNING(astro-i18next): "${locale}" locale is not supported, add it to the supportedLngs in your astro config.`
    );
    return base + path;
  }

  let pathSegments = path.split("/");

  if (
    JSON.stringify(pathSegments) === JSON.stringify([""]) ||
    JSON.stringify(pathSegments) === JSON.stringify(["", ""])
  ) {
    return locale === i18next.options.supportedLngs[0]
      ? base
      : `${base}${locale}/`;
  }

  // make a copy of i18next's supportedLngs
  const otherLocales = [...(i18next.options.supportedLngs as string[])];
  otherLocales.slice(1); // remove base locale (first index)

  // loop over all locales except the base one
  for (const otherLocale of otherLocales) {
    if (pathSegments[0] === otherLocale) {
      // if the path starts with one of the other locales, remove it from the path
      pathSegments.shift();
      break; // no need to continue
    }
  }

  // translating pathSegments
  const routeTranslations = getLanguageRouteTranslations(i18next, locale) || {};
  pathSegments = pathSegments.map((segment) =>
    routeTranslations[segment] ? routeTranslations[segment] : segment
  );

  // prepend the given locale if it's not the base one
  if (locale !== i18next.options.supportedLngs[0]) {
    pathSegments = [locale, ...pathSegments];
  }

  return base + pathSegments.join("/");
};

/**
 * Injects the given locale to a url
 */
export const localizeUrl = (
  url: string,
  locale: string | null = null,
  base: string = import.meta.env.BASE_URL
): string => {
  const [protocol, , host, ...path] = url.split("/");
  const baseUrl = protocol + "//" + host;

  return baseUrl + localizePath(path.join("/"), locale, base);
};

/**
 * Returns the locale detected from a given path
 */
export const detectLocaleFromPath = (path: string) => {
  // remove all leading slashes
  path = path.replace(/^\/+/g, "");

  const pathSegments = path.split("/");

  if (
    JSON.stringify(pathSegments) === JSON.stringify([""]) ||
    JSON.stringify(pathSegments) === JSON.stringify(["", ""])
  ) {
    return i18next.options.supportedLngs[0];
  }

  // make a copy of i18next's supportedLngs
  const otherLocales = [...(i18next.options.supportedLngs as string[])];
  otherLocales.slice(1); // remove base locale (first index)

  // loop over all locales except the base one
  for (const otherLocale of otherLocales) {
    if (pathSegments[0] === otherLocale) {
      // if the path starts with one of the other locales, then detected!
      return otherLocale;
    }
  }

  // return base locale by default
  return i18next.options.supportedLngs[0];
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

export const createResourceBundleCallback = (
  routes: AstroI18nextConfig["routes"] = {}
) => {
  let callback = "() => {";
  for (const lang in routes) {
    callback += `i18next.addResourceBundle("${lang}", "${I18NEXT_ROUTES_BUNDLE_NS}", ${JSON.stringify(
      routes[lang]
    )});`;
  }
  return `${callback}}`;
};

export const getLanguageRouteTranslations = (i18next: i18n, lang: string) => {
  return i18next.getResourceBundle(lang, I18NEXT_ROUTES_BUNDLE_NS) as
    | AstroI18nextConfig["routes"][keyof AstroI18nextConfig["routes"]]
    | undefined;
};

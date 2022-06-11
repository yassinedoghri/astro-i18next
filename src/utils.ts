import i18next, { t } from "i18next";

/**
 * Interpolates a localized string (loaded with the i18nKey) to a given reference string.
 *
 * @param i18nKey
 * @param referenceString
 * @returns
 */
export const interpolate = (
  i18nKey: string,
  referenceString: string
): string => {
  const localizedString = t(i18nKey);

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
    const [, name, attributes] = tagsRegex.exec(tagNode) || [];
    referenceTags.push({ name, attributes });

    // reset regex state
    tagsRegex.exec("");
  });

  let interpolatedString = localizedString;
  for (let index = 0; index < referenceTags.length; index++) {
    const referencedTag = referenceTags[index];
    interpolatedString = interpolatedString.replaceAll(
      `<${index}>`,
      `<${referencedTag.name}${referencedTag.attributes}>`
    );
    interpolatedString = interpolatedString.replaceAll(
      `</${index}>`,
      `</${referencedTag.name}>`
    );
  }

  return interpolatedString;
};

/**
 * Injects the current locale to a path
 *
 * @param path
 * @param locale
 */
export const localizePath = (
  path: string,
  locale: string | null = null
): string => {
  if (!locale) {
    locale = i18next.language;
  }

  if (!(i18next.options.supportedLngs as string[]).includes(locale)) {
    console.warn(
      `WARNING(astro-i18next): "${locale}" locale is not supported, add it to the supportedLngs in your astro config.`
    );
    return path;
  }

  // remove all leading slashes
  path = path.replace(/^\/+/g, "");

  let pathSegments = path.split("/");

  if (pathSegments.length === 0) {
    return locale === i18next.options.supportedLngs[0] ? `/` : `/${locale}`;
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

  // prepend the given locale if it's not the base one
  if (locale !== i18next.options.supportedLngs[0]) {
    pathSegments = [locale, ...pathSegments];
  }

  return "/" + pathSegments.join("/");
};

export const deeplyStringifyObject = (obj: object | Array<any>) => {
  const isArr = Array.isArray(obj);
  let str = isArr ? "[" : "{";
  for (const key in obj) {
    if (obj[key] === null || obj[key] === undefined) {
      continue;
    }
    let val = null;
    switch (typeof obj[key]) {
      case "string": {
        val = `"${obj[key]}"`;
        break;
      }
      case "number":
      case "boolean": {
        val = obj[key];
        break;
      }
      case "object": {
        val = deeplyStringifyObject(obj[key]);
        break;
      }
      case "function": {
        val = obj[key].toString();
        break;
      }
      case "symbol": {
        val = `Symbol("${obj[key].description}")`;
        break;
      }
      default:
        break;
    }
    str += isArr ? `${val},` : `"${key}": ${val},`;
  }
  return `${str}${isArr ? "]" : "}"}`;
};

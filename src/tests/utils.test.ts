import {
  loadResources,
  interpolate,
  localizePath,
  moveBaseLanguageToFirstIndex,
  loadResourcesNamespaced,
  loadNamespaces,
  localizeUrl,
} from "../utils";
import i18next from "i18next";

afterEach(() => {
  jest.clearAllMocks();
});

describe("moveBaseLanguageToFirstIndex(...)", () => {
  test("moves base language to first index", () => {
    const supportedLngs = ["fr", "es", "en"];

    moveBaseLanguageToFirstIndex(supportedLngs, "en");
    expect(supportedLngs).toStrictEqual(["en", "fr", "es"]);
  });

  test("keeps base language in first index", () => {
    const supportedLngs = ["fr", "es", "en"];

    moveBaseLanguageToFirstIndex(supportedLngs, "fr");
    expect(supportedLngs).toStrictEqual(["fr", "es", "en"]);
  });
});

describe("loadResources(...)", () => {
  const resourcesResult = {
    en: {
      translation: {
        hello: "Hello world!",
      },
    },
    es: {
      translation: {
        hello: "¡Hola Mundo!",
      },
    },
    fr: {
      translation: {
        hello: "Bonjour le monde !",
      },
    },
  };

  test("loads all languages", () => {
    const resources = loadResources("src/tests/locales/", ["en", "fr", "es"]);

    expect(resources).toStrictEqual(resourcesResult);
  });

  test("missing supported language", () => {
    expect(() =>
      loadResources("src/tests/locales/", ["en", "fr", "es", "de"])
    ).toThrowError();
  });

  test("does not load unsupported languages", () => {
    const resources = loadResources("src/tests/locales-with-unsupported/", [
      "en",
      "fr",
      "es",
    ]);

    expect(resources).toStrictEqual(resourcesResult);
  });
});

describe("loadNamespaces(...)", () => {
  test("loads all namespaces from base language", () => {
    const namespaces = loadNamespaces("src/tests/locales-namespaced/", "en");

    expect(namespaces).toStrictEqual(["home"]);
  });
});

describe("loadResourcesNamespaced(...)", () => {
  const resourcesResult = {
    en: {
      home: {
        hello: "Hello world!",
      },
    },
    es: {
      home: {
        hello: "¡Hola Mundo!",
      },
    },
    fr: {
      home: {
        hello: "Bonjour le monde !",
      },
    },
  };

  test("loads all namespaced languages", () => {
    const resources = loadResourcesNamespaced(
      "src/tests/locales-namespaced/",
      ["en", "fr", "es"],
      ["home"]
    );

    expect(resources).toStrictEqual(resourcesResult);
  });

  test("missing namespace resource for supported language", () => {
    expect(() =>
      loadResourcesNamespaced(
        "src/tests/locales-namespaced/",
        ["en", "fr", "es", "de"],
        ["home"]
      )
    ).toThrowError();
  });

  test("does not load unsupported languages", () => {
    const resources = loadResourcesNamespaced(
      "src/tests/locales-namespaced-with-unsupported/",
      ["en", "fr", "es"],
      ["home"]
    );

    expect(resources).toStrictEqual(resourcesResult);
  });
});

describe("interpolate(...)", () => {
  // load i18next config with "en", "fr", "fr-CA" and "es" as supported languages,
  // and "en" being the base language
  require("./i18next-test");

  jest.spyOn(console, "warn");
  const referenceString = "This is a <strong>super cool</strong> sentence!";

  test("interpolates the localized string", () => {
    i18next.changeLanguage("fr");
    const interpolatedStringFR =
      "Ceci est une phrase <strong>super cool</strong> !";

    expect(interpolate("interpolationKey", referenceString)).toBe(
      interpolatedStringFR
    );

    i18next.changeLanguage("en");
    expect(interpolate("interpolationKey", referenceString)).toBe(
      "This is a <strong>super cool</strong> sentence!"
    );
  });

  test("with an i18nKey that is undefined", () => {
    expect(interpolate("missingKey", referenceString)).toBe(referenceString);
    expect(console.warn).toHaveBeenCalled();
  });

  test("with no HTML tags in default slot", () => {
    expect(
      interpolate(
        "interpolationKeyNoHTML",
        "This is a reference string without any HTML tags!"
      )
    ).toBe("This is a reference string without any HTML tags!");
    expect(console.warn).toHaveBeenCalled();
  });

  test("with malformed HTML tags in default slot", () => {
    expect(
      interpolate(
        "interpolationKeyNoHTML",
        "This is a reference string with a <>malformed HTML tag</>!"
      )
    ).toBe("This is a reference string without any HTML tags!");
    expect(console.warn).toHaveBeenCalled();
  });
});

describe("localizePath(...)", () => {
  // load i18next config with "en", "fr", "fr-CA" and "es" as supported languages,
  // and "en" being the base language
  require("./i18next-test");

  jest.spyOn(console, "warn");

  test("generates the correct path given a path with supported locale", () => {
    i18next.changeLanguage("en");
    expect(localizePath("/")).toBe("/");
    expect(localizePath("/fr")).toBe("/");
    expect(localizePath("/about")).toBe("/about");
    expect(localizePath("/fr/about")).toBe("/about");

    i18next.changeLanguage("fr");
    expect(localizePath("/")).toBe("/fr/");
    expect(localizePath("/about")).toBe("/fr/about");
    expect(localizePath("/fr/about")).toBe("/fr/about");
    expect(localizePath("/fr-CA/about")).toBe("/fr/about");

    i18next.changeLanguage("fr-CA");
    expect(localizePath("/fr/about")).toBe("/fr-CA/about");
    expect(localizePath("/about")).toBe("/fr-CA/about");
  });

  test("with longer paths", () => {
    i18next.changeLanguage("fr");
    expect(localizePath("/really/long/path")).toBe("/fr/really/long/path");
    expect(localizePath("/super/huge/and/really/long/path")).toBe(
      "/fr/super/huge/and/really/long/path"
    );

    i18next.changeLanguage("fr-CA");
    expect(localizePath("/fr/really/long/path/with/locale/before")).toBe(
      "/fr-CA/really/long/path/with/locale/before"
    );

    i18next.changeLanguage("en");
    expect(localizePath("/fr/really/long/path/with/locale/before")).toBe(
      "/really/long/path/with/locale/before"
    );
  });

  test("with multiple leading slashes", () => {
    i18next.changeLanguage("fr");
    expect(localizePath("//fr-CA/about")).toBe("/fr/about");
    expect(localizePath("////fr/about")).toBe("/fr/about");
  });

  test("with an empty string as path", () => {
    i18next.changeLanguage("en"); // base language
    expect(localizePath("")).toBe("/");

    i18next.changeLanguage("fr");
    expect(localizePath("")).toBe("/fr/");
  });

  test("with no supplied path", () => {
    i18next.changeLanguage("en"); // base language
    expect(localizePath()).toBe("/");

    i18next.changeLanguage("fr");
    expect(localizePath()).toBe("/fr/");
  });

  test("with an unsupported locale", () => {
    i18next.changeLanguage("de");
    expect(localizePath("/fr/about")).toBe("/fr/about");
    expect(console.warn).toHaveBeenCalled();
  });
});

describe("localizeUrl(...)", () => {
  // load i18next config with "en", "fr", "fr-CA" and "es" as supported languages,
  // and "en" being the base language
  require("./i18next-test");

  test("generates the correct url given a url with supported locale", () => {
    i18next.changeLanguage("en");
    expect(localizeUrl("https://example.com/")).toBe("https://example.com/");
    expect(localizeUrl("https://example.com/about")).toBe(
      "https://example.com/about"
    );
    expect(localizeUrl("https://example.com/fr/")).toBe("https://example.com/");
    expect(localizeUrl("https://example.com/fr/about")).toBe(
      "https://example.com/about"
    );

    i18next.changeLanguage("fr");
    expect(localizeUrl("https://example.com/")).toBe("https://example.com/fr/");
    expect(localizeUrl("https://example.com/about")).toBe(
      "https://example.com/fr/about"
    );
  });
});

import {
  interpolate,
  localizePath,
  moveBaseLanguageToFirstIndex,
  localizeUrl,
  deeplyStringifyObject,
  detectLocaleFromPath,
} from "../utils";
import i18next from "i18next";

// init i18next config with "en", "fr", "fr-CA" and "es" as supported languages,
// and "en" being the base language
i18next.init({
  lng: "en",
  debug: false,
  supportedLngs: ["en", "fr", "es", "fr-CA"], // ℹ️ base language is the first one, ie. "en"
  fallbackLng: ["en", "fr", "es", "fr-CA"],
  resources: {
    en: {
      translation: {
        hello: "Hello!",
        interpolationKey: "This is a <0>super cool</0> sentence!",
        interpolationKeyNoHTML:
          "This is a reference string without any HTML tags!",
      },
    },
    fr: {
      translation: {
        hello: "Bonjour !",
        interpolationKey: "Ceci est une phrase <0>super cool</0> !",
        interpolationKeyNoHTML:
          "Ceci est une chaîne de caractères de référence, sans aucune balise HTML !",
      },
    },
  },
});

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

describe("interpolate(...)", () => {
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

describe("detectLocaleFromPath(...)", () => {
  test("with supported locales", () => {
    expect(detectLocaleFromPath("/")).toBe("en");
    expect(detectLocaleFromPath("")).toBe("en");

    expect(detectLocaleFromPath("/example/path")).toBe("en");
    expect(detectLocaleFromPath("another/example")).toBe("en");

    expect(detectLocaleFromPath("/fr/another/example")).toBe("fr");
    expect(detectLocaleFromPath("fr/another/example")).toBe("fr");

    expect(detectLocaleFromPath("/fr-CA/another/example")).toBe("fr-CA");
  });

  test("with unsupported locales", () => {
    expect(detectLocaleFromPath("/de/example")).toBe("en");
    expect(detectLocaleFromPath("de/example")).toBe("en");
  });
});

describe("deeplyStringifyObject(...)", () => {
  test("with deep object", () => {
    const objectToStringify = {
      string1: "This is a string",
      object1: {
        string2: "This is another string",
        string3: "This is yet another string",
        function1: function () {
          console.log("This is a function");
        },
        arrowFunction: () => {
          console.log("This is an arrow function");
        },
        array1: [12346, 55, "string", { foo: "foo", bar: "bar" }],
        object2: {
          string4: "Again, another string!",
        },
        symbol1: Symbol("sym"),
        nan1: NaN,
        infinity1: Infinity,
        negativeInfinity1: -Infinity,
        undefined1: undefined,
        null1: null,
        boolean1: true,
        boolean2: false,
      },
    };

    expect(deeplyStringifyObject(objectToStringify)).toBe(
      `{"string1": "This is a string","object1": {"string2": "This is another string","string3": "This is yet another string","function1": function () { console.log("This is a function"); },"arrowFunction": () => { console.log("This is an arrow function"); },"array1": [12346,55,"string",{"foo": "foo","bar": "bar",},],"object2": {"string4": "Again, another string!",},"symbol1": Symbol("sym"),"nan1": NaN,"infinity1": Infinity,"negativeInfinity1": -Infinity,"boolean1": true,"boolean2": false,},}`
    );
  });

  test("with deep array", () => {
    const arrayToStringify = [
      {
        string1: "This is a string",
        object1: {
          string2: "This is another string",
          string3: "This is yet another string",
          function1: function () {
            console.log("This is a function");
          },
          arrowFunction: () => {
            console.log("This is an arrow function");
          },
          array1: [12346, 55, "string", { foo: "foo", bar: "bar" }],
          object2: {
            string4: "Again, another string!",
          },
          symbol1: Symbol("sym"),
          nan1: NaN,
          infinity1: Infinity,
          negativeInfinity1: -Infinity,
          undefined1: undefined,
          null1: null,
          boolean1: true,
          boolean2: false,
        },
      },
      {
        string1: "This is a string",
        object1: {
          string2: "This is another string",
          string3: "This is yet another string",
          function1: function () {
            console.log("This is a function");
          },
          arrowFunction: () => {
            console.log("This is an arrow function");
          },
          array1: [12346, 55, "string", { foo: "foo", bar: "bar" }],
          object2: {
            string4: "Again, another string!",
          },
          symbol1: Symbol("sym"),
          nan1: NaN,
          infinity1: Infinity,
          negativeInfinity1: -Infinity,
          undefined1: undefined,
          null1: null,
          boolean1: true,
          boolean2: false,
        },
      },
    ];

    expect(deeplyStringifyObject(arrayToStringify)).toBe(
      `[{"string1": "This is a string","object1": {"string2": "This is another string","string3": "This is yet another string","function1": function () { console.log("This is a function"); },"arrowFunction": () => { console.log("This is an arrow function"); },"array1": [12346,55,"string",{"foo": "foo","bar": "bar",},],"object2": {"string4": "Again, another string!",},"symbol1": Symbol("sym"),"nan1": NaN,"infinity1": Infinity,"negativeInfinity1": -Infinity,"boolean1": true,"boolean2": false,},},{"string1": "This is a string","object1": {"string2": "This is another string","string3": "This is yet another string","function1": function () { console.log("This is a function"); },"arrowFunction": () => { console.log("This is an arrow function"); },"array1": [12346,55,"string",{"foo": "foo","bar": "bar",},],"object2": {"string4": "Again, another string!",},"symbol1": Symbol("sym"),"nan1": NaN,"infinity1": Infinity,"negativeInfinity1": -Infinity,"boolean1": true,"boolean2": false,},},]`
    );
  });
});

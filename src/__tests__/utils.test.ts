import {
  interpolate,
  createReferenceStringFromHTML,
  localizePath,
  movedefaultLocaleToFirstIndex,
  localizeUrl,
  deeplyStringifyObject,
  detectLocaleFromPath,
} from "../utils";
import i18next from "i18next";
import { afterEach, describe, expect, it, vi } from "vitest";

// init i18next config with "en", "fr", "fr-CA" and "es" as supported locales,
// and "en" being the default locale
i18next.init({
  lng: "en",
  debug: false,
  supportedLngs: ["en", "fr", "es", "fr-CA"], // ℹ️ default locale is the first one, ie. "en"
  fallbackLng: ["en", "fr", "es", "fr-CA"],
  resources: {
    en: {
      translation: {
        hello: "Hello!",
        interpolationKey: "This is a <0>super cool</0> sentence!",
        interpolationKeySelfClosing: "This has an image <0> here",
        interpolationKeyNoHTML:
          "This is a reference string without any HTML tags!",
      },
    },
    fr: {
      translation: {
        hello: "Bonjour !",
        interpolationKey: "Ceci est une phrase <0>super cool</0> !",
        interpolationKeySelfClosing: "Ceci a une image <0> ici",
        interpolationKeyNoHTML:
          "Ceci est une chaîne de caractères de référence, sans aucune balise HTML !",
      },
    },
  },
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("moveBaseLanguageToFirstIndex(...)", () => {
  it("moves default locale to first index", () => {
    const supportedLngs = ["fr", "es", "en"];

    movedefaultLocaleToFirstIndex(supportedLngs, "en");
    expect(supportedLngs).toStrictEqual(["en", "fr", "es"]);
  });

  it("keeps default locale in first index", () => {
    const supportedLngs = ["fr", "es", "en"];

    movedefaultLocaleToFirstIndex(supportedLngs, "fr");
    expect(supportedLngs).toStrictEqual(["fr", "es", "en"]);
  });
});

describe("interpolate(...)", () => {
  vi.spyOn(console, "warn");
  const referenceString = "This is a <strong>super cool</strong> sentence!";

  it("interpolates the localized string", () => {
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

  it("interpolates localized string with self-closing HTML tags", () => {
    i18next.changeLanguage("fr");
    const referenceString = 'This has an image <img src="./img.png"> here';
    const interpolatedStringFR = 'Ceci a une image <img src="./img.png"> ici';

    expect(interpolate("interpolationKeySelfClosing", referenceString)).toBe(
      interpolatedStringFR
    );

    i18next.changeLanguage("en");
    expect(interpolate("interpolationKeySelfClosing", referenceString)).toBe(
      'This has an image <img src="./img.png"> here'
    );
  });

  it("with an i18nKey that is undefined", () => {
    expect(interpolate("missingKey", referenceString)).toBe(referenceString);
    expect(console.warn).toHaveBeenCalled();
  });

  it("with no HTML tags in default slot", () => {
    i18next.changeLanguage("en");
    expect(
      interpolate(
        "interpolationKeyNoHTML",
        "This is a reference string without any HTML tags!"
      )
    ).toBe("This is a reference string without any HTML tags!");
    expect(console.warn).toHaveBeenCalled();
  });

  it("with malformed HTML tags in default slot", () => {
    i18next.changeLanguage("en");
    expect(
      interpolate(
        "interpolationKeyNoHTML",
        "This is a reference string with a <>malformed HTML tag</>!"
      )
    ).toBe("This is a reference string without any HTML tags!");
    expect(console.warn).toHaveBeenCalled();
  });
});

describe("createReferenceStringFromHTML(...)", () => {
  it("replaces HTML elements", () => {
    expect(createReferenceStringFromHTML("Single <h1>element</h1>")).toBe(
      "Single <0>element</0>"
    );
    expect(
      createReferenceStringFromHTML(
        'Multiple <div class="wrapper" id="head"><h1>Elements</h1><p>Nested and with attributes</p></div>'
      )
    ).toBe("Multiple <0><1>Elements</1><2>Nested and with attributes</2></0>");

    expect(
      createReferenceStringFromHTML(
        '<p>Self <img src="./img.png"> closing tags</p>'
      )
    ).toBe("<0>Self <1> closing tags</0>");
  });

  it("ignores allowed elements with no attributes", () => {
    expect(
      createReferenceStringFromHTML("<p>Text with <em>emphasis</em></p>")
    ).toEqual("<0>Text with <em>emphasis</em></0>");

    expect(
      createReferenceStringFromHTML(
        '<p>Text with <em class="test">emphasis</em></p>'
      )
    ).toEqual("<0>Text with <1>emphasis</1></0>");

    expect(
      createReferenceStringFromHTML("<em>Text with <div>div</div></em>")
    ).toEqual("<em>Text with <1>div</1></em>");
  });

  it("warns when contains separator strings", () => {
    const keySeparator = i18next.options.keySeparator;

    expect(
      createReferenceStringFromHTML(
        `<p>Text with <em>emphasis</em>${keySeparator}</p>`
      )
    ).toEqual(`<0>Text with <em>emphasis</em>${keySeparator}</0>`);

    expect(console.warn).toHaveBeenCalled();
  });

  it("collapses extra whitespace", () => {
    expect(
      createReferenceStringFromHTML("Single  \n    \t    <h1>element</h1>")
    ).toBe("Single <0>element</0>");
    expect(
      createReferenceStringFromHTML("   Trims <h1>outer</h1> text     ")
    ).toBe("Trims <0>outer</0> text");
  });

  it("does not cause duplicate elements with attributes to be collapsed", () => {
    expect(
      createReferenceStringFromHTML(
        `<span><span class="one">one</span><span class="two">two</span></span>`
      )
    ).toBe("<0><1>one</0><2>two</0></0>");
  });
});

describe("interpolate(...) and createReferenceStringFromHTML(...)", () => {
  it("methods undo each other", () => {
    const html =
      '<p class="test1" id="test2"><strong>The</strong> text with <img src="./img.png"> image <em>reconstructs</em> properly</p>';
    const frHtml =
      '<p class="test1" id="test2"><strong>Le</strong> texte avec <img src="./img.png"> image <em>se reconstruit</em> correctement</p>';
    const key = createReferenceStringFromHTML(html);
    const frKey = createReferenceStringFromHTML(frHtml);
    i18next.addResources("en", "translation", {
      [key]: key,
    });
    i18next.addResources("fr", "translation", {
      [key]: frKey,
    });

    i18next.changeLanguage("fr");
    expect(interpolate(key, html)).toBe(frHtml);
  });
});

describe("localizePath(...)", () => {
  vi.spyOn(console, "warn");

  it("generates the correct path given a path with supported locale", () => {
    i18next.changeLanguage("en");
    expect(localizePath("/")).toBe("/");
    expect(localizePath("/fr")).toBe("/");
    expect(localizePath("/about")).toBe("/about/");
    expect(localizePath("/fr/about")).toBe("/about/");

    i18next.changeLanguage("fr");
    expect(localizePath("/")).toBe("/fr/");
    expect(localizePath("/about")).toBe("/fr/about/");
    expect(localizePath("/fr/about")).toBe("/fr/about/");
    expect(localizePath("/fr-CA/about")).toBe("/fr/about/");

    i18next.changeLanguage("fr-CA");
    expect(localizePath("/fr/about")).toBe("/fr-CA/about/");
    expect(localizePath("/about")).toBe("/fr-CA/about/");
  });

  it("with longer paths", () => {
    i18next.changeLanguage("fr");
    expect(localizePath("/really/long/path")).toBe("/fr/really/long/path/");
    expect(localizePath("/super/huge/and/really/long/path")).toBe(
      "/fr/super/huge/and/really/long/path/"
    );

    i18next.changeLanguage("fr-CA");
    expect(localizePath("/fr/really/long/path/with/locale/before")).toBe(
      "/fr-CA/really/long/path/with/locale/before/"
    );

    i18next.changeLanguage("en");
    expect(localizePath("/fr/really/long/path/with/locale/before")).toBe(
      "/really/long/path/with/locale/before/"
    );
  });

  it("with multiple leading slashes", () => {
    i18next.changeLanguage("fr");
    expect(localizePath("//fr-CA/about")).toBe("/fr/about/");
    expect(localizePath("////fr/about")).toBe("/fr/about/");
  });

  it("with an empty string as path", () => {
    i18next.changeLanguage("en"); // default locale
    expect(localizePath("")).toBe("/");

    i18next.changeLanguage("fr");
    expect(localizePath("")).toBe("/fr/");
  });

  it("with no supplied path", () => {
    i18next.changeLanguage("en"); // default locale
    expect(localizePath()).toBe("/");

    i18next.changeLanguage("fr");
    expect(localizePath()).toBe("/fr/");
  });

  it("with an unsupported locale", () => {
    i18next.changeLanguage("de");
    expect(localizePath("/fr/about")).toBe("/fr/about/");
    expect(console.warn).toHaveBeenCalled();
  });

  it("with base path", () => {
    i18next.changeLanguage("fr");
    expect(localizePath("/base", null, "/base/")).toBe("/base/fr/");
    expect(localizePath("/base/about", null, "/base/")).toBe("/base/fr/about/");
    expect(localizePath("/about", null, "/base/")).toBe("/base/fr/about/");
    expect(localizePath("/", null, "/base/")).toBe("/base/fr/");
    expect(localizePath("", null, "/base/")).toBe("/base/fr/");

    i18next.changeLanguage("en");
    expect(localizePath("/base/about", null, "/base/")).toBe("/base/about/");
    expect(localizePath("/about", null, "/base/")).toBe("/base/about/");
    expect(localizePath("/", null, "/base/")).toBe("/base/");
    expect(localizePath("", null, "/base/")).toBe("/base/");

    i18next.changeLanguage("de");
    expect(localizePath("/fr/about", null, "/base/")).toBe("/base/fr/about/");
    expect(localizePath("base/fr/about", null, "base")).toBe("/base/fr/about/");
    expect(console.warn).toHaveBeenCalled();
  });

  it("with base path written weirdly", () => {
    i18next.changeLanguage("fr");
    expect(localizePath("", null, "base")).toBe("/base/fr/");
    expect(localizePath("", null, "/base")).toBe("/base/fr/");
    expect(localizePath("", null, "base/")).toBe("/base/fr/");
    expect(localizePath("", null, "//base//")).toBe("/base/fr/");
    expect(localizePath("", null, "/base///")).toBe("/base/fr/");
    expect(localizePath("", null, "///base/")).toBe("/base/fr/");
  });
});

describe("localizeUrl(...)", () => {
  it("generates the correct url given a url with supported locale", () => {
    i18next.changeLanguage("en");
    expect(localizeUrl("https://example.com/")).toBe("https://example.com/");
    expect(localizeUrl("https://example.com/about")).toBe(
      "https://example.com/about/"
    );
    expect(localizeUrl("https://example.com/fr/")).toBe("https://example.com/");
    expect(localizeUrl("https://example.com/fr/about")).toBe(
      "https://example.com/about/"
    );

    i18next.changeLanguage("fr");
    expect(localizeUrl("https://example.com/")).toBe("https://example.com/fr/");
    expect(localizeUrl("https://example.com/about")).toBe(
      "https://example.com/fr/about/"
    );
  });

  it("generates the correct url given a url with a base path", () => {
    i18next.changeLanguage("en");
    expect(localizeUrl("https://example.com/base/", null, "/base/")).toBe(
      "https://example.com/base/"
    );
    expect(localizeUrl("https://example.com/base/about/", null, "/base/")).toBe(
      "https://example.com/base/about/"
    );
    expect(localizeUrl("https://example.com/fr/", null, "/base/")).toBe(
      "https://example.com/base/"
    );
    expect(
      localizeUrl("https://example.com/base/fr/about", null, "/base/")
    ).toBe("https://example.com/base/about/");

    i18next.changeLanguage("fr");
    expect(localizeUrl("https://example.com/", null, "/base/")).toBe(
      "https://example.com/base/fr/"
    );
    expect(localizeUrl("https://example.com/about", null, "/base/")).toBe(
      "https://example.com/base/fr/about/"
    );
  });
});

describe("detectLocaleFromPath(...)", () => {
  it("with supported locales", () => {
    expect(detectLocaleFromPath("/")).toBe("en");
    expect(detectLocaleFromPath("")).toBe("en");

    expect(detectLocaleFromPath("/example/path")).toBe("en");
    expect(detectLocaleFromPath("another/example")).toBe("en");

    expect(detectLocaleFromPath("/fr/another/example")).toBe("fr");
    expect(detectLocaleFromPath("fr/another/example")).toBe("fr");

    expect(detectLocaleFromPath("/fr-CA/another/example")).toBe("fr-CA");
  });

  it("with unsupported locales", () => {
    expect(detectLocaleFromPath("/de/example")).toBe("en");
    expect(detectLocaleFromPath("de/example")).toBe("en");
  });
});

describe("deeplyStringifyObject(...)", () => {
  it("with deep object", () => {
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
      `{"string1": "This is a string","object1": {"string2": "This is another string","string3": "This is yet another string","function1": function() { console.log("This is a function"); },"arrowFunction": () => { console.log("This is an arrow function"); },"array1": [12346,55,"string",{"foo": "foo","bar": "bar",},],"object2": {"string4": "Again, another string!",},"symbol1": Symbol("sym"),"nan1": NaN,"infinity1": Infinity,"negativeInfinity1": -Infinity,"boolean1": true,"boolean2": false,},}`
    );
  });

  it("with deep array", () => {
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
      `[{"string1": "This is a string","object1": {"string2": "This is another string","string3": "This is yet another string","function1": function() { console.log("This is a function"); },"arrowFunction": () => { console.log("This is an arrow function"); },"array1": [12346,55,"string",{"foo": "foo","bar": "bar",},],"object2": {"string4": "Again, another string!",},"symbol1": Symbol("sym"),"nan1": NaN,"infinity1": Infinity,"negativeInfinity1": -Infinity,"boolean1": true,"boolean2": false,},},{"string1": "This is a string","object1": {"string2": "This is another string","string3": "This is yet another string","function1": function() { console.log("This is a function"); },"arrowFunction": () => { console.log("This is an arrow function"); },"array1": [12346,55,"string",{"foo": "foo","bar": "bar",},],"object2": {"string4": "Again, another string!",},"symbol1": Symbol("sym"),"nan1": NaN,"infinity1": Infinity,"negativeInfinity1": -Infinity,"boolean1": true,"boolean2": false,},},]`
    );
  });
});

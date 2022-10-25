import {
  moveBaseLanguageToFirstIndex,
  deeplyStringifyObject,
} from "../pluginUtils";
import i18next from "i18next";
import { afterEach, describe, expect, it, vi } from "vitest";

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
  it("moves base language to first index", () => {
    const supportedLngs = ["fr", "es", "en"];

    moveBaseLanguageToFirstIndex(supportedLngs, "en");
    expect(supportedLngs).toStrictEqual(["en", "fr", "es"]);
  });

  it("keeps base language in first index", () => {
    const supportedLngs = ["fr", "es", "en"];

    moveBaseLanguageToFirstIndex(supportedLngs, "fr");
    expect(supportedLngs).toStrictEqual(["fr", "es", "en"]);
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

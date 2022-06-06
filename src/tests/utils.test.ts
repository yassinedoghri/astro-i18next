import { interpolate, localizePath } from "../utils";
import i18next from "i18next";

afterEach(() => {
  jest.clearAllMocks();
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

  test("with an unsupported locale", () => {
    i18next.changeLanguage("de");
    expect(localizePath("/fr/about")).toBe("/fr/about");
    expect(console.warn).toHaveBeenCalled();
  });
});

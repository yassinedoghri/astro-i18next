import {
  doesStringIncludeFrontmatter,
  extractFrontmatterFromAstroSource,
  isLocale,
  overwriteAstroFrontmatter,
} from "../../cli/utils";

describe("isLocale(...)", () => {
  test("with correct iso6391 only", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("fr")).toBe(true);
    expect(isLocale("es")).toBe(true);
    expect(isLocale("de")).toBe(true);
  });

  test("with correct iso6391 and iso33661a2", () => {
    expect(isLocale("en-US")).toBe(true);
    expect(isLocale("fr-FR")).toBe(true);
    expect(isLocale("fr-BE")).toBe(true);
    expect(isLocale("pt-BR")).toBe(true);
  });

  test("with wrong format / random strings", () => {
    expect(isLocale("en_US")).toBe(false);
    expect(isLocale("frFR")).toBe(false);
    expect(isLocale("foo")).toBe(false);
    expect(isLocale("bar")).toBe(false);
  });

  test("with incorrect iso6391 only", () => {
    expect(isLocale("cc")).toBe(false);
    expect(isLocale("zz")).toBe(false);
  });

  test("with correct iso33661a2 but incorrect iso6391", () => {
    expect(isLocale("cc-FR")).toBe(false);
    expect(isLocale("cc-FR")).toBe(false);
  });

  test("with correct iso6391 but incorrect iso33661a2", () => {
    expect(isLocale("en-AA")).toBe(false);
    expect(isLocale("en-AA")).toBe(false);
  });
});

describe("doesStringIncludeFrontmatter(...)", () => {
  test("with frontmatter in source", () => {
    expect(
      doesStringIncludeFrontmatter(
        `---\nconsole.log("Hello World");\n---\n<div>Hello world</div>`
      )
    ).toBe(true);
  });

  test("without frontmatter in source", () => {
    expect(doesStringIncludeFrontmatter(`<div>Hello World</div`)).toBe(false);
  });
});

describe("extractFrontmatterFromAstroSource(...)", () => {
  test("with frontmatter in source", () => {
    expect(
      extractFrontmatterFromAstroSource(
        `---\nconsole.log("Hello World");\n---\n<div>Hello world</div>`
      )
    ).toBe(`\nconsole.log("Hello World");\n`);
  });

  test("without frontmatter in source", () => {
    expect(extractFrontmatterFromAstroSource(`<div>Hello World</div`)).toBe("");
  });
});

describe("overwriteAstroFrontmatter(...)", () => {
  test("replaces frontmatter in source", () => {
    expect(
      overwriteAstroFrontmatter(
        `---\nconsole.log("Hello World");\n---\n<div>Hello world</div>`,
        `console.log("Howdy World!");`
      )
    ).toBe(`---\nconsole.log("Howdy World!");\n---\n<div>Hello world</div>`);
  });

  test("adds frontmatter if no frontmatter is present", () => {
    expect(
      overwriteAstroFrontmatter(
        `<div>Hello world</div>`,
        `console.log("Howdy World!");`
      )
    ).toBe(`---\nconsole.log("Howdy World!");\n---\n<div>Hello world</div>`);
  });
});

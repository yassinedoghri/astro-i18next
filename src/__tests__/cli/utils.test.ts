import { describe, expect, it } from "vitest";
import {
  addDepthToRelativePath,
  resolveTranslatedAstroPath,
  doesStringIncludeFrontmatter,
  extractFrontmatterFromAstroSource,
  isFileHidden,
  overwriteAstroFrontmatter,
  resolveRelativePathsLevel,
} from "../../cli/utils";
import { CodeStringsTest } from "../types";

describe("doesStringIncludeFrontmatter(...)", () => {
  it("with frontmatter in source", () => {
    expect(
      doesStringIncludeFrontmatter(
        `---\nconsole.log("Hello World");\n---\n<div>Hello world</div>`
      )
    ).toBe(true);
  });

  it("without frontmatter in source", () => {
    expect(doesStringIncludeFrontmatter(`<div>Hello World</div`)).toBe(false);
  });
});

describe("extractFrontmatterFromAstroSource(...)", () => {
  it("with frontmatter in source", () => {
    expect(
      extractFrontmatterFromAstroSource(
        `---\nconsole.log("Hello World");\n---\n<div>Hello world</div>`
      )
    ).toBe(`\nconsole.log("Hello World");\n`);
  });

  it("without frontmatter in source", () => {
    expect(extractFrontmatterFromAstroSource(`<div>Hello World</div`)).toBe("");
  });
});

describe("overwriteAstroFrontmatter(...)", () => {
  it("replaces frontmatter in source", () => {
    expect(
      overwriteAstroFrontmatter(
        `---\nconsole.log("Hello World");\n---\n<div>Hello world</div>`,
        `console.log("Howdy World!");`
      )
    ).toBe(`---\nconsole.log("Howdy World!");\n---\n<div>Hello world</div>`);
  });

  it("with source wrapped with unwanted newlines", () => {
    expect(
      overwriteAstroFrontmatter(
        `---\n\nconsole.log("Hello World");\n\n---\n<div>Hello world</div>`,
        `console.log("Howdy World!");`
      )
    ).toBe(`---\nconsole.log("Howdy World!");\n---\n<div>Hello world</div>`);
  });

  it("adds frontmatter if no frontmatter is present", () => {
    expect(
      overwriteAstroFrontmatter(
        `<div>Hello world</div>`,
        `console.log("Howdy World!");`
      )
    ).toBe(`---\nconsole.log("Howdy World!");\n---\n\n<div>Hello world</div>`);
  });

  it("with frontmatter wrapped with unwanted newlines", () => {
    expect(
      overwriteAstroFrontmatter(
        `<div>Hello world</div>`,
        `\n\nconsole.log("Howdy World!");\n\n`
      )
    ).toBe(`---\nconsole.log("Howdy World!");\n---\n\n<div>Hello world</div>`);
  });
});

describe("addDepthToRelativePath(...)", () => {
  it("with any depth level / path", () => {
    expect(addDepthToRelativePath("../foo/bar", 1)).toBe("../../foo/bar");
    expect(addDepthToRelativePath("../../../foo/bar/baz", 2)).toBe(
      "../../../../../foo/bar/baz"
    );
    expect(addDepthToRelativePath("../../foo", 5)).toBe(
      "../../../../../../../foo"
    );
  });

  it("with relative path beginning with current folder", () => {
    expect(addDepthToRelativePath("./foo/bar/baz", 1)).toBe("../foo/bar/baz");
    expect(addDepthToRelativePath("./foo/bar/baz", 2)).toBe(
      "../../foo/bar/baz"
    );
    expect(addDepthToRelativePath("./foo/bar/baz", 5)).toBe(
      "../../../../../foo/bar/baz"
    );
  });
});

describe("isFileVisible(...)", () => {
  it("with hidden files", () => {
    expect(isFileHidden("_foo.ts")).toBe(true);
    expect(isFileHidden("_foo/bar.ts")).toBe(true);
    expect(isFileHidden("_foo/bar/baz.ts")).toBe(true);
    expect(isFileHidden("foo/_bar/baz.ts")).toBe(true);
  });

  it("with visible files", () => {
    expect(isFileHidden("foo.ts")).toBe(false);
    expect(isFileHidden("foo/bar.ts")).toBe(false);
    expect(isFileHidden("foo/bar/baz.ts")).toBe(false);
  });
});

describe("resolveTranslatedPath(...)", () => {
  const flatRouteTranslations = {
    "/fr/about": "/fr/a-propos",
    "/fr/contact-us": "/fr/contactez-nous",
    "/es/about": "/es/a-propos",
    "/es/contact-us": "/es/contactenos",
  };

  it("with translated path", () => {
    expect(
      resolveTranslatedAstroPath(
        "index.astro",
        "fr",
        "./src/pages",
        flatRouteTranslations
      )
    ).toBe("./src/pages/fr/index.astro");
    expect(
      resolveTranslatedAstroPath(
        "about.astro",
        "fr",
        "./src/pages",
        flatRouteTranslations
      )
    ).toBe("./src/pages/fr/a-propos.astro");
    expect(
      resolveTranslatedAstroPath(
        "contact-us.astro",
        "es",
        "./src/pages",
        flatRouteTranslations
      )
    ).toBe("./src/pages/es/contactenos.astro");
  });

  it("with path not translated", () => {
    expect(
      resolveTranslatedAstroPath(
        "products/index.astro",
        "fr",
        "./src/pages",
        flatRouteTranslations
      )
    ).toBe("./src/pages/fr/products/index.astro");
    expect(
      resolveTranslatedAstroPath(
        "products/merchants.astro",
        "fr",
        "./src/pages",
        flatRouteTranslations
      )
    ).toBe("./src/pages/fr/products/merchants.astro");
    expect(
      resolveTranslatedAstroPath(
        "products/categories/index.astro",
        "fr",
        "./src/pages",
        flatRouteTranslations
      )
    ).toBe("./src/pages/fr/products/categories/index.astro");
    expect(
      resolveTranslatedAstroPath(
        "products/categories/fruits.astro",
        "es",
        "./src/pages",
        flatRouteTranslations
      )
    ).toBe("./src/pages/es/products/categories/fruits.astro");
  });

  it("without locale", () => {
    expect(
      resolveTranslatedAstroPath(
        "products/index.astro",
        null,
        "./src/pages",
        flatRouteTranslations
      )
    ).toBe("./src/pages/products/index.astro");
  });
});

describe("resolveRelativePathsLevel(...)", () => {
  const codeStringTests: CodeStringsTest[] = [
    {
      name: "with named relative imports",
      actual: `import { hello } from "../hello";`,
      expected: `import { hello } from "../../hello";`,
    },
    {
      name: "with same folder imports",
      actual: `import { hello } from "./hello";`,
      expected: `import { hello } from "../hello";`,
    },
    {
      name: "with relative imports",
      actual: `import "../hello.ts";`,
      expected: `import "../../hello.ts";`,
    },
    {
      name: "with relative Astro.glob pattern",
      actual: `const astroGlob = Astro.glob("../foo/*.mdx");`,
      expected: `const astroGlob = Astro.glob("../../foo/*.mdx");`,
    },
  ];

  codeStringTests.forEach((codeStringTest) => {
    it(codeStringTest.name, () => {
      resolveRelativePathsLevel(codeStringTest.actual, 1);
    });
  });
});

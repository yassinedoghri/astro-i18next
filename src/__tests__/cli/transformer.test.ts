import { transformer } from "../../cli/transformer";
import ts from "typescript";

interface CodeStringsTest {
  name: string;
  actual: string;
  expected: string;
}

describe("transformer(...)", () => {
  const codeStringTests: CodeStringsTest[] = [
    {
      name: "with no i18next import",
      actual: ``,
      expected:
        'import { changeLanguage } from "i18next";\n\nchangeLanguage("fr");\n\n',
    },
    {
      name: "with i18next import",
      actual: `import i18next from "i18next";`,
      expected:
        'import i18next, { changeLanguage } from "i18next";\n\nchangeLanguage("fr");\n\n',
    },
    {
      name: "with i18next import + named imports",
      actual: `import {t} from "i18next";`,
      expected:
        'import { t, changeLanguage } from "i18next";\n\nchangeLanguage("fr");\n\n',
    },
    {
      name: "with i18next import + named imports + language switch",
      actual: `import { t, changeLanguage } from "i18next";changeLanguage("en");\n`,
      expected:
        'import { t, changeLanguage } from "i18next";\n\nchangeLanguage("fr");\n\n',
    },
    {
      name: "with i18next import + global import + named imports + language switch",
      actual: `import i18next, { t, changeLanguage } from "i18next";changeLanguage("en");`,
      expected:
        'import i18next, { t, changeLanguage } from "i18next";\n\nchangeLanguage("fr");\n\n',
    },
    {
      name: "with changeLanguage being called from i18next import",
      actual: `import i18next from "i18next";i18next.changeLanguage("en");`,
      expected:
        'import i18next, { changeLanguage } from "i18next";\n\nchangeLanguage("fr");\n\n',
    },
    {
      name: "with changeLanguage being called from i18next import + named imports",
      actual: `import i18next, { changeLanguage } from "i18next";i18next.changeLanguage("en");`,
      expected:
        'import i18next, { changeLanguage } from "i18next";\n\nchangeLanguage("fr");\n\n',
    },
    {
      name: "with other imports",
      actual: `import foo from "foo";\nimport bar from "bar";\nimport {baz} from "baz";\nimport { changeLanguage } from "i18next";changeLanguage("en");`,
      expected:
        'import foo from "foo";\nimport bar from "bar";\nimport { baz } from "baz";\nimport { changeLanguage } from "i18next";\n\nchangeLanguage("fr");\n\n',
    },
    {
      name: "with logic after imports",
      actual: `import { changeLanguage } from "i18next";\n\nconst a = 1 + 2;\nchangeLanguage("en");`,
      expected:
        'import { changeLanguage } from "i18next";\n\nchangeLanguage("fr");\n\nconst a = 1 + 2;\n',
    },
    {
      name: "with relative imports",
      actual: `import Foo from "../Foo.astro";\nimport Bar from "../../Bar.astro";\nimport { baz } from "./baz";`,
      expected:
        'import { changeLanguage } from "i18next";\nimport Foo from "../../Foo.astro";\nimport Bar from "../../../Bar.astro";\nimport { baz } from "../baz";\n\nchangeLanguage("fr");\n\n',
    },
  ];

  codeStringTests.forEach((codeStringTest) => {
    test(codeStringTest.name, () => {
      const tsNode = ts.createSourceFile(
        "test.ts",
        codeStringTest.actual,
        ts.ScriptTarget.Latest
      );

      const result: ts.TransformationResult<ts.SourceFile> = ts.transform(
        tsNode,
        [transformer],
        { language: "fr" }
      );
      const printer = ts.createPrinter();

      const generatedCode = printer.printNode(
        ts.EmitHint.Unspecified,
        result.transformed[0],
        tsNode
      );

      expect(generatedCode).toBe(codeStringTest.expected);
    });
  });
});

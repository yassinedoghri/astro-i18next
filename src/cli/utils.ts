import { fdir, PathsOutput } from "fdir";
import fsExtra from "fs-extra";
import ISO6391 from "iso-639-1";
import ISO33661a2 from "iso-3166-1-alpha-2";
import path from "path";
import fs from "fs";
import ts from "typescript";
import { transformer } from "./transformer";

export interface FileToGenerate {
  path: string;
  source: string;
}

/* istanbul ignore next */
/**
 * parse frontmatter using typescript compiler
 *
 * @param source
 */
export const parseFrontmatter = (source: string): ts.SourceFile =>
  ts.createSourceFile(
    "x.ts",
    extractFrontmatterFromAstroSource(source),
    ts.ScriptTarget.Latest
  );

/* istanbul ignore next */
export const generateLocalizedFrontmatter = (
  tsNode: ts.SourceFile,
  language: string
) => {
  // generate for default language, then loop over languages to generate other pages
  const result: ts.TransformationResult<ts.SourceFile> = ts.transform(
    tsNode,
    [transformer],
    { language }
  );
  const printer = ts.createPrinter();

  return printer.printNode(
    ts.EmitHint.Unspecified,
    result.transformed[0],
    tsNode
  );
};

/* istanbul ignore next */
export const crawlInputDirectory = (directoryPath: string): PathsOutput => {
  // eslint-disable-next-line new-cap
  const api = new fdir()
    .exclude((dirName) => isLocale(dirName))
    .withRelativePaths()
    .crawl(directoryPath);

  return api.sync() as PathsOutput;
};

export const isLocale = (code: string): boolean => {
  const REGEX = /^(?<iso6391>[a-z]{2})(-(?<iso33661a2>[A-Z]{2}))?$/;

  if (!REGEX.test(code)) {
    return false;
  }

  const {
    groups: { iso6391, iso33661a2 },
  } = REGEX.exec(code);

  if (iso33661a2 && !ISO33661a2.getCountry(iso33661a2)) {
    return false;
  }

  if (!ISO6391.validate(iso6391)) {
    return false;
  }

  return true;
};

export const doesStringIncludeFrontmatter = (source: string): boolean =>
  /---.*---/s.test(source);

export const extractFrontmatterFromAstroSource = (source: string): string => {
  let frontmatterSource = "";
  if (doesStringIncludeFrontmatter(source)) {
    const {
      groups: { frontmatter },
    } = /---(?<frontmatter>(.*))---/s.exec(source);
    frontmatterSource = frontmatter;
  }

  return frontmatterSource;
};

export const overwriteAstroFrontmatter = (
  source: string,
  frontmatter: string
): string => {
  let newFileContents = "";
  if (doesStringIncludeFrontmatter(source)) {
    newFileContents = source.replace(/---.*---/s, `---\n${frontmatter}\n---`);
  } else {
    newFileContents = `---\n${frontmatter}\n---\n` + source;
  }

  return newFileContents;
};

/* istanbul ignore next */
export const createFiles = (filesToGenerate: FileToGenerate[]): void => {
  filesToGenerate.forEach((fileToGenerate) => {
    fsExtra.ensureDirSync(path.dirname(fileToGenerate.path));

    fs.writeFileSync(fileToGenerate.path, fileToGenerate.source);
  });
};

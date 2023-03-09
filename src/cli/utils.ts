import { fdir, PathsOutput } from "fdir";
import fsExtra from "fs-extra";
import path from "path";
import fs from "fs";
import ts from "typescript";
import { transformer } from "./transformer";
import { AstroI18nextConfig } from "../types";

export interface FileToGenerate {
  path: string;
  source: string;
}

export const doesStringIncludeFrontmatter = (source: string): boolean =>
  /---.*---/s.test(source);

export const extractFrontmatterFromAstroSource = (source: string): string => {
  if (doesStringIncludeFrontmatter(source)) {
    const {
      groups: { frontmatter },
    } = /---(?<frontmatter>(.*))---/s.exec(source);

    return frontmatter;
  }

  return "";
};

export const overwriteAstroFrontmatter = (
  source: string,
  frontmatter: string
): string => {
  if (doesStringIncludeFrontmatter(source)) {
    return source.replace(/---[\s\S]*---/g, `---\n${frontmatter.trim()}\n---`);
  }

  return `---\n${frontmatter.trim()}\n---\n\n` + source;
};

export const addDepthToRelativePath = (
  relativePath: string,
  depth: number = 1
): string => {
  if (relativePath.startsWith("./") && depth > 0) {
    // remove "./" from relativePath
    relativePath = relativePath.slice(2);
  }

  return relativePath.padStart(relativePath.length + depth * 3, "../");
};

/**
 * file is hidden if its name or any of its parent folders start with an underscore
 */
export const isFileHidden = (filepath: string): boolean => {
  return /((^_)|(\/_))/.test(filepath);
};

export const resolveRelativePathsLevel = (
  fileContents: string,
  fileDepth: number
) => {
  fileContents = fileContents.replace(
    /(import\s+.*["'])(\..*)(["'])/g,
    (_, before, relativePath, after) =>
      `${before}${addDepthToRelativePath(relativePath, fileDepth)}${after}`
  );
  fileContents = fileContents.replace(
    /(Astro.glob\(["'])(\..*)(["']\))/g,
    (_, before, relativePath, after) =>
      `${before}${addDepthToRelativePath(relativePath, fileDepth)}${after}`
  );
  fileContents = fileContents.replace(
    /(<script\s+src=["'])(\..*)(["'])/g,
    (_, before, relativePath, after) =>
      `${before}${addDepthToRelativePath(relativePath, fileDepth)}${after}`
  );

  return fileContents;
};

/* c8 ignore start */
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

export const generateLocalizedFrontmatter = (
  tsNode: ts.SourceFile,
  locale: string
) => {
  // generate for default locale, then loop over locales to generate other pages
  const result: ts.TransformationResult<ts.SourceFile> = ts.transform(
    tsNode,
    [transformer],
    { locale }
  );
  const printer = ts.createPrinter();

  return printer.printNode(
    ts.EmitHint.Unspecified,
    result.transformed[0],
    tsNode
  );
};

/**
 * Crawls pages directory and returns all Astro pages
 * except for locale folders and excluded pages / directories (starting with underscore).
 * (https://docs.astro.build/en/core-concepts/routing/#excluding-pages)
 *
 * @param pagesDirectoryPath
 * @param childDirToCrawl will make the function crawl inside the given
 * `childDirToCrawl` (doesn't take paths, only dirname).
 */
export const getAstroPagesFullPaths = (
  pagesDirectoryPath: string,
  childDirToCrawl: AstroI18nextConfig["defaultLocale"] | undefined = undefined,
  locales: AstroI18nextConfig["locales"] = []
): PathsOutput => {
  // eslint-disable-next-line new-cap
  const api = new fdir()
    .filter(
      (filepath) => !isFileHidden(filepath) && filepath.endsWith(".astro")
    )
    .exclude((dirName) => locales.includes(dirName))
    .withFullPaths();

  return childDirToCrawl
    ? (api
        .crawl(`${pagesDirectoryPath}${path.sep}${childDirToCrawl}`)
        .sync() as PathsOutput)
    : (api.crawl(pagesDirectoryPath).sync() as PathsOutput);
};

export const createFiles = (filesToGenerate: FileToGenerate[]): void => {
  filesToGenerate.forEach((fileToGenerate) => {
    fsExtra.ensureDirSync(path.dirname(fileToGenerate.path));

    fs.writeFileSync(fileToGenerate.path, fileToGenerate.source);
  });
};
/* c8 ignore stop */

/**
 * Resolves the right translated path based on
 * a given `astroFilePath` and a locale,
 * with the `routeTranslations` mapping.
 */
export const resolveTranslatedAstroPath = (
  astroFilePath: string,
  locale: string | null = null,
  basePath: string = "",
  flatRoutes: AstroI18nextConfig["flatRoutes"] = {}
) => {
  astroFilePath = astroFilePath.replace(/^\/+|\/+$/g, "");

  // remove trailing slash of basePath if any
  basePath = basePath.replace(/\/+$/g, "");

  if (locale === null) {
    return `${basePath}/${astroFilePath}`;
  }

  astroFilePath = astroFilePath.replace(/.astro$/, "");

  const filePath = `/${locale}/${astroFilePath}`;

  // is route translated?
  if (Object.prototype.hasOwnProperty.call(flatRoutes, filePath)) {
    return `${basePath}${flatRoutes[filePath]}.astro`;
  }

  return `${basePath}/${locale}/${astroFilePath}.astro`;
};

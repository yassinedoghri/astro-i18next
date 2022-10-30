import { fdir, PathsOutput } from "fdir";
import fsExtra from "fs-extra";
import ISO6391 from "iso-639-1";
import ISO33661a2 from "iso-3166-1-alpha-2";
import path from "path";
import fs from "fs";
import ts from "typescript";
import { transformer } from "./transformer";
import { AstroI18nextConfig } from "types";

export interface FileToGenerate {
  path: string;
  source: string;
}

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
  if (relativePath.startsWith("./")) {
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
  locale: string,
  fileDepth: number
) => {
  // generate for default locale, then loop over locales to generate other pages
  const result: ts.TransformationResult<ts.SourceFile> = ts.transform(
    tsNode,
    [transformer],
    { locale, fileDepth }
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
export const getAstroPagesPath = (
  pagesDirectoryPath: string,
  childDirToCrawl = undefined as AstroI18nextConfig["defaultLocale"] | undefined
): PathsOutput => {
  // eslint-disable-next-line new-cap
  const api = new fdir()
    .filter(
      (filepath) => !isFileHidden(filepath) && filepath.endsWith(".astro")
    )
    .exclude((dirName) => isLocale(dirName))
    .withRelativePaths();

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
 * Translates `path` with `routeTranslations` if `lang` exists in
 * `routeTranslations`, else returns `[basePath, path].join("/")` or
 * `[basePath, locale, path].join("/")`.
 *
 * @param basePath defaults to `""`.
 */
export const createTranslatedPath = (
  path: string,
  locale?: string,
  basePath = "",
  routeTranslations: AstroI18nextConfig["routes"] = {}
) => {
  if (!locale) {
    return `${basePath}/${path}`;
  }

  if (!routeTranslations[locale]) {
    return `${basePath}/${locale}/${path}`;
  }

  return `${basePath}/${locale}/${path
    .split("/")
    .map((segment) => {
      // get segment extension
      const segmentExtension = /(?:\.([^.]+))?$/.exec(segment)[0];

      // remove extension from segment
      const segmentWithoutExt = segment.replace(/\.[^.]+$/, "");

      const translated = routeTranslations[locale][segmentWithoutExt];

      if (!translated) {
        return segment;
      }

      return translated + segmentExtension;
    })
    .join("/")}`;
};

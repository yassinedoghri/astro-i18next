import fs from "fs";
import { AstroI18nextConfig } from "types";
import {
  getAstroPagesPath,
  createFiles,
  FileToGenerate,
  generateLocalizedFrontmatter,
  overwriteAstroFrontmatter,
  parseFrontmatter,
  resolveTranslatedAstroPath,
  resolveRelativePathsLevel,
} from "./utils";

/**
 * Reads all files inside inputPath
 *
 * @param inputPath
 * @param locales
 * @param outputPath
 */
export const generate = (
  inputPath: string,
  defaultLocale: AstroI18nextConfig["defaultLocale"],
  locales: AstroI18nextConfig["locales"],
  showDefaultLocale = false,
  flatRoutes?: AstroI18nextConfig["flatRoutes"],
  outputPath: string = inputPath
): { filesToGenerate: FileToGenerate[]; timeToProcess: number } => {
  const start = process.hrtime();

  // default locale page paths
  const astroPagesPaths = showDefaultLocale
    ? getAstroPagesPath(inputPath, defaultLocale, locales)
    : getAstroPagesPath(inputPath, undefined, locales);

  const filesToGenerate: FileToGenerate[] = [];
  astroPagesPaths.forEach(async function (astroFilePath: string) {
    const inputFilePath = showDefaultLocale
      ? [inputPath, defaultLocale, astroFilePath].join("/")
      : [inputPath, astroFilePath].join("/");

    const fileContents = fs.readFileSync(inputFilePath);
    const fileContentsString = fileContents.toString();

    const parsedFrontmatter = parseFrontmatter(fileContentsString);

    locales.forEach((locale) => {
      const isOtherLocale = locale !== defaultLocale;
      const fileDepth = showDefaultLocale ? 0 : Number(isOtherLocale);

      // add i18next's changeLanguage function to frontmatter
      const frontmatterCode = generateLocalizedFrontmatter(
        parsedFrontmatter,
        locale
      );

      // get the astro file contents
      let newFileContents = overwriteAstroFrontmatter(
        fileContentsString,
        frontmatterCode
      );

      // add depth to imports and Astro.glob pattern
      newFileContents = resolveRelativePathsLevel(newFileContents, fileDepth);

      const createLocaleFolder = showDefaultLocale ? true : isOtherLocale;

      filesToGenerate.push({
        path: resolveTranslatedAstroPath(
          astroFilePath,
          createLocaleFolder ? locale : undefined,
          outputPath,
          flatRoutes
        ),
        source: newFileContents,
      });
    });
  });

  createFiles(filesToGenerate);

  return {
    filesToGenerate,
    timeToProcess: process.hrtime(start)[1] / 1000000,
  };
};

import fs from "fs";
import { AstroI18nextConfig } from "types";
import {
  getAstroPagesPath,
  createFiles,
  FileToGenerate,
  generateLocalizedFrontmatter,
  overwriteAstroFrontmatter,
  parseFrontmatter,
  createTranslatedPath,
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
  routeTranslations?: AstroI18nextConfig["routes"],
  outputPath: string = inputPath
): { filesToGenerate: FileToGenerate[]; timeToProcess: number } => {
  const start = process.hrtime();

  // default locale page paths
  const astroPagesPaths = showDefaultLocale
    ? getAstroPagesPath(inputPath, defaultLocale)
    : getAstroPagesPath(inputPath);

  const filesToGenerate: FileToGenerate[] = [];
  astroPagesPaths.forEach(async function (file: string) {
    const inputFilePath = showDefaultLocale
      ? [inputPath, defaultLocale, file].join("/")
      : [inputPath, file].join("/");

    const fileContents = fs.readFileSync(inputFilePath);
    const fileContentsString = fileContents.toString();

    const parsedFrontmatter = parseFrontmatter(fileContentsString);

    locales.forEach((locale) => {
      const isOtherLocale = locale !== defaultLocale;

      const frontmatterCode = generateLocalizedFrontmatter(
        parsedFrontmatter,
        locale,
        // If showDefaultLocale then we want to have 0 depth since 1 depth was
        // already added by the defaultLocale folder
        // Else we add depth only when the locale is not the default one
        showDefaultLocale ? 0 : Number(isOtherLocale)
      );

      // get the astro file contents
      const newFileContents = overwriteAstroFrontmatter(
        fileContentsString,
        frontmatterCode
      );

      const createLocaleFolder = showDefaultLocale ? true : isOtherLocale;

      filesToGenerate.push({
        path: createTranslatedPath(
          file,
          createLocaleFolder ? locale : undefined,
          outputPath,
          routeTranslations
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

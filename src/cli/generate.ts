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
 * @param supportedLanguages
 * @param outputPath
 */
export const generate = (
  inputPath: string,
  defaultLanguage: AstroI18nextConfig["defaultLanguage"],
  supportedLanguages: AstroI18nextConfig["supportedLanguages"],
  showDefaultLocale = false,
  routeTranslations?: AstroI18nextConfig["routes"],
  outputPath: string = inputPath
): { filesToGenerate: FileToGenerate[]; timeToProcess: number } => {
  const start = process.hrtime();

  // default language page paths
  const astroPagesPaths = showDefaultLocale
    ? getAstroPagesPath(inputPath, defaultLanguage)
    : getAstroPagesPath(inputPath);

  const filesToGenerate: FileToGenerate[] = [];
  astroPagesPaths.forEach(async function (file: string) {
    const inputFilePath = showDefaultLocale
      ? [inputPath, defaultLanguage, file].join("/")
      : [inputPath, file].join("/");

    const fileContents = fs.readFileSync(inputFilePath);
    const fileContentsString = fileContents.toString();

    const parsedFrontmatter = parseFrontmatter(fileContentsString);

    supportedLanguages.forEach((language) => {
      const isOtherLanguage = language !== defaultLanguage;

      const frontmatterCode = generateLocalizedFrontmatter(
        parsedFrontmatter,
        language,
        // If showDefaultLocale then we want to have 0 depth since 1 depth was
        // already added by the defaultLanguage folder
        // Else we add depth only when the language is not the default one
        showDefaultLocale ? 0 : Number(isOtherLanguage)
      );

      // get the astro file contents
      const newFileContents = overwriteAstroFrontmatter(
        fileContentsString,
        frontmatterCode
      );

      const createLocaleFolder = showDefaultLocale ? true : isOtherLanguage;

      filesToGenerate.push({
        path: createTranslatedPath(
          file,
          createLocaleFolder ? language : undefined,
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

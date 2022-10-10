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
  routeTranslations?: AstroI18nextConfig["routes"],
  outputPath: string = inputPath
): { filesToGenerate: FileToGenerate[]; timeToProcess: number } => {
  const start = process.hrtime();

  const astroPagesPaths = getAstroPagesPath(inputPath);

  const filesToGenerate: FileToGenerate[] = [];
  astroPagesPaths.forEach(async function (file: string) {
    const inputFilePath = [inputPath, file].join("/");

    const fileContents = fs.readFileSync(inputFilePath);
    const fileContentsString = fileContents.toString();

    const parsedFrontmatter = parseFrontmatter(fileContentsString);

    supportedLanguages.forEach((language) => {
      const frontmatterCode = generateLocalizedFrontmatter(
        parsedFrontmatter,
        language,
        language === defaultLanguage ? 0 : 1
      );

      // get the astro file contents
      const newFileContents = overwriteAstroFrontmatter(
        fileContentsString,
        frontmatterCode
      );

      filesToGenerate.push({
        path: createTranslatedPath(
          file,
          language === defaultLanguage ? undefined : language,
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

import fs from "fs";
import {
  crawlInputDirectory,
  createFiles,
  FileToGenerate,
  generateLocalizedFrontmatter,
  overwriteAstroFrontmatter,
  parseFrontmatter,
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
  defaultLanguage: string,
  supportedLanguages: string[],
  outputPath: string = inputPath
) => {
  const files = crawlInputDirectory(inputPath);

  const filesToGenerate: FileToGenerate[] = [];

  files.forEach(async function (file) {
    const inputFilePath = [inputPath, file].join("/");
    const extension = file.split(".").pop();

    // only parse astro files
    if (extension === "astro") {
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
          path: [
            outputPath,
            language === defaultLanguage ? null : language,
            file,
          ]
            .filter(Boolean)
            .join("/"),
          source: newFileContents,
        });
      });
    }
  });

  createFiles(filesToGenerate);
};

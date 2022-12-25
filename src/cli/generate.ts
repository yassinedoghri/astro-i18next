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
  addDepthToRelativePath,
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
    let fileContentsString = fileContents.toString();

    const parsedFrontmatter = parseFrontmatter(fileContentsString);

    if (astroFilePath === "blog/index.astro") {
      locales.forEach((locale) => {
        const isOtherLocale = locale !== defaultLocale;
        const fileDepth = showDefaultLocale ? 0 : Number(isOtherLocale);

        const frontmatterCode = generateLocalizedFrontmatter(
          parsedFrontmatter,
          locale,
          // If showDefaultLocale then we want to have 0 depth since 1 depth was
          // already added by the defaultLocale folder
          // Else we add depth only when the locale is not the default one
          fileDepth
        );

        // edit sources' script relative imports
        fileContentsString = fileContentsString.replace(
          /import\s+["'](\..*)["']/g,
          (_, relativePath) =>
            `import "${addDepthToRelativePath(relativePath, fileDepth)}"`
        );

        // get the astro file contents
        const newFileContents = overwriteAstroFrontmatter(
          fileContentsString,
          frontmatterCode
        );

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
    }
  });

  createFiles(filesToGenerate);

  return {
    filesToGenerate,
    timeToProcess: process.hrtime(start)[1] / 1000000,
  };
};

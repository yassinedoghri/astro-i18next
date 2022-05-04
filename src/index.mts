import { AstroIntegration } from "astro";
import { InitOptions, Resource } from "i18next";
import * as fs from "fs";
import * as path from "path";

interface AstroI18nextOptions {
  resourcesPath?: string;
  i18nextConfig: InitOptions;
}

const loadResources = (
  resourcesPath: string,
  supportedLocales: string[]
): Resource => {
  const resources = {};

  const translationFilenames = fs.readdirSync(resourcesPath);

  translationFilenames.forEach((filename) => {
    const filenameLanguage = path.parse(filename).name;

    // check if language is supported before loading the resource
    if (supportedLocales.includes(filenameLanguage)) {
      const rawContents = fs.readFileSync(resourcesPath + filename);
      resources[filenameLanguage] = {
        translation: JSON.parse(rawContents.toString()),
      };
    }
  });

  return resources;
};

export default (options: AstroI18nextOptions): AstroIntegration => {
  return {
    name: "astro-i18next",
    hooks: {
      "astro:config:setup": async ({ config, injectScript }) => {
        // TODO: include other options? Abstract translation files loading?

        options.i18nextConfig.resources = loadResources(
          options.resourcesPath,
          options.i18nextConfig.fallbackLng as string[]
        );

        // init i18next
        injectScript(
          "page-ssr",
          `import i18next from "i18next";
           i18next.init(${JSON.stringify(options.i18nextConfig)});`
        );
      },
    },
  };
};

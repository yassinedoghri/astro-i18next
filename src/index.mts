import { AstroIntegration } from "astro";
import { InitOptions } from "i18next";

export default (options: InitOptions): AstroIntegration => {
  return {
    name: "astro-i18next",
    hooks: {
      "astro:config:setup": async ({ config, injectScript }) => {
        // TODO: include other options? Abstract translation files loading?

        // init i18next
        injectScript(
          "page-ssr",
          `import i18next from "i18next";
           i18next.init(${JSON.stringify(options)});`
        );
      },
    },
  };
};

#!/usr/bin/env node

import { flattenRoutes } from "../config";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { generate } from "./generate";
import { loadConfig, normalizePath } from "./middlewares";
import { GenerateArgs } from "./types";

yargs(hideBin(process.argv))
  .usage("usage: $0 <command>")
  .command<GenerateArgs>(
    "generate [path] [options]",
    "generates localized Astro pages",
    (yargs) => {
      return yargs
        .positional("path", {
          type: "string",
          description: "Path to the Astro project folder",
          default: "./",
        })
        .option("output", {
          alias: "o",
          type: "string",
          description:
            "Set the output of the generated pages if different from input",
        });
    },
    async (argv) => {
      if (argv.verbose) {
        console.info(`Generating localized pages: ${argv.config.locales}`);
      }

      const pagesPath = argv.path + "src/pages";

      const flatRoutes = flattenRoutes(argv.config.routes);

      const result = generate(
        pagesPath,
        argv.config.defaultLocale,
        argv.config.locales,
        argv.config.showDefaultLocale,
        flatRoutes,
        argv.output
      );

      if (argv.verbose) {
        const filepaths = result.filesToGenerate.map(
          (fileToGenerate) => fileToGenerate.path
        );
        console.log(`\n✨ ${filepaths.join("\n✨ ")}\n`);
      }

      // All good! Show success feedback
      console.log(
        `🧪 Localized .astro pages were generated successfully, it took ${result.timeToProcess.toFixed()}ms!`
      );
    }
  )
  .middleware([normalizePath, loadConfig], true)
  .options({
    config: {
      alias: "c",
      type: "string",
      description:
        "Set the output of the generated pages if different from input",
    },
    verbose: {
      alias: "v",
      type: "boolean",
      description: "Run with verbose logging",
    },
  })
  .parse();

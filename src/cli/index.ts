#!/usr/bin/env node

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
        console.info(`Generating localized pages: ${argv.languages}`);
      }

      const pagesPath = argv.path + "src/pages";

      generate(
        pagesPath,
        argv.config.defaultLanguage,
        argv.config.supportedLanguages,
        argv.output
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

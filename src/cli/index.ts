#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { generate } from "./generate";
import { isLocale } from "./utils";

interface GenerateArgs {
  path: string;
  defaultLanguage: string;
  languages: string[];
  output: string;
}

yargs(hideBin(process.argv))
  .usage("usage: $0 <command>")
  .command<GenerateArgs>(
    "generate [path] [options]",
    "generates localized Astro pages",
    (yargs) => {
      return yargs
        .positional("path", {
          type: "string",
          description: "Path to base pages folder",
          default: "./src/pages",
        })
        .options({
          "default-language": {
            alias: "d",
            type: "string",
            description: "Set the default language",
            demandOption: true,
          },
          languages: {
            alias: "l",
            type: "array",
            string: true,
            description: "Provide a list of locales to generate",
            demandOption: true,
          },
          output: {
            alias: "o",
            type: "string",
            description:
              "Set the output of the generated pages if different from input",
            default: "./src/pages",
          },
        })
        .check((argv) => {
          const { "default-language": defaultLanguage, languages } = argv;

          const errors = [];

          if (!isLocale(defaultLanguage)) {
            errors.push(`"${defaultLanguage}" is not a valid locale!`);
          }

          languages.forEach((language) => {
            if (!isLocale(language)) {
              errors.push(`"${language}" is not a valid locale!`);
            }
          });

          if (errors.length > 0) {
            throw new Error(errors.join("\n"));
          }

          return true;
        });
    },
    (argv) => {
      if (argv.verbose) {
        console.info(`Generating localized pages: ${argv.languages}`);
      }

      generate(argv.path, argv.defaultLanguage, argv.languages, argv.output);
    }
  )
  .options({
    verbose: {
      alias: "v",
      type: "boolean",
      description: "Run with verbose logging",
    },
  })
  .parse();

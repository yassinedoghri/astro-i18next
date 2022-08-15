#!/usr/bin/env node

require("esbuild")
  .build({
    bundle: true,
    entryPoints: [
      "src/index.mts",
      "src/utils.ts",
      "src/components/index.mts",
      "src/cli/index.ts",
    ],
    outdir: "dist",
    outExtension: {
      ".js": ".mjs",
    },
    external: [
      "i18next",
      "locale-emoji",
      "typescript",
      "fdir",
      "fs-extra",
      "iso-639-1",
      "iso-3166-1-alpha-2",
    ],
    minify: false,
    format: "esm",
    platform: "node",
    target: "node14",
    sourcemap: "inline",
    sourcesContent: false,
    loader: {
      ".astro": "file",
    },
    assetNames: "[dir]/[name]",
  })
  .catch(() => process.exit(1));

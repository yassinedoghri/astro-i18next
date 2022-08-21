#!/usr/bin/env node

require("esbuild")
  .build({
    bundle: true,
    entryPoints: [
      "src/index.ts",
      "src/utils.ts",
      "src/components/index.mts",
      "src/cli/index.ts",
    ],
    outdir: "dist",
    external: [
      "i18next",
      "locale-emoji",
      "typescript",
      "fdir",
      "fs-extra",
      "iso-639-1",
      "iso-3166-1-alpha-2",
      "@proload/core",
      "@proload/plugin-typescript",
    ],
    minify: false,
    format: "esm",
    platform: "node",
    target: "node14",
    sourcemap: "inline",
    sourcesContent: false,
    allowOverwrite: true,
    loader: {
      ".astro": "file",
    },
    assetNames: "[dir]/[name]",
  })
  .catch(() => process.exit(1));

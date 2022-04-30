#!/usr/bin/env node

require("esbuild")
  .build({
    bundle: true,
    entryPoints: ["src/index.mts", "src/utils.ts", "src/components/index.mts"],
    outdir: "dist",
    outExtension: {
      ".js": ".mjs",
    },
    external: ["i18next", "country-code-to-flag-emoji"],
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

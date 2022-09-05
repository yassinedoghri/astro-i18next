#!/usr/bin/env node

require("esbuild")
  .build({
    bundle: true,
    entryPoints: ["src/index.ts", "src/cli/index.ts"],
    outdir: "dist",
    external: [
      "i18next",
      "@proload/core",
      "@proload/plugin-tsm",
      "locale-emoji",
      "iso-639-1",
    ],
    minify: true,
    format: "esm",
    platform: "node",
    target: "node14",
    banner: {
      js: `
      import module2 from 'module';
      import path2 from 'path';
      import * as url2 from 'url';
      const require = module2.createRequire(import.meta.url);
      const __filename = url2.fileURLToPath(import.meta.url);
      const __dirname = path2.dirname(__filename);
      `,
    },
    sourcemap: false,
    sourcesContent: false,
    allowOverwrite: true,
  })
  .catch(() => process.exit(1));

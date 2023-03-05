# astro-i18next examples - React <!-- omit in toc -->

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/yassinedoghri/astro-i18next/tree/beta/examples/react)

- [🛠️ How to setup?](#️-how-to-setup)
  - [1. Install](#1-install)
  - [2. Configure](#2-configure)
- [🌐 Client-side locale detection](#-client-side-locale-detection)
- [👀 Want to learn more?](#-want-to-learn-more)

## 🛠️ How to setup?

`astro-i18next` can be loaded in both server and client side.

### 1. Install

```bash
npm install astro-i18next @astrojs/react react-i18next
```

### 2. Configure

1. Add `astro-i18next` to your `astro.config.mjs`:

   ```js
   import { defineConfig } from "astro/config";
   import react from "@astrojs/react";
   import astroI18next from "astro-i18next";

   export default defineConfig({
     integrations: [react(), astroI18next()],
   });
   ```

2. Configure `astro-i18next` in your `astro-i18next.config.mjs` file:

   ```js
   /** @type {import('astro-i18next').AstroI18nextConfig} */
   export default {
     defaultLocale: "en",
     locales: ["en", "fr"],
     load: ["server", "client"], // load i18next server and client side
     i18nextServerPlugins: {
       "{initReactI18next}": "react-i18next",
     },
     i18nextClientPlugins: {
       "{initReactI18next}": "react-i18next",
     },
   };
   ```

3. By default, `astro-i18next` expects your translations to be organized inside
   your `public` folder, in a `locales` folder:

   ```bash
     public
     └── locales  # create this folder to store your translation strings
         ├── en
         |   └── translation.json
         └── fr
             └── translation.json
   ```

**That's it!** You can now start translating!

## 🌐 Client-side locale detection

⚠️ **astro-18next** implements client-side locale detection using the
[`i18next-browser-languageDetector`](https://github.com/i18next/i18next-browser-languageDetector)
plugin.

To have the page locale be detected, the default configuration is set to check
for the html `lang` attribute in your page:

```astro
---
import i18next from "i18next";
---

<html lang={i18next.language}>...</html>
```

## 👀 Want to learn more?

Feel free to check [astro-i18next's documentation](../../README.md).

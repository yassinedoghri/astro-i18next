# 🧪 astro-i18next

An [astro](https://astro.build/) integration of
[i18next](https://www.i18next.com/) + some
[utility components](#utility-components) to help you translate your astro
websites!

> **Status** [beta version]
>
> You can use it, and feedback is welcome! As integrations in Astro are still
> experimental, note that some breaking changes may be still introduced during
> this phase.

## Getting started

### 1. Install

```bash
npm install astro-i18next
```

### 2. Configure

1. Add `astro-i18next` to your `astro.config.mjs`:

   ```mjs
   import { defineConfig } from "astro/config";
   import astroI18next from "astro-i18next";

   export default defineConfig({
     experimental: {
       integrations: true,
     },
     integrations: [
       astroI18next({
         resourcesPath: "./src/locales/",
         i18nextConfig: {
           debug: true,
           fallbackLng: ["en", "fr"],
           supportedLngs: ["en", "fr"],
         },
       }),
     ],
   });
   ```

2. Create a `locales` folder containing the translation strings as JSONs (the
   files must be named with the language code):

   ```bash
   src
   ├-- locales          # astro-i18next will load all supported locales
   |   |-- en.json      # english translation strings
   |   └-- fr.json      # french translation strings
   └-- pages
       |-- [lang].astro # you may add a dynamic route to generate language routes
       └-- index.astro  # route for base language (first element in fallbackLng)
   ```

### 3. Start translating

You're all set! You may now start translating your website by using
[i18next's `t` function](https://www.i18next.com/overview/api#t) or the
[Trans component](#trans-component) depending on your needs.

Here's a quick tutorial to get you going:

```astro
---
// src/pages/index.astro
import i18next, { t } from "i18next";
import { Trans } from "astro-i18next/components";

// Use i18next's changeLanguage() function to change the language
i18next.changeLanguage("fr");
---

<html lang={i18next.language}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{t("site.title")}</title>
    <meta name="description" content={t("site.description")} />
  </head>
  <body>
    <h1>{t("home.title")}</h1>
    <p>
      <Trans i18nKey="home.subtitle">
        This is a <em>more complex</em> string to translate, mixed with <strong
          >html elements
        </strong> such as a <a href="https://example.com/">a cool link</a>!
      </Trans>
    </p>
  </body>
</html>
```

```json
// src/locales/en.json
{
  "site": {
    "title": "My awesome website!",
    "description": "Here is the description of my awesome website!"
  },
  "home": {
    "title": "Welcome to my awesome website!",
    "subtitle": "This is a <0>more complex</0> string to translate, mixed with <1>html elements</1>, such as a <2>a cool link</2>!"
  }
}
```

```json
// src/locales/fr.json
{
  "site": {
    "title": "Mon super site web !",
    "description": "Voici la description de mon super site web !"
  },
  "home": {
    "title": "Bienvenue sur mon super site web !",
    "subtitle": "Ceci est une chaine de charactères <0>plus compliquée</0> à traduire, il y a des <1>éléments html</1>, comme <2>un super lien</2> par exemple !"
  }
}
```

For a more exhaustive example, see the [example astro website](./example/).

## Utility components

### Trans component

A component that takes care of interpolating its children with the translation
strings. Inspired by
[react-i18next's Trans component](https://react.i18next.com/latest/trans-component).

```astro
---
import { Trans } from "astro-i18next/components";
---

<Trans i18nKey="sampleKey">
  An <a href="https://astro.build" title="Astro website">astro</a> integration of
  <a href="https://www.i18next.com/" title="i18next website">i18next</a> and utility
  components to help you translate your astro websites!
</Trans>
```

```json
// fr.json
{
  "superCoolKey": "Une intégration <0>astro</0> d'<1>i18next</1> + quelques composants utilitaires pour vous aider à traduire vos sites astro !"
}
```

#### Trans Props

| Prop name | Type   | Description                                |
| --------- | ------ | ------------------------------------------ |
| i18nKey   | string | Internationalization key to interpolate to |

### LanguageSelector component

Unstyled custom select component to choose amongst supported locales.

```astro
---
import { LanguageSelector } from "astro-i18next/components";
---

<LanguageSelector baseLanguage="en" className="my-select-class" />
```

#### LanguageSelector Props

| Prop name    | Type     | Description                                                                                           |
| ------------ | -------- | ----------------------------------------------------------------------------------------------------- |
| baseLanguage | string   | language code that translations are based off of (will redirect to `/` instead of `/[language-code]`) |
| showFlag     | ?boolean | choose to display the language emoji before language name (defaults to `false`)                       |
| className    | ?string  | class attribute for the `<select>` tag to customize it                                                |

## License

Code released under the [MIT License](https://choosealicense.com/licenses/mit/).

Copyright (c) 2022-present, Yassine Doghri
([@yassinedoghri](https://twitter.com/yassinedoghri))

<div align="center">

# 🧪 astro-i18next

An [astro](https://astro.build/) integration of
[i18next](https://www.i18next.com/) + some
[utility components](#utility-components) to help you translate your astro
websites!

</div>

<div align="center">

[![npm-badge]][npm]&nbsp;[![build-badge]][build]&nbsp;[![license-badge]][license]&nbsp;[![contributions-badge]][contributions]&nbsp;[![semantic-release-badge]][semantic-release]&nbsp;[![stars-badge]][stars]

</div>

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
         i18next: {
           debug: true,
           supportedLngs: ["en", "fr"], // ℹ️ base language is the first one, ie. "en"
         },
       }),
     ],
   });
   ```

2. Create a `locales` folder containing the translation strings as JSONs (⚠️
   files must be named as the language code):

   ```bash
   src
   ├-- locales          # astro-i18next will load all supported locales
   |   |-- en.json      # english translation strings
   |   └-- fr.json      # french translation strings
   └-- pages
       |-- [lang].astro # you may add a dynamic route to generate language routes
       └-- index.astro  # route for base language (first element in supportedLngs)
   ```

### 3. 🚀 Start translating

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
        </strong> such as <a href="https://example.com/">a cool link</a>!
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

---

## Utility components

### Trans component

A component that takes care of interpolating its children with the translation
strings. Inspired by
[react-i18next's Trans component](https://react.i18next.com/latest/trans-component).

```astro
---
import { Trans } from "astro-i18next/components";
---

<Trans i18nKey="superCoolKey">
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

#### interpolate function

`interpolate(i18nKey: string, reference: string): string`

astro-i18next exposes the logic behind the Trans component, you may want to use
it directly.

```ts
import { interpolate } from "astro-i18next";

const interpolated = interpolate(
  "superCoolKey",
  'An <a href="https://astro.build" title="Astro website">astro</a> integration of <a href="https://www.i18next.com/" title="i18next website">i18next</a> and utility components to help you translate your astro websites!'
);
```

### LanguageSelector component

Unstyled custom select component to choose amongst supported locales.

```astro
---
import { LanguageSelector } from "astro-i18next/components";
---

<LanguageSelector showFlag={true} class="my-select-class" />
```

#### LanguageSelector Props

| Prop name | Type     | Description                                                                     |
| --------- | -------- | ------------------------------------------------------------------------------- |
| showFlag  | ?boolean | Choose to display the language emoji before language name (defaults to `false`) |

### localizePath function

`localizePath(path: string, locale: string | null = null): string`

Sets a path within a given locale. If the locale param is not specified, the
current language will be used.

**Note:** This should be used instead of hard coding paths to other pages. It
will take care of setting the right path depending on the locale you set.

```astro
---
import { localizePath } from "astro-i18next";
import i18next from "i18next";

i18next.changeLanguage("fr");
---

<a href={localizePath("/about")}>Go to about page ➔</a>
<!-- renders: <a href="/fr/about">Go to about page ➔</a> -->
```

## License

Code released under the [MIT License](https://choosealicense.com/licenses/mit/).

Copyright (c) 2022-present, Yassine Doghri
([@yassinedoghri](https://twitter.com/yassinedoghri))

[npm]: https://www.npmjs.com/package/astro-i18next
[npm-badge]: https://img.shields.io/npm/v/astro-i18next
[build]:
  https://github.com/yassinedoghri/astro-i18next/actions/workflows/publish.yml
[build-badge]:
  https://img.shields.io/github/workflow/status/yassinedoghri/astro-i18next/astro-i18next-publish
[license]:
  https://github.com/yassinedoghri/astro-i18next/blob/develop/LICENSE.md
[license-badge]:
  https://img.shields.io/github/license/yassinedoghri/astro-i18next
[contributions]: https://github.com/yassinedoghri/astro-i18next/issues
[contributions-badge]:
  https://img.shields.io/badge/contributions-welcome-brightgreen.svg
[semantic-release]: https://github.com/semantic-release/semantic-release
[semantic-release-badge]:
  https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[stars]: https://github.com/yassinedoghri/astro-i18next/stargazers
[stars-badge]:
  https://img.shields.io/github/stars/yassinedoghri/astro-i18next?style=social

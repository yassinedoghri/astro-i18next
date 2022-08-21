<div align="center">

# 🧪 astro-i18next <!-- omit in toc -->

An [astro](https://astro.build/) integration of
[i18next](https://www.i18next.com/) + some utility components to help you
translate your astro websites!

</div>

<div align="center">

[![npm-badge]][npm]&nbsp;[![build-badge]][build]&nbsp;[![codecov-badge]][codecov]&nbsp;[![license-badge]][license]&nbsp;[![contributions-badge]][contributions]&nbsp;[![semantic-release-badge]][semantic-release]&nbsp;[![stars-badge]][stars]

</div>

> **Note**
>
> Status - **Beta**
>
> You can use it, and feedback is more than welcome! Note that some breaking
> changes may still be introduced during this phase as the goal for v1 is to get
> the best possible DX for translating your Astro pages.

- [🚀 Getting started](#-getting-started)
  - [1. Install](#1-install)
  - [2. Configure](#2-configure)
  - [3. Start translating](#3-start-translating)
- [💻 CLI commands](#-cli-commands)
  - [generate](#generate)
- [📦 Utility components](#-utility-components)
  - [Trans component](#trans-component)
  - [LanguageSelector component](#languageselector-component)
  - [HeadHrefLangs component](#headhreflangs-component)
- [📦 Utility functions](#-utility-functions)
  - [interpolate function](#interpolate-function)
  - [localizePath function](#localizepath-function)
  - [localizeUrl function](#localizeurl-function)
- [🛠️ AstroI18nextConfig Props](#️-astroi18nextconfig-props)
- [✨ Contributors](#-contributors)
- [📜 License](#-license)

## 🚀 Getting started

### 1. Install

```bash
npm install astro-i18next
```

### 2. Configure

1. Add `astro-i18next` to your `astro.config.js`:

   ```js
   import { defineConfig } from "astro/config";
   import astroI18next from "astro-i18next";

   export default defineConfig({
     experimental: {
       integrations: true,
     },
     integrations: [astroI18next()],
   });
   ```

2. Configure `astro-i18next` in your `astro-i18next.config.js` file:

   ```js
   /** @type {import('astro-i18next').AstroI18nextConfig} */
   export default {
     defaultLanguage: "en",
     supportedLanguages: ["en", "fr"],
   };
   ```

   ℹ️ For a more advanced configuration, see the
   [AstroI18nextConfig props](#astroi18nextconfig-props).

3. (recommended) Load translation keys using an
   [i18next backend plugin](https://www.i18next.com/overview/plugins-and-utils#backends).
   For instance with the
   [`i18next-fs-backend`](https://github.com/i18next/i18next-fs-backend) plugin:

   ```bash
   npm install i18next-fs-backend
   ```

   ```bash
     src
     ├-- locales  # create this folder to store your translation strings
     |   |-- en.json      # english translation strings
     |   └-- fr.json      # french translation strings
     └-- pages
         └-- index.astro  # route for default language
   ```

   ```js
   /** @type {import('astro-i18next').AstroI18nextConfig} */
   export default {
     defaultLanguage: "en",
     supportedLanguages: ["en", "fr"],
     i18next: {
       // debug is convenient during development to check for missing keys
       debug: true,
       initImmediate: false,
       backend: {
         loadPath: "./src/locales/{{lng}}.json",
       },
     },
     i18nextPlugins: { fsBackend: "i18next-fs-backend" },
   };
   ```

### 3. Start translating

You may now start translating your pages by using
[i18next's `t` function](https://www.i18next.com/overview/api#t) or the
[Trans component](#trans-component) depending on your needs.

Here's a quick tutorial to get you going:

1. Use translation keys in your Astro pages

   ```astro
   ---
   // src/pages/index.astro
   import { t } from "i18next";
   import { Trans, HeadHrefLangs } from "astro-i18next/components";
   ---

   <html lang={i18next.language}>
     <head>
       <meta charset="utf-8" />
       <meta name="viewport" content="width=device-width" />
       <title>{t("site.title")}</title>
       <meta name="description" content={t("site.description")} />
       <HeadHrefLangs />
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

2. Create localized pages using the [generate command](#generate)

   ```bash
   npx astro-i18next generate
   ```

3. You're all set! Have fun translating and generate localized pages as you go
   🚀

> **Note**
>
> For a real world example, see the [demo project](./example/).

---

## 💻 CLI commands

### generate

```bash
npx astro-i18next generate
```

This command will generate localized pages depending on your config and set
i18next's language change on each page.

For instance, with `supportedLanguages = ["en", "fr", "es"]`, and `"en"` being
the default language and having:

```bash
src
└-- pages
    |-- about.astro
    └-- index.astro
```

👇 Running `npx astro-i18next generate` will create the following pages

```bash
src
└-- pages
    |-- es
    |   |-- about.astro
    |   └-- index.astro
    |-- fr
    |   |-- about.astro
    |   └-- index.astro
    |-- about.astro
    └-- index.astro
```

---

## 📦 Utility components

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

| Prop name | Type (default)      | Description                                                                                                                                            |
| --------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| i18nKey   | string (undefined)  | Internationalization key to interpolate to. Can contain the namespace by prepending it in the form 'ns:key' (depending on i18next.options.nsSeparator) |
| ns        | ?string (undefined) | Namespace to use. May also be embedded in i18nKey but not recommended when used in combination with natural language keys.                             |

### LanguageSelector component

Unstyled custom select component to choose amongst supported locales.

```astro
---
import { LanguageSelector } from "astro-i18next/components";
---

<LanguageSelector showFlag={true} class="my-select-class" />
```

#### LanguageSelector Props

| Prop name | Type (default)     | Description                                               |
| --------- | ------------------ | --------------------------------------------------------- |
| showFlag  | ?boolean (`false`) | Choose to display the language emoji before language name |

### HeadHrefLangs component

HTML tags to include in your page's `<head>` section to let search engines know
about its language and region variants. To know more, see
[Google's advanced localized versions](https://developers.google.com/search/docs/advanced/crawling/localized-versions#html).

```astro
---
import i18next from "i18next";
import { HeadHrefLangs } from "astro-i18next/components";
---

<html lang={i18next.language}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>...</title>
    <meta name="description" content="..." />
    <HeadHrefLangs />
  </head>
  <body>...</body>
</html>
```

The HeadHrefLangs component will generate all of the alternate links depending
on the current url and supported languages.

For example, if you are on the `/about` page and support 3 languages (`en`,
`fr`, `es`) with `en` being the default language, this will render:

```html
<link rel="alternate" hreflang="en" href="https://www.example.com/about/" />
<link rel="alternate" hreflang="fr" href="https://www.example.com/fr/about/" />
<link rel="alternate" hreflang="es" href="https://www.example.com/es/about/" />
```

## 📦 Utility functions

### interpolate function

`interpolate(i18nKey: string, reference: string, namespace: string | null): string`

`astro-i18next` exposes the logic behind the Trans component, you may want to
use it directly.

```ts
import { interpolate } from "astro-i18next";

const interpolated = interpolate(
  "superCoolKey",
  'An <a href="https://astro.build" title="Astro website">astro</a> integration of <a href="https://www.i18next.com/" title="i18next website">i18next</a> and utility components to help you translate your astro websites!'
);
```

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

<a href={localizePath("/about")}>...</a>
<!-- renders: <a href="/fr/about">...</a> -->
```

### localizeUrl function

`localizeUrl(url: string, locale: string | null = null): string`

Sets a url within a given locale. If the locale param is not specified, the
current language will be used.

**Note:** This should be used instead of hard coding urls for internal links. It
will take care of setting the right url depending on the locale you set.

```astro
---
import { localizeUrl } from "astro-i18next";
import i18next from "i18next";

i18next.changeLanguage("fr");
---

<a href={localizeUrl("https://www.example.com/about")}>...</a>
<!-- renders: <a href="https://www.example.com/fr/about">...</a> -->
```

---

## 🛠️ AstroI18nextConfig Props

`astro-i18next`'s goal is to abstract most of the configuration for you so that
you don't have to think about it. Just focus on translating!

Though if you'd like to go further in customizing i18next, feel free to tweak
your config!

| Prop name          | Type (default)             | Description                                                                                                       |
| ------------------ | -------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| defaultLanguage    | `string` (undefined)       | The default language for your website                                                                             |
| supportedLanguages | `string[]` (undefined)     | Your website's supported languages                                                                                |
| i18next            | `?InitOptions`             | The i18next configuration. See [i18next's documentation](https://www.i18next.com/overview/configuration-options). |
| i18nextPlugins     | `?{[key: string]: string}` | Set i18next plugins. See [i18next's available plugins](https://www.i18next.com/overview/plugins-and-utils).       |

## ✨ Contributors

Thanks goes to these wonderful people
([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://yassinedoghri.com/"><img src="https://avatars.githubusercontent.com/u/11021441?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Yassine Doghri</b></sub></a><br /><a href="https://github.com/yassinedoghri/astro-i18next/commits?author=yassinedoghri" title="Code">💻</a> <a href="https://github.com/yassinedoghri/astro-i18next/commits?author=yassinedoghri" title="Documentation">📖</a> <a href="#design-yassinedoghri" title="Design">🎨</a> <a href="#example-yassinedoghri" title="Examples">💡</a> <a href="#maintenance-yassinedoghri" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://gdevs.io/"><img src="https://avatars.githubusercontent.com/u/10165264?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Davide Ceschia</b></sub></a><br /><a href="https://github.com/yassinedoghri/astro-i18next/commits?author=killpowa" title="Code">💻</a> <a href="https://github.com/yassinedoghri/astro-i18next/issues?q=author%3Akillpowa" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/preetamslot"><img src="https://avatars.githubusercontent.com/u/5420582?v=4?s=100" width="100px;" alt=""/><br /><sub><b>preetamslot</b></sub></a><br /><a href="https://github.com/yassinedoghri/astro-i18next/issues?q=author%3Apreetamslot" title="Bug reports">🐛</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the
[all-contributors](https://github.com/all-contributors/all-contributors)
specification. Contributions of any kind welcome!

## 📜 License

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
  https://img.shields.io/github/license/yassinedoghri/astro-i18next?color=blue
[contributions]: https://github.com/yassinedoghri/astro-i18next/issues
[contributions-badge]:
  https://img.shields.io/badge/contributions-welcome-blueviolet.svg
[semantic-release]: https://github.com/semantic-release/semantic-release
[semantic-release-badge]:
  https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[stars]: https://github.com/yassinedoghri/astro-i18next/stargazers
[stars-badge]:
  https://img.shields.io/github/stars/yassinedoghri/astro-i18next?style=social
[codecov]: https://codecov.io/gh/yassinedoghri/astro-i18next
[codecov-badge]:
  https://codecov.io/gh/yassinedoghri/astro-i18next/branch/develop/graph/badge.svg?token=IFWNB6UJDJ

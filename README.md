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
> Status - 🚧 **Beta**
>
> [👉 **Road to v1.0.0**](https://github.com/yassinedoghri/astro-i18next/issues/19)
>
> You can use it, and feedback is more than welcome! Note that some breaking
> changes may still be introduced during this phase as the goal for v1 is to get
> the best possible DX for translating your Astro pages.

## Examples

| Example                               | Status                                                                                               |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [SSG - **Basics**](examples/basics)   | [![example-up-badge]](examples/basics)                                                               |
| [SSR - **Node**](examples/node)       | [![example-up-badge]](examples/node)                                                                 |
| [**React**](examples/react)           | [![example-up-badge]](examples/react)                                                                |
| [SSR - **Netlify**](examples/netlify) | [![example-down-badge]](examples/netlify) (https://github.com/yassinedoghri/astro-i18next/issues/26) |
| SSR - **Deno**                        | [![example-down-badge]](examples/basics) (https://github.com/yassinedoghri/astro-i18next/issues/55)  |

- [Examples](#examples)
- [🚀 Getting started](#-getting-started)
  - [1. Install](#1-install)
  - [2. Configure](#2-configure)
  - [3. Start translating](#3-start-translating)
- [💻 CLI commands](#-cli-commands)
  - [generate](#generate)
- [🔄 Translate Routes](#-translate-routes)
- [📦 Utility components](#-utility-components)
  - [Trans component](#trans-component)
  - [LanguageSelector component](#languageselector-component)
  - [HeadHrefLangs component](#headhreflangs-component)
- [📦 Utility functions](#-utility-functions)
  - [interpolate function](#interpolate-function)
  - [localizePath function](#localizepath-function)
  - [localizeUrl function](#localizeurl-function)
- [👀 Going further](#-going-further)
  - [Namespaces](#namespaces)
  - [AstroI18nextConfig Props](#astroi18nextconfig-props)
- [✨ Contributors](#-contributors)
- [📜 License](#-license)

## 🚀 Getting started

### 1. Install

```bash
npm install astro-i18next
```

### 2. Configure

1. Add `astro-i18next` to your `astro.config.mjs`:

   ```js
   import { defineConfig } from "astro/config";
   import astroI18next from "astro-i18next";

   export default defineConfig({
     integrations: [astroI18next()],
   });
   ```

2. Configure `astro-i18next` in your `astro-i18next.config.mjs` file:

   ```js
   /** @type {import('astro-i18next').AstroI18nextConfig} */
   export default {
     defaultLocale: "en",
     locales: ["en", "fr"],
   };
   ```

   ℹ️ Your `astro-i18next` config file can be a javascript (`.js` | `.mjs` |
   `.cjs`) or typescript (`.ts` | `.mts` | `.cts`) file.

   ℹ️ For a more advanced configuration, see the
   [AstroI18nextConfig props](#astroi18nextconfig-props).

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

   ℹ️ You may choose to organize your translations into multiple files instead
   of a single file per locale [using namespaces](#namespaces).

### 3. Start translating

You may now start translating your pages by using
[i18next's `t` function](https://www.i18next.com/overview/api#t) or the
[Trans component](#trans-component) depending on your needs.

Here's a quick tutorial to get you going:

1. Use translation keys in your Astro pages

   ```astro
   ---
   // src/pages/index.astro
   import i18next, { t } from "i18next";
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
   // public/locales/en/translation.json
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
   // public/locales/fr/translation.json
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
> For a real world example, see the [demo project](./website/) or try the _Astro
> i18n basics example_ on StackBlitz:\
> [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/edit/astro-i18n-basics-example?file=README.md)

---

## 💻 CLI commands

### generate

```bash
npx astro-i18next generate
```

This command will generate localized pages depending on your config and set
i18next's language change on each page.

For instance, with `locales = ["en", "fr", "es"]`, and `"en"` being the default
locale and having:

```bash
src
└── pages
    ├── about.astro
    └── index.astro
```

👇 Running `npx astro-i18next generate` will create the following pages

```bash
src
└── pages
    ├── es
    |   ├── about.astro
    |   └── index.astro
    ├── fr
    |   ├── about.astro
    |   └── index.astro
    ├── about.astro
    └── index.astro
```

## 🔄 Translate Routes

`astro-i18next` let's you translate your pages routes for each locale!

For instance, with support for 3 locales (`en`, `fr`, `es`), `en` being the
default and the following pages:

```bash
src
└── pages
    ├── about.astro
    ├── contact-us.astro
    └── index.astro
```

1. Set route mappings in your `astro-i18next` config:

   ```js
   /** @type {import('astro-i18next').AstroI18nextConfig} */
   export default {
     defaultLocale: "en",
     locales: ["en", "fr", "es"],
     routes: {
      fr: {
        "about": "a-propos",
        "contact-us": "contactez-nous",
      }
      es: {
        "about": "a-proposito",
        "contact-us": "contactenos",
      }
     },
   };
   ```

2. Generate your localized pages using the [generate CLI command](#generate),
   they will be translated for you!

```bash
src
└── pages
    ├── es
    |   ├── a-proposito.astro
    |   ├── contactenos.astro
    |   └── index.astro
    ├── fr
    |   ├── a-propos.astro
    |   ├── contactez-nous.astro
    |   └── index.astro
    ├── about.astro
    ├── contact-us.astro
    └── index.astro
```

**Note:** The [localizedPath](#localizepath-function) and
[localizeUrl](#localizeurl-function) functions will retrieve the correct route
based on the mappings.

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

| Prop name | Type (default)      | Description                                                                                                                                                                                                                            |
| --------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| i18nKey   | ?string (undefined) | Internationalization key to interpolate to. Can contain the namespace by prepending it in the form 'ns:key' (depending on i18next.options.nsSeparator). If omitted, a key is automatically generated using the content of the element. |
| ns        | ?string (undefined) | Namespace to use. May also be embedded in i18nKey but not recommended when used in combination with natural language keys.                                                                                                             |

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
on the current url and supported locales.

For example, if you are on the `/about` page and support 3 locales (`en`, `fr`,
`es`) with `en` being the default locale, this will render:

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

`localizePath(path: string, locale: string | null = null, base: string = import.meta.env.BASE_URL): string`

Sets a path within a given locale. If the locale param is not specified, the
current locale will be used.

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

`localizeUrl(url: string, locale: string | null = null, base: string = import.meta.env.BASE_URL): string`

Sets a url within a given locale. If the locale param is not specified, the
current locale will be used.

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

## 👀 Going further

### Namespaces

i18next allows you to organize your translation keys into
[namespaces](https://www.i18next.com/principles/namespaces).

You can have as many namespaces as you wish, have one per page and one for
common translation strings for example:

```bash
public
├-- locales
|   |-- en
|   |   |-- about.json    # "about" namespace
|   |   |-- common.json   # "common" namespace
|   |   └-- home.json     # "home" namespace
|   └-- fr   # same files in other locale folders
src
└-- pages
      |-- about.astro
      └-- index.astro
```

1. Using the `i18next-fs-backend` plugin, it can easily be setup in your
   `backend.loadPath` alongside the `ns` and `defaultNS` keys, like so:

   ```ts
   /** @type {import('astro-i18next').AstroI18nextConfig} */
   export default {
     defaultLocale: "en",
     locales: ["en", "fr"],
     namespaces: ["about", "common", "home"],
     defaultNamespace: "common",
   };
   ```

2. Load the namespace globally using `i18next.setDefaultNamespace(ns: string)`
   or specify it in the `t` function or the `Trans` component:

   ```astro
   ---
   import { t, setDefaultNamespace } from "i18next";
   import { Trans } from "astro-i18next/components";

   setDefaultNamespace("home");
   ---

   <h1>{t("myHomeTitle")}</h1>
   <p>
     <Trans i18nKey="myHomeDescription">
       This translation is loaded from the default <strong>home</strong> namespace!
     </Trans>
   </p>
   <p>
     <Trans i18nKey="myCommonCTA" ns="common">
       This translation is loaded from the <strong>common</strong> namespace!
     </Trans>
   </p>
   <!-- t function loads the "buttonCTA" key from the "common" namespace -->
   <button>{t("common:buttonCTA")}</button>
   ```

### AstroI18nextConfig Props

`astro-i18next`'s goal is to abstract most of the configuration for you so that
you don't have to think about it. Just focus on translating!

Though if you'd like to go further in customizing i18next, feel free to tweak
your config!

| Prop name        | Type (default)                         | Description                                                                                                                   |
| ---------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| defaultLocale    | `string` (undefined)                   | The default locale for your website                                                                                           |
| locales          | `string[]` (undefined)                 | Your website's supported locales                                                                                              |
| namespaces       | `string` or `string[]` ('translation') | String or array of namespaces to load                                                                                         |
| defaultNamespace | `string` (translation')                | Default namespace used if not passed to the translation function                                                              |
| i18nextServer    | `?InitOptions`                         | The i18next configuration server side. See [i18next's documentation](https://www.i18next.com/overview/configuration-options). |
| i18nextClient    | `?InitOptions`                         | The i18next configuration client side. See [i18next's documentation](https://www.i18next.com/overview/configuration-options). |
| routes           | `[key: string]: string`(`{}`)          | The translations for your routes                                                                                              |

## ✨ Contributors

Thanks goes to these wonderful people
([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://yassinedoghri.com/"><img src="https://avatars.githubusercontent.com/u/11021441?v=4?s=100" width="100px;" alt="Yassine Doghri"/><br /><sub><b>Yassine Doghri</b></sub></a><br /><a href="https://github.com/yassinedoghri/astro-i18next/commits?author=yassinedoghri" title="Code">💻</a> <a href="https://github.com/yassinedoghri/astro-i18next/commits?author=yassinedoghri" title="Documentation">📖</a> <a href="#ideas-yassinedoghri" title="Ideas, Planning, & Feedback">🤔</a> <a href="#design-yassinedoghri" title="Design">🎨</a> <a href="#example-yassinedoghri" title="Examples">💡</a> <a href="#maintenance-yassinedoghri" title="Maintenance">🚧</a></td>
      <td align="center"><a href="https://gdevs.io/"><img src="https://avatars.githubusercontent.com/u/10165264?v=4?s=100" width="100px;" alt="Davide Ceschia"/><br /><sub><b>Davide Ceschia</b></sub></a><br /><a href="https://github.com/yassinedoghri/astro-i18next/commits?author=killpowa" title="Code">💻</a> <a href="https://github.com/yassinedoghri/astro-i18next/issues?q=author%3Akillpowa" title="Bug reports">🐛</a></td>
      <td align="center"><a href="https://github.com/preetamslot"><img src="https://avatars.githubusercontent.com/u/5420582?v=4?s=100" width="100px;" alt="preetamslot"/><br /><sub><b>preetamslot</b></sub></a><br /><a href="https://github.com/yassinedoghri/astro-i18next/issues?q=author%3Apreetamslot" title="Bug reports">🐛</a></td>
      <td align="center"><a href="https://www.linkedin.com/in/dklymenko"><img src="https://avatars.githubusercontent.com/u/1391015?v=4?s=100" width="100px;" alt="Dmytro"/><br /><sub><b>Dmytro</b></sub></a><br /><a href="https://github.com/yassinedoghri/astro-i18next/issues?q=author%3Admythro" title="Bug reports">🐛</a></td>
      <td align="center"><a href="https://duskmoon314.com/"><img src="https://avatars.githubusercontent.com/u/20477228?v=4?s=100" width="100px;" alt="Campbell He"/><br /><sub><b>Campbell He</b></sub></a><br /><a href="https://github.com/yassinedoghri/astro-i18next/issues?q=author%3Aduskmoon314" title="Bug reports">🐛</a></td>
      <td align="center"><a href="https://t.me/mellkam"><img src="https://avatars.githubusercontent.com/u/51422045?v=4?s=100" width="100px;" alt="MelKam"/><br /><sub><b>MelKam</b></sub></a><br /><a href="https://github.com/yassinedoghri/astro-i18next/commits?author=MellKam" title="Code">💻</a></td>
      <td align="center"><a href="https://webslc.com/"><img src="https://avatars.githubusercontent.com/u/34887287?v=4?s=100" width="100px;" alt="L1lith"/><br /><sub><b>L1lith</b></sub></a><br /><a href="https://github.com/yassinedoghri/astro-i18next/issues?q=author%3AL1lith" title="Bug reports">🐛</a> <a href="#ideas-L1lith" title="Ideas, Planning, & Feedback">🤔</a></td>
    </tr>
    <tr>
      <td align="center"><a href="https://github.com/Anomander43"><img src="https://avatars.githubusercontent.com/u/14289502?v=4?s=100" width="100px;" alt="Anomander43"/><br /><sub><b>Anomander43</b></sub></a><br /><a href="https://github.com/yassinedoghri/astro-i18next/commits?author=Anomander43" title="Documentation">📖</a></td>
      <td align="center"><a href="https://github.com/dschoeni"><img src="https://avatars.githubusercontent.com/u/1913623?v=4?s=100" width="100px;" alt="Dominik Schöni"/><br /><sub><b>Dominik Schöni</b></sub></a><br /><a href="https://github.com/yassinedoghri/astro-i18next/commits?author=dschoeni" title="Code">💻</a></td>
      <td align="center"><a href="https://github.com/dallyh"><img src="https://avatars.githubusercontent.com/u/6968534?v=4?s=100" width="100px;" alt="Dalibor Hon"/><br /><sub><b>Dalibor Hon</b></sub></a><br /><a href="https://github.com/yassinedoghri/astro-i18next/commits?author=dallyh" title="Code">💻</a> <a href="https://github.com/yassinedoghri/astro-i18next/issues?q=author%3Adallyh" title="Bug reports">🐛</a></td>
      <td align="center"><a href="https://github.com/aquaminer"><img src="https://avatars.githubusercontent.com/u/17113289?v=4?s=100" width="100px;" alt="Oleksii Lozoviahin"/><br /><sub><b>Oleksii Lozoviahin</b></sub></a><br /><a href="https://github.com/yassinedoghri/astro-i18next/commits?author=aquaminer" title="Code">💻</a></td>
      <td align="center"><a href="https://talale.it/"><img src="https://avatars.githubusercontent.com/u/68308554?v=4?s=100" width="100px;" alt="Alessandro Talamona"/><br /><sub><b>Alessandro Talamona</b></sub></a><br /><a href="https://github.com/yassinedoghri/astro-i18next/issues?q=author%3AxTalAlex" title="Bug reports">🐛</a></td>
      <td align="center"><a href="https://github.com/jkjustjoshing"><img src="https://avatars.githubusercontent.com/u/813192?v=4?s=100" width="100px;" alt="Josh Kramer"/><br /><sub><b>Josh Kramer</b></sub></a><br /><a href="https://github.com/yassinedoghri/astro-i18next/issues?q=author%3Ajkjustjoshing" title="Bug reports">🐛</a></td>
    </tr>
  </tbody>
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
[example-up-badge]: https://img.shields.io/badge/satus-up-brightgreen
[example-down-badge]: https://img.shields.io/badge/satus-down-red

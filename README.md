<div align="center">

# 🧪 astro-i18next

An [astro](https://astro.build/) integration of
[i18next](https://www.i18next.com/) + some
[utility components](#utility-components) to help you translate your astro
websites!

</div>

<div align="center">

[![npm-badge]][npm]&nbsp;[![build-badge]][build]&nbsp;[![codecov-badge]][codecov]&nbsp;[![license-badge]][license]&nbsp;[![contributions-badge]][contributions]&nbsp;[![semantic-release-badge]][semantic-release]&nbsp;[![stars-badge]][stars]

</div>

> **Status** [beta version]
>
> You can use it, and feedback is more than welcome! As third-party integrations
> in Astro are still experimental, note that some breaking changes may still be
> introduced during this phase.

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
         baseLanguage: "en",
         i18next: {
           debug: true, // convenient during development to check for missing keys
           supportedLngs: ["en", "fr"],
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
       └-- index.astro  # route for base language
   ```

ℹ️ This is the **minimal setup** to get you started as fast as possible. If
you'd like to go further, check out the [config props](#config-props) and
[namespaces](#namespaces).

### 3. 🚀 Start translating

You're all set! You may now start translating your website by using
[i18next's `t` function](https://www.i18next.com/overview/api#t) or the
[Trans component](#trans-component) depending on your needs.

Here's a quick tutorial to get you going:

```astro
---
// src/pages/index.astro
import i18next, { t } from "i18next";
import { Trans, HeadHrefLangs } from "astro-i18next/components";

// Use i18next's changeLanguage() function to change the language
i18next.changeLanguage("fr");
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

For a more exhaustive example, see the [demo project](./example/).

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

| Prop name | Type (default)      | Description                                                                                                                                            |
| --------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| i18nKey   | string (undefined)  | Internationalization key to interpolate to. Can contain the namespace by prepending it in the form 'ns:key' (depending on i18next.options.nsSeparator) |
| ns        | ?string (undefined) | Namespace to use. May also be embedded in i18nKey but not recommended when used in combination with natural language keys.                             |

#### interpolate function

`interpolate(i18nKey: string, reference: string, namespace: string | null): string`

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
`fr`, `es`) with `en` being the base language, this will render:

```html
<link rel="alternate" hreflang="en" href="https://www.example.com/about/" />
<link rel="alternate" hreflang="fr" href="https://www.example.com/fr/about/" />
<link rel="alternate" hreflang="es" href="https://www.example.com/es/about/" />
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

## Namespaces

For larger projects, the namespaces feature allows you to break your
translations into multiple files, thus easier maintenance!

See i18next's documentation on the
[Namespaces principle](https://www.i18next.com/principles/namespaces).

### 1. Configure namespaces

All you have to do is create a folder including the namespaced translation files
for each language instead of a single file per language.

🪄 `astro-i18next` will automagically load the namespaces for you!

```bash
src
├-- locales
|   ├-- en # the base language `en` contains 3 namespaces
|   |   ├-- common.json
|   |   ├-- home.json
|   |   └-- about.json
|   └-- fr # `fr` language must contain the same namespaces as the base `en` language
|       ├-- common.json
|       ├-- home.json
|       └-- about.json
└-- pages
    └-- [...]
```

You can also define the default namespace in your `astro-i18next` config:

```mjs
import { defineConfig } from "astro/config";
import astroI18next from "astro-i18next";

export default defineConfig({
  experimental: {
    integrations: true,
  },
  integrations: [
    astroI18next({
      baseLanguage: "en",
      i18next: {
        defaultNS: "common", // translation keys will be retrieved in the common.json file by default
        supportedLngs: ["en", "fr"],
      },
    }),
  ],
});
```

### 2. Using namespaces

1. Using i18next's `t` function

   ```astro
   ---
   import { t } from "i18next";
   ---

   <p>{t("home:myKey")}</p>
   or
   <p>{t("myKey", { ns: "home" })}</p>
   ```

2. Using the [Trans component](#trans-component)

```astro
---
import { Trans } from "astro-i18next/components";
---

<Trans i18nKey="myKey" ns="home">This is a sample key</Trans>
```

## Config Props

`astro-i18next` abstracts most of the configuration for you so that you don't
have to think about it. Just focus on translating!

Though if you'd like to go further, feel free to tweak the config!

| Prop name     | Type (default)                     | Description                                                                                                                   |
| ------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| baseLanguage  | string (undefined)                 | The default language for your website                                                                                         |
| resourcesPath | ?string (`src/resources/locales/`) | The path to your translation files                                                                                            |
| i18next       | `InitOptions` (undefined)          | The i18next configuration. See [i18next's documentation](https://www.i18next.com/overview/configuration-options) to know more |

## Contributors ✨

Thanks goes to these wonderful people
([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://yassinedoghri.com/"><img src="https://avatars.githubusercontent.com/u/11021441?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Yassine Doghri</b></sub></a><br /><a href="https://github.com/yassinedoghri/astro-i18next/commits?author=yassinedoghri" title="Code">💻</a> <a href="https://github.com/yassinedoghri/astro-i18next/commits?author=yassinedoghri" title="Documentation">📖</a> <a href="#design-yassinedoghri" title="Design">🎨</a> <a href="#example-yassinedoghri" title="Examples">💡</a> <a href="#maintenance-yassinedoghri" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://gdevs.io/"><img src="https://avatars.githubusercontent.com/u/10165264?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Davide Ceschia</b></sub></a><br /><a href="https://github.com/yassinedoghri/astro-i18next/commits?author=killpowa" title="Code">💻</a> <a href="https://github.com/yassinedoghri/astro-i18next/issues?q=author%3Akillpowa" title="Bug reports">🐛</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the
[all-contributors](https://github.com/all-contributors/all-contributors)
specification. Contributions of any kind welcome!

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

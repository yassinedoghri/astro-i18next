# 🚀 Astro i18next 🌍

i18next components to help translate [astro](https://astro.build/) websites.

> **Status** [alpha version]
>
> Currently in development, not ready yet! Missing tests, better integration,
> better docs and examples

## Install

```bash
npm install astro-i18next
```

```bash
pnpm add astro-i18next
```

```bash
yarn add astro-i18next
```

## Usage

### Trans component

```astro
---
import { Trans } from "astro-i18next";
---

<Trans i18nKey="superCoolKey">
  This is a <strong>super cool</strong> sentence!
</Trans>
```

```json
// fr.json
{
  "superCoolKey": "Ceci est une phrase <0>super cool</0>!"
}
```

#### Trans Props

| Propname | Type   | Description              |
| -------- | ------ | ------------------------ |
| i18nKey  | string | Internationalization key |

### LanguageSelector component

Unstyled custom select component to choose amongst supported locales.

```astro
---
import { LanguageSelector } from "astro-i18next";
---

<LanguageSelector className="my-select-class" />
```

#### LanguageSelector Props

| Propname  | Type   | Description                            |
| --------- | ------ | -------------------------------------- |
| className | string | class attribute for the `<select>` tag |

## License

[MIT](https://choosealicense.com/licenses/mit/)

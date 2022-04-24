# 🚀 Astro i18next 🌍

i18next components to help translate [astro](https://astro.build/) websites.

> **Status**
>
> Currently in development: missing tests, better docs and examples

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
// en.json
{
  "superCoolKey": "This is a <0>super cool</0> sentence!"
}
```

### Props

| Propname | Type   | Description              |
| -------- | ------ | ------------------------ |
| i18nKey  | string | Internationalization key |

## License

[MIT](https://choosealicense.com/licenses/mit/)

# [1.0.0-beta.13](https://github.com/yassinedoghri/astro-i18next/compare/v1.0.0-beta.12...v1.0.0-beta.13) (2022-11-06)


### Bug Fixes

* add isFileHidden function + tests to prevent missing hidden files ([7dcd0aa](https://github.com/yassinedoghri/astro-i18next/commit/7dcd0aad9adfb43f47446f8b2ca1059eafbc7bf9))
* **generate:** replace isLocale check with user defined locales to prevent nested folders generation ([a598e2e](https://github.com/yassinedoghri/astro-i18next/commit/a598e2ebb7b1e3c7a2073ed626aae39fe5ef580b)), closes [#56](https://github.com/yassinedoghri/astro-i18next/issues/56)
* **i18next-server:** load locale files synchronously ([e7892e2](https://github.com/yassinedoghri/astro-i18next/commit/e7892e20a63b7b639b390c4f6487a8757bfbf157))
* update types import to relative ([#58](https://github.com/yassinedoghri/astro-i18next/issues/58)) ([44a5422](https://github.com/yassinedoghri/astro-i18next/commit/44a54223cff9f57686ec0830529f26304a763a50))


### Features

* add option to show the default locale in the url ([#51](https://github.com/yassinedoghri/astro-i18next/issues/51)) ([ea939db](https://github.com/yassinedoghri/astro-i18next/commit/ea939db76114ed0ffb5efec452d6fcfaefe8962c)), closes [#54](https://github.com/yassinedoghri/astro-i18next/issues/54)
* add support for route translations ([db5200b](https://github.com/yassinedoghri/astro-i18next/commit/db5200b69bb79ae1a7bb9d60c05aee44e46e948d)), closes [#50](https://github.com/yassinedoghri/astro-i18next/issues/50) [#29](https://github.com/yassinedoghri/astro-i18next/issues/29)
* allow implicit key for <Trans> when omitting i18nKey prop ([ff14354](https://github.com/yassinedoghri/astro-i18next/commit/ff14354b81cf2d5462a3831a2f2cfabbc53e4dc0)), closes [#53](https://github.com/yassinedoghri/astro-i18next/issues/53)
* simplified API + instanciate i18next both in server and client side ([ed44510](https://github.com/yassinedoghri/astro-i18next/commit/ed445109ea7aa93fa0b2130d159c91a48f2e5869)), closes [#57](https://github.com/yassinedoghri/astro-i18next/issues/57) [#46](https://github.com/yassinedoghri/astro-i18next/issues/46) [#37](https://github.com/yassinedoghri/astro-i18next/issues/37)


### BREAKING CHANGES

* - defaultLanguage is now defaultLocale
- supportedLanguages is now locales
- i18next config is now split into two configs: `i18nextServer`
and `i18nextClient`

# [1.0.0-beta.12](https://github.com/yassinedoghri/astro-i18next/compare/v1.0.0-beta.11...v1.0.0-beta.12) (2022-09-25)

### Bug Fixes

- **cli:** filter out any file other than .astro files for generate
  ([c34fa07](https://github.com/yassinedoghri/astro-i18next/commit/c34fa070eb1bfd9414e5713c8638be2c3cf90ebf))

# [1.0.0-beta.11](https://github.com/yassinedoghri/astro-i18next/compare/v1.0.0-beta.10...v1.0.0-beta.11) (2022-09-24)

### Bug Fixes

- **generate:** ignore any directories/files that begin with an underscore
  ([a7e6f08](https://github.com/yassinedoghri/astro-i18next/commit/a7e6f08710c4da71b4b595e6411494abb135d64f)),
  closes [#43](https://github.com/yassinedoghri/astro-i18next/issues/43)

# [1.0.0-beta.10](https://github.com/yassinedoghri/astro-i18next/compare/v1.0.0-beta.9...v1.0.0-beta.10) (2022-09-12)

### Bug Fixes

- **plugins:** normalize named imports to call in i18next's use function
  ([6928ddc](https://github.com/yassinedoghri/astro-i18next/commit/6928ddc248465a10fa18764ad903c2fb8e02ddb5)),
  closes [#38](https://github.com/yassinedoghri/astro-i18next/issues/38)

# [1.0.0-beta.9](https://github.com/yassinedoghri/astro-i18next/compare/v1.0.0-beta.8...v1.0.0-beta.9) (2022-09-05)

### Bug Fixes

- reset iso-639-1 and locale-emoji as dependencies
  ([b2863d7](https://github.com/yassinedoghri/astro-i18next/commit/b2863d74ed74b750fda868e3039308e9daa6022d)),
  closes [#32](https://github.com/yassinedoghri/astro-i18next/issues/32)

# [1.0.0-beta.8](https://github.com/yassinedoghri/astro-i18next/compare/v1.0.0-beta.7...v1.0.0-beta.8) (2022-09-04)

### Bug Fixes

- take astro base path into account when using localizePath or localizeUrl
  functions
  ([5c35eaf](https://github.com/yassinedoghri/astro-i18next/commit/5c35eaf27b4f3ebc216ba943ef46e0cee1ca468c)),
  closes [#27](https://github.com/yassinedoghri/astro-i18next/issues/27)

# [1.0.0-beta.7](https://github.com/yassinedoghri/astro-i18next/compare/v1.0.0-beta.6...v1.0.0-beta.7) (2022-09-03)

### Bug Fixes

- replace @proload/plugin-typescript with @proload/plugin-tsm
  ([6f639ee](https://github.com/yassinedoghri/astro-i18next/commit/6f639ee9b3f5ee121d6f7bfad90b2088f4112688))

# [1.0.0-beta.6](https://github.com/yassinedoghri/astro-i18next/compare/v1.0.0-beta.5...v1.0.0-beta.6) (2022-09-03)

### Bug Fixes

- Rollup failed to resolve import 'types'
  ([#33](https://github.com/yassinedoghri/astro-i18next/issues/33))
  ([2807989](https://github.com/yassinedoghri/astro-i18next/commit/2807989b1d3164b1ce7e2a1298dc46d19b63e985))

# [1.0.0-beta.5](https://github.com/yassinedoghri/astro-i18next/compare/v1.0.0-beta.4...v1.0.0-beta.5) (2022-08-27)

### Bug Fixes

- **build:** remove components and utils from build + set components export to
  src
  ([bb7ab0f](https://github.com/yassinedoghri/astro-i18next/commit/bb7ab0f318feeb7bd4243ea805d09f55634b1ecf)),
  closes [#18](https://github.com/yassinedoghri/astro-i18next/issues/18)
- **generate:** inject changeLanguage statement after imports and before
  frontmatter logic
  ([4d74e0b](https://github.com/yassinedoghri/astro-i18next/commit/4d74e0b3d1d03c40ca9090b82fb4d171cd4b84a0)),
  closes [#23](https://github.com/yassinedoghri/astro-i18next/issues/23)
- type definitions for exported astro components
  ([bb60949](https://github.com/yassinedoghri/astro-i18next/commit/bb609499c1002dca13849ce0f500940b31c1482b)),
  closes [#18](https://github.com/yassinedoghri/astro-i18next/issues/18)

# [1.0.0-beta.4](https://github.com/yassinedoghri/astro-i18next/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2022-08-21)

### Bug Fixes

- add depth level to relative import declarations
  ([02ddb76](https://github.com/yassinedoghri/astro-i18next/commit/02ddb7614391e07975d3422357e5f0140ed48ec8))
- **example:** add isCurrentPath function comparing current url to localized
  path
  ([ee90afb](https://github.com/yassinedoghri/astro-i18next/commit/ee90afb2dc44168a343e627a3c9cea1f369f8da8))
- **language-selector:** replace country-code-to-flag-emoji dependency with
  locale-emoji
  ([6aee21d](https://github.com/yassinedoghri/astro-i18next/commit/6aee21d6064cd596f6bff1bf6b670cc58ef0b263)),
  closes [#14](https://github.com/yassinedoghri/astro-i18next/issues/14)

### Features

- allow using i18next plugins directly in the config
  ([114ccd7](https://github.com/yassinedoghri/astro-i18next/commit/114ccd759d80c7bdd017f787cdbd557f0721e817))
- **cli:** add generate command to create localized astro pages
  ([17982cf](https://github.com/yassinedoghri/astro-i18next/commit/17982cf1ef152c913230094b017828f1a77073da)),
  closes [#13](https://github.com/yassinedoghri/astro-i18next/issues/13)
- **cli:** add success feedback to generate command + add generated filepaths
  with verbose
  ([9e3d4f5](https://github.com/yassinedoghri/astro-i18next/commit/9e3d4f57f31913e4f8646c1003a5f9379d5cae2a))
- move astro-i18next config in a standalone file to load it for CLI commands
  ([bdf2408](https://github.com/yassinedoghri/astro-i18next/commit/bdf240857e1fbb0d7b13482cbbd39eedfe768119))

### BREAKING CHANGES

- config is now a standalone file + some property names have changed for better
  clarity and consistency

* `baseLocale` is now `defaultLanguage`
* `supportedLocales` is now `supportedLanguages``

- `baseLanguage` is now `baseLocale` in config options

# [1.0.0-beta.3](https://github.com/yassinedoghri/astro-i18next/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2022-06-12)

### Features

- add HeadHrefLangs component + localizeUrl util function
  ([cd4095e](https://github.com/yassinedoghri/astro-i18next/commit/cd4095ec7b42d7a4759ef980ba76515549b21f75))
- add i18next namespaces + validate config before processing it
  ([10b40cc](https://github.com/yassinedoghri/astro-i18next/commit/10b40cc81329d2d34f9cd9e37f1aa16145812449))
- allow passing functions to i18next init
  ([ed7c721](https://github.com/yassinedoghri/astro-i18next/commit/ed7c72117ccc363a8174681b990f75c67986dcd6))

# [1.0.0-beta.2](https://github.com/yassinedoghri/astro-i18next/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2022-06-06)

### Features

- add utility function to localize path + improve components and overall DX
  ([d230f00](https://github.com/yassinedoghri/astro-i18next/commit/d230f002183bccad88230d947d4c981e2792b2ed))

### BREAKING CHANGES

- rename i18nextConfig to i18next in config + remove className and baseLanguage
  props for LanguageSelector

# 1.0.0-beta.1 (2022-05-12)

### Bug Fixes

- include LanguageSelector component to release files
  ([efa1961](https://github.com/yassinedoghri/astro-i18next/commit/efa19613f3341dde2afbd794b43fcd9e73d6f1b1))
- replace language-flag-colors with country-code-to-flag-emoji dependency
  ([7d4d408](https://github.com/yassinedoghri/astro-i18next/commit/7d4d408577e48d8fb860ae897a5573f2ec7c3beb))
- update package.json's exports value
  ([86d7cf9](https://github.com/yassinedoghri/astro-i18next/commit/86d7cf96a91176c75235ed2553bacbdf68217c61))
- update publish workflow to include bundled package in dist
  ([5428dc3](https://github.com/yassinedoghri/astro-i18next/commit/5428dc34a5f6729da3b2b81ab1a49a03a4811a32))
- update utils path to relative in Trans component
  ([c767fe3](https://github.com/yassinedoghri/astro-i18next/commit/c767fe3c174212358e285e1b85ebfff3ce9411e1))
- **workflow:** download bundle artifact into dist path to include it into
  package
  ([3fb5a78](https://github.com/yassinedoghri/astro-i18next/commit/3fb5a781051f38c1c210d5c70a6533f1e8d34469))

### Features

- add astro integration --> initialize i18next upon astro:config:setup
  ([78ec744](https://github.com/yassinedoghri/astro-i18next/commit/78ec7444439ac6d31b0e66cc2aa10007d83ac5c1))
- add LanguageSelector component to select language from supported locales
  ([ad3fe2a](https://github.com/yassinedoghri/astro-i18next/commit/ad3fe2af6895a993f94e414757269d86aefc8451))
- add showFlag attribute to LanguageSelector to display the flag emoji or not
  ([a4b2f98](https://github.com/yassinedoghri/astro-i18next/commit/a4b2f988b1772056e10812c10c906af3da5716bc))
- add Trans component to interpolate translation strings with its contents
  ([14ff1bd](https://github.com/yassinedoghri/astro-i18next/commit/14ff1bd0258e1d860fc188cfee941338787b5f4d))
- load translation resources automatically + add example website
  ([48dd98e](https://github.com/yassinedoghri/astro-i18next/commit/48dd98e6d95a824abd7ca521f786d1802cec0db5))
- prefix language name with language flag emoji using language-flag-colors
  ([7e09d93](https://github.com/yassinedoghri/astro-i18next/commit/7e09d93d45538ce90ebdc2d16a6a3ce5be782211))

# [1.0.0-alpha.9](https://github.com/yassinedoghri/astro-i18next/compare/v1.0.0-alpha.8...v1.0.0-alpha.9) (2022-05-12)

### Features

- load translation resources automatically + add example website
  ([48dd98e](https://github.com/yassinedoghri/astro-i18next/commit/48dd98e6d95a824abd7ca521f786d1802cec0db5))

# [1.0.0-alpha.8](https://github.com/yassinedoghri/astro-i18next/compare/v1.0.0-alpha.7...v1.0.0-alpha.8) (2022-04-30)

### Bug Fixes

- **workflow:** download bundle artifact into dist path to include it into
  package
  ([3fb5a78](https://github.com/yassinedoghri/astro-i18next/commit/3fb5a781051f38c1c210d5c70a6533f1e8d34469))

# [1.0.0-alpha.7](https://github.com/yassinedoghri/astro-i18next/compare/v1.0.0-alpha.6...v1.0.0-alpha.7) (2022-04-30)

### Bug Fixes

- update publish workflow to include bundled package in dist
  ([5428dc3](https://github.com/yassinedoghri/astro-i18next/commit/5428dc34a5f6729da3b2b81ab1a49a03a4811a32))

# [1.0.0-alpha.6](https://github.com/yassinedoghri/astro-i18next/compare/v1.0.0-alpha.5...v1.0.0-alpha.6) (2022-04-30)

### Features

- add astro integration --> initialize i18next upon astro:config:setup
  ([78ec744](https://github.com/yassinedoghri/astro-i18next/commit/78ec7444439ac6d31b0e66cc2aa10007d83ac5c1))

# [1.0.0-alpha.5](https://github.com/yassinedoghri/astro-i18next/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2022-04-30)

### Bug Fixes

- replace language-flag-colors with country-code-to-flag-emoji dependency
  ([7d4d408](https://github.com/yassinedoghri/astro-i18next/commit/7d4d408577e48d8fb860ae897a5573f2ec7c3beb))

# [1.0.0-alpha.4](https://github.com/yassinedoghri/astro-i18next/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2022-04-30)

### Bug Fixes

- include LanguageSelector component to release files
  ([efa1961](https://github.com/yassinedoghri/astro-i18next/commit/efa19613f3341dde2afbd794b43fcd9e73d6f1b1))

# [1.0.0-alpha.3](https://github.com/yassinedoghri/astro-i18next/compare/v1.0.0-alpha.2...v1.0.0-alpha.3) (2022-04-29)

### Features

- prefix language name with language flag emoji using language-flag-colors
  ([7e09d93](https://github.com/yassinedoghri/astro-i18next/commit/7e09d93d45538ce90ebdc2d16a6a3ce5be782211))

# [1.0.0-alpha.2](https://github.com/yassinedoghri/astro-i18next/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2022-04-29)

### Features

- add LanguageSelector component to select language from supported locales
  ([ad3fe2a](https://github.com/yassinedoghri/astro-i18next/commit/ad3fe2af6895a993f94e414757269d86aefc8451))

# 1.0.0-alpha.1 (2022-04-27)

### Bug Fixes

- update package.json's exports value
  ([86d7cf9](https://github.com/yassinedoghri/astro-i18next/commit/86d7cf96a91176c75235ed2553bacbdf68217c61))
- update utils path to relative in Trans component
  ([c767fe3](https://github.com/yassinedoghri/astro-i18next/commit/c767fe3c174212358e285e1b85ebfff3ce9411e1))

### Features

- add Trans component to interpolate translation strings with its contents
  ([14ff1bd](https://github.com/yassinedoghri/astro-i18next/commit/14ff1bd0258e1d860fc188cfee941338787b5f4d))

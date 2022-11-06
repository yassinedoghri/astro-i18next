import { InitOptions } from "i18next";

export interface AstroI18nextOptions {
  /**
   * Path to your astro-i18next config file
   *
   * @default 'astro-i18next.config.js'
   */
  configPath?: string;
}

export interface Routes {
  [segment: string]: string | Record<string, string | Routes>;
}

export interface AstroI18nextConfig {
  /**
   * The default locale for your website.
   *
   * @default undefined
   */
  defaultLocale: string;

  /**
   * The locales that are supported by your website.
   *
   * @default undefined
   */
  locales: string[];

  /**
   * String or array of namespaces to load
   *
   * @default "translation"
   */
  namespaces?: string | string[];

  /**
   * Default namespace used if not passed to the translation function
   *
   * @default "translation"
   */
  defaultNamespace?: string;

  /**
   * i18next server side config. See https://www.i18next.com/overview/configuration-options
   */
  i18nextServer?: InitOptions;

  /**
   * i18next client side config. See https://www.i18next.com/overview/configuration-options
   */
  i18nextClient?: InitOptions;

  /**
   * The translations for your routes.
   *
   * @default {}
   */
  routes?: Routes;

  /**
   * Generated mappings based on the routes
   *
   * @default {}
   */
  readonly flatRoutes?: Record<string, string>;

  /**
   * The display behaviour for the URL locale.
   *
   * @default false
   */
  showDefaultLocale?: boolean;
}

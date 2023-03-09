import { InitOptions } from "i18next";

export interface AstroI18nextGlobal {
  config: AstroI18nextConfig;
}

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

export interface Plugins {
  [importName: string]: string | null;
}

export interface AstroI18nextConfig {
  /**
   * The default locale for your website.
   *
   * @default "cimode"
   */
  defaultLocale: string;

  /**
   * The locales that are supported by your website.
   *
   * @default []
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
   * Load i18next on server side only, client side only or both.
   *
   * @default ["server"]
   */
  load?: ("server" | "client")[];

  /**
   * Set base path for i18next resources.
   *
   * @default "/locales"
   */
  resourcesBasePath?: string;

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

  /**
   * i18next server side plugins. See https://www.i18next.com/overview/plugins-and-utils
   *
   * Include the plugins with the key being the import name and the value being the plugin name.
   *
   * Eg.:
   * ```
   * {
   *  "Backend": "i18next-fs-backend",
   * }
   * ```
   */
  i18nextServerPlugins?: Plugins;

  /**
   * i18next client side plugins. See https://www.i18next.com/overview/plugins-and-utils
   *
   * Include the plugins with the key being the import name and the value being the plugin name.
   *
   * Eg.:
   * ```
   * {
   *  "{initReactI18next}": "react-i18next",
   * }
   * ```
   */
  i18nextClientPlugins?: Plugins;

  /**
   * Set the route matching behavior of the dev server. Choose from the following options:
   *
   * 'always' - Only match URLs that include a trailing slash (ex: "/foo/")
   * 'never' - Never match URLs that include a trailing slash (ex: "/foo")
   * 'ignore' - Match URLs regardless of whether a trailing "/" exists
   */
  trailingSlash?: "always" | "never" | "ignore";
}

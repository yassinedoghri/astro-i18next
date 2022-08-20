import { InitOptions } from "i18next";

export interface AstroI18nextOptions {
  /**
   * Path to your astro-i18next config file
   *
   * @default 'astro-i18next.config.js'
   */
  configPath?: string;
}

export interface AstroI18nextConfig {
  /**
   * The default language for your website.
   *
   * @default undefined
   */
  defaultLanguage: string;

  /**
   * The locales that are supported by your website.
   *
   * @default undefined
   */
  supportedLanguages: string[];

  /**
   * i18next config. See https://www.i18next.com/overview/configuration-options
   */
  i18next?: InitOptions;

  /**
   * i18next plugins. See https://www.i18next.com/overview/plugins-and-utils
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
  i18nextPlugins?: {
    [key: string]: string;
  };
}

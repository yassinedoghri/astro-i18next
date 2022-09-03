import { AstroI18nextConfig } from "../types";

export interface GlobalArgs {
  verbose: boolean;
}

export interface GenerateArgs {
  path: string;
  config: AstroI18nextConfig;
  output: string;
}

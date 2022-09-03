import { pathToFileURL } from "url";
import { MiddlewareFunction } from "yargs";
import { getUserConfig } from "../utils";
import { GenerateArgs, GlobalArgs } from "./types";

// @ts-ignore
export const loadConfig: MiddlewareFunction<GlobalArgs & GenerateArgs> = async (
  argv
): Promise<GlobalArgs & GenerateArgs> => {
  const { path, config } = argv;

  const userConfig = await getUserConfig(pathToFileURL(path), config as any);

  if (path && !userConfig?.value) {
    throw new Error(
      `Could not find a config file at ${JSON.stringify(
        path
      )}. Does the file exist?`
    );
  }

  return { ...argv, config: userConfig?.value };
};

// @ts-ignore
export const normalizePath: MiddlewareFunction<
  GlobalArgs & GenerateArgs
> = async (argv): Promise<GlobalArgs & GenerateArgs> => {
  const { path } = argv;

  return { ...argv, path: path.endsWith("/") ? path : path + "/" };
};

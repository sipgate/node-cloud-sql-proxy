import * as chalk from "chalk";
import { spawn } from "child_process";
import { arch, platform } from "os";
import { resolve } from "path";
const config = require("dotenv").config();
const expand = require("dotenv-expand");

expand(config);

const error = (message: string) => console.error(chalk.red(message));
const log = (message: string) =>
  console.log(`${chalk.blue("[Proxy]")} ${message}`);

const getBinary = (): string => {
  const paths: any = {
    linux: {
      x64: resolve(__dirname, "..", "bin", "cloud_sql_proxy_linux_amd32"),
      x32: resolve(__dirname, "..", "bin", "cloud_sql_proxy_linux_amd64"),
    },
    darwin: {
      x64: resolve(__dirname, "..", "bin", "cloud_sql_proxy_macos_amd64"),
      x32: resolve(__dirname, "..", "bin", "cloud_sql_proxy_macos_amd32"),
      arm: resolve(__dirname, "..", "bin", "cloud_sql_proxy_macos_arm64"),
      arm64: resolve(__dirname, "..", "bin", "cloud_sql_proxy_macos_arm64"),
    },
  };
  try {
    return paths[platform()][arch()];
  } catch (err) {
    error(`Cannot access binary: ${err instanceof Error ? err.message : err}`);
    process.exit(1);
  }
};

export enum ENV {
  NODE_CLOUD_SQL_DIR = "NODE_CLOUD_SQL_DIR",
  NODE_CLOUD_SQL_INSTANCES = "NODE_CLOUD_SQL_INSTANCES",
  GOOGLE_APPLICATION_CREDENTIALS_PATH = "GOOGLE_APPLICATION_CREDENTIALS_PATH",
  GOOGLE_APPLICATION_CREDENTIALS = "GOOGLE_APPLICATION_CREDENTIALS",
}

export interface Options {
  dir?: string;
  instances?: string;
  quiet?: boolean;
  gcpCredentialPath?: string;
  gcpCredentials?: string;
}

const checkEnv = (key: string) => {
  return process.env[key] && typeof process.env[key] === "string";
};

const getArgsFromEnv = (): string[] => {
  const args: string[] = [];
  if (checkEnv(ENV.NODE_CLOUD_SQL_DIR))
    args.push("-dir", process.env[ENV.NODE_CLOUD_SQL_DIR] as string);
  if (checkEnv(ENV.NODE_CLOUD_SQL_INSTANCES))
    args.push(
      "-instances",
      process.env[ENV.NODE_CLOUD_SQL_INSTANCES] as string
    );
  if (checkEnv(ENV.GOOGLE_APPLICATION_CREDENTIALS_PATH))
    args.push(
      "-credential_file",
      process.env[ENV.GOOGLE_APPLICATION_CREDENTIALS_PATH] as string
    );
  return args;
};

const getEnv = () => {
  if (checkEnv(ENV.GOOGLE_APPLICATION_CREDENTIALS)) {
    return {
      [ENV.GOOGLE_APPLICATION_CREDENTIALS]:
        process.env[ENV.GOOGLE_APPLICATION_CREDENTIALS],
    };
  }

  return {};
};

const connect = async (options: Options = { quiet: true }): Promise<void> => {
  if (platform() !== "darwin" && platform() !== "linux") {
    error(`OS "${platform()}"" is not supported.`);
    process.exit(1);
  }

  if (
    arch() !== "x32" &&
    arch() !== "x64" &&
    arch() !== "arm" &&
    arch() !== "arm64"
  ) {
    error(`CPU architecture "${arch()}"" is not supported.`);
    process.exit(1);
  }

  const binary = getBinary();

  const args = getArgsFromEnv();
  const env = getEnv();

  if (options.dir) args.push("-dir", options.dir);
  if (options.instances) args.push("-instances", options.instances);
  if (options.quiet) args.push("-quiet");
  if (options.gcpCredentialPath)
    args.push("-credential_file", options.gcpCredentialPath);

  if (options.gcpCredentials) {
    env["GOOGLE_APPLICATION_CREDENTIALS"] = options.gcpCredentials;
  }

  log(`${binary} ${args.join(" ")}`);
  return new Promise((res, rej) => {
    const proxy = spawn(binary, args, {
      stdio: ["pipe", "pipe", "pipe"],
      env,
    });

    proxy.stderr.on("data", (message: Buffer) => {
      log(message.toString().replace("\n", ""));
      if (message.toString().includes("Ready for new connections")) {
        res();
      }
    });

    setTimeout(() => res(), 5 * 1000);
  });
};

export default { connect };

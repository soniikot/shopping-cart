"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const commander = require("commander");
require("axios");
require("fs-extra");
require("os");
const utils = require("@strapi/utils");
require("path");
require("xdg-app-paths");
require("jwks-rsa");
require("jsonwebtoken");
const chalk = require("chalk");
const stringify = require("fast-safe-stringify");
const ora = require("ora");
const cliProgress = require("cli-progress");
const index_ts = require("./index.ts");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
function _interopNamespace(e) {
  if (e && e.__esModule)
    return e;
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const chalk__default = /* @__PURE__ */ _interopDefault(chalk);
const stringify__default = /* @__PURE__ */ _interopDefault(stringify);
const ora__default = /* @__PURE__ */ _interopDefault(ora);
const cliProgress__namespace = /* @__PURE__ */ _interopNamespace(cliProgress);
({
  apiBaseUrl: utils.env("STRAPI_CLI_CLOUD_API", "https://cloud-cli-api.strapi.io"),
  dashboardBaseUrl: utils.env("STRAPI_CLI_CLOUD_DASHBOARD", "https://cloud.strapi.io")
});
const stringifyArg = (arg) => {
  return typeof arg === "object" ? stringify__default.default(arg) : arg;
};
const createLogger = (options = {}) => {
  const { silent = false, debug = false, timestamp = true } = options;
  const state = { errors: 0, warning: 0 };
  return {
    get warnings() {
      return state.warning;
    },
    get errors() {
      return state.errors;
    },
    async debug(...args) {
      if (silent || !debug) {
        return;
      }
      console.log(
        chalk__default.default.cyan(`[DEBUG]${timestamp ? `	[${(/* @__PURE__ */ new Date()).toISOString()}]` : ""}`),
        ...args.map(stringifyArg)
      );
    },
    info(...args) {
      if (silent) {
        return;
      }
      console.info(
        chalk__default.default.blue(`[INFO]${timestamp ? `	[${(/* @__PURE__ */ new Date()).toISOString()}]` : ""}`),
        ...args.map(stringifyArg)
      );
    },
    log(...args) {
      if (silent) {
        return;
      }
      console.info(
        chalk__default.default.blue(`${timestamp ? `	[${(/* @__PURE__ */ new Date()).toISOString()}]` : ""}`),
        ...args.map(stringifyArg)
      );
    },
    success(...args) {
      if (silent) {
        return;
      }
      console.info(
        chalk__default.default.green(`[SUCCESS]${timestamp ? `	[${(/* @__PURE__ */ new Date()).toISOString()}]` : ""}`),
        ...args.map(stringifyArg)
      );
    },
    warn(...args) {
      state.warning += 1;
      if (silent) {
        return;
      }
      console.warn(
        chalk__default.default.yellow(`[WARN]${timestamp ? `	[${(/* @__PURE__ */ new Date()).toISOString()}]` : ""}`),
        ...args.map(stringifyArg)
      );
    },
    error(...args) {
      state.errors += 1;
      if (silent) {
        return;
      }
      console.error(
        chalk__default.default.red(`[ERROR]${timestamp ? `	[${(/* @__PURE__ */ new Date()).toISOString()}]` : ""}`),
        ...args.map(stringifyArg)
      );
    },
    // @ts-expect-error – returning a subpart of ora is fine because the types tell us what is what.
    spinner(text) {
      if (silent) {
        return {
          succeed() {
            return this;
          },
          fail() {
            return this;
          },
          start() {
            return this;
          },
          text: "",
          isSpinning: false
        };
      }
      return ora__default.default(text);
    },
    progressBar(totalSize, text) {
      if (silent) {
        return {
          start() {
            return this;
          },
          stop() {
            return this;
          },
          update() {
            return this;
          }
        };
      }
      const progressBar = new cliProgress__namespace.SingleBar({
        format: `${text ? `${text} |` : ""}${chalk__default.default.green("{bar}")}| {percentage}%`,
        barCompleteChar: "█",
        barIncompleteChar: "░",
        hideCursor: true,
        forceRedraw: true
      });
      progressBar.start(totalSize, 0);
      return progressBar;
    }
  };
};
function loadStrapiCloudCommand(argv = process.argv, command = new commander.Command()) {
  command.storeOptionsAsProperties(false).allowUnknownOption(true);
  command.helpOption("-h, --help", "Display help for command");
  command.addHelpCommand("help [command]", "Display help for command");
  const cwd = process.cwd();
  const hasDebug = argv.includes("--debug");
  const hasSilent = argv.includes("--silent");
  const logger = createLogger({ debug: hasDebug, silent: hasSilent, timestamp: false });
  const ctx = {
    cwd,
    logger
  };
  index_ts.buildStrapiCloudCommands({ command, ctx, argv });
}
function runStrapiCloudCommand(argv = process.argv, command = new commander.Command()) {
  loadStrapiCloudCommand(argv, command);
  command.parse(argv);
}
exports.runStrapiCloudCommand = runStrapiCloudCommand;
//# sourceMappingURL=bin.js.map

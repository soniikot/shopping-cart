"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const commander = require("commander");
const cloudCli = require("@strapi/cloud-cli");
const command = require("./actions/admin/create-user/command.js");
const command$1 = require("./actions/admin/reset-user-password/command.js");
const command$2 = require("./actions/components/list/command.js");
const command$3 = require("./actions/configuration/dump/command.js");
const command$4 = require("./actions/configuration/restore/command.js");
const command$5 = require("./actions/console/command.js");
const command$6 = require("./actions/content-types/list/command.js");
const command$7 = require("./actions/controllers/list/command.js");
const command$8 = require("./actions/generate/command.js");
const command$9 = require("./actions/hooks/list/command.js");
const command$a = require("./actions/install/command.js");
const command$b = require("./actions/middlewares/list/command.js");
const command$c = require("./actions/new/command.js");
const command$d = require("./actions/policies/list/command.js");
const command$e = require("./actions/report/command.js");
const command$f = require("./actions/routes/list/command.js");
const command$g = require("./actions/services/list/command.js");
const command$h = require("./actions/start/command.js");
const command$i = require("./actions/telemetry/disable/command.js");
const command$j = require("./actions/telemetry/enable/command.js");
const command$k = require("./actions/templates/generate/command.js");
const command$l = require("./actions/ts/generate-types/command.js");
const command$m = require("./actions/uninstall/command.js");
const command$n = require("./actions/version/command.js");
const command$o = require("./actions/watch-admin/command.js");
const command$p = require("./actions/plugin/build-command/command.js");
const command$q = require("./actions/plugin/init/command.js");
const command$r = require("./actions/plugin/link-watch/command.js");
const command$s = require("./actions/plugin/watch/command.js");
const command$t = require("./actions/plugin/verify/command.js");
const logger = require("./utils/logger.js");
const tsconfig = require("./utils/tsconfig.js");
const strapiCommands = {
  createAdminUser: command,
  resetAdminUserPassword: command$1,
  listComponents: command$2,
  configurationDump: command$3,
  configurationRestore: command$4,
  consoleCommand: command$5,
  listContentTypes: command$6,
  listControllers: command$7,
  generateCommand: command$8,
  listHooks: command$9,
  installCommand: command$a,
  listMiddlewares: command$b,
  newCommand: command$c,
  listPolicies: command$d,
  reportCommand: command$e,
  listRoutes: command$f,
  listServices: command$g,
  startCommand: command$h,
  disableTelemetry: command$i,
  enableTelemetry: command$j,
  generateTemplates: command$k,
  generateTsTypes: command$l,
  uninstallCommand: command$m,
  versionCommand: command$n,
  watchAdminCommand: command$o,
  /**
   * Cloud
   */
  buildStrapiCloudCommands: cloudCli.buildStrapiCloudCommands,
  /**
   * Plugins
   */
  buildPluginCommand: command$p,
  initPluginCommand: command$q,
  linkWatchPluginCommand: command$r,
  watchPluginCommand: command$s,
  verifyPluginCommand: command$t
};
const buildStrapiCommand = async (argv, command2 = new commander.Command()) => {
  try {
    const dtsCommands = require(require.resolve("@strapi/data-transfer")).commands;
    Object.assign(strapiCommands, dtsCommands);
    const adminCommands = require(require.resolve("@strapi/admin/cli")).commands;
    Object.assign(strapiCommands, adminCommands);
  } catch (e) {
  }
  command2.storeOptionsAsProperties(false).allowUnknownOption(true);
  command2.helpOption("-h, --help", "Display help for command");
  command2.addHelpCommand("help [command]", "Display help for command");
  const keys = Object.keys(strapiCommands);
  const cwd = process.cwd();
  const hasDebug = argv.includes("--debug");
  const hasSilent = argv.includes("--silent");
  const logger$1 = logger.createLogger({ debug: hasDebug, silent: hasSilent, timestamp: false });
  const tsconfig$1 = tsconfig.loadTsConfig({
    cwd,
    path: "tsconfig.json",
    logger: logger$1
  });
  const ctx = {
    cwd,
    logger: logger$1,
    tsconfig: tsconfig$1
  };
  for (const name of keys) {
    try {
      await strapiCommands[name]({ command: command2, argv, ctx });
    } catch (e) {
      console.error(`Failed to load command ${name}`, e);
    }
  }
  return command2;
};
const runStrapiCommand = async (argv = process.argv, command2 = new commander.Command()) => {
  const commands = await buildStrapiCommand(argv, command2);
  await commands.parseAsync(argv);
};
exports.buildStrapiCommand = buildStrapiCommand;
exports.runStrapiCommand = runStrapiCommand;
exports.strapiCommands = strapiCommands;
//# sourceMappingURL=index.js.map

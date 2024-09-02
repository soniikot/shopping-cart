"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const fs = require("fs/promises");
const ora = require("ora");
const os = require("os");
const createBuildContext = require("./createBuildContext-teXLqX5U.js");
const errors = require("./errors-ov7Nr9g3.js");
const index = require("./index-D66XIRbD.js");
require("chalk");
require("pkg-up");
require("yup");
require("browserslist-to-esbuild");
require("path");
require("esbuild-register/dist/node");
require("fs");
require("typescript");
require("boxen");
require("rxjs");
require("@vitejs/plugin-react-swc");
require("node:module");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const fs__default = /* @__PURE__ */ _interopDefault(fs);
const ora__default = /* @__PURE__ */ _interopDefault(ora);
const os__default = /* @__PURE__ */ _interopDefault(os);
const build$1 = async (opts = {}) => {
  process.env.NODE_ENV = process.env.NODE_ENV || "production";
  const {
    silent,
    debug,
    cwd = process.cwd(),
    configFile = true,
    config: providedConfig,
    ...configOptions
  } = opts;
  const logger = errors.createLogger({ silent, debug });
  const packageJsonLoader = ora__default.default(`Verifying package.json ${os__default.default.EOL}`).start();
  const rawPkg = await createBuildContext.loadPkg({ cwd, logger }).catch((err) => {
    packageJsonLoader.fail();
    if (errors.isError(err)) {
      logger.error(err.message);
    }
    logger.debug(`Path checked – ${cwd}`);
    process.exit(1);
  });
  const validatedPkg = await createBuildContext.validatePkg({
    pkg: rawPkg
  }).catch((err) => {
    packageJsonLoader.fail();
    if (errors.isError(err)) {
      logger.error(err.message);
    }
    process.exit(1);
  });
  const packageJson = await createBuildContext.validateExportsOrdering({ pkg: validatedPkg, logger }).catch((err) => {
    packageJsonLoader.fail();
    if (errors.isError(err)) {
      logger.error(err.message);
    }
    process.exit(1);
  });
  packageJsonLoader.succeed("Verified package.json");
  const config = configFile ? await createBuildContext.loadConfig({ cwd, logger }) : providedConfig;
  const buildContextLoader = ora__default.default(`Creating build context ${os__default.default.EOL}`).start();
  const extMap = createBuildContext.getExportExtensionMap();
  const ctx = await createBuildContext.createBuildContext({
    config: { ...config, ...configOptions },
    cwd,
    extMap,
    logger,
    pkg: packageJson
  }).catch((err) => {
    buildContextLoader.fail();
    if (errors.isError(err)) {
      logger.error(err.message);
    }
    process.exit(1);
  });
  logger.debug(`Build context: ${os__default.default.EOL}`, ctx);
  const buildTasks = await index.createBuildTasks(ctx);
  buildContextLoader.succeed("Created build context");
  try {
    logger.debug(`Cleaning dist folder: ${ctx.distPath}`);
    await fs__default.default.rm(ctx.distPath, { recursive: true, force: true });
    logger.debug("Cleaned dist folder");
  } catch {
    logger.debug("There was no dist folder to clean");
  }
  for (const task of buildTasks) {
    const handler = index.taskHandlers[task.type];
    handler.print(ctx, task);
    const result$ = handler.run$(ctx, task);
    result$.subscribe({
      complete() {
        handler.success(ctx, task);
      },
      error(err) {
        handler.fail(ctx, task, err);
      }
    });
  }
};
const build = async (options) => {
  try {
    await build$1(options);
  } catch (err) {
    errors.handleError(err);
  }
};
exports.build = build;
//# sourceMappingURL=build-Kx1DWL2J.js.map

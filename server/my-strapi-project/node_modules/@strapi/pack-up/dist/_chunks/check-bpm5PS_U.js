"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const chalk = require("chalk");
const esbuild = require("esbuild");
const ora = require("ora");
const os = require("os");
const path = require("path");
const createBuildContext = require("./createBuildContext-teXLqX5U.js");
const errors = require("./errors-ov7Nr9g3.js");
const files = require("./files-pIit-45R.js");
require("fs/promises");
require("pkg-up");
require("yup");
require("browserslist-to-esbuild");
require("esbuild-register/dist/node");
require("fs");
require("typescript");
require("boxen");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const chalk__default = /* @__PURE__ */ _interopDefault(chalk);
const esbuild__default = /* @__PURE__ */ _interopDefault(esbuild);
const ora__default = /* @__PURE__ */ _interopDefault(ora);
const os__default = /* @__PURE__ */ _interopDefault(os);
const check$1 = async (opts = {}) => {
  const { silent, debug, cwd = process.cwd() } = opts;
  const logger = errors.createLogger({ silent, debug });
  const packageJsonLoader = ora__default.default(`Verifying package.json ${os__default.default.EOL}`).start();
  const rawPkg = await createBuildContext.loadPkg({ cwd, logger }).catch((err) => {
    packageJsonLoader.fail();
    logger.error(err.message);
    logger.debug(`Path checked – ${cwd}`);
    process.exit(1);
  });
  const validatedPkg = await createBuildContext.validatePkg({
    pkg: rawPkg
  }).catch((err) => {
    packageJsonLoader.fail();
    logger.error(err.message);
    process.exit(1);
  });
  const packageJson = await createBuildContext.validateExportsOrdering({ pkg: validatedPkg, logger }).catch((err) => {
    packageJsonLoader.fail();
    logger.error(err.message);
    process.exit(1);
  });
  packageJsonLoader.succeed("Verified package.json");
  const config = await createBuildContext.loadConfig({ cwd, logger });
  const extMap = createBuildContext.getExportExtensionMap();
  const ctx = await createBuildContext.createBuildContext({
    config: { ...config },
    cwd,
    extMap,
    logger,
    pkg: packageJson
  }).catch((err) => {
    logger.error(err.message);
    process.exit(1);
  });
  logger.debug(`Build context: ${os__default.default.EOL}`, ctx);
  const missingExports = [];
  const checkingFilePathsLoader = ora__default.default(`Checking files for exports`).start();
  for (const exp of Object.values(ctx.exports)) {
    if (exp.source && !await files.pathExists(path.resolve(ctx.cwd, exp.source))) {
      missingExports.push(exp.source);
    }
    if (exp.types && !await files.pathExists(path.resolve(ctx.cwd, exp.types))) {
      missingExports.push(exp.types);
    }
    if (exp.require && !await files.pathExists(path.resolve(ctx.cwd, exp.require))) {
      missingExports.push(exp.require);
    }
    if (exp.import && !await files.pathExists(path.resolve(ctx.cwd, exp.import))) {
      missingExports.push(exp.import);
    }
    if (exp.module && !await files.pathExists(path.resolve(ctx.cwd, exp.module))) {
      missingExports.push(exp.module);
    }
    if (exp.default && !await files.pathExists(path.resolve(ctx.cwd, exp.default))) {
      missingExports.push(exp.default);
    }
    if (exp.browser) {
      if (exp.browser.source && !await files.pathExists(path.resolve(ctx.cwd, exp.browser.source))) {
        missingExports.push(exp.browser.source);
      }
      if (exp.browser.import && !await files.pathExists(path.resolve(ctx.cwd, exp.browser.import))) {
        missingExports.push(exp.browser.import);
      }
      if (exp.browser.require && !await files.pathExists(path.resolve(ctx.cwd, exp.browser.require))) {
        missingExports.push(exp.browser.require);
      }
    }
    if (exp.node) {
      if (exp.node.source && !await files.pathExists(path.resolve(ctx.cwd, exp.node.source))) {
        missingExports.push(exp.node.source);
      }
      if (exp.node.import && !await files.pathExists(path.resolve(ctx.cwd, exp.node.import))) {
        missingExports.push(exp.node.import);
      }
      if (exp.node.require && !await files.pathExists(path.resolve(ctx.cwd, exp.node.require))) {
        missingExports.push(exp.node.require);
      }
      if (exp.node.module && !await files.pathExists(path.resolve(ctx.cwd, exp.node.module))) {
        missingExports.push(exp.node.module);
      }
    }
  }
  if (missingExports.length) {
    checkingFilePathsLoader.fail("");
    logger.error(
      [
        "Missing files for exports:",
        ...missingExports.map((str) => `    ${chalk__default.default.blue(str)} -> ${path.resolve(ctx.cwd, str)}`)
      ].join(os__default.default.EOL)
    );
    process.exit(1);
  }
  checkingFilePathsLoader.succeed("");
  const exportPaths = Object.values(ctx.exports).reduce(
    (acc, exp) => {
      if (exp.require) {
        acc.require.push(exp.require);
      }
      if (exp.import) {
        acc.import.push(exp.import);
      }
      return acc;
    },
    {
      require: [],
      import: []
    }
  );
  if (exportPaths.import.length > 0) {
    await resolveExports(exportPaths.import, {
      cwd: ctx.cwd,
      external: ctx.external,
      format: "esm",
      logger
    });
  }
  if (exportPaths.require.length > 0) {
    await resolveExports(exportPaths.require, {
      cwd: ctx.cwd,
      external: ctx.external,
      format: "cjs",
      logger
    });
  }
};
const resolveExports = async (paths, { cwd, format, external, logger }) => {
  const esbuildLoader = ora__default.default(`Resolving ${format} exports`).start();
  const code = paths.map((id) => format === "esm" ? `import('${id}');` : `require('${id}');`).join(os__default.default.EOL);
  try {
    const esbuildResult = await esbuild__default.default.build({
      bundle: true,
      external,
      format,
      logLevel: "silent",
      // otherwise output maps to stdout as we're using stdin
      outfile: "/dev/null",
      platform: "node",
      stdin: {
        contents: code,
        loader: "js",
        resolveDir: cwd
      }
    });
    if (esbuildResult.errors.length > 0) {
      for (const msg of esbuildResult.errors) {
        printESBuildMessage(msg, logger.error);
      }
      esbuildLoader.fail();
      process.exit(1);
    }
    const esbuildWarnings = esbuildResult.warnings.filter(
      (msg) => !(msg.detail || msg.text).includes(`does not affect esbuild's own target setting`)
    );
    for (const msg of esbuildWarnings) {
      printESBuildMessage(msg, logger.warn);
    }
    esbuildLoader.succeed();
  } catch (err) {
    if (isESBuildError(err)) {
      for (const msg of err.errors) {
        printESBuildMessage(msg, logger.error);
      }
    }
    esbuildLoader.fail();
    process.exit(1);
  }
};
const isESBuildError = (err) => {
  return errors.isError(err) && "errors" in err && "warnings" in err;
};
const printESBuildMessage = (msg, log) => {
  if (msg.location) {
    log(
      [
        `${msg.detail || msg.text}`,
        `${msg.location.line} | ${msg.location.lineText}`,
        `in ./${msg.location.file}:${msg.location.line}:${msg.location.column}`
      ].join(os__default.default.EOL)
    );
  } else {
    log(msg.detail || msg.text);
  }
};
const check = async (options) => {
  try {
    await check$1(options);
  } catch (err) {
    errors.handleError(err);
  }
};
exports.check = check;
//# sourceMappingURL=check-bpm5PS_U.js.map

"use strict";
const chalk = require("chalk");
const boxen = require("boxen");
const os = require("os");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const chalk__default = /* @__PURE__ */ _interopDefault(chalk);
const boxen__default = /* @__PURE__ */ _interopDefault(boxen);
const os__default = /* @__PURE__ */ _interopDefault(os);
const isError = (err) => err instanceof Error;
const createLogger = (options = {}) => {
  const { silent = false, debug = false } = options;
  const state = { errors: 0, warning: 0 };
  return {
    get warnings() {
      return state.warning;
    },
    get errors() {
      return state.errors;
    },
    debug(...args) {
      if (silent || !debug) {
        return;
      }
      console.debug(chalk__default.default.cyan(`[DEBUG] `), ...args);
    },
    info(...args) {
      if (silent) {
        return;
      }
      console.info(chalk__default.default.blue(`[INFO] `), ...args);
    },
    log(...args) {
      if (silent) {
        return;
      }
      console.log(...args);
    },
    warn(...args) {
      state.warning += 1;
      if (silent) {
        return;
      }
      console.warn(chalk__default.default.yellow(`[WARN] `), ...args);
    },
    error(...args) {
      state.errors += 1;
      if (silent) {
        return;
      }
      console.error(chalk__default.default.red(`[ERROR] `), ...args);
    },
    success(...args) {
      if (silent) {
        return;
      }
      console.info(chalk__default.default.green(`[SUCCESS] `), ...args);
    }
  };
};
const handleError = (err) => {
  console.error(
    chalk__default.default.red(
      `[ERROR] `,
      "There seems to be an unexpected error, try again with --debug for more information",
      os__default.default.EOL
    )
  );
  if (isError(err) && err.stack) {
    console.log(
      chalk__default.default.red(
        boxen__default.default(err.stack, {
          padding: 1,
          align: "left"
        })
      )
    );
  }
  process.exit(1);
};
exports.createLogger = createLogger;
exports.handleError = handleError;
exports.isError = isError;
//# sourceMappingURL=errors-ov7Nr9g3.js.map

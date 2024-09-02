"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const chalk = require("chalk");
const ora = require("ora");
const cliProgress = require("cli-progress");
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
const ora__default = /* @__PURE__ */ _interopDefault(ora);
const cliProgress__namespace = /* @__PURE__ */ _interopNamespace(cliProgress);
const silentSpinner = {
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
const silentProgressBar = {
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
    debug(...args) {
      if (silent || !debug) {
        return;
      }
      console.log(
        chalk__default.default.cyan(`[DEBUG]${timestamp ? `	[${(/* @__PURE__ */ new Date()).toISOString()}]` : ""}`),
        ...args
      );
    },
    info(...args) {
      if (silent) {
        return;
      }
      console.info(
        chalk__default.default.blue(`[INFO]${timestamp ? `	[${(/* @__PURE__ */ new Date()).toISOString()}]` : ""}`),
        ...args
      );
    },
    log(...args) {
      if (silent) {
        return;
      }
      console.info(chalk__default.default.blue(`${timestamp ? `	[${(/* @__PURE__ */ new Date()).toISOString()}]` : ""}`), ...args);
    },
    success(...args) {
      if (silent) {
        return;
      }
      console.info(
        chalk__default.default.green(`[SUCCESS]${timestamp ? `	[${(/* @__PURE__ */ new Date()).toISOString()}]` : ""}`),
        ...args
      );
    },
    warn(...args) {
      state.warning += 1;
      if (silent) {
        return;
      }
      console.warn(
        chalk__default.default.yellow(`[WARN]${timestamp ? `	[${(/* @__PURE__ */ new Date()).toISOString()}]` : ""}`),
        ...args
      );
    },
    error(...args) {
      state.errors += 1;
      if (silent) {
        return;
      }
      console.error(
        chalk__default.default.red(`[ERROR]${timestamp ? `	[${(/* @__PURE__ */ new Date()).toISOString()}]` : ""}`),
        ...args
      );
    },
    spinner(text) {
      if (silent) {
        return silentSpinner;
      }
      return ora__default.default(text);
    },
    progressBar(totalSize, text) {
      if (silent) {
        return silentProgressBar;
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
exports.createLogger = createLogger;
//# sourceMappingURL=logger.js.map

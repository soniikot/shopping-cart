"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const winston = require("winston");
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
const winston__namespace = /* @__PURE__ */ _interopNamespace(winston);
const LEVELS = winston.config.npm.levels;
const LEVEL_LABEL = "silly";
LEVELS[LEVEL_LABEL];
const logErrors = winston.format((info) => {
  if (info instanceof Error) {
    return { ...info, message: `${info.message}${info.stack ? `
${info.stack}` : ""}` };
  }
  return info;
});
const defaultTimestampFormat = "YYYY-MM-DD HH:mm:ss.SSS";
const prettyPrint = (options = {}) => {
  const { timestamps = true, colors = true } = options;
  const handlers = [];
  if (timestamps) {
    handlers.push(
      winston.format.timestamp({
        format: timestamps === true ? defaultTimestampFormat : timestamps
      })
    );
  }
  if (colors) {
    handlers.push(winston.format.colorize());
  }
  handlers.push(logErrors());
  handlers.push(
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamps ? `[${timestamp}] ` : ""}${level}: ${message}`;
    })
  );
  return winston.format.combine(...handlers);
};
const levelFilter = (...levels) => {
  return winston.format((info) => levels.some((level) => info.level.includes(level)) ? info : false)();
};
const excludeColors = winston.format.printf(({ message }) => {
  if (typeof message !== "string") {
    return message;
  }
  return message.replace(
    // eslint-disable-next-line no-control-regex
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    ""
  );
});
const index$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  excludeColors,
  levelFilter,
  prettyPrint
}, Symbol.toStringTag, { value: "Module" }));
const defaultConfiguration = () => {
  return {
    level: LEVEL_LABEL,
    levels: LEVELS,
    format: prettyPrint(),
    transports: [new winston.transports.Console()]
  };
};
const outputFileConfiguration = (filename) => {
  return {
    level: LEVEL_LABEL,
    levels: LEVELS,
    format: prettyPrint(),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ level: "error", filename, format: excludeColors })
    ]
  };
};
const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createDefaultConfiguration: defaultConfiguration,
  createOutputFileConfiguration: outputFileConfiguration
}, Symbol.toStringTag, { value: "Module" }));
const createLogger = (userConfiguration = {}) => {
  const configuration = defaultConfiguration();
  Object.assign(configuration, userConfiguration);
  return winston__namespace.createLogger(configuration);
};
exports.winston = winston__namespace;
exports.configs = index;
exports.createLogger = createLogger;
exports.formats = index$1;
//# sourceMappingURL=index.js.map

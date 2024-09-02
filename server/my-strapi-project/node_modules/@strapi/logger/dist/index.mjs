import * as winston from "winston";
import { config, format, transports } from "winston";
const LEVELS = config.npm.levels;
const LEVEL_LABEL = "silly";
LEVELS[LEVEL_LABEL];
const logErrors = format((info) => {
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
      format.timestamp({
        format: timestamps === true ? defaultTimestampFormat : timestamps
      })
    );
  }
  if (colors) {
    handlers.push(format.colorize());
  }
  handlers.push(logErrors());
  handlers.push(
    format.printf(({ level, message, timestamp }) => {
      return `${timestamps ? `[${timestamp}] ` : ""}${level}: ${message}`;
    })
  );
  return format.combine(...handlers);
};
const levelFilter = (...levels) => {
  return format((info) => levels.some((level) => info.level.includes(level)) ? info : false)();
};
const excludeColors = format.printf(({ message }) => {
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
    transports: [new transports.Console()]
  };
};
const outputFileConfiguration = (filename) => {
  return {
    level: LEVEL_LABEL,
    levels: LEVELS,
    format: prettyPrint(),
    transports: [
      new transports.Console(),
      new transports.File({ level: "error", filename, format: excludeColors })
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
  return winston.createLogger(configuration);
};
export {
  index as configs,
  createLogger,
  index$1 as formats,
  winston
};
//# sourceMappingURL=index.mjs.map

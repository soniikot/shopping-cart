"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const os = require("os");
const ts = require("typescript");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const os__default = /* @__PURE__ */ _interopDefault(os);
const ts__default = /* @__PURE__ */ _interopDefault(ts);
const loadTsConfig = ({
  cwd,
  path,
  logger
}) => {
  const configPath = ts__default.default.findConfigFile(cwd, ts__default.default.sys.fileExists, path);
  if (!configPath) {
    return void 0;
  }
  const configFile = ts__default.default.readConfigFile(configPath, ts__default.default.sys.readFile);
  const parsedConfig = ts__default.default.parseJsonConfigFileContent(configFile.config, ts__default.default.sys, cwd);
  logger.debug(`Loaded user TS config:`, os__default.default.EOL, parsedConfig);
  return {
    config: parsedConfig,
    path: configPath
  };
};
exports.loadTsConfig = loadTsConfig;
//# sourceMappingURL=tsconfig.js.map

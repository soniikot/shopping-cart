"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const path = require("path");
const fse = require("fs-extra");
const fp = require("lodash/fp");
const loadConfigFile = require("../../app-configuration/load-config-file.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const fse__default = /* @__PURE__ */ _interopDefault(fse);
const getUserPluginsConfig = async () => {
  const globalUserConfigPath = path.join(strapi.dirs.dist.config, "plugins.js");
  const currentEnvUserConfigPath = path.join(
    strapi.dirs.dist.config,
    "env",
    process.env.NODE_ENV,
    "plugins.js"
  );
  let config = {};
  if (await fse__default.default.pathExists(globalUserConfigPath)) {
    config = loadConfigFile.loadFile(globalUserConfigPath);
  }
  if (await fse__default.default.pathExists(currentEnvUserConfigPath)) {
    config = fp.merge(config, loadConfigFile.loadFile(currentEnvUserConfigPath));
  }
  return config;
};
exports.getUserPluginsConfig = getUserPluginsConfig;
//# sourceMappingURL=get-user-plugins-config.js.map

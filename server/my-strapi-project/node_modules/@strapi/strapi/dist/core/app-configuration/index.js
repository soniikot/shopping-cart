"use strict";
const os = require("os");
const path = require("path");
const _ = require("lodash");
const fp = require("lodash/fp");
const dotenv = require("dotenv");
const configLoader = require("./config-loader.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const os__default = /* @__PURE__ */ _interopDefault(os);
const path__default = /* @__PURE__ */ _interopDefault(path);
const ___default = /* @__PURE__ */ _interopDefault(_);
const dotenv__default = /* @__PURE__ */ _interopDefault(dotenv);
dotenv__default.default.config({ path: process.env.ENV_PATH });
process.env.NODE_ENV = process.env.NODE_ENV || "development";
const { version: strapiVersion } = require(path__default.default.join(__dirname, "../../../package.json"));
const defaultConfig = {
  server: {
    host: process.env.HOST || os__default.default.hostname() || "localhost",
    port: process.env.PORT || 1337,
    proxy: false,
    cron: { enabled: false },
    admin: { autoOpen: false },
    dirs: { public: "./public" }
  },
  admin: {},
  api: {
    rest: {
      prefix: "/api"
    }
  }
};
const loadConfiguration = (dirs, initialConfig = {}) => {
  const { app: appDir, dist: distDir } = dirs;
  const { autoReload = false, serveAdminPanel = true } = initialConfig;
  const pkgJSON = require(path__default.default.resolve(appDir, "package.json"));
  const configDir = path__default.default.resolve(distDir || process.cwd(), "config");
  const rootConfig = {
    launchedAt: Date.now(),
    serveAdminPanel,
    autoReload,
    environment: process.env.NODE_ENV,
    uuid: ___default.default.get(pkgJSON, "strapi.uuid"),
    packageJsonStrapi: ___default.default.omit(___default.default.get(pkgJSON, "strapi", {}), "uuid"),
    info: {
      ...pkgJSON,
      strapi: strapiVersion
    }
  };
  const baseConfig = fp.omit("plugins", configLoader(configDir));
  const envDir = path__default.default.resolve(configDir, "env", process.env.NODE_ENV);
  const envConfig = configLoader(envDir);
  return ___default.default.merge(rootConfig, defaultConfig, baseConfig, envConfig);
};
module.exports = loadConfiguration;
//# sourceMappingURL=index.js.map

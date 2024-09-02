"use strict";
const path = require("path");
const packageJson = require("package-json");
const Configstore = require("configstore");
const semver = require("semver");
const boxen = require("boxen");
const chalk = require("chalk");
const strapiUtils = require("@strapi/utils");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const path__default = /* @__PURE__ */ _interopDefault(path);
const packageJson__default = /* @__PURE__ */ _interopDefault(packageJson);
const Configstore__default = /* @__PURE__ */ _interopDefault(Configstore);
const semver__default = /* @__PURE__ */ _interopDefault(semver);
const boxen__default = /* @__PURE__ */ _interopDefault(boxen);
const chalk__default = /* @__PURE__ */ _interopDefault(chalk);
const pkg = require("../../../package.json");
const CHECK_INTERVAL = 1e3 * 60 * 60 * 24 * 1;
const NOTIF_INTERVAL = 1e3 * 60 * 60 * 24 * 7;
const boxenOptions = {
  padding: 1,
  margin: 1,
  align: "center",
  borderColor: "yellow",
  borderStyle: "round"
};
const getUpdateMessage = (newVersion, currentVersion) => {
  const currentVersionLog = chalk__default.default.dim(currentVersion);
  const newVersionLog = chalk__default.default.green(newVersion);
  const releaseLink = chalk__default.default.bold("https://github.com/strapi/strapi/releases");
  return `
A new version of Strapi is available ${currentVersionLog} → ${newVersionLog}
Check out the new releases at: ${releaseLink}
`.trim();
};
const createUpdateNotifier = (strapi) => {
  let config;
  try {
    config = new Configstore__default.default(
      pkg.name,
      {},
      { configPath: path__default.default.join(strapi.dirs.app.root, ".strapi-updater.json") }
    );
  } catch {
  }
  const checkUpdate = async (checkInterval) => {
    const now = Date.now();
    const lastUpdateCheck = config.get("lastUpdateCheck") || 0;
    if (lastUpdateCheck + checkInterval > now) {
      return;
    }
    try {
      const res = await packageJson__default.default(pkg.name);
      if (res.version) {
        config.set("latest", res.version);
        config.set("lastUpdateCheck", now);
      }
    } catch {
    }
  };
  const display = (notifInterval) => {
    const now = Date.now();
    const latestVersion = config.get("latest");
    const lastNotification = config.get("lastNotification") || 0;
    if (!process.stdout.isTTY || lastNotification + notifInterval > now || !semver__default.default.valid(latestVersion) || !semver__default.default.valid(pkg.version) || semver__default.default.lte(latestVersion, pkg.version)) {
      return;
    }
    const message = boxen__default.default(getUpdateMessage(latestVersion, pkg.version), boxenOptions);
    config.set("lastNotification", now);
    console.log(message);
  };
  return {
    notify({ checkInterval = CHECK_INTERVAL, notifInterval = NOTIF_INTERVAL } = {}) {
      if (strapiUtils.env.bool("STRAPI_DISABLE_UPDATE_NOTIFICATION", false) || !config) {
        return;
      }
      display(notifInterval);
      checkUpdate(checkInterval);
    }
  };
};
module.exports = createUpdateNotifier;
//# sourceMappingURL=index.js.map

"use strict";
const chalk = require("chalk");
const fse = require("fs-extra");
const stopProcess = require("./stop-process.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const chalk__default = /* @__PURE__ */ _interopDefault(chalk);
const fse__default = /* @__PURE__ */ _interopDefault(fse);
const checkInstallPath = async (rootPath) => {
  if (await fse__default.default.pathExists(rootPath)) {
    const stat = await fse__default.default.stat(rootPath);
    if (!stat.isDirectory()) {
      stopProcess(
        `⛔️ ${chalk__default.default.green(
          rootPath
        )} is not a directory. Make sure to create a Strapi application in an empty directory.`
      );
    }
    const files = await fse__default.default.readdir(rootPath);
    if (files.length > 1) {
      stopProcess(
        `⛔️ You can only create a Strapi app in an empty directory.
Make sure ${chalk__default.default.green(
          rootPath
        )} is empty.`
      );
    }
  }
};
module.exports = checkInstallPath;
//# sourceMappingURL=check-install-path.js.map

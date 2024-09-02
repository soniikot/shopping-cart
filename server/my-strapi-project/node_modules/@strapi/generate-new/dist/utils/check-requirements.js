"use strict";
const chalk = require("chalk");
const semver = require("semver");
const engines = require("../resources/json/common/engines.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const chalk__default = /* @__PURE__ */ _interopDefault(chalk);
const semver__default = /* @__PURE__ */ _interopDefault(semver);
function checkRequirements() {
  const currentNodeVersion = process.versions.node;
  if (!semver__default.default.satisfies(currentNodeVersion, engines.node)) {
    console.error(chalk__default.default.red(`You are running ${chalk__default.default.bold(`Node.js ${currentNodeVersion}`)}`));
    console.error(`Strapi requires ${chalk__default.default.bold(chalk__default.default.green(`Node.js ${engines.node}`))}`);
    console.error("Please make sure to use the right version of Node.");
    process.exit(1);
  } else if (semver__default.default.major(currentNodeVersion) % 2 !== 0) {
    console.warn(chalk__default.default.yellow(`You are running ${chalk__default.default.bold(`Node.js ${currentNodeVersion}`)}`));
    console.warn(
      `Strapi only supports ${chalk__default.default.bold(
        chalk__default.default.green("LTS versions of Node.js")
      )}, other versions may not be compatible.`
    );
  }
}
module.exports = checkRequirements;
//# sourceMappingURL=check-requirements.js.map

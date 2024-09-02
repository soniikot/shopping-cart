"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const chalk = require("chalk");
const fp = require("lodash/fp");
const inquirer = require("inquirer");
const boxen = require("boxen");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const chalk__default = /* @__PURE__ */ _interopDefault(chalk);
const boxen__default = /* @__PURE__ */ _interopDefault(boxen);
const assertCwdContainsStrapiProject = (name) => {
  const logErrorAndExit = () => {
    console.log(
      `You need to run ${chalk__default.default.yellow(
        `strapi ${name}`
      )} in a Strapi project. Make sure you are in the right directory.`
    );
    process.exit(1);
  };
  try {
    const pkgJSON = require(`${process.cwd()}/package.json`);
    if (!fp.has("dependencies.@strapi/strapi", pkgJSON) && !fp.has("devDependencies.@strapi/strapi", pkgJSON)) {
      logErrorAndExit();
    }
  } catch (err) {
    logErrorAndExit();
  }
};
const runAction = (name, action) => (...args) => {
  assertCwdContainsStrapiProject(name);
  Promise.resolve().then(() => {
    return action(...args);
  }).catch((error) => {
    console.error(error);
    process.exit(1);
  });
};
const notifyExperimentalCommand = async (name, { force } = {}) => {
  console.log(
    boxen__default.default(
      `The ${chalk__default.default.bold(
        chalk__default.default.underline(name)
      )} command is considered experimental, use at your own risk.`,
      {
        title: "Warning",
        padding: 1,
        margin: 1,
        align: "center",
        borderColor: "yellow",
        borderStyle: "bold"
      }
    )
  );
  if (!force) {
    const { confirmed } = await inquirer.prompt({
      type: "confirm",
      name: "confirmed",
      message: "Do you want to continue?"
    });
    if (!confirmed) {
      process.exit(0);
    }
  }
};
exports.assertCwdContainsStrapiProject = assertCwdContainsStrapiProject;
exports.notifyExperimentalCommand = notifyExperimentalCommand;
exports.runAction = runAction;
//# sourceMappingURL=helpers.js.map

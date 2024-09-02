"use strict";
const path = require("path");
const fse = require("fs-extra");
const ora = require("ora");
const execa = require("execa");
const inquirer = require("inquirer");
const packagePath = require("../../../load/package-path.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const ora__default = /* @__PURE__ */ _interopDefault(ora);
const execa__default = /* @__PURE__ */ _interopDefault(execa);
const inquirer__default = /* @__PURE__ */ _interopDefault(inquirer);
const action = async (plugins, { deleteFiles }) => {
  const answers = await inquirer__default.default.prompt([
    {
      type: "confirm",
      name: "deleteFiles",
      message: `Do you want to delete the plugin generated files in the extensions folder ?`,
      default: true,
      when: !deleteFiles
    }
  ]);
  const loader = ora__default.default();
  const dir = process.cwd();
  const pluginArgs = plugins.map((name) => `@strapi/plugin-${name}`);
  try {
    let shouldRebuild = false;
    for (const name of plugins) {
      const pkgPath = packagePath(`@strapi/plugin-${name}`);
      if (fse.existsSync(path.join(pkgPath, "admin", "src", "index.js"))) {
        shouldRebuild = true;
      }
    }
    loader.start(`Uninstalling dependencies`);
    const useYarn = fse.existsSync(path.join(dir, "yarn.lock"));
    if (useYarn) {
      await execa__default.default("yarn", ["remove", ...pluginArgs]);
    } else {
      await execa__default.default("npm", ["remove", ...pluginArgs]);
    }
    loader.succeed();
    if (deleteFiles === true || answers.deleteFiles === true) {
      loader.start("Deleting old files");
      for (const name of plugins) {
        const pluginDir = path.join(dir, "extensions", name);
        if (fse.existsSync(pluginDir)) {
          fse.removeSync(pluginDir);
        }
      }
      loader.succeed();
    }
    if (shouldRebuild) {
      loader.start(`Rebuilding admin UI`);
      await execa__default.default("npm", ["run", "build"]);
      loader.succeed();
    }
  } catch (err) {
    loader.clear();
    if (err instanceof Error) {
      console.error(err.message);
    }
    process.exit(1);
  }
};
module.exports = action;
//# sourceMappingURL=action.js.map

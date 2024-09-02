"use strict";
const path = require("path");
const fse = require("fs-extra");
const ora = require("ora");
const execa = require("execa");
const packagePath = require("../../../load/package-path.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const ora__default = /* @__PURE__ */ _interopDefault(ora);
const execa__default = /* @__PURE__ */ _interopDefault(execa);
const action = async (plugins) => {
  const loader = ora__default.default();
  const dir = process.cwd();
  const version = require(path.join(dir, "package.json")).dependencies["@strapi/strapi"];
  const pluginArgs = plugins.map((name) => `@strapi/plugin-${name}@${version}`);
  try {
    loader.start(`Installing dependencies`);
    const useYarn = fse.existsSync(path.join(dir, "yarn.lock"));
    if (useYarn) {
      await execa__default.default("yarn", ["add", ...pluginArgs]);
    } else {
      await execa__default.default("npm", ["install", "--save", ...pluginArgs]);
    }
    loader.succeed();
    let shouldRebuild = false;
    for (const name of plugins) {
      const pkgPath = packagePath(`@strapi/plugin-${name}`);
      if (fse.existsSync(path.join(pkgPath, "admin", "src", "index.js"))) {
        shouldRebuild = true;
      }
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

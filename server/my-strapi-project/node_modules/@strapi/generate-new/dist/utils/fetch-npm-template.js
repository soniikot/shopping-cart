"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const path = require("path");
const execa = require("execa");
const chalk = require("chalk");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const path__default = /* @__PURE__ */ _interopDefault(path);
const execa__default = /* @__PURE__ */ _interopDefault(execa);
const chalk__default = /* @__PURE__ */ _interopDefault(chalk);
async function getPackageInfo(packageName) {
  const { stdout } = await execa__default.default("npm", ["view", packageName, "name", "version", "--silent"]);
  const match = stdout.match(/(?<=')(.*?)(?=')/gm);
  if (!match) {
    throw new Error("Could not match");
  }
  const [name, version] = match;
  return { name, version };
}
async function getTemplatePackageInfo(template) {
  try {
    const longhand = `@strapi/template-${template}`;
    const packageInfo = await getPackageInfo(longhand);
    return packageInfo;
  } catch (error) {
  }
  try {
    return await getPackageInfo(template);
  } catch (error) {
    throw new Error(`Could not find package ${chalk__default.default.yellow(template)} on npm`);
  }
}
async function downloadNpmTemplate({ name, version }, parentDir) {
  await execa__default.default("npm", ["install", `${name}@${version}`, "--no-save", "--silent"], {
    cwd: parentDir
  });
  const exactTemplatePath = path__default.default.dirname(
    require.resolve(`${name}/package.json`, { paths: [parentDir] })
  );
  return exactTemplatePath;
}
exports.downloadNpmTemplate = downloadNpmTemplate;
exports.getTemplatePackageInfo = getTemplatePackageInfo;
//# sourceMappingURL=fetch-npm-template.js.map

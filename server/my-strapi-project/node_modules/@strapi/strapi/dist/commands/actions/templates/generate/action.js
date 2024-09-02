"use strict";
const path = require("path");
const fse = require("fs-extra");
const chalk = require("chalk");
const inquirer = require("inquirer");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const fse__default = /* @__PURE__ */ _interopDefault(fse);
const chalk__default = /* @__PURE__ */ _interopDefault(chalk);
const inquirer__default = /* @__PURE__ */ _interopDefault(inquirer);
const TEMPLATE_CONTENT = ["src", "data"];
async function copyContent(templatePath, rootBase) {
  for (const item of TEMPLATE_CONTENT) {
    try {
      const pathToCopy = path.join(process.cwd(), item);
      if (!await fse__default.default.pathExists(pathToCopy)) {
        continue;
      }
      await fse__default.default.copy(pathToCopy, path.join(templatePath, item));
      const currentProjectBase = path.basename(process.cwd());
      console.log(
        `${chalk__default.default.green(
          "success"
        )}: copy ${currentProjectBase}/${item} => ${rootBase}/template/${item}`
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error(`${chalk__default.default.red("error")}: ${error.message}`);
      }
    }
  }
}
async function writeTemplateJson(rootPath) {
  try {
    await fse__default.default.writeJSON(path.join(rootPath, "template.json"), {});
    console.log(`${chalk__default.default.green("success")}: create JSON config file`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`${chalk__default.default.red("error")}: ${error.message}`);
    }
  }
}
async function templateConfigExists(rootPath) {
  const configExists = await fse__default.default.pathExists(path.join(rootPath, "template.json"));
  console.log(`checking: ${path.join(rootPath, "template.json")}. result ${configExists}`);
  return configExists;
}
async function generateTemplate(directory) {
  const rootPath = path.resolve(directory);
  const templatePath = path.join(rootPath, "template");
  const exists = await fse__default.default.pathExists(templatePath);
  const rootBase = path.basename(rootPath);
  if (exists) {
    const inquiry = await inquirer__default.default.prompt({
      type: "confirm",
      name: "confirm",
      message: `${chalk__default.default.yellow(rootBase)} already exists.  Do you want to replace it?`
    });
    if (!inquiry.confirm) {
      process.exit(0);
    }
  }
  await fse__default.default.ensureDir(templatePath);
  await copyContent(templatePath, rootBase);
  const configExists = await templateConfigExists(rootPath);
  if (!configExists) {
    await writeTemplateJson(rootPath);
  }
  console.log(`${chalk__default.default.green("success")}: generated template at ${chalk__default.default.yellow(rootPath)}`);
}
module.exports = generateTemplate;
//# sourceMappingURL=action.js.map

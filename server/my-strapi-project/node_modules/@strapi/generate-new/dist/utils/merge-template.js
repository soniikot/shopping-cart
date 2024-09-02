"use strict";
const os = require("os");
const path = require("path");
const fse = require("fs-extra");
const _ = require("lodash/fp");
const chalk = require("chalk");
const fetchNpmTemplate = require("./fetch-npm-template.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const os__default = /* @__PURE__ */ _interopDefault(os);
const path__default = /* @__PURE__ */ _interopDefault(path);
const fse__default = /* @__PURE__ */ _interopDefault(fse);
const ___default = /* @__PURE__ */ _interopDefault(_);
const chalk__default = /* @__PURE__ */ _interopDefault(chalk);
const allowFile = Symbol("alloFile");
const allowChildren = Symbol("allowChildren");
const allowedTemplateContents = {
  "README.md": allowFile,
  ".env.example": allowFile,
  "package.json": allowFile,
  src: allowChildren,
  data: allowChildren,
  database: allowChildren,
  public: allowChildren,
  scripts: allowChildren
};
async function mergeTemplate(scope, rootPath) {
  if (!scope.template) {
    throw new Error("Missing template");
  }
  let templatePath;
  let templateParentPath;
  let templatePackageInfo;
  const isLocalTemplate = ["./", "../", "/"].some(
    (filePrefix) => scope.template?.startsWith(filePrefix)
  );
  if (isLocalTemplate) {
    console.log("Installing local template.");
    templatePath = path__default.default.resolve(rootPath, "..", scope.template);
  } else {
    templatePackageInfo = await fetchNpmTemplate.getTemplatePackageInfo(scope.template);
    console.log(`Installing ${chalk__default.default.yellow(templatePackageInfo.name)} template.`);
    templateParentPath = await fse__default.default.mkdtemp(path__default.default.join(os__default.default.tmpdir(), "strapi-"));
    templatePath = await fetchNpmTemplate.downloadNpmTemplate(templatePackageInfo, templateParentPath);
  }
  const templateConfig = await checkTemplateRootStructure(templatePath);
  await checkTemplateContentsStructure(path__default.default.resolve(templatePath, "template"));
  await mergePackageJSON({ rootPath, templateConfig, templatePackageInfo });
  await mergeFilesAndDirectories(rootPath, templatePath);
  if (!isLocalTemplate && templateParentPath) {
    await fse__default.default.remove(templateParentPath);
  }
}
async function checkTemplateRootStructure(templatePath) {
  const templateJsonPath = path__default.default.join(templatePath, "template.json");
  const templateJsonExists = await fse__default.default.pathExists(templateJsonPath);
  if (!templateJsonExists) {
    throw new Error(`A template must have a ${chalk__default.default.green("template.json")} root file`);
  }
  const templateJsonStat = await fse__default.default.stat(templateJsonPath);
  if (!templateJsonStat.isFile()) {
    throw new Error(`A template's ${chalk__default.default.green("template.json")} must be a file`);
  }
  const templateConfig = require(templateJsonPath);
  const templateDirPath = path__default.default.join(templatePath, "template");
  try {
    const stat = await fse__default.default.stat(templateDirPath);
    if (!stat.isDirectory()) {
      throw Error(`A template must have a root ${chalk__default.default.green("template/")} directory`);
    }
  } catch (error) {
    if (error instanceof Error && error.code === "ENOENT") {
      throw Error(`A template must have a root ${chalk__default.default.green("template/")} directory`);
    }
    throw error;
  }
  return templateConfig;
}
async function checkTemplateContentsStructure(templateContentsPath) {
  const checkPathContents = async (pathToCheck, parents) => {
    const contents = await fse__default.default.readdir(pathToCheck);
    for (const item of contents) {
      const nextParents = [...parents, item];
      const matchingTreeValue = ___default.default.get(nextParents, allowedTemplateContents);
      const itemPath = path__default.default.resolve(pathToCheck, item);
      const isDirectory = (await fse__default.default.stat(itemPath)).isDirectory();
      if (matchingTreeValue === void 0) {
        throw Error(
          `Illegal template structure, unknown path ${chalk__default.default.green(nextParents.join("/"))}`
        );
      }
      if (matchingTreeValue === allowFile) {
        if (!isDirectory) {
          return;
        }
        throw Error(
          `Illegal template structure, expected a file and got a directory at ${chalk__default.default.green(
            nextParents.join("/")
          )}`
        );
      }
      if (isDirectory) {
        if (matchingTreeValue === allowChildren) {
          return;
        }
        await checkPathContents(itemPath, nextParents);
      } else {
        throw Error(
          `Illegal template structure, unknown file ${chalk__default.default.green(nextParents.join("/"))}`
        );
      }
    }
  };
  await checkPathContents(templateContentsPath, []);
}
async function mergePackageJSON({
  rootPath,
  templateConfig,
  templatePackageInfo
}) {
  const packageJSON = require(path__default.default.resolve(rootPath, "package.json"));
  if (!templateConfig.package) {
    return;
  }
  if (___default.default.has("strapi.uuid", templateConfig.package)) {
    throw Error("A template cannot overwrite the Strapi UUID");
  }
  const mergedConfig = ___default.default.merge(templateConfig.package, packageJSON);
  if (templatePackageInfo?.name) {
    ___default.default.set("strapi.template", templatePackageInfo.name, mergedConfig);
  }
  const packageJSONPath = path__default.default.join(rootPath, "package.json");
  await fse__default.default.writeJSON(packageJSONPath, mergedConfig, { spaces: 2 });
}
async function mergeFilesAndDirectories(rootPath, templatePath) {
  const templateDir = path__default.default.join(templatePath, "template");
  await fse__default.default.copy(templateDir, rootPath, { overwrite: true, recursive: true });
}
module.exports = mergeTemplate;
//# sourceMappingURL=merge-template.js.map

import os from "os";
import path from "path";
import fse from "fs-extra";
import _ from "lodash/fp";
import chalk from "chalk";
import { getTemplatePackageInfo, downloadNpmTemplate } from "./fetch-npm-template.mjs";
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
    templatePath = path.resolve(rootPath, "..", scope.template);
  } else {
    templatePackageInfo = await getTemplatePackageInfo(scope.template);
    console.log(`Installing ${chalk.yellow(templatePackageInfo.name)} template.`);
    templateParentPath = await fse.mkdtemp(path.join(os.tmpdir(), "strapi-"));
    templatePath = await downloadNpmTemplate(templatePackageInfo, templateParentPath);
  }
  const templateConfig = await checkTemplateRootStructure(templatePath);
  await checkTemplateContentsStructure(path.resolve(templatePath, "template"));
  await mergePackageJSON({ rootPath, templateConfig, templatePackageInfo });
  await mergeFilesAndDirectories(rootPath, templatePath);
  if (!isLocalTemplate && templateParentPath) {
    await fse.remove(templateParentPath);
  }
}
async function checkTemplateRootStructure(templatePath) {
  const templateJsonPath = path.join(templatePath, "template.json");
  const templateJsonExists = await fse.pathExists(templateJsonPath);
  if (!templateJsonExists) {
    throw new Error(`A template must have a ${chalk.green("template.json")} root file`);
  }
  const templateJsonStat = await fse.stat(templateJsonPath);
  if (!templateJsonStat.isFile()) {
    throw new Error(`A template's ${chalk.green("template.json")} must be a file`);
  }
  const templateConfig = require(templateJsonPath);
  const templateDirPath = path.join(templatePath, "template");
  try {
    const stat = await fse.stat(templateDirPath);
    if (!stat.isDirectory()) {
      throw Error(`A template must have a root ${chalk.green("template/")} directory`);
    }
  } catch (error) {
    if (error instanceof Error && error.code === "ENOENT") {
      throw Error(`A template must have a root ${chalk.green("template/")} directory`);
    }
    throw error;
  }
  return templateConfig;
}
async function checkTemplateContentsStructure(templateContentsPath) {
  const checkPathContents = async (pathToCheck, parents) => {
    const contents = await fse.readdir(pathToCheck);
    for (const item of contents) {
      const nextParents = [...parents, item];
      const matchingTreeValue = _.get(nextParents, allowedTemplateContents);
      const itemPath = path.resolve(pathToCheck, item);
      const isDirectory = (await fse.stat(itemPath)).isDirectory();
      if (matchingTreeValue === void 0) {
        throw Error(
          `Illegal template structure, unknown path ${chalk.green(nextParents.join("/"))}`
        );
      }
      if (matchingTreeValue === allowFile) {
        if (!isDirectory) {
          return;
        }
        throw Error(
          `Illegal template structure, expected a file and got a directory at ${chalk.green(
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
          `Illegal template structure, unknown file ${chalk.green(nextParents.join("/"))}`
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
  const packageJSON = require(path.resolve(rootPath, "package.json"));
  if (!templateConfig.package) {
    return;
  }
  if (_.has("strapi.uuid", templateConfig.package)) {
    throw Error("A template cannot overwrite the Strapi UUID");
  }
  const mergedConfig = _.merge(templateConfig.package, packageJSON);
  if (templatePackageInfo?.name) {
    _.set("strapi.template", templatePackageInfo.name, mergedConfig);
  }
  const packageJSONPath = path.join(rootPath, "package.json");
  await fse.writeJSON(packageJSONPath, mergedConfig, { spaces: 2 });
}
async function mergeFilesAndDirectories(rootPath, templatePath) {
  const templateDir = path.join(templatePath, "template");
  await fse.copy(templateDir, rootPath, { overwrite: true, recursive: true });
}
export {
  mergeTemplate as default
};
//# sourceMappingURL=merge-template.mjs.map

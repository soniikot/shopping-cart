"use strict";
const path = require("path");
const fse = require("fs-extra");
const chalk = require("chalk");
const execa = require("execa");
const ora = require("ora");
const _ = require("lodash");
const stopProcess = require("./utils/stop-process.js");
const usage = require("./utils/usage.js");
const mergeTemplate = require("./utils/merge-template.js");
const git = require("./utils/git.js");
const package_json = require("./resources/json/common/package.json.js");
const jsconfig_json = require("./resources/json/js/jsconfig.json.js");
const tsconfigAdmin_json = require("./resources/json/ts/tsconfig-admin.json.js");
const tsconfigServer_json = require("./resources/json/ts/tsconfig-server.json.js");
const database = require("./resources/templates/database.js");
const env = require("./resources/templates/env.js");
const types = require("./types.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const fse__default = /* @__PURE__ */ _interopDefault(fse);
const chalk__default = /* @__PURE__ */ _interopDefault(chalk);
const execa__default = /* @__PURE__ */ _interopDefault(execa);
const ora__default = /* @__PURE__ */ _interopDefault(ora);
const ___default = /* @__PURE__ */ _interopDefault(_);
async function createProject(scope, { client, connection, dependencies }) {
  console.log(`Creating a new Strapi application at ${chalk__default.default.green(scope.rootPath)}.`);
  console.log("Creating files.");
  const { rootPath, useTypescript } = scope;
  const resources = path.join(__dirname, "resources");
  const language = useTypescript ? "ts" : "js";
  try {
    await fse__default.default.copy(path.join(resources, "files", language), rootPath);
    await fse__default.default.writeFile(path.join(rootPath, ".env"), env());
    const copyDotFilesFromSubDirectory = (subDirectory) => {
      const files = fse__default.default.readdirSync(path.join(resources, "dot-files", subDirectory));
      return Promise.all(
        files.map((file) => {
          const src = path.join(resources, "dot-files", subDirectory, file);
          const dest = path.join(rootPath, `.${file}`);
          return fse__default.default.copy(src, dest);
        })
      );
    };
    copyDotFilesFromSubDirectory("common");
    if (!useTypescript) {
      copyDotFilesFromSubDirectory("js");
    }
    await usage.trackUsage({ event: "didCopyProjectFiles", scope });
    await fse__default.default.writeJSON(
      path.join(rootPath, "package.json"),
      package_json({
        strapiDependencies: scope.strapiDependencies,
        additionalsDependencies: dependencies,
        strapiVersion: scope.strapiVersion,
        projectName: ___default.default.kebabCase(scope.name),
        uuid: scope.uuid,
        packageJsonStrapi: scope.packageJsonStrapi
      }),
      {
        spaces: 2
      }
    );
    await usage.trackUsage({ event: "didWritePackageJSON", scope });
    if (useTypescript) {
      const filesMap = {
        "tsconfig-admin.json.js": "src/admin",
        "tsconfig-server.json.js": "."
      };
      for (const [fileName, path$1] of Object.entries(filesMap)) {
        const destPath = path.join(rootPath, path$1, "tsconfig.json");
        if (fileName === "tsconfig-admin.json.js") {
          await fse__default.default.writeJSON(destPath, tsconfigAdmin_json(), { spaces: 2 });
        }
        if (fileName === "tsconfig-server.json.js") {
          await fse__default.default.writeJSON(destPath, tsconfigServer_json(), { spaces: 2 });
        }
      }
    } else {
      const filesMap = { "jsconfig.json.js": "." };
      for (const [, path$1] of Object.entries(filesMap)) {
        const destPath = path.join(rootPath, path$1, "jsconfig.json");
        await fse__default.default.writeJSON(destPath, jsconfig_json(), { spaces: 2 });
      }
    }
    await fse__default.default.ensureDir(path.join(rootPath, "node_modules"));
    await fse__default.default.appendFile(path.join(rootPath, ".env"), database.generateDbEnvariables({ client, connection }));
    await fse__default.default.writeFile(
      path.join(rootPath, `config/database.${language}`),
      database.createDatabaseConfig({ useTypescript })
    );
    await usage.trackUsage({ event: "didCopyConfigurationFiles", scope });
    const hasTemplate = Boolean(scope.template);
    if (hasTemplate) {
      try {
        await mergeTemplate(scope, rootPath);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`⛔️ Template installation failed: ${error.message}`);
        }
        throw error;
      }
    }
  } catch (err) {
    await fse__default.default.remove(scope.rootPath);
    throw err;
  }
  await usage.trackUsage({ event: "willInstallProjectDependencies", scope });
  const installPrefix = chalk__default.default.yellow("Installing dependencies:");
  const loader = ora__default.default(installPrefix).start();
  const logInstall = (chunk = "") => {
    loader.text = `${installPrefix} ${chunk.toString().split("\n").join(" ")}`;
  };
  try {
    if (scope.installDependencies !== false) {
      const runner = runInstall(scope);
      runner.stdout?.on("data", logInstall);
      runner.stderr?.on("data", logInstall);
      await runner;
    }
    loader.stop();
    console.log(`Dependencies installed ${chalk__default.default.green("successfully")}.`);
    await usage.trackUsage({ event: "didInstallProjectDependencies", scope });
  } catch (error) {
    const stderr = types.isStderrError(error) ? error.stderr : "";
    loader.stop();
    await usage.trackUsage({
      event: "didNotInstallProjectDependencies",
      scope,
      error: stderr.slice(-1024)
    });
    console.error(`${chalk__default.default.red("Error")} while installing dependencies:`);
    console.error(stderr);
    await usage.captureStderr("didNotInstallProjectDependencies", error);
    console.log(chalk__default.default.black.bgWhite(" Keep trying!"));
    console.log();
    console.log(
      chalk__default.default.bold(
        "Oh, it seems that you encountered errors while installing dependencies in your project."
      )
    );
    console.log(`Don't give up, your project was created correctly.`);
    console.log(
      `Fix the issues mentioned in the installation errors and try to run the following command:`
    );
    console.log();
    console.log(
      `cd ${chalk__default.default.green(rootPath)} && ${chalk__default.default.cyan(scope.useYarn ? "yarn" : "npm")} install`
    );
    console.log();
    stopProcess();
  }
  await usage.trackUsage({ event: "didCreateProject", scope });
  if (await git(rootPath)) {
    console.log("Initialized a git repository.");
    console.log();
  }
  console.log();
  console.log(`Your application was created at ${chalk__default.default.green(rootPath)}.
`);
  const cmd = chalk__default.default.cyan(scope.useYarn ? "yarn" : "npm run");
  console.log("Available commands in your project:");
  console.log();
  console.log(`  ${cmd} develop`);
  console.log(
    "  Start Strapi in watch mode. (Changes in Strapi project files will trigger a server restart)"
  );
  console.log();
  console.log(`  ${cmd} start`);
  console.log("  Start Strapi without watch mode.");
  console.log();
  console.log(`  ${cmd} build`);
  console.log("  Build Strapi admin panel.");
  console.log();
  console.log(`  ${cmd} deploy`);
  console.log("  Deploy Strapi project.");
  console.log();
  console.log(`  ${cmd} strapi`);
  console.log(`  Display all available commands.`);
  console.log();
  console.log("You can start by doing:");
  console.log();
  console.log(`  ${chalk__default.default.cyan("cd")} ${rootPath}`);
  console.log(`  ${cmd} develop`);
  console.log();
}
const installArguments = ["install", "--production", "--no-optional"];
function runInstall({ rootPath, useYarn }) {
  if (useYarn) {
    installArguments.push("--network-timeout 1000000");
    return execa__default.default("yarnpkg", installArguments, {
      cwd: rootPath,
      stdin: "ignore"
    });
  }
  return execa__default.default("npm", installArguments, { cwd: rootPath, stdin: "ignore" });
}
module.exports = createProject;
//# sourceMappingURL=create-project.js.map

"use strict";
const path = require("node:path");
const boxen = require("boxen");
const chalk = require("chalk");
const getLatestVersion = require("get-latest-version");
const gitUrlParse = require("git-url-parse");
const packUp = require("@strapi/pack-up");
const outdent = require("outdent");
const helpers = require("../../../utils/helpers.js");
const gitIgnore = require("./files/gitIgnore.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const path__default = /* @__PURE__ */ _interopDefault(path);
const boxen__default = /* @__PURE__ */ _interopDefault(boxen);
const chalk__default = /* @__PURE__ */ _interopDefault(chalk);
const getLatestVersion__default = /* @__PURE__ */ _interopDefault(getLatestVersion);
const gitUrlParse__default = /* @__PURE__ */ _interopDefault(gitUrlParse);
const action = async (packagePath, { silent, debug }, { logger, cwd }) => {
  try {
    await helpers.notifyExperimentalCommand("plugin:init", { force: true });
    await packUp.init({
      path: packagePath,
      cwd,
      silent,
      debug,
      template: PLUGIN_TEMPLATE
    });
    logger.info("Don't forget to enable your plugin in your configuration files.");
  } catch (err) {
    logger.error(
      "There seems to be an unexpected error, try again with --debug for more information \n"
    );
    if (err instanceof Error && err.stack) {
      logger.log(
        chalk__default.default.red(
          boxen__default.default(err.stack, {
            padding: 1,
            align: "left"
          })
        )
      );
    }
    process.exit(1);
  }
};
const PACKAGE_NAME_REGEXP = /^(?:@(?:[a-z0-9-*~][a-z0-9-*._~]*)\/)?[a-z0-9-~][a-z0-9-._~]*$/i;
const PLUGIN_TEMPLATE = packUp.defineTemplate(async ({ logger, gitConfig, packagePath }) => {
  let repo;
  const [packageFolder] = packagePath.split(path__default.default.sep).slice(-1);
  return {
    prompts: [
      packUp.definePackageOption({
        name: "repo",
        type: "text",
        message: "git url",
        validate(v) {
          if (!v) {
            return true;
          }
          try {
            const result = gitUrlParse__default.default(v);
            repo = { source: result.source, owner: result.owner, name: result.name };
            return true;
          } catch (err) {
            return "invalid git url";
          }
        }
      }),
      packUp.definePackageOption({
        name: "pkgName",
        type: "text",
        message: "plugin name",
        initial: () => repo?.name ?? "",
        validate(v) {
          if (!v) {
            return "package name is required";
          }
          const match = PACKAGE_NAME_REGEXP.exec(v);
          if (!match) {
            return "invalid package name";
          }
          return true;
        }
      }),
      packUp.definePackageOption({
        name: "displayName",
        type: "text",
        message: "plugin display name"
      }),
      packUp.definePackageOption({
        name: "description",
        type: "text",
        message: "plugin description"
      }),
      packUp.definePackageOption({
        name: "authorName",
        type: "text",
        message: "plugin author name",
        initial: gitConfig?.user?.name
      }),
      packUp.definePackageOption({
        name: "authorEmail",
        type: "text",
        message: "plugin author email",
        initial: gitConfig?.user?.email
      }),
      packUp.definePackageOption({
        name: "license",
        type: "text",
        message: "plugin license",
        initial: "MIT",
        validate(v) {
          if (!v) {
            return "license is required";
          }
          return true;
        }
      }),
      packUp.definePackageOption({
        name: "client-code",
        type: "confirm",
        message: "register with the admin panel?",
        initial: true
      }),
      packUp.definePackageOption({
        name: "server-code",
        type: "confirm",
        message: "register with the server?",
        initial: true
      }),
      packUp.definePackageFeature({
        name: "editorconfig",
        initial: true,
        optional: true
      }),
      packUp.definePackageFeature({
        name: "eslint",
        initial: true,
        optional: true
      }),
      packUp.definePackageFeature({
        name: "prettier",
        initial: true,
        optional: true
      }),
      packUp.definePackageFeature({
        name: "typescript",
        initial: true,
        optional: true
      })
    ],
    async getFiles(answers) {
      const author = [];
      const files = [];
      const pkgJson = {
        version: "0.0.0",
        keywords: [],
        type: "commonjs",
        exports: {
          "./package.json": "./package.json"
        },
        files: ["dist"],
        scripts: {
          build: "strapi plugin:build",
          watch: "strapi plugin:watch",
          "watch:link": "strapi plugin:watch:link",
          verify: "strapi plugin:verify"
        },
        dependencies: {},
        devDependencies: {
          /**
           * We set * as a default version, but further down
           * we try to resolve each package to their latest
           * version, failing that we leave the fallback of *.
           */
          "@strapi/strapi": "*",
          prettier: "*"
        },
        peerDependencies: {
          "@strapi/strapi": "^4.0.0"
        },
        strapi: {
          kind: "plugin"
        }
      };
      if (Array.isArray(answers)) {
        for (const ans of answers) {
          const { name, answer } = ans;
          switch (name) {
            case "pkgName": {
              pkgJson.name = String(answer);
              pkgJson.strapi.name = String(answer);
              break;
            }
            case "description": {
              pkgJson.description = String(answer) ?? void 0;
              pkgJson.strapi.description = String(answer) ?? void 0;
              break;
            }
            case "displayName": {
              pkgJson.strapi.displayName = String(answer) ?? void 0;
              break;
            }
            case "authorName": {
              author.push(String(answer));
              break;
            }
            case "authorEmail": {
              if (answer) {
                author.push(`<${answer}>`);
              }
              break;
            }
            case "license": {
              pkgJson.license = String(answer);
              break;
            }
            case "client-code": {
              if (answer) {
                pkgJson.exports["./strapi-admin"] = {
                  source: "./admin/src/index.js",
                  import: "./dist/admin/index.mjs",
                  require: "./dist/admin/index.js",
                  default: "./dist/admin/index.js"
                };
                pkgJson.dependencies = {
                  ...pkgJson.dependencies,
                  "@strapi/helper-plugin": "*",
                  "@strapi/design-system": "*",
                  "@strapi/icons": "*"
                };
                pkgJson.devDependencies = {
                  ...pkgJson.devDependencies,
                  react: "*",
                  "react-dom": "*",
                  "react-router-dom": "5.3.4",
                  "styled-components": "5.3.3"
                };
                pkgJson.peerDependencies = {
                  ...pkgJson.peerDependencies,
                  react: "^17.0.0 || ^18.0.0",
                  "react-dom": "^17.0.0 || ^18.0.0",
                  "react-router-dom": "5.2.0",
                  "styled-components": "5.2.1"
                };
              }
              break;
            }
            case "server-code": {
              if (answer) {
                pkgJson.exports["./strapi-server"] = {
                  source: "./server/src/index.js",
                  import: "./dist/server/index.mjs",
                  require: "./dist/server/index.js",
                  default: "./dist/server/index.js"
                };
                pkgJson.files.push("./strapi-server.js");
                files.push({
                  name: "strapi-server.js",
                  contents: outdent.outdent`
                      'use strict';
  
                      module.exports = require('./dist/server');
                  `
                });
              }
              break;
            }
            case "typescript": {
              const isTypescript = Boolean(answer);
              if (isTypescript) {
                if (isRecord(pkgJson.exports["./strapi-admin"])) {
                  pkgJson.exports["./strapi-admin"].source = "./admin/src/index.ts";
                  pkgJson.exports["./strapi-admin"] = {
                    types: "./dist/admin/src/index.d.ts",
                    ...pkgJson.exports["./strapi-admin"]
                  };
                  pkgJson.scripts = {
                    ...pkgJson.scripts,
                    "test:ts:front": "run -T tsc -p admin/tsconfig.json"
                  };
                  pkgJson.devDependencies = {
                    ...pkgJson.devDependencies,
                    "@types/react": "*",
                    "@types/react-dom": "*",
                    "@types/react-router-dom": "5.3.3",
                    "@types/styled-components": "5.1.32"
                  };
                  const { adminTsconfigFiles } = await Promise.resolve().then(() => require("./files/typescript.js"));
                  files.push(adminTsconfigFiles.tsconfigBuildFile, adminTsconfigFiles.tsconfigFile);
                }
                if (isRecord(pkgJson.exports["./strapi-server"])) {
                  pkgJson.exports["./strapi-server"].source = "./server/src/index.ts";
                  pkgJson.exports["./strapi-server"] = {
                    types: "./dist/server/src/index.d.ts",
                    ...pkgJson.exports["./strapi-server"]
                  };
                  pkgJson.scripts = {
                    ...pkgJson.scripts,
                    "test:ts:back": "run -T tsc -p server/tsconfig.json"
                  };
                  const { serverTsconfigFiles } = await Promise.resolve().then(() => require("./files/typescript.js"));
                  files.push(
                    serverTsconfigFiles.tsconfigBuildFile,
                    serverTsconfigFiles.tsconfigFile
                  );
                }
                pkgJson.devDependencies = {
                  ...pkgJson.devDependencies,
                  "@strapi/typescript-utils": "*",
                  typescript: "*"
                };
              }
              if (isRecord(pkgJson.exports["./strapi-admin"])) {
                files.push({
                  name: isTypescript ? "admin/src/pluginId.ts" : "admin/src/pluginId.js",
                  contents: outdent.outdent`
                    export const PLUGIN_ID = '${pkgJson.name.replace(/^strapi-plugin-/i, "")}';
                  `
                });
                if (isTypescript) {
                  const { adminTypescriptFiles } = await Promise.resolve().then(() => require("./files/admin.js"));
                  files.push(...adminTypescriptFiles);
                } else {
                  const { adminJavascriptFiles } = await Promise.resolve().then(() => require("./files/admin.js"));
                  files.push(...adminJavascriptFiles);
                }
              }
              if (isRecord(pkgJson.exports["./strapi-server"])) {
                if (isTypescript) {
                  const { serverTypescriptFiles } = await Promise.resolve().then(() => require("./files/server.js"));
                  files.push(...serverTypescriptFiles(packageFolder));
                } else {
                  const { serverJavascriptFiles } = await Promise.resolve().then(() => require("./files/server.js"));
                  files.push(...serverJavascriptFiles(packageFolder));
                }
              }
              break;
            }
            case "eslint": {
              if (answer) {
                const { eslintIgnoreFile } = await Promise.resolve().then(() => require("./files/eslint.js"));
                files.push(eslintIgnoreFile);
              }
              break;
            }
            case "prettier": {
              if (answer) {
                const { prettierFile, prettierIgnoreFile } = await Promise.resolve().then(() => require("./files/prettier.js"));
                files.push(prettierFile, prettierIgnoreFile);
              }
              break;
            }
            case "editorconfig": {
              if (answer) {
                const { editorConfigFile } = await Promise.resolve().then(() => require("./files/editorConfig.js"));
                files.push(editorConfigFile);
              }
              break;
            }
          }
        }
      }
      if (repo) {
        pkgJson.repository = {
          type: "git",
          url: `git+ssh://git@${repo.source}/${repo.owner}/${repo.name}.git`
        };
        pkgJson.bugs = {
          url: `https://${repo.source}/${repo.owner}/${repo.name}/issues`
        };
        pkgJson.homepage = `https://${repo.source}/${repo.owner}/${repo.name}#readme`;
      }
      pkgJson.author = author.filter(Boolean).join(" ") ?? void 0;
      try {
        pkgJson.devDependencies = await resolveLatestVerisonOfDeps(pkgJson.devDependencies);
        pkgJson.dependencies = await resolveLatestVerisonOfDeps(pkgJson.dependencies);
        pkgJson.peerDependencies = await resolveLatestVerisonOfDeps(pkgJson.peerDependencies);
      } catch (err) {
        if (err instanceof Error) {
          logger.error(err.message);
        } else {
          logger.error(err);
        }
      }
      files.push({
        name: "package.json",
        contents: outdent.outdent`
            ${JSON.stringify(pkgJson, null, 2)}
          `
      });
      files.push({
        name: "README.md",
        contents: outdent.outdent`
            # ${pkgJson.name}

            ${pkgJson.description ?? ""}
        `
      });
      files.push(gitIgnore.gitIgnoreFile);
      return files;
    }
  };
});
const isRecord = (value) => Boolean(value) && !Array.isArray(value) && typeof value === "object";
const resolveLatestVerisonOfDeps = async (deps) => {
  const latestDeps = {};
  for (const [name, version] of Object.entries(deps)) {
    try {
      const latestVersion = await getLatestVersion__default.default(name, version);
      latestDeps[name] = latestVersion ? `^${latestVersion}` : "*";
    } catch (err) {
      latestDeps[name] = "*";
    }
  }
  return latestDeps;
};
module.exports = action;
//# sourceMappingURL=action.js.map

"use strict";
const boxen = require("boxen");
const chalk = require("chalk");
const concurrently = require("concurrently");
const fs = require("node:fs/promises");
const path = require("node:path");
const nodemon = require("nodemon");
const outdent = require("outdent");
const helpers = require("../../../utils/helpers.js");
const pkg = require("../../../utils/pkg.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const boxen__default = /* @__PURE__ */ _interopDefault(boxen);
const chalk__default = /* @__PURE__ */ _interopDefault(chalk);
const concurrently__default = /* @__PURE__ */ _interopDefault(concurrently);
const fs__default = /* @__PURE__ */ _interopDefault(fs);
const path__default = /* @__PURE__ */ _interopDefault(path);
const nodemon__default = /* @__PURE__ */ _interopDefault(nodemon);
const action = async (_opts, _cmd, { cwd, logger }) => {
  try {
    await helpers.notifyExperimentalCommand("plugin:watch:link", { force: true });
    const outDir = "./dist";
    const extensions = "ts,js,png,svg,gif,jpeg,css";
    nodemon__default.default({
      watch: [outDir],
      ext: extensions,
      exec: "yalc push --changed"
    });
    const folder = path__default.default.join(cwd, outDir);
    if (!await pathExists(folder)) {
      await fs__default.default.mkdir(folder);
    }
    const pkg$1 = await pkg.loadPkg({ cwd, logger });
    const pkgJson = await pkg.validatePkg({ pkg: pkg$1 });
    concurrently__default.default(["npm run watch"]);
    nodemon__default.default.on("start", () => {
      logger.info(
        outdent.outdent`
        Watching ${outDir} for changes to files with extensions: ${extensions}

        To use this package in Strapi, in a separate shell run:
        cd /path/to/strapi/project

        Then run one of the commands below based on the package manager used in that project:

        ## yarn
        ${chalk__default.default.greenBright(`yarn dlx yalc add --link ${pkgJson.name} && yarn install`)}

        ## npm
        ${chalk__default.default.greenBright(
          `npx yalc add ${pkgJson.name} && npx yalc link ${pkgJson.name} && npm install`
        )}
      `.trimStart()
      );
    }).on("quit", () => {
      process.exit();
    }).on("restart", (files) => {
      logger.info("Found changes in files:", chalk__default.default.magentaBright(files));
      logger.info("Pushing new yalc package...");
    });
  } catch (err) {
    logger.error(
      "There seems to be an unexpected error, try again with --debug for more information \n"
    );
    if (err instanceof Error && err.stack) {
      console.log(
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
const pathExists = async (path2) => {
  try {
    await fs__default.default.access(path2);
    return true;
  } catch (error) {
    return false;
  }
};
module.exports = action;
//# sourceMappingURL=action.js.map

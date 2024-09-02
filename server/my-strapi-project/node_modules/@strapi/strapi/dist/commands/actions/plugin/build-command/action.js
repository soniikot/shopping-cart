"use strict";
const boxen = require("boxen");
const chalk = require("chalk");
const packUp = require("@strapi/pack-up");
const helpers = require("../../../utils/helpers.js");
const pkg = require("../../../utils/pkg.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const boxen__default = /* @__PURE__ */ _interopDefault(boxen);
const chalk__default = /* @__PURE__ */ _interopDefault(chalk);
const action = async ({ force, ...opts }, _cmd, { logger, cwd }) => {
  try {
    process.env.NODE_ENV = "production";
    await helpers.notifyExperimentalCommand("plugin:build", { force });
    const pkg$1 = await pkg.loadPkg({ cwd, logger });
    const pkgJson = await pkg.validatePkg({ pkg: pkg$1 });
    if (!pkgJson.exports["./strapi-admin"] && !pkgJson.exports["./strapi-server"]) {
      throw new Error(
        "You need to have either a strapi-admin or strapi-server export in your package.json"
      );
    }
    const bundles = [];
    if (pkgJson.exports["./strapi-admin"]) {
      const exp = pkgJson.exports["./strapi-admin"];
      const bundle = {
        source: exp.source,
        import: exp.import,
        require: exp.require,
        runtime: "web"
      };
      if (exp.types) {
        bundle.types = exp.types;
        bundle.tsconfig = "./admin/tsconfig.build.json";
      }
      bundles.push(bundle);
    }
    if (pkgJson.exports["./strapi-server"]) {
      const exp = pkgJson.exports["./strapi-server"];
      const bundle = {
        source: exp.source,
        import: exp.import,
        require: exp.require,
        runtime: "node"
      };
      if (exp.types) {
        bundle.types = exp.types;
        bundle.tsconfig = "./server/tsconfig.build.json";
      }
      bundles.push(bundle);
    }
    await packUp.build({
      cwd,
      configFile: false,
      config: {
        bundles,
        dist: "./dist",
        /**
         * ignore the exports map of a plugin, because we're streamlining the
         * process and ensuring the server package and admin package are built
         * with the correct runtime and their individual tsconfigs
         */
        exports: {}
      },
      ...opts
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
module.exports = action;
//# sourceMappingURL=action.js.map

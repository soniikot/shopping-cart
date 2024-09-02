"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const boxen = require("boxen");
const index = require("./index-sNH2VWbC.js");
const chalk = require("chalk");
require("@strapi/strapi/dist/utils/ee");
require("@strapi/typescript-utils");
require("node:os");
require("node:fs/promises");
require("node:path");
require("inquirer");
require("semver");
require("resolve-from");
require("execa");
require("read-pkg-up");
require("perf_hooks");
require("outdent");
require("prettier");
require("react");
require("react-dom/server");
require("react/jsx-runtime");
require("browserslist");
require("@strapi/strapi");
require("@strapi/utils");
require("dotenv");
require("esbuild-register/dist/node");
require("node:fs");
require("lodash/camelCase");
require("chokidar");
require("node:cluster");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const boxen__default = /* @__PURE__ */ _interopDefault(boxen);
const chalk__default = /* @__PURE__ */ _interopDefault(chalk);
const build = async (options) => {
  try {
    if (typeof process.env.STRAPI_ENFORCE_SOURCEMAPS !== "undefined") {
      options.logger.warn(
        "[@strapi/strapi]: STRAPI_ENFORCE_SOURCEMAPS is now deprecated. You can enable sourcemaps by passing '--sourcemaps' to the build command."
      );
    }
    if (typeof options.optimization !== "undefined" && options.optimization !== true) {
      options.logger.warn(
        "[@strapi/strapi]: The optimization argument is now deprecated. Use '--minify' instead."
      );
    }
    if (options.bundler !== "webpack") {
      options.logger.log(
        boxen__default.default(
          `Using ${chalk__default.default.bold(
            chalk__default.default.underline(options.bundler)
          )} as a bundler is considered experimental, use at your own risk. If you do experience bugs, open a new issue on Github – https://github.com/strapi/strapi/issues/new?template=BUG_REPORT.md`,
          {
            title: "Warning",
            padding: 1,
            margin: 1,
            align: "center",
            borderColor: "yellow",
            borderStyle: "bold"
          }
        )
      );
    }
    const envSourceMaps = process.env.STRAPI_ENFORCE_SOURCEMAPS === "true";
    process.env.NODE_ENV = process.env.NODE_ENV ?? "production";
    if (process.env.NODE_ENV !== "production") {
      options.logger.warn(
        "[@strapi/strapi]: The NODE_ENV is not set to production. This may result in unexpected behavior."
      );
    }
    await index.build({
      ...options,
      minify: options.optimization ?? options.minify,
      sourcemaps: options.sourcemaps || envSourceMaps
    });
  } catch (err) {
    index.handleUnexpectedError(err);
  }
};
exports.build = build;
//# sourceMappingURL=build-QRFarm0x.js.map

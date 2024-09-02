"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const boxen = require("boxen");
const chalk = require("chalk");
const cluster = require("node:cluster");
const index = require("./index-sNH2VWbC.js");
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
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const boxen__default = /* @__PURE__ */ _interopDefault(boxen);
const chalk__default = /* @__PURE__ */ _interopDefault(chalk);
const cluster__default = /* @__PURE__ */ _interopDefault(cluster);
const develop = async (options) => {
  try {
    if (cluster__default.default.isPrimary) {
      if (typeof options.browser !== "undefined") {
        options.logger.warn(
          "[@strapi/strapi]: The browser argument, this is now deprecated. Use '--open' instead."
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
    }
    await index.develop({
      ...options,
      open: options.browser ?? options.open
    });
  } catch (err) {
    index.handleUnexpectedError(err);
  }
};
exports.develop = develop;
//# sourceMappingURL=develop-YNTGWKMC.js.map

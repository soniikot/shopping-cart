"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const webpack = require("webpack");
const config = require("./config-e-cmAy8N.js");
const index = require("./index-sNH2VWbC.js");
require("browserslist-to-esbuild");
require("esbuild-loader");
require("html-webpack-plugin");
require("mini-css-extract-plugin");
require("fork-ts-checker-webpack-plugin");
require("webpack-bundle-analyzer");
require("node:crypto");
require("node:path");
require("@pmmmwh/react-refresh-webpack-plugin");
require("find-root");
require("./config-cQDYAnre.js");
require("path");
require("read-pkg-up");
require("@strapi/strapi/dist/utils/ee");
require("@strapi/typescript-utils");
require("node:os");
require("node:fs/promises");
require("inquirer");
require("semver");
require("resolve-from");
require("execa");
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
require("boxen");
require("chalk");
require("chokidar");
require("node:cluster");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const webpack__default = /* @__PURE__ */ _interopDefault(webpack);
const build = async (ctx) => new Promise(async (resolve, reject) => {
  const config$1 = await config.resolveProductionConfig(ctx);
  const finalConfig = await config.mergeConfigWithUserConfig(config$1, ctx);
  ctx.logger.debug("Webpack config", finalConfig);
  webpack__default.default(finalConfig, (err, stats) => {
    if (stats) {
      if (stats.hasErrors()) {
        ctx.logger.error(
          stats.toString({
            chunks: false,
            colors: true
          })
        );
        reject(false);
      } else if (ctx.options.stats) {
        ctx.logger.info(
          stats.toString({
            chunks: false,
            colors: true
          })
        );
      }
      resolve(true);
    }
    if (err && index.isError(err)) {
      ctx.logger.error(err.message);
      reject(false);
    }
  });
});
exports.build = build;
//# sourceMappingURL=build-bnYNP-fZ.js.map

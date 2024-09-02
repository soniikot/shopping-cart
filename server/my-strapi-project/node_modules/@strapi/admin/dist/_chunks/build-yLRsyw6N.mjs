import webpack from "webpack";
import { r as resolveProductionConfig, m as mergeConfigWithUserConfig } from "./config-wB5k8sQ0.mjs";
import { i as isError } from "./index-0WWbaSNa.mjs";
import "browserslist-to-esbuild";
import "esbuild-loader";
import "html-webpack-plugin";
import "mini-css-extract-plugin";
import "fork-ts-checker-webpack-plugin";
import "webpack-bundle-analyzer";
import "node:crypto";
import "node:path";
import "@pmmmwh/react-refresh-webpack-plugin";
import "find-root";
import "./config-vWNWOcHV.mjs";
import "path";
import "read-pkg-up";
import "@strapi/strapi/dist/utils/ee";
import "@strapi/typescript-utils";
import "node:os";
import "node:fs/promises";
import "inquirer";
import "semver";
import "resolve-from";
import "execa";
import "perf_hooks";
import "outdent";
import "prettier";
import "react";
import "react-dom/server";
import "react/jsx-runtime";
import "browserslist";
import "@strapi/strapi";
import "@strapi/utils";
import "dotenv";
import "esbuild-register/dist/node";
import "node:fs";
import "lodash/camelCase";
import "boxen";
import "chalk";
import "chokidar";
import "node:cluster";
const build = async (ctx) => new Promise(async (resolve, reject) => {
  const config = await resolveProductionConfig(ctx);
  const finalConfig = await mergeConfigWithUserConfig(config, ctx);
  ctx.logger.debug("Webpack config", finalConfig);
  webpack(finalConfig, (err, stats) => {
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
    if (err && isError(err)) {
      ctx.logger.error(err.message);
      reject(false);
    }
  });
});
export {
  build
};
//# sourceMappingURL=build-yLRsyw6N.mjs.map

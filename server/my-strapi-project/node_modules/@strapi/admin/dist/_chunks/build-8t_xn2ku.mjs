import boxen from "boxen";
import { b as build$1, h as handleUnexpectedError } from "./index-0WWbaSNa.mjs";
import chalk from "chalk";
import "@strapi/strapi/dist/utils/ee";
import "@strapi/typescript-utils";
import "node:os";
import "node:fs/promises";
import "node:path";
import "inquirer";
import "semver";
import "resolve-from";
import "execa";
import "read-pkg-up";
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
import "chokidar";
import "node:cluster";
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
        boxen(
          `Using ${chalk.bold(
            chalk.underline(options.bundler)
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
    await build$1({
      ...options,
      minify: options.optimization ?? options.minify,
      sourcemaps: options.sourcemaps || envSourceMaps
    });
  } catch (err) {
    handleUnexpectedError(err);
  }
};
export {
  build
};
//# sourceMappingURL=build-8t_xn2ku.mjs.map

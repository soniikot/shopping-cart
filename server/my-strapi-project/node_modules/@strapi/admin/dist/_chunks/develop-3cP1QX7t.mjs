import boxen from "boxen";
import chalk from "chalk";
import cluster from "node:cluster";
import { d as develop$1, h as handleUnexpectedError } from "./index-0WWbaSNa.mjs";
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
const develop = async (options) => {
  try {
    if (cluster.isPrimary) {
      if (typeof options.browser !== "undefined") {
        options.logger.warn(
          "[@strapi/strapi]: The browser argument, this is now deprecated. Use '--open' instead."
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
    }
    await develop$1({
      ...options,
      open: options.browser ?? options.open
    });
  } catch (err) {
    handleUnexpectedError(err);
  }
};
export {
  develop
};
//# sourceMappingURL=develop-3cP1QX7t.mjs.map

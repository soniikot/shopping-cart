import { r as resolveProductionConfig, m as mergeConfigWithUserConfig } from "./config-bN5VpLkz.mjs";
import "browserslist-to-esbuild";
import "@vitejs/plugin-react-swc";
import "./config-vWNWOcHV.mjs";
import "node:path";
import "path";
import "read-pkg-up";
import "./index-0WWbaSNa.mjs";
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
const build = async (ctx) => {
  const config = await resolveProductionConfig(ctx);
  const finalConfig = await mergeConfigWithUserConfig(config, ctx);
  const { build: viteBuild } = await import("vite");
  ctx.logger.debug("Vite config", finalConfig);
  await viteBuild(finalConfig);
};
export {
  build
};
//# sourceMappingURL=build-Xj2_p4-7.mjs.map

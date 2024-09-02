import path from "node:path";
import fs from "node:fs/promises";
import { a as resolveDevelopmentConfig, m as mergeConfigWithUserConfig } from "./config-bN5VpLkz.mjs";
import "browserslist-to-esbuild";
import "@vitejs/plugin-react-swc";
import "./config-vWNWOcHV.mjs";
import "path";
import "read-pkg-up";
import "./index-0WWbaSNa.mjs";
import "@strapi/strapi/dist/utils/ee";
import "@strapi/typescript-utils";
import "node:os";
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
const watch = async (ctx) => {
  const config = await resolveDevelopmentConfig(ctx);
  const finalConfig = await mergeConfigWithUserConfig(config, ctx);
  ctx.logger.debug("Vite config", finalConfig);
  const { createServer } = await import("vite");
  const vite = await createServer(config);
  ctx.strapi.server.app.use(async (ctx2, next) => {
    const url = ctx2.url;
    const file = await vite.moduleGraph.getModuleByUrl(url);
    if (file || url.startsWith("/@")) {
      return new Promise((resolve, reject) => {
        vite.middlewares(ctx2.req, ctx2.res, (err) => {
          if (err)
            reject(err);
          else
            resolve(next());
        });
      });
    }
    await next();
  });
  const serveAdmin = async (koaCtx, next) => {
    await next();
    if (koaCtx.method !== "HEAD" && koaCtx.method !== "GET") {
      return;
    }
    if (koaCtx.body != null || koaCtx.status !== 404) {
      return;
    }
    const url = koaCtx.originalUrl;
    let template = await fs.readFile(path.relative(ctx.cwd, ".strapi/client/index.html"), "utf-8");
    template = await vite.transformIndexHtml(url, template);
    koaCtx.type = "html";
    koaCtx.body = template;
  };
  ctx.strapi.server.routes([
    {
      method: "GET",
      path: `${ctx.basePath}:path*`,
      handler: serveAdmin,
      config: { auth: false }
    }
  ]);
  return {
    async close() {
      await vite.close();
    }
  };
};
export {
  watch
};
//# sourceMappingURL=watch-6AKkERUi.mjs.map

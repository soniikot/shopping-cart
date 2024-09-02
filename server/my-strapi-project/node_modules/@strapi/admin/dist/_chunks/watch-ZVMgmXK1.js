"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const path = require("node:path");
const fs = require("node:fs/promises");
const config = require("./config-gs-JvsQG.js");
require("browserslist-to-esbuild");
require("@vitejs/plugin-react-swc");
require("./config-cQDYAnre.js");
require("path");
require("read-pkg-up");
require("./index-sNH2VWbC.js");
require("@strapi/strapi/dist/utils/ee");
require("@strapi/typescript-utils");
require("node:os");
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
const path__default = /* @__PURE__ */ _interopDefault(path);
const fs__default = /* @__PURE__ */ _interopDefault(fs);
const watch = async (ctx) => {
  const config$1 = await config.resolveDevelopmentConfig(ctx);
  const finalConfig = await config.mergeConfigWithUserConfig(config$1, ctx);
  ctx.logger.debug("Vite config", finalConfig);
  const { createServer } = await import("vite");
  const vite = await createServer(config$1);
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
    let template = await fs__default.default.readFile(path__default.default.relative(ctx.cwd, ".strapi/client/index.html"), "utf-8");
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
exports.watch = watch;
//# sourceMappingURL=watch-ZVMgmXK1.js.map

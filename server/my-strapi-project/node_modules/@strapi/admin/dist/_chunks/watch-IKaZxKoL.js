"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const os = require("node:os");
const path = require("node:path");
const node_util = require("node:util");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const webpack = require("webpack");
const config = require("./config-e-cmAy8N.js");
require("browserslist-to-esbuild");
require("esbuild-loader");
require("html-webpack-plugin");
require("mini-css-extract-plugin");
require("fork-ts-checker-webpack-plugin");
require("webpack-bundle-analyzer");
require("node:crypto");
require("@pmmmwh/react-refresh-webpack-plugin");
require("find-root");
require("./config-cQDYAnre.js");
require("path");
require("read-pkg-up");
require("./index-sNH2VWbC.js");
require("@strapi/strapi/dist/utils/ee");
require("@strapi/typescript-utils");
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
const os__default = /* @__PURE__ */ _interopDefault(os);
const path__default = /* @__PURE__ */ _interopDefault(path);
const webpackDevMiddleware__default = /* @__PURE__ */ _interopDefault(webpackDevMiddleware);
const webpackHotMiddleware__default = /* @__PURE__ */ _interopDefault(webpackHotMiddleware);
const watch = async (ctx) => {
  const config$1 = await config.resolveDevelopmentConfig(ctx);
  const finalConfig = await config.mergeConfigWithUserConfig(config$1, ctx);
  ctx.logger.debug("Final webpack config:", os__default.default.EOL, finalConfig);
  return new Promise((res) => {
    const compiler = webpack.webpack(finalConfig);
    const devMiddleware = webpackDevMiddleware__default.default(compiler);
    const hotMiddleware = webpackHotMiddleware__default.default(compiler, {
      log: false,
      path: "/__webpack_hmr"
    });
    ctx.strapi.server.app.use((ctx2, next) => {
      return new Promise((resolve, reject) => {
        hotMiddleware(ctx2.req, ctx2.res, (err) => {
          if (err)
            reject(err);
          else
            resolve(next());
        });
      });
    });
    ctx.strapi.server.app.use((context, next) => {
      const ready = new Promise((resolve, reject) => {
        devMiddleware.waitUntilValid(() => {
          resolve(true);
        });
      });
      const init = new Promise((resolve) => {
        devMiddleware(
          context.req,
          {
            // @ts-expect-error
            end: (content) => {
              context.body = content;
              resolve(true);
            },
            getHeader: context.get.bind(context),
            // @ts-expect-error
            setHeader: context.set.bind(context),
            locals: context.state
          },
          () => resolve(next())
        );
      });
      return Promise.all([ready, init]);
    });
    const serveAdmin = async (ctx2, next) => {
      await next();
      if (devMiddleware.context.outputFileSystem.createReadStream) {
        if (ctx2.method !== "HEAD" && ctx2.method !== "GET") {
          return;
        }
        if (ctx2.body != null || ctx2.status !== 404) {
          return;
        }
        const filename = path__default.default.resolve(finalConfig.output?.path, "index.html");
        ctx2.type = "html";
        ctx2.body = devMiddleware.context.outputFileSystem.createReadStream(filename);
      }
    };
    ctx.strapi.server.routes([
      {
        method: "GET",
        path: `${ctx.basePath}:path*`,
        handler: serveAdmin,
        config: { auth: false }
      }
    ]);
    devMiddleware.waitUntilValid(() => {
      res({
        async close() {
          await Promise.all([
            node_util.promisify(devMiddleware.close.bind(devMiddleware))(),
            hotMiddleware.close(),
            node_util.promisify(compiler.close.bind(compiler))()
          ]);
        }
      });
    });
  });
};
exports.watch = watch;
//# sourceMappingURL=watch-IKaZxKoL.js.map

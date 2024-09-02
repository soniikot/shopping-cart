"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const fs = require("fs");
const path = require("path");
const stream = require("stream");
const _ = require("lodash");
const fp = require("lodash/fp");
const koaStatic = require("koa-static");
require("open");
require("@strapi/utils");
const isInitialized = require("../../utils/is-initialized.js");
const serveStatic = require("./serve-static.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const fs__default = /* @__PURE__ */ _interopDefault(fs);
const path__default = /* @__PURE__ */ _interopDefault(path);
const stream__default = /* @__PURE__ */ _interopDefault(stream);
const ___default = /* @__PURE__ */ _interopDefault(_);
const koaStatic__default = /* @__PURE__ */ _interopDefault(koaStatic);
const defaults = {
  maxAge: 6e4,
  defaultIndex: true
};
const publicStatic = (config, { strapi }) => {
  const { defaultIndex, maxAge } = fp.defaultsDeep(defaults, config);
  if (defaultIndex === true) {
    const index = fs__default.default.readFileSync(path__default.default.join(__dirname, "index.html"), "utf8");
    const serveIndexPage = async (ctx, next) => {
      await next();
      if (ctx.body != null || ctx.status !== 404)
        return;
      ctx.url = "index.html";
      const isInitialized$1 = await isInitialized(strapi);
      const data = {
        serverTime: (/* @__PURE__ */ new Date()).toUTCString(),
        isInitialized: isInitialized$1,
        ...___default.default.pick(strapi, [
          "config.info.version",
          "config.info.name",
          "config.admin.url",
          "config.server.url",
          "config.environment",
          "config.serveAdminPanel"
        ])
      };
      const content = ___default.default.template(index)(data);
      const body = new stream__default.default.Readable({
        read() {
          this.push(Buffer.from(content));
          this.push(null);
        }
      });
      ctx.type = "html";
      ctx.body = body;
    };
    strapi.server.routes([
      {
        method: "GET",
        path: "/",
        handler: serveIndexPage,
        config: { auth: false }
      },
      {
        method: "GET",
        path: "/index.html",
        handler: serveIndexPage,
        config: { auth: false }
      },
      {
        method: "GET",
        path: "/assets/images/(.*)",
        handler: serveStatic.serveStatic(path__default.default.resolve(__dirname, "assets/images"), {
          maxage: maxAge,
          defer: true
        }),
        config: { auth: false }
      },
      // All other public GET-routes except /uploads/(.*) which is handled in upload middleware
      {
        method: "GET",
        path: "/((?!uploads/).+)",
        handler: koaStatic__default.default(strapi.dirs.static.public, {
          maxage: maxAge,
          defer: true
        }),
        config: { auth: false }
      }
    ]);
  }
};
exports.publicStatic = publicStatic;
//# sourceMappingURL=index.js.map

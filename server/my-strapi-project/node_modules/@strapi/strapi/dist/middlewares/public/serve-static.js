"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const path = require("path");
const koaStatic = require("koa-static");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const path__default = /* @__PURE__ */ _interopDefault(path);
const koaStatic__default = /* @__PURE__ */ _interopDefault(koaStatic);
const serveStatic = (filesDir, koaStaticOptions = {}) => {
  const serve = koaStatic__default.default(filesDir, koaStaticOptions);
  const middleware = async (ctx, next) => {
    const prev = ctx.path;
    const newPath = path__default.default.basename(ctx.path);
    ctx.path = newPath;
    await serve(ctx, async () => {
      ctx.path = prev;
      await next();
      ctx.path = newPath;
    });
    ctx.path = prev;
  };
  return middleware;
};
exports.serveStatic = serveStatic;
//# sourceMappingURL=serve-static.js.map

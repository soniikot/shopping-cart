"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const fs = require("fs");
const path = require("path");
const koaFavicon = require("koa-favicon");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const koaFavicon__default = /* @__PURE__ */ _interopDefault(koaFavicon);
const defaults = {
  path: "favicon.png",
  maxAge: 864e5
};
const favicon = (config, { strapi }) => {
  const { maxAge, path: faviconDefaultPath } = { ...defaults, ...config };
  const { root: appRoot } = strapi.dirs.app;
  let faviconPath = faviconDefaultPath;
  if (!fs.existsSync(path.resolve(appRoot, faviconPath))) {
    faviconPath = "favicon.ico";
  }
  return koaFavicon__default.default(path.resolve(appRoot, faviconPath), { maxAge });
};
exports.favicon = favicon;
//# sourceMappingURL=favicon.js.map

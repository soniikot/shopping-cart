"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const fse = require("fs-extra");
const fp = require("lodash/fp");
const body = require("koa-body");
const mime = require("mime-types");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const fse__default = /* @__PURE__ */ _interopDefault(fse);
const body__default = /* @__PURE__ */ _interopDefault(body);
const mime__default = /* @__PURE__ */ _interopDefault(mime);
const defaults = {
  multipart: true,
  patchKoa: true
};
function ensureFileMimeType(file) {
  if (!file.type) {
    file.type = mime__default.default.lookup(file.name) || "application/octet-stream";
  }
}
function getFiles(ctx) {
  return ctx?.request?.files?.files;
}
const bodyMiddleware = (config, { strapi }) => {
  const bodyConfig = fp.defaultsDeep(defaults, config);
  let gqlEndpoint;
  if (strapi.plugin("graphql")) {
    const { config: gqlConfig } = strapi.plugin("graphql");
    gqlEndpoint = gqlConfig("endpoint");
  }
  return async (ctx, next) => {
    if (gqlEndpoint && ctx.url === gqlEndpoint) {
      await next();
    } else {
      try {
        await body__default.default({ patchKoa: true, ...bodyConfig })(ctx, async () => {
        });
        const files2 = getFiles(ctx);
        if (files2) {
          if (Array.isArray(files2)) {
            files2.forEach(ensureFileMimeType);
          } else {
            ensureFileMimeType(files2);
          }
        }
        await next();
      } catch (error) {
        if (error instanceof Error && error.message && error.message.includes("maxFileSize exceeded")) {
          return ctx.payloadTooLarge("FileTooBig");
        }
        throw error;
      }
    }
    const files = getFiles(ctx);
    if (files) {
      if (Array.isArray(files)) {
        Promise.all(files.map((file) => fse__default.default.remove(file.path)));
      } else if (files && files.path) {
        fse__default.default.remove(files.path);
      }
      delete ctx.request.files;
    }
  };
};
exports.body = bodyMiddleware;
//# sourceMappingURL=body.js.map

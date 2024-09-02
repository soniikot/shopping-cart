import fse from "fs-extra";
import { defaultsDeep } from "lodash/fp";
import body from "koa-body";
import mime from "mime-types";
const defaults = {
  multipart: true,
  patchKoa: true
};
function ensureFileMimeType(file) {
  if (!file.type) {
    file.type = mime.lookup(file.name) || "application/octet-stream";
  }
}
function getFiles(ctx) {
  return ctx?.request?.files?.files;
}
const bodyMiddleware = (config, { strapi }) => {
  const bodyConfig = defaultsDeep(defaults, config);
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
        await body({ patchKoa: true, ...bodyConfig })(ctx, async () => {
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
        Promise.all(files.map((file) => fse.remove(file.path)));
      } else if (files && files.path) {
        fse.remove(files.path);
      }
      delete ctx.request.files;
    }
  };
};
export {
  bodyMiddleware as body
};
//# sourceMappingURL=body.mjs.map

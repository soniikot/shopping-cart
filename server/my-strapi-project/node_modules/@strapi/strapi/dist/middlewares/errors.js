"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const strapiUtils = require("@strapi/utils");
const errors = require("../services/errors.js");
const errorMiddleware = () => {
  return async (ctx, next) => {
    try {
      await next();
      if (!ctx.response._explicitStatus) {
        return ctx.notFound();
      }
    } catch (error) {
      if (error instanceof strapiUtils.errors.ApplicationError) {
        const { status: status2, body: body2 } = errors.formatApplicationError(error);
        ctx.status = status2;
        ctx.body = body2;
        return;
      }
      if (error instanceof strapiUtils.errors.HttpError) {
        const { status: status2, body: body2 } = errors.formatHttpError(error);
        ctx.status = status2;
        ctx.body = body2;
        return;
      }
      strapi.log.error(error);
      const { status, body } = errors.formatInternalError(error);
      ctx.status = status;
      ctx.body = body;
    }
  };
};
exports.errors = errorMiddleware;
//# sourceMappingURL=errors.js.map

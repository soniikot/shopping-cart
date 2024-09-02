import { errors } from "@strapi/utils";
import { formatApplicationError, formatHttpError, formatInternalError } from "../services/errors.mjs";
const errorMiddleware = () => {
  return async (ctx, next) => {
    try {
      await next();
      if (!ctx.response._explicitStatus) {
        return ctx.notFound();
      }
    } catch (error) {
      if (error instanceof errors.ApplicationError) {
        const { status: status2, body: body2 } = formatApplicationError(error);
        ctx.status = status2;
        ctx.body = body2;
        return;
      }
      if (error instanceof errors.HttpError) {
        const { status: status2, body: body2 } = formatHttpError(error);
        ctx.status = status2;
        ctx.body = body2;
        return;
      }
      strapi.log.error(error);
      const { status, body } = formatInternalError(error);
      ctx.status = status;
      ctx.body = body;
    }
  };
};
export {
  errorMiddleware as errors
};
//# sourceMappingURL=errors.mjs.map

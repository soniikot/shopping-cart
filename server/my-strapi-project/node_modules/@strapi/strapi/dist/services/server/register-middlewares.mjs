import { yup } from "@strapi/utils";
import { resolveMiddlewares } from "./middleware.mjs";
const defaultConfig = [
  "strapi::logger",
  "strapi::errors",
  "strapi::security",
  "strapi::cors",
  "strapi::poweredBy",
  "strapi::session",
  "strapi::query",
  "strapi::body",
  "strapi::favicon",
  "strapi::public"
];
const requiredMiddlewares = [
  "strapi::errors",
  "strapi::security",
  "strapi::cors",
  "strapi::query",
  "strapi::body",
  "strapi::public",
  "strapi::favicon"
];
const middlewareConfigSchema = yup.array().of(
  yup.lazy((value) => {
    if (typeof value === "string") {
      return yup.string().required();
    }
    if (typeof value === "object") {
      return yup.object({
        name: yup.string(),
        resolve: yup.string(),
        config: yup.mixed()
      }).required().noUnknown();
    }
    return yup.mixed().test(() => false);
  })
  // FIXME: yup v1
);
const registerApplicationMiddlewares = async (strapi) => {
  const middlewareConfig = strapi.config.get("middlewares", defaultConfig);
  await validateMiddlewareConfig(middlewareConfig);
  const middlewares = await resolveMiddlewares(middlewareConfig, strapi);
  checkRequiredMiddlewares(middlewares);
  for (const middleware of middlewares) {
    strapi.server.use(middleware.handler);
  }
};
const validateMiddlewareConfig = async (config) => {
  try {
    await middlewareConfigSchema.validate(config, { strict: true, abortEarly: false });
  } catch (error) {
    throw new Error(
      "Invalid middleware configuration. Expected Array<string|{name?: string, resolve?: string, config: any}."
    );
  }
};
const checkRequiredMiddlewares = (middlewares) => {
  const missingMiddlewares = requiredMiddlewares.filter((name) => {
    return middlewares.findIndex((mdl) => mdl.name === name) === -1;
  });
  if (missingMiddlewares.length > 0) {
    throw new Error(
      `Missing required middlewares in configuration. Add the following middlewares: "${missingMiddlewares.join(
        ", "
      )}".`
    );
  }
};
export {
  registerApplicationMiddlewares as default
};
//# sourceMappingURL=register-middlewares.mjs.map

import Router from "@koa/router";
import { has } from "lodash/fp";
import { yup } from "@strapi/utils";
import createEndpointComposer from "./compose-endpoint.mjs";
const policyOrMiddlewareSchema = yup.lazy((value) => {
  if (typeof value === "string") {
    return yup.string().required();
  }
  if (typeof value === "function") {
    return yup.mixed().isFunction();
  }
  return yup.object({
    name: yup.string().required(),
    options: yup.object().notRequired()
    // any options
  });
});
const routeSchema = yup.object({
  method: yup.string().oneOf(["GET", "POST", "PUT", "PATCH", "DELETE", "ALL"]).required(),
  path: yup.string().required(),
  handler: yup.lazy((value) => {
    if (typeof value === "string") {
      return yup.string().required();
    }
    if (Array.isArray(value)) {
      return yup.array().required();
    }
    return yup.mixed().isFunction().required();
  }),
  config: yup.object({
    auth: yup.lazy((value) => {
      if (value === false) {
        return yup.boolean().required();
      }
      return yup.object({
        scope: yup.array().of(yup.string()).required()
      });
    }),
    policies: yup.array().of(policyOrMiddlewareSchema).notRequired(),
    middlewares: yup.array().of(policyOrMiddlewareSchema).notRequired()
  }).notRequired()
});
const validateRouteConfig = (routeConfig) => {
  try {
    return routeSchema.validateSync(routeConfig, {
      strict: true,
      abortEarly: false,
      stripUnknown: true
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new Error(`Invalid route config ${error.message}`);
    }
  }
};
const createRouteManager = (strapi, opts = {}) => {
  const { type } = opts;
  const composeEndpoint = createEndpointComposer(strapi);
  const createRoute = (route, router) => {
    validateRouteConfig(route);
    const routeWithInfo = Object.assign(route, {
      info: {
        ...route.info ?? {},
        type: type || "api"
      }
    });
    composeEndpoint(routeWithInfo, { router });
  };
  const addRoutes = (routes, router) => {
    if (Array.isArray(routes)) {
      routes.forEach((route) => createRoute(route, router));
    } else if (routes.routes) {
      const subRouter = new Router({ prefix: routes.prefix });
      routes.routes.forEach((route) => {
        const hasPrefix = has("prefix", route.config);
        createRoute(route, hasPrefix ? router : subRouter);
      });
      return router.use(subRouter.routes(), subRouter.allowedMethods());
    }
  };
  return {
    addRoutes
  };
};
export {
  createRouteManager,
  validateRouteConfig
};
//# sourceMappingURL=routing.mjs.map

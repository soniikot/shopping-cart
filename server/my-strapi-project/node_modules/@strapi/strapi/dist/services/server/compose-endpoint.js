"use strict";
const fp = require("lodash/fp");
const strapiUtils = require("@strapi/utils");
const compose = require("koa-compose");
const middleware = require("./middleware.js");
const policy = require("./policy.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const compose__default = /* @__PURE__ */ _interopDefault(compose);
const getMethod = (route) => {
  return fp.trim(fp.toLower(route.method));
};
const getPath = (route) => fp.trim(route.path);
const createRouteInfoMiddleware = (routeInfo) => (ctx, next) => {
  const route = {
    ...routeInfo,
    config: routeInfo.config || {}
  };
  ctx.state.route = route;
  return next();
};
const getAuthConfig = fp.prop("config.auth");
const createAuthorizeMiddleware = (strapi) => async (ctx, next) => {
  const { auth, route } = ctx.state;
  const authService = strapi.container.get("auth");
  try {
    await authService.verify(auth, getAuthConfig(route));
    return await next();
  } catch (error) {
    if (error instanceof strapiUtils.errors.UnauthorizedError) {
      return ctx.unauthorized();
    }
    if (error instanceof strapiUtils.errors.ForbiddenError) {
      return ctx.forbidden();
    }
    throw error;
  }
};
const createAuthenticateMiddleware = (strapi) => async (ctx, next) => {
  return strapi.container.get("auth").authenticate(ctx, next);
};
const returnBodyMiddleware = async (ctx, next) => {
  const values = await next();
  if (fp.isNil(ctx.body) && !fp.isNil(values)) {
    ctx.body = values;
  }
};
const createEndpointComposer = (strapi) => {
  const authenticate = createAuthenticateMiddleware(strapi);
  const authorize = createAuthorizeMiddleware(strapi);
  return (route, { router }) => {
    try {
      const method = getMethod(route);
      const path = getPath(route);
      const middlewares = middleware.resolveRouteMiddlewares(route, strapi);
      const policies = policy.resolvePolicies(route);
      const action = getAction(route, strapi);
      const routeHandler = compose__default.default([
        createRouteInfoMiddleware(route),
        authenticate,
        authorize,
        ...policies,
        ...middlewares,
        returnBodyMiddleware,
        ...fp.castArray(action)
      ]);
      router[method](path, routeHandler);
    } catch (error) {
      if (error instanceof Error) {
        error.message = `Error creating endpoint ${route.method} ${route.path}: ${error.message}`;
      }
      throw error;
    }
  };
};
const getController = (name, { pluginName, apiName }, strapi) => {
  let ctrl;
  if (pluginName) {
    if (pluginName === "admin") {
      ctrl = strapi.controller(`admin::${name}`);
    } else {
      ctrl = strapi.plugin(pluginName).controller(name);
    }
  } else if (apiName) {
    ctrl = strapi.controller(`api::${apiName}.${name}`);
  }
  if (!ctrl) {
    return strapi.controller(name);
  }
  return ctrl;
};
const extractHandlerParts = (name) => {
  const controllerName = name.slice(0, name.lastIndexOf("."));
  const actionName = name.slice(name.lastIndexOf(".") + 1);
  return { controllerName, actionName };
};
const getAction = (route, strapi) => {
  const { handler, info } = route;
  const { pluginName, apiName, type } = info ?? {};
  if (Array.isArray(handler) || typeof handler === "function") {
    return handler;
  }
  const { controllerName, actionName } = extractHandlerParts(fp.trim(handler));
  const controller = getController(controllerName, { pluginName, apiName, type }, strapi);
  if (typeof controller[actionName] !== "function") {
    throw new Error(`Handler not found "${handler}"`);
  }
  if (Symbol.for("__type__") in controller[actionName]) {
    controller[actionName][Symbol.for("__type__")].push(type);
  } else {
    controller[actionName][Symbol.for("__type__")] = [type];
  }
  return controller[actionName].bind(controller);
};
module.exports = createEndpointComposer;
//# sourceMappingURL=compose-endpoint.js.map

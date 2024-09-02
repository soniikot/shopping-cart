"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const path = require("path");
const fp = require("lodash/fp");
const strapiUtils = require("@strapi/utils");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const path__default = /* @__PURE__ */ _interopDefault(path);
const instantiateMiddleware = (middlewareFactory, name, config, strapi) => {
  try {
    return middlewareFactory(config, { strapi });
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`Middleware "${name}": ${e.message}`);
    }
  }
};
const resolveRouteMiddlewares = (route, strapi) => {
  const middlewaresConfig = route?.config?.middlewares ?? [];
  if (!fp.isArray(middlewaresConfig)) {
    throw new Error("Route middlewares config must be an array");
  }
  const middlewares = resolveMiddlewares(middlewaresConfig, strapi);
  return middlewares.map(({ handler }) => handler);
};
const dummyMiddleware = (_, next) => next();
const resolveMiddlewares = (config, strapi) => {
  const middlewares = [];
  for (const item of config) {
    if (typeof item === "function") {
      middlewares.push({
        name: null,
        handler: item
      });
      continue;
    }
    if (typeof item === "string") {
      const middlewareFactory = strapi.middleware(item);
      if (!middlewareFactory) {
        throw new Error(`Middleware ${item} not found.`);
      }
      middlewares.push({
        name: item,
        handler: instantiateMiddleware(middlewareFactory, item, {}, strapi) ?? dummyMiddleware
      });
      continue;
    }
    if (typeof item === "object" && item !== null) {
      const { name, resolve, config: config2 = {} } = item;
      if (name) {
        const middlewareFactory = strapi.middleware(name);
        middlewares.push({
          name,
          handler: instantiateMiddleware(middlewareFactory, name, config2, strapi) ?? dummyMiddleware
        });
        continue;
      }
      if (resolve) {
        const resolvedMiddlewareFactory = resolveCustomMiddleware(resolve, strapi);
        middlewares.push({
          name: resolve,
          handler: instantiateMiddleware(resolvedMiddlewareFactory, resolve, config2, strapi) ?? dummyMiddleware
        });
        continue;
      }
      throw new Error("Invalid middleware configuration. Missing name or resolve properties.");
    }
    throw new Error(
      "Middleware config must either be a string or an object {name?: string, resolve?: string, config: any}."
    );
  }
  return middlewares;
};
const resolveCustomMiddleware = (resolve, strapi) => {
  let modulePath;
  try {
    modulePath = require.resolve(resolve);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "MODULE_NOT_FOUND") {
      modulePath = path__default.default.resolve(strapi.dirs.dist.root, resolve);
    } else {
      throw error;
    }
  }
  try {
    return strapiUtils.importDefault(modulePath);
  } catch (err) {
    throw new Error(`Could not load middleware "${modulePath}".`);
  }
};
exports.resolveMiddlewares = resolveMiddlewares;
exports.resolveRouteMiddlewares = resolveRouteMiddlewares;
//# sourceMappingURL=middleware.js.map

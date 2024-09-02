"use strict";
const _ = require("lodash");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const ___default = /* @__PURE__ */ _interopDefault(_);
const createRouteScopeGenerator = (namespace) => (route) => {
  const prefix = namespace.endsWith("::") ? namespace : `${namespace}.`;
  if (typeof route.handler === "string") {
    ___default.default.defaultsDeep(route, {
      config: {
        auth: {
          scope: [`${route.handler.startsWith(prefix) ? "" : prefix}${route.handler}`]
        }
      }
    });
  }
};
const registerAllRoutes = (strapi) => {
  registerAdminRoutes(strapi);
  registerAPIRoutes(strapi);
  registerPluginRoutes(strapi);
};
const registerAdminRoutes = (strapi) => {
  const generateRouteScope = createRouteScopeGenerator(`admin::`);
  ___default.default.forEach(strapi.admin?.routes, (router) => {
    router.type = router.type || "admin";
    router.prefix = router.prefix || `/admin`;
    router.routes.forEach((route) => {
      generateRouteScope(route);
      route.info = { pluginName: "admin" };
    });
    strapi.server.routes(router);
  });
};
const registerPluginRoutes = (strapi) => {
  for (const pluginName of Object.keys(strapi.plugins)) {
    const plugin = strapi.plugins[pluginName];
    const generateRouteScope = createRouteScopeGenerator(`plugin::${pluginName}`);
    if (Array.isArray(plugin.routes)) {
      plugin.routes.forEach((route) => {
        generateRouteScope(route);
        route.info = { pluginName };
      });
      strapi.server.routes({
        type: "admin",
        prefix: `/${pluginName}`,
        routes: plugin.routes
      });
    } else {
      ___default.default.forEach(plugin.routes, (router) => {
        router.type = router.type || "admin";
        router.prefix = router.prefix || `/${pluginName}`;
        router.routes.forEach((route) => {
          generateRouteScope(route);
          route.info = { pluginName };
        });
        strapi.server.routes(router);
      });
    }
  }
};
const registerAPIRoutes = (strapi) => {
  for (const apiName of Object.keys(strapi.api)) {
    const api = strapi.api[apiName];
    const generateRouteScope = createRouteScopeGenerator(`api::${apiName}`);
    ___default.default.forEach(api.routes, (router) => {
      router.type = "content-api";
      router.routes?.forEach((route) => {
        generateRouteScope(route);
        route.info = { apiName };
      });
      return strapi.server.routes(router);
    });
  }
};
module.exports = registerAllRoutes;
//# sourceMappingURL=register-routes.js.map

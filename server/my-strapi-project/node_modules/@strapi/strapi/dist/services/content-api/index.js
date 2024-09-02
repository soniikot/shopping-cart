"use strict";
const _ = require("lodash");
const index = require("./permissions/index.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const ___default = /* @__PURE__ */ _interopDefault(_);
const transformRoutePrefixFor = (pluginName) => (route) => {
  const prefix = route.config && route.config.prefix;
  const path = prefix !== void 0 ? `${prefix}${route.path}` : `/${pluginName}${route.path}`;
  return {
    ...route,
    path
  };
};
const filterContentAPI = (route) => route.info.type === "content-api";
const createContentAPI = (strapi) => {
  const getRoutesMap = async () => {
    const routesMap = {};
    ___default.default.forEach(strapi.api, (api, apiName) => {
      const routes = ___default.default.flatMap(api.routes, (route) => {
        if ("routes" in route) {
          return route.routes;
        }
        return route;
      }).filter(filterContentAPI);
      if (routes.length === 0) {
        return;
      }
      const apiPrefix = strapi.config.get("api.rest.prefix");
      routesMap[`api::${apiName}`] = routes.map((route) => ({
        ...route,
        path: `${apiPrefix}${route.path}`
      }));
    });
    ___default.default.forEach(strapi.plugins, (plugin, pluginName) => {
      const transformPrefix = transformRoutePrefixFor(pluginName);
      if (Array.isArray(plugin.routes)) {
        return plugin.routes.map(transformPrefix).filter(filterContentAPI);
      }
      const routes = ___default.default.flatMap(plugin.routes, (route) => route.routes.map(transformPrefix)).filter(
        filterContentAPI
      );
      if (routes.length === 0) {
        return;
      }
      const apiPrefix = strapi.config.get("api.rest.prefix");
      routesMap[`plugin::${pluginName}`] = routes.map((route) => ({
        ...route,
        path: `${apiPrefix}${route.path}`
      }));
    });
    return routesMap;
  };
  return {
    permissions: index(strapi),
    getRoutesMap
  };
};
module.exports = createContentAPI;
//# sourceMappingURL=index.js.map

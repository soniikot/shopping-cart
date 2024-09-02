import _ from "lodash";
import instantiatePermissionsUtilities from "./permissions/index.mjs";
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
    _.forEach(strapi.api, (api, apiName) => {
      const routes = _.flatMap(api.routes, (route) => {
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
    _.forEach(strapi.plugins, (plugin, pluginName) => {
      const transformPrefix = transformRoutePrefixFor(pluginName);
      if (Array.isArray(plugin.routes)) {
        return plugin.routes.map(transformPrefix).filter(filterContentAPI);
      }
      const routes = _.flatMap(plugin.routes, (route) => route.routes.map(transformPrefix)).filter(
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
    permissions: instantiatePermissionsUtilities(strapi),
    getRoutesMap
  };
};
export {
  createContentAPI as default
};
//# sourceMappingURL=index.mjs.map

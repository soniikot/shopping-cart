"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const Router = require("@koa/router");
const httpServer = require("./http-server.js");
const routing = require("./routing.js");
const adminApi = require("./admin-api.js");
const contentApi = require("./content-api.js");
const registerRoutes = require("./register-routes.js");
const registerMiddlewares = require("./register-middlewares.js");
const koa = require("./koa.js");
const requestContext = require("../request-context.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const Router__default = /* @__PURE__ */ _interopDefault(Router);
const healthCheck = async (ctx) => {
  ctx.set("strapi", "You are so French!");
  ctx.status = 204;
};
const createServer = (strapi) => {
  const app = koa({
    proxy: strapi.config.get("server.proxy"),
    keys: strapi.config.get("server.app.keys")
  });
  app.use((ctx, next) => requestContext.run(ctx, () => next()));
  const router = new Router__default.default();
  const routeManager = routing.createRouteManager(strapi);
  const httpServer$1 = httpServer.createHTTPServer(strapi, app);
  const apis = {
    "content-api": contentApi.createContentAPI(strapi),
    admin: adminApi.createAdminAPI(strapi)
  };
  router.all("/_health", healthCheck);
  const state = {
    mounted: false
  };
  return {
    app,
    router,
    httpServer: httpServer$1,
    api(name) {
      return apis[name];
    },
    use(...args) {
      app.use(...args);
      return this;
    },
    routes(routes) {
      if (!Array.isArray(routes) && routes.type) {
        const api = apis[routes.type];
        if (!api) {
          throw new Error(`API ${routes.type} not found. Possible APIs are ${Object.keys(apis)}`);
        }
        apis[routes.type].routes(routes);
        return this;
      }
      routeManager.addRoutes(routes, router);
      return this;
    },
    mount() {
      state.mounted = true;
      Object.values(apis).forEach((api) => api.mount(router));
      app.use(router.routes()).use(router.allowedMethods());
      return this;
    },
    initRouting() {
      registerRoutes(strapi);
      return this;
    },
    async initMiddlewares() {
      await registerMiddlewares(strapi);
      return this;
    },
    listRoutes() {
      const allRoutes = [...router.stack];
      return allRoutes;
    },
    listen(...args) {
      if (!state.mounted) {
        this.mount();
      }
      return httpServer$1.listen(...args);
    },
    async destroy() {
      await httpServer$1.destroy();
    }
  };
};
exports.createServer = createServer;
//# sourceMappingURL=index.js.map

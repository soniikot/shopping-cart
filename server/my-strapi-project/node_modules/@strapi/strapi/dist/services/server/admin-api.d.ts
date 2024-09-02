/// <reference types="koa__router" />
/// <reference types="koa" />
import type { Strapi } from '@strapi/types';
declare const createAdminAPI: (strapi: Strapi) => {
    listRoutes(): import("@koa/router").Layer[];
    use(fn: import("@koa/router").Middleware<import("koa").DefaultState, import("koa").DefaultContext, unknown>): any;
    routes(routes: import("@strapi/types/dist/types/core/common").Router | import("@strapi/types/dist/types/core/common").Route[]): any;
    mount(router: import("@koa/router")<import("koa").DefaultState, import("koa").DefaultContext>): any;
};
export { createAdminAPI };
//# sourceMappingURL=admin-api.d.ts.map
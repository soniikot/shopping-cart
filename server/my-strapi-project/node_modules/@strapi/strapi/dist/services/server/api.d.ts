/// <reference types="koa__router" />
import Router from '@koa/router';
import type { Strapi, Common } from '@strapi/types';
interface Options {
    prefix?: string;
    type?: string;
}
declare const createAPI: (strapi: Strapi, opts?: Options) => {
    listRoutes(): Router.Layer[];
    use(fn: Router.Middleware): any;
    routes(routes: Common.Router | Common.Route[]): any;
    mount(router: Router): any;
};
export { createAPI };
//# sourceMappingURL=api.d.ts.map
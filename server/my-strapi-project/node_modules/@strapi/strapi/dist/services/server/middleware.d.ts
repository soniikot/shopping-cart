import type { Strapi, Common } from '@strapi/types';
declare const resolveRouteMiddlewares: (route: Common.Route, strapi: Strapi) => Common.MiddlewareHandler[];
/**
 * Initialize every configured middlewares
 */
declare const resolveMiddlewares: (config: (string | Common.MiddlewareHandler | {
    name?: string | undefined;
    resolve?: string | undefined;
    config?: unknown;
})[], strapi: Strapi) => {
    name: string | null;
    handler: Common.MiddlewareHandler;
}[];
export { resolveRouteMiddlewares, resolveMiddlewares };
//# sourceMappingURL=middleware.d.ts.map
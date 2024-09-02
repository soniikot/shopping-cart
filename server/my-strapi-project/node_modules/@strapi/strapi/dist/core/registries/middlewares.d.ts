/// <reference types="lodash" />
import type { Common } from '@strapi/types';
type MiddlewareExtendFn = (middleware: Common.Middleware) => Common.Middleware;
declare const middlewaresRegistry: () => {
    /**
     * Returns this list of registered middlewares uids
     */
    keys(): string[];
    /**
     * Returns the instance of a middleware. Instantiate the middleware if not already done
     */
    get(uid: Common.UID.Middleware): Common.Middleware;
    /**
     * Returns a map with all the middlewares in a namespace
     */
    getAll(namespace: string): import("lodash").Dictionary<unknown>;
    /**
     * Registers a middleware
     */
    set(uid: Common.UID.Middleware, middleware: Common.Middleware): any;
    /**
     * Registers a map of middlewares for a specific namespace
     */
    add(namespace: string, rawMiddlewares?: Record<string, Common.Middleware>): void;
    /**
     * Wraps a middleware to extend it
     */
    extend(uid: Common.UID.Middleware, extendFn: MiddlewareExtendFn): any;
};
export default middlewaresRegistry;
//# sourceMappingURL=middlewares.d.ts.map
import type { Strapi, Common, Schema } from '@strapi/types';
export interface RawModule {
    config?: Record<string, unknown>;
    routes?: Common.Module['routes'];
    controllers?: Common.Module['controllers'];
    services?: Common.Module['services'];
    contentTypes?: Common.Module['contentTypes'];
    policies?: Common.Module['policies'];
    middlewares?: Common.Module['middlewares'];
    bootstrap?: (params: {
        strapi: Strapi;
    }) => Promise<void>;
    register?: (params: {
        strapi: Strapi;
    }) => Promise<void>;
    destroy?: (params: {
        strapi: Strapi;
    }) => Promise<void>;
}
export interface Module {
    bootstrap: () => Promise<void>;
    register: () => Promise<void>;
    destroy: () => Promise<void>;
    load: () => void;
    routes: Common.Module['routes'];
    config: (path: string, defaultValue?: unknown) => unknown;
    contentType: (ctName: Common.UID.ContentType) => Schema.ContentType;
    contentTypes: Record<string, Schema.ContentType>;
    service: (serviceName: Common.UID.Service) => Common.Service;
    services: Record<string, Common.Service>;
    policy: (policyName: Common.UID.Policy) => Common.Policy;
    policies: Record<string, Common.Policy>;
    middleware: (middlewareName: Common.UID.Middleware) => Common.Middleware;
    middlewares: Record<string, Common.Middleware>;
    controller: (controllerName: Common.UID.Controller) => Common.Controller;
    controllers: Record<string, Common.Controller>;
}
export declare const createModule: (namespace: string, rawModule: RawModule, strapi: Strapi) => Module;
//# sourceMappingURL=index.d.ts.map
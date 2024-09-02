import type { Common } from '@strapi/types';
export interface Config {
    handlers?: Record<number, Common.MiddlewareHandler>;
}
export declare const responses: Common.MiddlewareFactory<Config>;
//# sourceMappingURL=responses.d.ts.map
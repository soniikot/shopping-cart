import type { Common } from '@strapi/types';
export type Config = {
    enabled?: boolean;
    origin: string | string[] | ((ctx: any) => string | string[]);
    expose?: string | string[];
    maxAge?: number;
    credentials?: boolean;
    methods?: string | string[];
    headers?: string | string[];
    keepHeadersOnError?: boolean;
};
export declare const cors: Common.MiddlewareFactory<Config>;
//# sourceMappingURL=cors.d.ts.map
import type { Strapi } from '@strapi/types';
declare const apisRegistry: (strapi: Strapi) => {
    get(name: string): unknown;
    getAll(): Record<string, unknown>;
    add(apiName: string, apiConfig: unknown): unknown;
};
export default apisRegistry;
//# sourceMappingURL=apis.d.ts.map
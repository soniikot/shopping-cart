import type { Strapi, Common } from '@strapi/types';
/**
 * Create a content API container that holds logic, tools and utils. (eg: permissions, ...)
 */
declare const createContentAPI: (strapi: Strapi) => {
    permissions: {
        engine: import("@strapi/permissions/dist/engine").Engine;
        providers: {
            action: {
                register(action: string, payload: Record<string, unknown>): Promise<import("@strapi/utils/dist/provider-factory").Provider<{
                    [x: string]: unknown;
                }>>;
                hooks: import("@strapi/utils/dist/provider-factory").ProviderHooksMap;
                delete(key: string): Promise<import("@strapi/utils/dist/provider-factory").Provider<{
                    [x: string]: unknown;
                }>>;
                get(key: string): {
                    [x: string]: unknown;
                } | undefined;
                values(): {
                    [x: string]: unknown;
                }[];
                keys(): string[];
                has(key: string): boolean;
                size(): number;
                clear(): Promise<import("@strapi/utils/dist/provider-factory").Provider<{
                    [x: string]: unknown;
                }>>;
            };
            condition: {
                register(condition: import("./permissions/providers/condition").Condition): Promise<import("@strapi/utils/dist/provider-factory").Provider<{
                    [x: string]: unknown;
                }>>;
                hooks: import("@strapi/utils/dist/provider-factory").ProviderHooksMap;
                delete(key: string): Promise<import("@strapi/utils/dist/provider-factory").Provider<{
                    [x: string]: unknown;
                }>>;
                get(key: string): {
                    [x: string]: unknown;
                } | undefined;
                values(): {
                    [x: string]: unknown;
                }[];
                keys(): string[];
                has(key: string): boolean;
                size(): number;
                clear(): Promise<import("@strapi/utils/dist/provider-factory").Provider<{
                    [x: string]: unknown;
                }>>;
            };
        };
        registerActions: () => Promise<void>;
        getActionsMap: () => Record<string, {
            controllers: Record<string, string[]>;
        }>;
    };
    getRoutesMap: () => Promise<Record<string, Common.Route[]>>;
};
export default createContentAPI;
//# sourceMappingURL=index.d.ts.map
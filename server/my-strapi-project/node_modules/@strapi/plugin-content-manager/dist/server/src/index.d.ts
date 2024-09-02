declare const _default: () => {
    bootstrap: () => Promise<void>;
    controllers: {
        'collection-types': {
            find(ctx: any): Promise<any>;
            findOne(ctx: any): Promise<any>;
            create(ctx: any): Promise<any>;
            update(ctx: any): Promise<any>;
            clone(ctx: any): Promise<any>;
            autoClone(ctx: any): Promise<any>;
            delete(ctx: any): Promise<any>;
            publish(ctx: any): Promise<any>;
            bulkPublish(ctx: any): Promise<any>;
            bulkUnpublish(ctx: any): Promise<any>;
            unpublish(ctx: any): Promise<any>;
            bulkDelete(ctx: any): Promise<any>;
            countDraftRelations(ctx: any): Promise<any>;
            countManyEntriesDraftRelations(ctx: any): Promise<any>;
        };
        components: {
            findComponents(ctx: any): void;
            findComponentConfiguration(ctx: any): Promise<any>;
            updateComponentConfiguration(ctx: any): Promise<any>;
        };
        'content-types': {
            findContentTypes(ctx: any): Promise<any>;
            findContentTypesSettings(ctx: any): Promise<void>;
            findContentTypeConfiguration(ctx: any): Promise<any>;
            updateContentTypeConfiguration(ctx: any): Promise<any>;
        };
        init: {
            getInitData(ctx: any): void;
        };
        relations: {
            findAvailable(ctx: any): Promise<any>;
            findExisting(ctx: any): Promise<any>;
        };
        'single-types': {
            find(ctx: any): Promise<any>;
            createOrUpdate(ctx: any): Promise<any>;
            delete(ctx: any): Promise<any>;
            publish(ctx: any): Promise<any>;
            unpublish(ctx: any): Promise<any>;
            countDraftRelations(ctx: any): Promise<any>;
        };
        uid: {
            generateUID(ctx: any): Promise<void>;
            checkUIDAvailability(ctx: any): Promise<void>;
        };
    };
    routes: {
        admin: {
            type: string;
            routes: ({
                method: string;
                path: string;
                handler: string;
                config: {
                    policies: string[];
                    middlewares?: undefined;
                };
            } | {
                method: string;
                path: string;
                handler: string;
                config: {
                    middlewares: ((ctx: import("koa").Context, next: import("koa").Next) => Promise<any>)[];
                    policies: (string | {
                        name: string;
                        config: {
                            actions: string[];
                        };
                    })[];
                };
            } | {
                method: string;
                path: string;
                handler: string;
                config: {
                    middlewares: ((ctx: import("koa").Context, next: import("koa").Next) => Promise<any>)[];
                    policies: (string | {
                        name: string;
                        config: {
                            actions: string[];
                            hasAtLeastOne: boolean;
                        };
                    })[];
                };
            })[];
        };
    };
    policies: {
        'has-draft-and-publish': (ctx: import("koa").Context, config: any, { strapi }: {
            strapi: import("@strapi/types").Strapi;
        }) => boolean;
        hasPermissions: {
            name: string;
            validator: (config: unknown) => void;
            handler: (...args: any[]) => any;
        };
    };
    services: {
        components: ({ strapi }: {
            strapi: import("@strapi/types").Strapi;
        }) => {
            findAllComponents(): unknown[];
            findComponent(uid: `${string}.${string}`): any;
            findConfiguration(component: import("@strapi/types/dist/types/core/schemas").Component): Promise<{
                uid: string;
                settings: import("../../shared/contracts/content-types").Settings;
                metadatas: import("../../shared/contracts/content-types").Metadatas;
                layouts: import("../../shared/contracts/content-types").Layouts;
                category: string;
            }>;
            updateConfiguration(component: import("@strapi/types/dist/types/core/schemas").Component, newConfiguration: import("./services/configuration").ConfigurationUpdate): Promise<{
                uid: string;
                settings: import("../../shared/contracts/content-types").Settings;
                metadatas: import("../../shared/contracts/content-types").Metadatas;
                layouts: import("../../shared/contracts/content-types").Layouts;
                category: string;
            }>;
            findComponentsConfigurations(model: import("@strapi/types/dist/types/core/schemas").Component): Promise<Record<string, import("../../shared/contracts/content-types").Configuration & {
                category: string;
                isComponent: boolean;
            }>>;
            syncConfigurations(): Promise<void>;
        };
        'content-types': ({ strapi }: {
            strapi: Required<import("@strapi/types").Strapi>;
        }) => {
            findAllContentTypes(): unknown[];
            findContentType(uid: `admin::${string}` | `strapi::${string}` | `api::${string}.${string}` | `plugin::${string}.${string}`): any;
            findDisplayedContentTypes(): unknown[];
            findContentTypesByKind(kind: {
                kind: import("@strapi/types/dist/types/core/schemas").ContentTypeKind | undefined;
            }): unknown[];
            findConfiguration(contentType: import("@strapi/types/dist/types/core/schemas").ContentType): Promise<any>;
            updateConfiguration(contentType: import("@strapi/types/dist/types/core/schemas").ContentType, newConfiguration: import("./services/configuration").ConfigurationUpdate): Promise<any>;
            findComponentsConfigurations(contentType: import("@strapi/types/dist/types/core/schemas").ContentType): any;
            syncConfigurations(): Promise<void>;
        };
        'data-mapper': () => {
            toContentManagerModel(contentType: import("@strapi/types/dist/types/core/schemas").Component): {
                apiID: string;
                isDisplayed: boolean;
                attributes: any;
                modelType: "component";
                uid: `${string}.${string}`;
                category: string;
                modelName: string;
                globalId: string;
                pluginOptions?: import("@strapi/types/dist/types/core/schemas").PluginOptions | undefined;
                options?: import("@strapi/types/dist/types/core/schemas").Options | undefined;
                collectionName?: string | undefined;
                info: import("@strapi/types/dist/types/core/schemas").Info;
            };
            toDto: import("lodash/fp").LodashPick2x1;
        };
        'entity-manager': import("./services/entity-manager").EntityManager;
        'field-sizes': ({ strapi }: {
            strapi: Required<import("@strapi/types").Strapi>;
        }) => {
            getAllFieldSizes(): Record<string, {
                default: 4 | 8 | 6 | 12;
                isResizable: boolean;
            } | undefined>;
            hasFieldSize(type: string): boolean;
            getFieldSize(type?: string | undefined): {
                default: 4 | 8 | 6 | 12;
                isResizable: boolean;
            };
            setFieldSize(type: string, size: {
                default: 4 | 8 | 6 | 12;
                isResizable: boolean;
            } | undefined): void;
            setCustomFieldInputSizes(): void;
        };
        metrics: ({ strapi }: {
            strapi: Required<import("@strapi/types").Strapi>;
        }) => {
            sendDidConfigureListView: (contentType: import("@strapi/types/dist/types/core/schemas").ContentType, configuration: import("../../shared/contracts/content-types").Configuration) => Promise<void>;
        };
        'permission-checker': ({ strapi }: {
            strapi: Required<import("@strapi/types").Strapi>;
        }) => {
            create: ({ userAbility, model }: {
                userAbility: any;
                model: string;
            }) => {
                can: (action: string, entity?: ({
                    id: import("@strapi/types/dist/types/core/entity").ID;
                } & {
                    [key: string]: any;
                }) | undefined, field: string) => any;
                cannot: (action: string, entity?: ({
                    id: import("@strapi/types/dist/types/core/entity").ID;
                } & {
                    [key: string]: any;
                }) | undefined, field: string) => any;
                sanitizeOutput: (data: {
                    id: import("@strapi/types/dist/types/core/entity").ID;
                } & {
                    [key: string]: any;
                }, { action }?: {
                    action?: string | undefined;
                }) => any;
                sanitizeQuery: (query: {
                    page?: string | undefined;
                    pageSize?: string | undefined;
                    sort?: string | undefined;
                }, { action }?: {
                    action?: string | undefined;
                }) => any;
                sanitizeCreateInput: (data: any) => any;
                sanitizeUpdateInput: (entity: {
                    id: import("@strapi/types/dist/types/core/entity").ID;
                } & {
                    [key: string]: any;
                }) => (data: any) => any;
                validateQuery: (query: {
                    page?: string | undefined;
                    pageSize?: string | undefined;
                    sort?: string | undefined;
                }, { action }?: {
                    action?: string | undefined;
                }) => any;
                validateInput: (action: string, data: any, entity?: ({
                    id: import("@strapi/types/dist/types/core/entity").ID;
                } & {
                    [key: string]: any;
                }) | undefined) => any;
                sanitizedQuery: (query: {
                    page?: string | undefined;
                    pageSize?: string | undefined;
                    sort?: string | undefined;
                }, action?: {
                    action?: string | undefined;
                }) => Promise<any>;
            };
        };
        permission: ({ strapi }: {
            strapi: Required<import("@strapi/types").Strapi>;
        }) => {
            canConfigureContentType({ userAbility, contentType, }: {
                userAbility: any;
                contentType: import("@strapi/types/dist/types/core/schemas").ContentType;
            }): any;
            registerPermissions(): Promise<void>;
        };
        'populate-builder': () => (uid: import("@strapi/types/dist/types/core/common/uid").Schema) => {
            populateFromQuery(query: object): any;
            countRelationsIf(condition: boolean, { toMany, toOne }?: {
                toMany: boolean;
                toOne: boolean;
            }): any;
            countRelations({ toMany, toOne }?: {
                toMany: boolean;
                toOne: boolean;
            }): any;
            populateDeep(level?: number): any;
            build(): Promise<{} | undefined>;
        };
        uid: ({ strapi }: {
            strapi: Required<import("@strapi/types").Strapi>;
        }) => {
            generateUIDField({ contentTypeUID, field, data, }: {
                contentTypeUID: `admin::${string}` | `strapi::${string}` | `api::${string}.${string}` | `plugin::${string}.${string}`;
                field: string;
                data: Record<string, any>;
            }): Promise<string>;
            findUniqueUID({ contentTypeUID, field, value, }: {
                contentTypeUID: `admin::${string}` | `strapi::${string}` | `api::${string}.${string}` | `plugin::${string}.${string}`;
                field: string;
                value: string;
            }): Promise<string>;
            checkUIDAvailability({ contentTypeUID, field, value, }: {
                contentTypeUID: `admin::${string}` | `strapi::${string}` | `api::${string}.${string}` | `plugin::${string}.${string}`;
                field: string;
                value: string;
            }): Promise<boolean>;
        };
    };
};
export default _default;
//# sourceMappingURL=index.d.ts.map
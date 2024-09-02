/// <reference types="koa" />
declare const _default: () => {
    register: ({ strapi }: {
        strapi: import("@strapi/types").Strapi;
    }) => void;
    bootstrap: ({ strapi }: {
        strapi: import("@strapi/types").Strapi;
    }) => Promise<void>;
    routes: {
        admin: {
            type: string;
            routes: {
                method: string;
                path: string;
                handler: string;
                config: {
                    policies: (string | {
                        name: string;
                        config: {
                            actions: string[];
                        };
                    })[];
                };
            }[];
        };
        'content-api': {
            type: string;
            routes: {
                method: string;
                path: string;
                handler: string;
            }[];
        };
    };
    controllers: {
        locales: import("@strapi/types/dist/types/core/common").Controller;
        'iso-locales': import("@strapi/types/dist/types/core/common").Controller;
        'content-types': {
            getNonLocalizedAttributes(ctx: import("koa").Context): Promise<import("koa").Context | undefined>;
        };
    };
    contentTypes: {
        locale: {
            schema: {
                info: {
                    singularName: string;
                    pluralName: string;
                    collectionName: string;
                    displayName: string;
                    description: string;
                };
                options: {
                    draftAndPublish: boolean;
                };
                pluginOptions: {
                    "content-manager": {
                        visible: boolean;
                    };
                    "content-type-builder": {
                        visible: boolean;
                    };
                };
                attributes: {
                    name: {
                        type: string;
                        min: number;
                        max: number;
                        configurable: boolean;
                    };
                    code: {
                        type: string;
                        unique: boolean;
                        configurable: boolean;
                    };
                };
            };
        };
    };
    services: {
        permissions: () => {
            actions: {
                actions: ({
                    section: string;
                    category: string;
                    subCategory: string;
                    pluginName: string;
                    displayName: string;
                    uid: string;
                    aliases?: undefined;
                } | {
                    section: string;
                    category: string;
                    subCategory: string;
                    pluginName: string;
                    displayName: string;
                    uid: string;
                    aliases: {
                        actionId: string;
                        subjects: string[];
                    }[];
                })[];
                registerI18nActions: () => Promise<void>;
                registerI18nActionsHooks: () => void;
                updateActionsProperties: () => void;
                syncSuperAdminPermissionsWithLocales: () => Promise<void>;
            };
            sectionsBuilder: {
                localesPropertyHandler: ({ action, section }: any) => Promise<void>;
                registerLocalesPropertyHandler: () => void;
            };
            engine: {
                willRegisterPermission: (context: any) => void;
                registerI18nPermissionsHandlers: () => void;
            };
        };
        metrics: () => {
            sendDidInitializeEvent: () => Promise<void>;
            sendDidUpdateI18nLocalesEvent: () => Promise<void>;
        };
        localizations: () => {
            assignDefaultLocaleToEntries: (data: any) => Promise<void>;
            syncLocalizations: (entry: any, { model }: any) => Promise<void>;
            syncNonLocalizedAttributes: (entry: any, { model }: any) => Promise<void>;
        };
        locales: () => {
            find: (params?: any) => Promise<any[]>;
            findById: (id: any) => Promise<any>;
            findByCode: (code: any) => Promise<any>;
            create: (locale: any) => Promise<any>;
            update: (params: any, updates: any) => Promise<any>;
            count: (params?: any) => Promise<number>;
            setDefaultLocale: ({ code }: any) => Promise<void>;
            getDefaultLocale: () => Promise<unknown>;
            setIsDefault: (locales: any) => Promise<any>;
            delete: ({ id }: any) => Promise<any>;
            initDefaultLocale: () => Promise<void>;
        };
        'iso-locales': () => {
            getIsoLocales: () => {
                code: string;
                name: string;
            }[];
        };
        'entity-service-decorator': () => {
            decorator: (service: any) => {
                wrapResult(result?: {}, ctx?: {}): Promise<any>;
                wrapParams(params?: any, ctx?: any): Promise<any>;
                create(uid: any, opts?: any): Promise<any>;
                update(uid: any, entityId: any, opts?: any): Promise<any>;
                findMany(uid: any, opts: any): Promise<any>;
            };
            wrapParams: (params?: any, ctx?: any) => Promise<any>;
        };
        'core-api': () => {
            addCreateLocalizationAction: (contentType: any) => void;
            addGraphqlLocalizationAction: (contentType: any) => void;
            createSanitizer: (contentType: any) => {
                sanitizeInput: (data: any) => Pick<any, string>;
                sanitizeInputFiles: (files: any) => any;
            };
            createCreateLocalizationHandler: (contentType: any) => (args?: any) => Promise<unknown>;
        };
        'content-types': () => {
            isLocalizedContentType: (model: any) => boolean;
            getValidLocale: (locale: any) => Promise<any>;
            getNewLocalizationsFrom: (relatedEntity: any) => Promise<any[]>;
            getLocalizedAttributes: (model: any) => string[];
            getNonLocalizedAttributes: (model: any) => string[];
            copyNonLocalizedAttributes: (model: any, entry: any) => any;
            getAndValidateRelatedEntity: (relatedEntityId: any, model: any, locale: any) => Promise<any>;
            fillNonLocalizedAttributes: (entry: any, relatedEntry: any, { model }: any) => void;
            getNestedPopulateOfNonLocalizedAttributes: (modelUID: any) => string[];
        };
    };
};
export default _default;
//# sourceMappingURL=index.d.ts.map
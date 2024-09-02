declare const _default: {
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
export default _default;
//# sourceMappingURL=index.d.ts.map
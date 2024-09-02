/// <reference types="koa" />
import 'koa-bodyparser';
declare const _default: {
    admin: {
        getProjectType(): Promise<{
            data: {
                isEE: boolean;
                features: never[];
                flags: {};
            };
        }>;
        init(): Promise<{
            data: {
                uuid: false;
                hasAdmin: boolean;
                menuLogo: string | null;
                authLogo: string | null;
            };
        }>;
        getProjectSettings(): Promise<import("../../../shared/contracts/admin").GetProjectSettings.Response>;
        updateProjectSettings(ctx: import("koa").Context): Promise<import("../../../shared/contracts/admin").GetProjectSettings.Response>;
        telemetryProperties(ctx: import("koa").Context): Promise<{
            data: {
                useTypescriptOnServer: any;
                useTypescriptOnAdmin: any;
                isHostedOnStrapiCloud: boolean;
                numberOfAllContentTypes: number;
                numberOfComponents: number;
                numberOfDynamicZones: number;
            };
        } | undefined>;
        information(): Promise<{
            data: {
                currentEnvironment: string;
                autoReload: false;
                strapiVersion: null;
                dependencies: {};
                projectId: null;
                nodeVersion: string;
                communityEdition: boolean;
                useYarn: boolean;
            };
        }>;
        plugins(ctx: import("koa").Context): Promise<void>;
    };
    'api-token': {
        create(ctx: import("koa").Context): Promise<void>;
        regenerate(ctx: import("koa").Context): Promise<void>;
        list(ctx: import("koa").Context): Promise<void>;
        revoke(ctx: import("koa").Context): Promise<void>;
        get(ctx: import("koa").Context): Promise<void>;
        update(ctx: import("koa").Context): Promise<import("koa").Context | undefined>;
        getLayout(ctx: import("koa").Context): Promise<void>;
    };
    'authenticated-user': {
        getMe(ctx: import("koa").Context): Promise<void>;
        updateMe(ctx: import("koa").Context): Promise<import("koa").Context | undefined>;
        getOwnPermissions(ctx: import("koa").Context): Promise<void>;
    };
    authentication: {
        login: import("koa").Middleware<import("koa").DefaultState, import("koa").Context, any>;
        renewToken(ctx: import("koa").Context): Promise<void>;
        registrationInfo(ctx: import("koa").Context): Promise<void>;
        register(ctx: import("koa").Context): Promise<void>;
        registerAdmin(ctx: import("koa").Context): Promise<void>;
        forgotPassword(ctx: import("koa").Context): Promise<void>;
        resetPassword(ctx: import("koa").Context): Promise<void>;
        logout(ctx: import("koa").Context): void;
    };
    permission: {
        check(ctx: import("koa").Context): Promise<void>;
        getAll(ctx: import("koa").Context): Promise<void>;
    };
    role: {
        create(ctx: import("koa").Context): Promise<void>;
        findOne(ctx: import("koa").Context): Promise<import("koa").Context | undefined>;
        findAll(ctx: import("koa").Context): Promise<void>;
        update(ctx: import("koa").Context): Promise<import("koa").Context | undefined>;
        getPermissions(ctx: import("koa").Context): Promise<import("koa").Context | undefined>;
        updatePermissions(ctx: import("koa").Context): Promise<import("koa").Context | undefined>;
        deleteOne(ctx: import("koa").Context): Promise<any>;
        deleteMany(ctx: import("koa").Context): Promise<any>;
    };
    transfer: {
        [x: string]: any;
    };
    user: {
        create(ctx: import("koa").Context): Promise<void>;
        find(ctx: import("koa").Context): Promise<void>;
        findOne(ctx: import("koa").Context): Promise<import("koa").Context | undefined>;
        update(ctx: import("koa").Context): Promise<import("koa").Context | undefined>;
        deleteOne(ctx: import("koa").Context): Promise<any>;
        deleteMany(ctx: import("koa").Context): Promise<any>;
    };
    webhooks: {
        listWebhooks(ctx: import("koa").Context): Promise<void>;
        getWebhook(ctx: import("koa").Context): Promise<import("koa").Context | undefined>;
        createWebhook(ctx: import("koa").Context): Promise<void>;
        updateWebhook(ctx: import("koa").Context): Promise<import("koa").Context | undefined>;
        deleteWebhook(ctx: import("koa").Context): Promise<import("koa").Context | undefined>;
        deleteWebhooks(ctx: import("koa").Context): Promise<import("koa").Context | undefined>;
        triggerWebhook(ctx: import("koa").Context): Promise<void>;
    };
    'content-api': {
        getPermissions(ctx: import("koa").Context): Promise<void>;
        getRoutes(ctx: import("koa").Context): Promise<void>;
    };
};
export default _default;
//# sourceMappingURL=index.d.ts.map
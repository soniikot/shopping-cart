import { Logger } from '@strapi/logger';
import { Database } from '@strapi/database';
import type { Strapi as StrapiI, Server, Container, EntityService, EventHub, StartupLogger, CronService, WebhookStore, CoreStore, TelemetryService, RequestContext, CustomFields, Fetch, StrapiFS, StrapiDirectories, Reloader, EntityValidator, Common, Shared, Schema } from '@strapi/types';
import * as factories from './factories';
import compile from './compile';
import { WebhookRunner } from './services/webhook-runner';
import { FeaturesService } from './services/features';
export type LoadedStrapi = Required<Strapi>;
declare class Strapi implements StrapiI {
    server: Server;
    container: Container;
    log: Logger;
    fs: StrapiFS;
    eventHub: EventHub;
    startupLogger: StartupLogger;
    cron: CronService;
    webhookRunner?: WebhookRunner;
    webhookStore?: WebhookStore;
    store?: CoreStore;
    entityValidator?: EntityValidator;
    entityService?: EntityService.EntityService;
    telemetry: TelemetryService;
    requestContext: RequestContext;
    customFields: CustomFields.CustomFields;
    fetch: Fetch;
    dirs: StrapiDirectories;
    admin?: Common.Module;
    isLoaded: boolean;
    db?: Database;
    app: any;
    EE?: boolean;
    components: Shared.Components;
    reload: Reloader;
    features: FeaturesService;
    constructor(opts?: StrapiOptions);
    get config(): any;
    get services(): any;
    service(uid: Common.UID.Service): any;
    get controllers(): any;
    controller(uid: Common.UID.Controller): any;
    get contentTypes(): Shared.ContentTypes;
    contentType(name: Common.UID.ContentType): any;
    get policies(): any;
    policy(name: string): any;
    get middlewares(): any;
    middleware(name: string): any;
    get plugins(): Record<string, Common.Plugin>;
    plugin(name: string): Common.Plugin;
    get hooks(): any;
    hook(name: string): any;
    get api(): Record<string, Common.Module>;
    get auth(): any;
    get contentAPI(): any;
    get sanitizers(): any;
    get validators(): any;
    start(): Promise<this>;
    destroy(): Promise<void>;
    sendStartupTelemetry(): void;
    openAdmin({ isInitialized }: {
        isInitialized: boolean;
    }): Promise<void>;
    postListen(): Promise<void>;
    /**
     * Add behaviors to the server
     */
    listen(): Promise<void>;
    stopWithError(err: unknown, customMessage?: string): never;
    stop(exitCode?: number): never;
    loadAdmin(): Promise<void>;
    loadPlugins(): Promise<void>;
    loadPolicies(): Promise<void>;
    loadAPIs(): Promise<void>;
    loadComponents(): Promise<void>;
    loadMiddlewares(): Promise<void>;
    loadApp(): Promise<void>;
    loadSanitizers(): Promise<void>;
    loadValidators(): Promise<void>;
    registerInternalHooks(): void;
    register(): Promise<this>;
    bootstrap(): Promise<this>;
    load(): Promise<this & Required<StrapiI>>;
    startWebhooks(): Promise<void>;
    runLifecyclesFunctions(lifecycleName: 'register' | 'bootstrap' | 'destroy'): Promise<void>;
    getModel(uid: Common.UID.ContentType): Schema.ContentType;
    getModel(uid: Common.UID.Component): Schema.Component;
    /**
     * Binds queries with a specific model
     * @param {string} uid
     */
    query(uid: Common.UID.Schema): import("@strapi/database/dist/entity-manager").Repository;
}
interface StrapiOptions {
    appDir?: string;
    distDir?: string;
    autoReload?: boolean;
    serveAdminPanel?: boolean;
}
interface Init {
    (options?: StrapiOptions): Strapi;
    factories: typeof factories;
    compile: typeof compile;
}
declare const init: Init;
export default init;
//# sourceMappingURL=Strapi.d.ts.map
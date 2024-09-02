import { Command } from 'commander';
import { buildStrapiCloudCommands } from '@strapi/cloud-cli';
declare const strapiCommands: {
    readonly createAdminUser: import("./types").StrapiCommand;
    readonly resetAdminUserPassword: import("./types").StrapiCommand;
    readonly listComponents: import("./types").StrapiCommand;
    readonly configurationDump: import("./types").StrapiCommand;
    readonly configurationRestore: import("./types").StrapiCommand;
    readonly consoleCommand: import("./types").StrapiCommand;
    readonly listContentTypes: import("./types").StrapiCommand;
    readonly listControllers: import("./types").StrapiCommand;
    readonly generateCommand: import("./types").StrapiCommand;
    readonly listHooks: import("./types").StrapiCommand;
    readonly installCommand: import("./types").StrapiCommand;
    readonly listMiddlewares: import("./types").StrapiCommand;
    readonly newCommand: import("./types").StrapiCommand;
    readonly listPolicies: import("./types").StrapiCommand;
    readonly reportCommand: import("./types").StrapiCommand;
    readonly listRoutes: import("./types").StrapiCommand;
    readonly listServices: import("./types").StrapiCommand;
    readonly startCommand: import("./types").StrapiCommand;
    readonly disableTelemetry: import("./types").StrapiCommand;
    readonly enableTelemetry: import("./types").StrapiCommand;
    readonly generateTemplates: import("./types").StrapiCommand;
    readonly generateTsTypes: import("./types").StrapiCommand;
    readonly uninstallCommand: import("./types").StrapiCommand;
    readonly versionCommand: import("./types").StrapiCommand;
    readonly watchAdminCommand: import("./types").StrapiCommand;
    /**
     * Cloud
     */
    readonly buildStrapiCloudCommands: typeof buildStrapiCloudCommands;
    /**
     * Plugins
     */
    readonly buildPluginCommand: import("./types").StrapiCommand;
    readonly initPluginCommand: import("./types").StrapiCommand;
    readonly linkWatchPluginCommand: import("./types").StrapiCommand;
    readonly watchPluginCommand: import("./types").StrapiCommand;
    readonly verifyPluginCommand: import("./types").StrapiCommand;
};
declare const buildStrapiCommand: (argv: string[], command?: Command) => Promise<Command>;
declare const runStrapiCommand: (argv?: string[], command?: Command) => Promise<void>;
export { runStrapiCommand, buildStrapiCommand, strapiCommands };
//# sourceMappingURL=index.d.ts.map
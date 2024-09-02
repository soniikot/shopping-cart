import { Command } from 'commander';
import { CLIContext } from './types';
export declare const cli: {
    deployProject: import("./types").StrapiCloudCommandInfo;
    link: import("./types").StrapiCloudCommandInfo;
    login: import("./types").StrapiCloudCommandInfo;
    logout: {
        name: string;
        description: string;
        action: (ctx: CLIContext) => Promise<void>;
        command: import("./types").StrapiCloudCommand;
    };
    createProject: import("./types").StrapiCloudCommandInfo;
    listProjects: import("./types").StrapiCloudCommandInfo;
};
export declare function buildStrapiCloudCommands({ command, ctx, argv, }: {
    command: Command;
    ctx: CLIContext;
    argv: string[];
}): Promise<void>;
export * as services from './services';
export * from './types';
//# sourceMappingURL=index.d.ts.map
import { ExtMap, Export } from './core/exports';
import type { Config } from './core/config';
import type { Logger } from './core/logger';
import type { PackageJson } from './core/pkg';
import type { ParsedCommandLine } from 'typescript';
interface BuildContextArgs {
    config: Config;
    cwd: string;
    extMap: ExtMap;
    logger: Logger;
    pkg: PackageJson;
}
interface Targets {
    node: string[];
    web: string[];
    '*': string[];
}
type Runtime = '*' | 'node' | 'web';
interface BuildContext {
    config: Config;
    cwd: string;
    distPath: string;
    exports: Record<string, Export>;
    external: string[];
    extMap: ExtMap;
    logger: Logger;
    pkg: PackageJson;
    runtime?: Runtime;
    targets: Targets;
    ts?: {
        config: ParsedCommandLine;
        path: string;
    };
}
/**
 * @description Create a build context for the pipeline we're creating,
 * this is shared among tasks so they all use the same settings for core pieces
 * such as a target, distPath, externals etc.
 */
declare const createBuildContext: ({ config, cwd, extMap, logger, pkg, }: BuildContextArgs) => Promise<BuildContext>;
export { createBuildContext };
export type { BuildContext, Targets, Runtime };
//# sourceMappingURL=createBuildContext.d.ts.map
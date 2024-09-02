import { Logger } from './logger';
import type { Export } from './exports';
import type { Runtime } from '../createBuildContext';
import type { PluginOption } from 'vite';
interface LoadConfigOptions {
    cwd: string;
    logger: Logger;
}
declare const CONFIG_FILE_NAMES: string[];
declare const loadConfig: ({ cwd, logger }: LoadConfigOptions) => Promise<Config | undefined>;
interface ConfigBundle {
    source: string;
    import?: string;
    require?: string;
    runtime?: Runtime;
    tsconfig?: string;
    types?: string;
}
interface ConfigOptions {
    bundles?: ConfigBundle[];
    /**
     * @description the directory to output the bundle to.
     */
    dist?: string;
    /**
     * @description Overwrite the default exports.
     */
    exports?: ConfigProperty<Record<string, Export>>;
    /**
     * @description a list of external dependencies to exclude from the bundle.
     * We already collect the dependencies & peerDeps from the package.json.
     */
    externals?: string[];
    minify?: boolean;
    plugins?: PluginOption[] | (({ runtime }: {
        runtime: Runtime;
    }) => PluginOption[]);
    /**
     * @alpha
     *
     * @description Instead of creating as few chunks as possible, this mode
     * will create separate chunks for all modules using the original module
     * names as file names
     */
    preserveModules?: boolean;
    sourcemap?: boolean;
    runtime?: Runtime;
    /**
     * @description path to the tsconfig file to use for the bundle.
     *
     * @default tsconfig.build.json
     */
    tsconfig?: string;
}
/**
 * @public
 *
 * @description a helper function to define your config in a typesafe manner.
 */
declare const defineConfig: (configOptions: ConfigOptions) => ConfigOptions;
type Config = ConfigOptions;
type ConfigPropertyResolver<T> = (currentValue: T) => T;
type ConfigProperty<T> = T | ConfigPropertyResolver<T>;
/** @internal */
export declare function resolveConfigProperty<T>(prop: ConfigProperty<T> | undefined, initialValue: T): T;
export { loadConfig, defineConfig, CONFIG_FILE_NAMES };
export type { Config, ConfigOptions, ConfigBundle, ConfigPropertyResolver, ConfigProperty, PluginOption, Runtime, };
//# sourceMappingURL=config.d.ts.map
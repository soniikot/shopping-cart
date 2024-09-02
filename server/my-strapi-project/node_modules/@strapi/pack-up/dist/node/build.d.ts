import { CommonCLIOptions } from '../types';
import { type Config } from './core/config';
interface BuildCLIOptions extends CommonCLIOptions {
    minify?: boolean;
    sourcemap?: boolean;
}
interface BuildWithConfigFile extends BuildCLIOptions {
    configFile?: true;
    config?: never;
    cwd?: string;
}
interface BuildWithoutConfigFile extends BuildCLIOptions {
    configFile: false;
    config?: Config;
    cwd?: string;
}
type BuildOptions = BuildWithConfigFile | BuildWithoutConfigFile;
declare const build: (opts?: BuildOptions) => Promise<void>;
export { build };
export type { BuildOptions, BuildCLIOptions, BuildWithConfigFile, BuildWithoutConfigFile };
//# sourceMappingURL=build.d.ts.map
import { CommonCLIOptions } from '../types';
import { Config } from './core/config';
interface WatchCLIOptions extends CommonCLIOptions {
}
interface WatchOptionsWithoutConfig extends WatchCLIOptions {
    configFile?: true;
    config?: never;
    cwd?: string;
}
interface WatchOptionsWithConfig extends WatchCLIOptions {
    configFile: false;
    config?: Config;
    cwd?: string;
}
type WatchOptions = WatchOptionsWithConfig | WatchOptionsWithoutConfig;
declare const watch: (opts: WatchOptions) => Promise<void>;
export { watch };
export type { WatchOptions, WatchOptionsWithConfig, WatchOptionsWithoutConfig, WatchCLIOptions };
//# sourceMappingURL=watch.d.ts.map
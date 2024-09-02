import { ViteBaseTask } from './types';
import type { TaskHandler } from '../index';
export type InputOption = string | string[] | {
    [entryAlias: string]: string;
};
/**
 * This is a copy because it can't be imported from `vite`.
 */
export type RollupWatcherEvent = {
    code: 'START';
} | {
    code: 'BUNDLE_START';
    input?: InputOption;
    output: readonly string[];
} | {
    code: 'BUNDLE_END';
    duration: number;
    input?: InputOption;
    output: readonly string[];
    result: object;
} | {
    code: 'END';
} | {
    code: 'ERROR';
    error: object;
    result: object | null;
};
interface ViteWatchTask extends ViteBaseTask {
    type: 'watch:js';
}
declare const viteWatchTask: TaskHandler<ViteWatchTask, RollupWatcherEvent>;
export { viteWatchTask };
export type { ViteWatchTask };
//# sourceMappingURL=watch.d.ts.map
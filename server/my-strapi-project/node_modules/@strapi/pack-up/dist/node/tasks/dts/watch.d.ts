import ts from 'typescript';
import { DtsBaseTask } from './types';
import type { TaskHandler } from '../index';
interface DtsWatchTask extends DtsBaseTask {
    type: 'watch:dts';
}
declare const dtsWatchTask: TaskHandler<DtsWatchTask, ts.Diagnostic>;
export { dtsWatchTask };
export type { DtsWatchTask };
//# sourceMappingURL=watch.d.ts.map
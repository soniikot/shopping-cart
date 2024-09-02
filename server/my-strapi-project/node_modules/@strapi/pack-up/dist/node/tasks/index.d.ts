import ts from 'typescript';
import { BuildContext } from '../createBuildContext';
import { DtsBuildTask } from './dts/build';
import { DtsWatchTask } from './dts/watch';
import { ViteBuildTask } from './vite/build';
import { RollupWatcherEvent, ViteWatchTask } from './vite/watch';
import type { Observable } from 'rxjs';
interface TaskHandler<Task, Result = void> {
    print(ctx: BuildContext, task: Task): void;
    run$(ctx: BuildContext, task: Task): Observable<Result>;
    success(ctx: BuildContext, task: Task, result: Result): void;
    fail(ctx: BuildContext, task: Task, err: unknown): void;
}
interface TaskHandlers {
    'build:js': TaskHandler<ViteBuildTask>;
    'build:dts': TaskHandler<DtsBuildTask>;
    'watch:js': TaskHandler<ViteWatchTask, RollupWatcherEvent>;
    'watch:dts': TaskHandler<DtsWatchTask, ts.Diagnostic>;
}
declare const taskHandlers: TaskHandlers;
export { taskHandlers };
export type { TaskHandler, TaskHandlers };
//# sourceMappingURL=index.d.ts.map
import { DtsWatchTask } from './tasks/dts/watch';
import { ViteBaseTask } from './tasks/vite/types';
import { ViteWatchTask } from './tasks/vite/watch';
import type { BuildContext } from './createBuildContext';
import type { DtsBuildTask } from './tasks/dts/build';
import type { DtsBaseTask } from './tasks/dts/types';
import type { ViteBuildTask } from './tasks/vite/build';
type BuildTask = DtsBuildTask | ViteBuildTask;
type WatchTask = ViteWatchTask | DtsWatchTask;
type BaseTask = ViteBaseTask | DtsBaseTask;
declare const createBuildTasks: (ctx: BuildContext) => Promise<BuildTask[]>;
declare const createWatchTasks: (ctx: BuildContext) => Promise<WatchTask[]>;
export { createBuildTasks, createWatchTasks };
export type { BuildTask, WatchTask, BaseTask };
//# sourceMappingURL=createTasks.d.ts.map
import { ViteBaseTask } from './types';
import type { TaskHandler } from '../index';
interface ViteBuildTask extends ViteBaseTask {
    type: 'build:js';
}
declare const viteBuildTask: TaskHandler<ViteBuildTask>;
export { viteBuildTask };
export type { ViteBuildTask };
//# sourceMappingURL=build.d.ts.map
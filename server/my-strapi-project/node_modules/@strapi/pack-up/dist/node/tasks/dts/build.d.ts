import { DtsBaseTask } from './types';
import type { TaskHandler } from '../index';
interface DtsBuildTask extends DtsBaseTask {
    type: 'build:dts';
}
declare const dtsBuildTask: TaskHandler<DtsBuildTask>;
export { dtsBuildTask };
export type { DtsBuildTask };
//# sourceMappingURL=build.d.ts.map
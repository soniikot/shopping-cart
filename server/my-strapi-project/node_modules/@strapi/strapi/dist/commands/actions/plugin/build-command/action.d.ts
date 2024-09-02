import { BuildCLIOptions } from '@strapi/pack-up';
import { CLIContext } from '../../../types';
interface ActionOptions extends BuildCLIOptions {
    force?: boolean;
}
declare const _default: ({ force, ...opts }: ActionOptions, _cmd: unknown, { logger, cwd }: CLIContext) => Promise<void>;
export default _default;
//# sourceMappingURL=action.d.ts.map
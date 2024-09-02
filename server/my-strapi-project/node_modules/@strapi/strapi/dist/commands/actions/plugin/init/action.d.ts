import { InitOptions } from '@strapi/pack-up';
import { CLIContext } from '../../../types';
interface ActionOptions extends Pick<InitOptions, 'silent' | 'debug'> {
}
declare const _default: (packagePath: string, { silent, debug }: ActionOptions, { logger, cwd }: CLIContext) => Promise<void>;
export default _default;
//# sourceMappingURL=action.d.ts.map
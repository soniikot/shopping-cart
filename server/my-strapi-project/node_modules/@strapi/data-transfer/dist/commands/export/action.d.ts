import { TransferGroupFilter } from '../../engine';
interface CmdOptions {
    file?: string;
    encrypt?: boolean;
    key?: string;
    compress?: boolean;
    only?: (keyof TransferGroupFilter)[];
    exclude?: (keyof TransferGroupFilter)[];
    throttle?: number;
    maxSizeJsonl?: number;
}
/**
 * Export command.
 *
 * It transfers data from a local Strapi instance to a file
 *
 * @param {ExportCommandOptions} opts
 */
declare const _default: (opts: CmdOptions) => Promise<void>;
export default _default;
//# sourceMappingURL=action.d.ts.map
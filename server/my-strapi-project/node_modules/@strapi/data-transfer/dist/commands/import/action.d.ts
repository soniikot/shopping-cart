import * as engine from '../../engine';
interface CmdOptions {
    file?: string;
    decompress?: boolean;
    decrypt?: boolean;
    key?: string;
    conflictStrategy?: 'restore';
    force?: boolean;
    only?: (keyof engine.TransferGroupFilter)[];
    exclude?: (keyof engine.TransferGroupFilter)[];
    throttle?: number;
}
/**
 * Import command.
 *
 * It transfers data from a file to a local Strapi instance
 */
declare const _default: (opts: CmdOptions) => Promise<void>;
export default _default;
//# sourceMappingURL=action.d.ts.map
import { CommonCLIOptions } from '../types';
export interface CheckOptions extends CommonCLIOptions {
    cwd?: string;
}
export declare const check: (opts?: CheckOptions) => Promise<void>;
//# sourceMappingURL=check.d.ts.map
import { CommonCLIOptions } from '../types';
import { TemplateOrTemplateResolver } from './templates/types';
export interface InitOptions extends CommonCLIOptions {
    cwd?: string;
    path: string;
    template?: TemplateOrTemplateResolver | string;
}
export declare const init: (opts: InitOptions) => Promise<void>;
//# sourceMappingURL=init.d.ts.map
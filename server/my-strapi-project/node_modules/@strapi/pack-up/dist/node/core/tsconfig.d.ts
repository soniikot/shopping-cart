import ts from 'typescript';
import { Logger } from './logger';
/**
 * @description Load a tsconfig.json file and return the parsed config
 * after injecting some required defaults for producing types.
 *
 * @internal
 */
declare const loadTsConfig: ({ cwd, path, logger, }: {
    cwd: string;
    path: string;
    logger: Logger;
}) => {
    config: ts.ParsedCommandLine;
    path: string;
} | undefined;
export { loadTsConfig };
//# sourceMappingURL=tsconfig.d.ts.map
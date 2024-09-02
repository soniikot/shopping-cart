import { Logger } from '../core/logger';
import { TemplateOrTemplateResolver } from './types';
/**
 * @internal
 *
 * @description Resolve a template from a path and return it.
 */
declare const loadTemplate: (path: string, { logger }: {
    logger: Logger;
}) => TemplateOrTemplateResolver | undefined;
export { loadTemplate };
//# sourceMappingURL=load.d.ts.map
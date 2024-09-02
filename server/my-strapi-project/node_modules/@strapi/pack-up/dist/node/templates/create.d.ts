import { Logger } from '../core/logger';
import { TemplateFeature, TemplateOption, TemplateOrTemplateResolver } from './types';
interface CreatePackageFromTemplateOpts {
    logger: Logger;
    cwd: string;
    template: TemplateOrTemplateResolver;
}
/**
 * @internal
 *
 * @description Resolves a template if it's a function and runs
 * through the template to create a new package.
 */
declare const createPackageFromTemplate: (packagePath: string, opts: CreatePackageFromTemplateOpts) => Promise<void>;
/**
 * @public
 *
 * @description a helper function to define your package template in a typesafe manner.
 */
declare const defineTemplate: (template: TemplateOrTemplateResolver) => TemplateOrTemplateResolver;
/**
 * @public
 *
 * @description Create a prompt for your users to input data for your package template.
 * e.g. "what is the name of your package?"
 */
declare const definePackageOption: <T extends string>(option: TemplateOption<T>) => TemplateOption<T>;
/**
 * @public
 *
 * @description Create a feature option for your package e.g. "do you want typescript?" – yes/no.
 */
declare const definePackageFeature: (feature: TemplateFeature) => TemplateFeature;
export { createPackageFromTemplate, definePackageFeature, definePackageOption, defineTemplate };
//# sourceMappingURL=create.d.ts.map
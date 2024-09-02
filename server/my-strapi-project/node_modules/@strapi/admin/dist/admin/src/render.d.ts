import { StrapiAppConstructorArgs } from './StrapiApp';
import type { FeaturesService } from '@strapi/types';
interface RenderAdminArgs {
    customisations: StrapiAppConstructorArgs['adminConfig'];
    plugins: StrapiAppConstructorArgs['appPlugins'];
    features?: FeaturesService['config'];
}
declare const renderAdmin: (mountNode: HTMLElement | null, { plugins, customisations, features }: RenderAdminArgs) => Promise<void>;
export { renderAdmin };
export type { RenderAdminArgs };

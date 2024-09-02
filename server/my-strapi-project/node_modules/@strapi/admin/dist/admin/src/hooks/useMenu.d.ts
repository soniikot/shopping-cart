import { StrapiAppContextValue } from '@strapi/helper-plugin';
type MenuItem = StrapiAppContextValue['menu'][number];
export interface Menu {
    generalSectionLinks: MenuItem[];
    pluginsSectionLinks: MenuItem[];
    isLoading: boolean;
}
declare const useMenu: () => Menu;
export { useMenu };

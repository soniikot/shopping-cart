import { MenuItem } from '@strapi/helper-plugin';
export interface Route extends Pick<MenuItem, 'exact' | 'to'>, Required<Pick<MenuItem, 'Component'>> {
}
export declare const ROUTES_CE: Route[];

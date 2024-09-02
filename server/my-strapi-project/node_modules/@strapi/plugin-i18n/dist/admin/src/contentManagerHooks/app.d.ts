import type { StrapiAppSettingLink } from '@strapi/helper-plugin';
import type { Store } from '@strapi/strapi/admin';
import type { Schema } from '@strapi/types';
export interface AddLocaleToCTLinksArgs {
    ctLinks: Array<StrapiAppSettingLink & {
        search?: string;
    }>;
    models: Schema.ContentType[];
}
export interface AddLocaleToSTLinksArgs {
    stLinks: Array<StrapiAppSettingLink & {
        search?: string;
    }>;
    models: Schema.ContentType[];
}
export type AddLocalToLinksHookArgs<TType extends 'collection-types' | 'single-types'> = TType extends 'collection-types' ? AddLocaleToCTLinksArgs : AddLocaleToSTLinksArgs;
declare const addLocaleToLinksHook: <TType extends "collection-types" | "single-types">(type: TType) => (args: AddLocalToLinksHookArgs<TType>, store: Store) => AddLocaleToCTLinksArgs | AddLocaleToSTLinksArgs;
export { addLocaleToLinksHook };

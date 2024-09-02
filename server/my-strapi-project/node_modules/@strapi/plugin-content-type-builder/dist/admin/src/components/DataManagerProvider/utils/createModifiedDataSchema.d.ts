import type { ContentType, Components } from '../../../types';
import type { UID } from '@strapi/types';
export declare const createModifiedDataSchema: (contentTypeSchema: ContentType, retrievedComponents: UID.Component[], allComponentsSchema: Components, isInContentTypeView: boolean) => {
    [x: string]: any;
    components: any;
};

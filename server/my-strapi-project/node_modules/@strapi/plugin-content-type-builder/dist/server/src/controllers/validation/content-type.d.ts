 
import type { Schema, UID } from '@strapi/types';
export type CreateContentTypeInput = {
    contentType?: Partial<Schema.ContentType> & Partial<Schema.ContentTypeInfo>;
    components?: Array<Partial<Schema.Component> & Partial<Schema.Info> & {
        tmpUID?: UID.Component;
    }>;
    singularName: Schema.ContentTypeInfo['singularName'];
    attributes: Schema.Attributes & Record<string, any>;
    kind: Schema.ContentTypeKind;
    collectionName?: Schema.CollectionType['collectionName'];
    pluralName: Schema.ContentTypeInfo['pluralName'];
    displayName: Schema.ContentTypeInfo['displayName'];
    description: Schema.ContentTypeInfo['description'];
    options?: Schema.Options;
    draftAndPublish?: Schema.Options['draftAndPublish'];
    pluginOptions?: Schema.ContentType['pluginOptions'];
    config?: object;
};
/**
 * Validator for content type creation
 */
export declare const validateContentTypeInput: (data: CreateContentTypeInput) => Promise<any>;
/**
 * Validator for content type edition
 */
export declare const validateUpdateContentTypeInput: (data: CreateContentTypeInput) => Promise<any>;
export declare const validateKind: (body: unknown, errorMessage?: string | undefined) => Promise<any>;
//# sourceMappingURL=content-type.d.ts.map
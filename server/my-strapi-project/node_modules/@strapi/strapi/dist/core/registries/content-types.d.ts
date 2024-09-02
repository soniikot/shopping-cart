/// <reference types="lodash" />
import type { Common, Schema } from '@strapi/types';
import { ContentTypeDefinition } from '../domain/content-type';
type ContentTypesInput = Record<string, ContentTypeDefinition>;
type ContentTypeExtendFn = (contentType: Schema.ContentType) => Schema.ContentType;
declare const contentTypesRegistry: () => {
    /**
     * Returns this list of registered contentTypes uids
     */
    keys(): string[];
    /**
     * Returns the instance of a contentType. Instantiate the contentType if not already done
     */
    get(uid: Common.UID.ContentType): Schema.ContentType;
    /**
     * Returns a map with all the contentTypes in a namespace
     */
    getAll(namespace: string): import("lodash").Dictionary<unknown>;
    /**
     * Registers a contentType
     */
    set(uid: Common.UID.ContentType, contentType: Schema.ContentType): any;
    /**
     * Registers a map of contentTypes for a specific namespace
     */
    add(namespace: string, newContentTypes: ContentTypesInput): void;
    /**
     * Wraps a contentType to extend it
     */
    extend(ctUID: Common.UID.ContentType, extendFn: ContentTypeExtendFn): any;
};
export default contentTypesRegistry;
//# sourceMappingURL=content-types.d.ts.map
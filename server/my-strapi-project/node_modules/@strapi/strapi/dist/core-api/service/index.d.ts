import type { CoreApi, Schema } from '@strapi/types';
/**
 * Returns a core api for the provided model
 */
declare function createService<T extends Schema.SingleType | Schema.CollectionType>(opts: {
    contentType: T;
}): T extends Schema.SingleType ? CoreApi.Service.SingleType : CoreApi.Service.CollectionType;
export { createService };
//# sourceMappingURL=index.d.ts.map
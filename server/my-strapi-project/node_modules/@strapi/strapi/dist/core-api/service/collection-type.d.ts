import type { CoreApi, Schema } from '@strapi/types';
/**
 *
 * Returns a collection type service to handle default core-api actions
 */
declare const createCollectionTypeService: ({ contentType, }: {
    contentType: Schema.CollectionType;
}) => CoreApi.Service.CollectionType;
export default createCollectionTypeService;
//# sourceMappingURL=collection-type.d.ts.map
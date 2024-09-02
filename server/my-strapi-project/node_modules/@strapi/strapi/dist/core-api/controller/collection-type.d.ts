import type { CoreApi, Schema, Utils } from '@strapi/types';
interface Options {
    contentType: Schema.CollectionType;
}
/**
 *
 * Returns a collection type controller to handle default core-api actions
 */
declare const createCollectionTypeController: ({ contentType, }: Options) => Utils.PartialWithThis<CoreApi.Controller.CollectionType>;
export default createCollectionTypeController;
//# sourceMappingURL=collection-type.d.ts.map
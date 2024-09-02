import type { Schema, CoreApi, Utils } from '@strapi/types';
interface Options {
    contentType: Schema.SingleType;
}
/**
 * Returns a single type controller to handle default core-api actions
 */
declare const createSingleTypeController: ({ contentType, }: Options) => Utils.PartialWithThis<CoreApi.Controller.SingleType>;
export default createSingleTypeController;
//# sourceMappingURL=single-type.d.ts.map
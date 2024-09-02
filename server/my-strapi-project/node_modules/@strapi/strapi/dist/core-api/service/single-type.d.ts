import type { CoreApi, Schema } from '@strapi/types';
/**
 * Returns a single type service to handle default core-api actions
 */
declare const createSingleTypeService: ({ contentType, }: {
    contentType: Schema.SingleType;
}) => CoreApi.Service.SingleType;
export default createSingleTypeService;
//# sourceMappingURL=single-type.d.ts.map
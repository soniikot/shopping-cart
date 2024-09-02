import type { Common, Shared, EntityService } from '@strapi/types';
declare const applyTransforms: <TUID extends Common.UID.ContentType>(data: EntityService.Params.Data.Input<TUID>, context: {
    contentType: Shared.ContentTypes[TUID];
}) => EntityService.Params.Data.Input<TUID>;
export { applyTransforms };
//# sourceMappingURL=index.d.ts.map
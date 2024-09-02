import type { Common, EntityService } from '@strapi/types';
declare const pickSelectionParams: <TUID extends Common.UID.ContentType>(data: unknown) => {
    fields?: EntityService.Params.Fields.Any<TUID> | undefined;
} & {
    populate?: EntityService.Params.Populate.Any<TUID> | undefined;
};
export { pickSelectionParams };
//# sourceMappingURL=params.d.ts.map
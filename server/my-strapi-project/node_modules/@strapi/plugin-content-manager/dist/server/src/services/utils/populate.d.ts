import { Common, EntityService } from '@strapi/types';
export type Populate = EntityService.Params.Populate.Any<Common.UID.Schema>;
type PopulateOptions = {
    initialPopulate?: Populate;
    countMany?: boolean;
    countOne?: boolean;
    maxLevel?: number;
};
/**
 * Deeply populate a model based on UID
 * @param uid - Unique identifier of the model
 * @param options - Options to apply while populating
 * @param level - Current level of nested call
 */
declare const getDeepPopulate: (uid: Common.UID.Schema, { initialPopulate, countMany, countOne, maxLevel, }?: PopulateOptions, level?: number) => {};
/**
 * getDeepPopulateDraftCount works recursively on the attributes of a model
 * creating a populated object to count all the unpublished relations within the model
 * These relations can be direct to this content type or contained within components/dynamic zones
 * @param  uid of the model
 * @returns result
 * @returns result.populate
 * @returns result.hasRelations
 */
declare const getDeepPopulateDraftCount: (uid: Common.UID.Schema) => {
    populate: any;
    hasRelations: boolean;
};
/**
 *  Create a Strapi populate object which populates all attribute fields of a Strapi query.
 */
declare const getQueryPopulate: (uid: Common.UID.Schema, query: object) => Promise<Populate>;
/**
 * When config admin.webhooks.populateRelations is set to true,
 * populated relations will be passed to any webhook event.
 * The entity-manager response will not have the populated relations though.
 * For performance reasons, it is recommended to set it to false,
 *
 * See docs: https://docs.strapi.io/dev-docs/configurations/server
 *
 * TODO V5: Set to false by default.
 * TODO V5: Make webhooks always send the same entity data.
 */
declare const isWebhooksPopulateRelationsEnabled: () => boolean;
export { getDeepPopulate, getDeepPopulateDraftCount, getQueryPopulate, isWebhooksPopulateRelationsEnabled, };
//# sourceMappingURL=populate.d.ts.map
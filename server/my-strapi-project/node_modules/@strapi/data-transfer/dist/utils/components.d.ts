import type { Attribute, Common, Schema, EntityService, LoadedStrapi } from '@strapi/types';
type LoadedComponents<TUID extends Common.UID.Schema> = Attribute.GetValues<TUID, Attribute.GetKeysByType<TUID, 'component' | 'dynamiczone'>>;
type ComponentBody = {
    [key: string]: Attribute.GetValue<Attribute.Component<Common.UID.Component, false> | Attribute.Component<Common.UID.Component, true> | Attribute.DynamicZone>;
};
declare function omitComponentData(contentType: Schema.ContentType, data: EntityService.Params.Data.Input<Schema.ContentType['uid']>): Partial<EntityService.Params.Data.Input<Schema.ContentType['uid']>>;
declare function omitComponentData(contentType: Schema.Component, data: EntityService.Params.Data.Input<Schema.Component['uid']>): Partial<EntityService.Params.Data.Input<Schema.Component['uid']>>;
declare const createComponents: <TUID extends Common.UID.Schema, TData extends EntityService.Params.Data.Input<TUID>>(uid: TUID, data: TData) => Promise<ComponentBody>;
declare const getComponents: <TUID extends Common.UID.Schema>(uid: TUID, entity: {
    id: EntityService.Params.Attribute.ID;
}) => Promise<LoadedComponents<TUID>>;
declare const updateComponents: <TUID extends Common.UID.Schema, TData extends Partial<EntityService.Params.Data.Input<TUID>>>(uid: TUID, entityToUpdate: {
    id: EntityService.Params.Attribute.ID;
}, data: TData) => Promise<ComponentBody>;
declare const deleteComponents: <TUID extends Common.UID.Schema, TEntity extends Attribute.GetValues<TUID, Attribute.GetKeys<TUID>>>(uid: TUID, entityToDelete: TEntity, { loadComponents }?: {
    loadComponents?: boolean | undefined;
}) => Promise<void>;
declare const cloneComponents: <TUID extends Common.UID.Schema>(uid: TUID, entityToClone: {
    id: EntityService.Params.Attribute.ID;
}, data: EntityService.Params.Data.Input<TUID>) => Promise<ComponentBody>;
declare const deleteComponent: <TUID extends `${string}.${string}`>(uid: TUID, componentToDelete: Attribute.GetValues<TUID, Attribute.GetKeys<TUID>>) => Promise<void>;
/**
 * Resolve the component UID of an entity's attribute based
 * on a given path (components & dynamic zones only)
 */
declare const resolveComponentUID: ({ paths, strapi, data, contentType, }: {
    paths: string[];
    strapi: LoadedStrapi;
    data: any;
    contentType: Schema.ContentType;
}) => Common.UID.Schema | undefined;
export { omitComponentData, getComponents, createComponents, updateComponents, deleteComponents, deleteComponent, cloneComponents, resolveComponentUID, };
//# sourceMappingURL=components.d.ts.map
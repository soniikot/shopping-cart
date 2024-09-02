import type { LoadedStrapi as Strapi, Common, EntityService } from '@strapi/types';
export type Entity = EntityService.Result<Common.UID.ContentType>;
type Body = EntityService.Params.Data.Input<Common.UID.ContentType>;
type EntityManager = (opts: {
    strapi: Strapi;
}) => {
    mapEntity<T = unknown>(entity: T): T;
    mapEntitiesResponse(entities: any, uid: Common.UID.ContentType): any;
    find(opts: Parameters<typeof strapi.entityService.findMany>[1], uid: Common.UID.ContentType): Promise<ReturnType<typeof strapi.entityService.findMany>>;
    findPage(opts: Parameters<typeof strapi.entityService.findPage>[1], uid: Common.UID.ContentType): Promise<ReturnType<typeof strapi.entityService.findPage>>;
    findOne(id: Entity['id'], uid: Common.UID.ContentType, opts?: any): Promise<Entity>;
    create(body: Body, uid: Common.UID.ContentType): Promise<Entity>;
    update(entity: Entity, body: Partial<Body>, uid: Common.UID.ContentType): Promise<Entity | null>;
    clone(entity: Entity, body: Partial<Body>, uid: Common.UID.ContentType): Promise<Entity | null>;
    delete(entity: Entity, uid: Common.UID.ContentType): Promise<Entity | null>;
    deleteMany(opts: Parameters<typeof strapi.entityService.deleteMany>[1], uid: Common.UID.ContentType): Promise<{
        count: number;
    } | null>;
    publish(entity: Entity, uid: Common.UID.ContentType, body?: any): Promise<Entity | null>;
    publishMany(entities: Entity[], uid: Common.UID.ContentType): Promise<{
        count: number;
    } | null>;
    unpublish(entity: Entity, uid: Common.UID.ContentType, body?: any): Promise<Entity | null>;
    unpublishMany(entities: Entity[], uid: Common.UID.ContentType): Promise<{
        count: number;
    } | null>;
    countDraftRelations(id: Entity['id'], uid: Common.UID.ContentType): Promise<number>;
    countManyEntriesDraftRelations(ids: number[], uid: Common.UID.ContentType, locale?: string): Promise<number>;
};
declare const entityManager: EntityManager;
export default entityManager;
export type { EntityManager };
//# sourceMappingURL=entity-manager.d.ts.map
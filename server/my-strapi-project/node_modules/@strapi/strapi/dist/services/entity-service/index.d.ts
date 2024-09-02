import type { Database } from '@strapi/database';
import type { Strapi, EntityService, EntityValidator, EventHub } from '@strapi/types';
type Decoratable<T> = T & {
    decorate(decorator: (old: EntityService.EntityService) => EntityService.EntityService & {
        [key: string]: unknown;
    }): void;
};
declare const _default: (ctx: {
    strapi: Strapi;
    db: Database;
    eventHub: EventHub;
    entityValidator: EntityValidator;
}) => Decoratable<EntityService.EntityService>;
export default _default;
//# sourceMappingURL=index.d.ts.map
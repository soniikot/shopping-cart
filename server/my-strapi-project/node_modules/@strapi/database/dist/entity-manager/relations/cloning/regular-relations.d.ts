import { Knex } from 'knex';
import type { ID, Relation } from '../../../types';
declare const replaceRegularRelations: ({ targetId, sourceId, attribute, omitIds, transaction: trx, }: {
    targetId: ID;
    sourceId: ID;
    attribute: Relation.Bidirectional;
    omitIds: ID[];
    transaction?: Knex.Transaction<any, any[]> | undefined;
}) => Promise<void>;
declare const cloneRegularRelations: ({ targetId, sourceId, attribute, transaction: trx, }: {
    targetId: ID;
    sourceId: ID;
    attribute: Relation.Bidirectional;
    transaction?: Knex.Transaction<any, any[]> | undefined;
}) => Promise<void>;
export { replaceRegularRelations, cloneRegularRelations };
//# sourceMappingURL=regular-relations.d.ts.map
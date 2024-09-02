import type { Knex } from 'knex';
import type { Database } from '..';
import type { ID, Relation } from '../types';
declare module 'knex' {
    namespace Knex {
        interface ChainableInterface {
            transacting(trx?: Knex.Transaction): this;
        }
    }
}
/**
 * If some relations currently exist for this oneToX relation, on the one side, this function removes them and update the inverse order if needed.
 */
declare const deletePreviousOneToAnyRelations: ({ id, attribute, relIdsToadd, db, transaction: trx, }: {
    id: ID;
    attribute: Relation.Bidirectional;
    relIdsToadd: ID[];
    db: Database;
    transaction?: Knex.Transaction<any, any[]> | undefined;
}) => Promise<void>;
/**
 * If a relation currently exists for this xToOne relations, this function removes it and update the inverse order if needed.
 */
declare const deletePreviousAnyToOneRelations: ({ id, attribute, relIdToadd, db, transaction: trx, }: {
    id: ID;
    attribute: Relation.Bidirectional;
    relIdToadd: ID;
    db: Database;
    transaction?: Knex.Transaction<any, any[]> | undefined;
}) => Promise<void>;
/**
 * Delete all or some relations of entity field
 */
declare const deleteRelations: ({ id, attribute, db, relIdsToNotDelete, relIdsToDelete, transaction: trx, }: {
    id: ID;
    attribute: Relation.Bidirectional;
    db: Database;
    relIdsToNotDelete?: ID[] | undefined;
    relIdsToDelete?: ID[] | "all" | undefined;
    transaction?: Knex.Transaction<any, any[]> | undefined;
}) => Promise<void>;
/**
 * Clean the order columns by ensuring the order value are continuous (ex: 1, 2, 3 and not 1, 5, 10)
 */
declare const cleanOrderColumns: ({ id, attribute, db, inverseRelIds, transaction: trx, }: {
    id?: ID | undefined;
    attribute: Relation.Bidirectional;
    db: Database;
    inverseRelIds?: ID[] | undefined;
    transaction?: Knex.Transaction<any, any[]> | undefined;
}) => Promise<[void, void] | undefined>;
/**
 * Use this when a relation is added or removed and its inverse order column
 * needs to be re-calculated
 *
 * Example: In this following table
 *
 *   | joinColumn      | inverseJoinColumn | order       | inverseOrder       |
 *   | --------------- | --------          | ----------- | ------------------ |
 *   | 1               | 1                 | 1           | 1                  |
 *   | 2               | 1                 | 3           | 2                  |
 *   | 2               | 2                 | 3           | 1                  |
 *
 * You add a new relation { joinColumn: 1, inverseJoinColumn: 2 }
 *
 *   | joinColumn      | inverseJoinColumn | order       | inverseOrder       |
 *   | --------------- | --------          | ----------- | ------------------ |
 *   | 1               | 1                 | 1           | 1                  |
 *   | 1               | 2                 | 2           | 1                  | <- inverseOrder should be 2
 *   | 2               | 1                 | 3           | 2                  |
 *   | 2               | 2                 | 3           | 1                  |
 *
 * This function would make such update, so all inverse order columns related
 * to the given id (1 in this example) are following a 1, 2, 3 sequence, without gap.
 *
 */
declare const cleanInverseOrderColumn: ({ id, attribute, trx, }: {
    id: ID;
    attribute: Relation.Bidirectional;
    trx: Knex.Transaction;
}) => Promise<void>;
export { deletePreviousOneToAnyRelations, deletePreviousAnyToOneRelations, deleteRelations, cleanOrderColumns, cleanInverseOrderColumn, };
//# sourceMappingURL=regular-relations.d.ts.map
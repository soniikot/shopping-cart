import type { Knex } from 'knex';
import type { Database } from '..';
import type { MorphJoinTable } from '../types';
type Rows = Record<string, unknown>[];
export declare const deleteRelatedMorphOneRelationsAfterMorphToManyUpdate: (rows: Rows, { uid, attributeName, joinTable, db, transaction: trx, }: {
    uid: string;
    attributeName: string;
    joinTable: MorphJoinTable;
    db: Database;
    transaction?: Knex.Transaction<any, any[]> | undefined;
}) => Promise<void>;
export {};
//# sourceMappingURL=morph-relations.d.ts.map
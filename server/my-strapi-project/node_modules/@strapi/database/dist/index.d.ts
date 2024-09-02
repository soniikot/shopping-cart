import type { Knex } from 'knex';
import { Dialect } from './dialects';
import { SchemaProvider } from './schema';
import { Metadata } from './metadata';
import { EntityManager } from './entity-manager';
import { MigrationProvider } from './migrations';
import { LifecycleProvider } from './lifecycles';
import * as errors from './errors';
import { Callback, TransactionObject } from './transaction-context';
import { Model } from './types';
export { isKnexQuery } from './utils/knex';
interface Settings {
    forceMigration?: boolean;
    runMigrations?: boolean;
    [key: string]: unknown;
}
export interface DatabaseConfig {
    connection: Knex.Config;
    settings: Settings;
    models: Model[];
}
declare class Database {
    connection: Knex;
    dialect: Dialect;
    config: DatabaseConfig;
    metadata: Metadata;
    schema: SchemaProvider;
    migrations: MigrationProvider;
    lifecycles: LifecycleProvider;
    entityManager: EntityManager;
    static transformContentTypes: (contentTypes: import("./utils/content-types").ContentType[]) => Model[];
    static init(config: DatabaseConfig): Promise<Database>;
    constructor(config: DatabaseConfig);
    query(uid: string): import("./entity-manager").Repository;
    inTransaction(): boolean;
    transaction(): Promise<TransactionObject>;
    transaction<TCallback extends Callback>(c: TCallback): Promise<ReturnType<TCallback>>;
    getSchemaName(): string | undefined;
    getConnection(): Knex;
    getConnection(tableName?: string): Knex.QueryBuilder;
    getSchemaConnection(trx?: Knex<any, any[]>): Knex.SchemaBuilder;
    queryBuilder(uid: string): import("./query/query-builder").QueryBuilder;
    destroy(): Promise<void>;
}
export { Database, errors };
//# sourceMappingURL=index.d.ts.map
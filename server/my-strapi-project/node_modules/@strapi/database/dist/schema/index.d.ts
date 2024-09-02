import createSchemaBuilder from './builder';
import createSchemaDiff from './diff';
import createSchemaStorage from './storage';
import type { Database } from '..';
export type * from './types';
export interface SchemaProvider {
    builder: ReturnType<typeof createSchemaBuilder>;
    schemaDiff: ReturnType<typeof createSchemaDiff>;
    schemaStorage: ReturnType<typeof createSchemaStorage>;
    sync(): Promise<void>;
    syncSchema(): Promise<void>;
    reset(): Promise<void>;
    create(): Promise<void>;
    drop(): Promise<void>;
}
/**
 * @type {import('.').default}
 */
export declare const createSchemaProvider: (db: Database) => SchemaProvider;
//# sourceMappingURL=index.d.ts.map
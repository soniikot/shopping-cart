/// <reference types="node" />
import type { Database } from '../..';
import Dialect from '../dialect';
import PostgresqlSchemaInspector from './schema-inspector';
export default class PostgresDialect extends Dialect {
    schemaInspector: PostgresqlSchemaInspector;
    constructor(db: Database);
    useReturning(): boolean;
    initialize(): Promise<void>;
    usesForeignKeys(): boolean;
    getSqlType(type: string): string;
    transformErrors(error: NodeJS.ErrnoException): void;
}
//# sourceMappingURL=index.d.ts.map
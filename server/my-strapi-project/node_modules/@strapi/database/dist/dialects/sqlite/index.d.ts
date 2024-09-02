/// <reference types="node" />
import Dialect from '../dialect';
import SqliteSchemaInspector from './schema-inspector';
import type { Database } from '../..';
export default class SqliteDialect extends Dialect {
    schemaInspector: SqliteSchemaInspector;
    constructor(db: Database);
    configure(): void;
    useReturning(): boolean;
    initialize(): Promise<void>;
    canAlterConstraints(): boolean;
    getSqlType(type: string): string;
    supportsOperator(operator: string): boolean;
    startSchemaUpdate(): Promise<void>;
    endSchemaUpdate(): Promise<void>;
    transformErrors(error: NodeJS.ErrnoException): void;
    canAddIncrements(): boolean;
}
//# sourceMappingURL=index.d.ts.map
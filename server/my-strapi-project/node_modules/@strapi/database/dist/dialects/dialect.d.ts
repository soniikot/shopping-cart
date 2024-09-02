import type { Database } from '..';
import type { Schema } from '../schema';
export interface SchemaInspector {
    getSchema(): Promise<Schema>;
}
export default class Dialect {
    db: Database;
    schemaInspector: SchemaInspector;
    client: string;
    constructor(db: Database, client: string);
    configure(): void;
    initialize(): void;
    getSqlType(type: unknown): unknown;
    canAlterConstraints(): boolean;
    usesForeignKeys(): boolean;
    useReturning(): boolean;
    supportsUnsigned(): boolean;
    supportsWindowFunctions(): boolean;
    supportsOperator(operator?: string): boolean;
    startSchemaUpdate(): Promise<void>;
    endSchemaUpdate(): Promise<void>;
    transformErrors(error: Error | {
        message: string;
    }): void;
    canAddIncrements(): boolean;
}
//# sourceMappingURL=dialect.d.ts.map
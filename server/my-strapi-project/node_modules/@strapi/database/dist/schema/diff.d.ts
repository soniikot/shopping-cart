import type { Schema, SchemaDiff } from './types';
import type { Database } from '..';
declare const _default: (db: Database) => {
    diff: (srcSchema: Schema, destSchema: Schema) => Promise<SchemaDiff>;
};
export default _default;
//# sourceMappingURL=diff.d.ts.map
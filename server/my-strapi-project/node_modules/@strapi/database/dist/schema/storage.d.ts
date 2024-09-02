import type { Database } from '..';
import type { Schema } from './types';
declare const _default: (db: Database) => {
    read(): Promise<any>;
    hashSchema(schema: Schema): string;
    add(schema: Schema): Promise<void>;
    clear(): Promise<void>;
};
export default _default;
//# sourceMappingURL=storage.d.ts.map
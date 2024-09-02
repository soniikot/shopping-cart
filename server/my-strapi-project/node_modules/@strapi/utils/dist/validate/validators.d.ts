/// <reference types="lodash" />
import type { Model, Data } from '../types';
declare const throwPasswords: (schema: Model) => (entity: Data) => Promise<Data>;
declare const defaultValidateFilters: import("lodash").CurriedFunction2<Model, unknown, Promise<unknown>>;
declare const defaultValidateSort: import("lodash").CurriedFunction2<Model, unknown, Promise<unknown>>;
declare const defaultValidateFields: import("lodash").CurriedFunction2<Model, unknown, Promise<unknown>>;
export { throwPasswords, defaultValidateFilters, defaultValidateSort, defaultValidateFields };
//# sourceMappingURL=validators.d.ts.map
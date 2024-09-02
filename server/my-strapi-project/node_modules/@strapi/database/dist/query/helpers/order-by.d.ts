import type { Ctx } from '../types';
type OrderByCtx = Ctx & {
    alias?: string;
};
type OrderBy = string | {
    [key: string]: 'asc' | 'desc';
} | OrderBy[];
type OrderByValue = {
    column: unknown;
    order?: 'asc' | 'desc';
};
export declare const processOrderBy: (orderBy: OrderBy, ctx: OrderByCtx) => OrderByValue[];
export {};
//# sourceMappingURL=order-by.d.ts.map
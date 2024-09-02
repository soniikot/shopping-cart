import koaFavicon from 'koa-favicon';
import type { Common } from '@strapi/types';
export type Config = NonNullable<Parameters<typeof koaFavicon>[1]>;
export declare const favicon: Common.MiddlewareFactory<Config>;
//# sourceMappingURL=favicon.d.ts.map
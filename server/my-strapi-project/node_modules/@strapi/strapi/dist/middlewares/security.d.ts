import { KoaHelmet } from 'koa-helmet';
import type { Common } from '@strapi/types';
export type Config = NonNullable<Parameters<KoaHelmet>[0]>;
export declare const security: Common.MiddlewareFactory<Config>;
//# sourceMappingURL=security.d.ts.map
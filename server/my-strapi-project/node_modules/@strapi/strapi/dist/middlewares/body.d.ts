import body from 'koa-body';
import type { Common } from '@strapi/types';
export type Config = body.IKoaBodyOptions;
declare const bodyMiddleware: Common.MiddlewareFactory<Config>;
export { bodyMiddleware as body };
//# sourceMappingURL=body.d.ts.map
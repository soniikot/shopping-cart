import type { Common } from '@strapi/types';
import type { Sender } from './sender';
declare const createMiddleware: ({ sendEvent }: {
    sendEvent: Sender;
}) => Common.MiddlewareHandler;
export default createMiddleware;
//# sourceMappingURL=middleware.d.ts.map
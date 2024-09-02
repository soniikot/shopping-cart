import type { Common } from '@strapi/types';
import type { ParameterizedContext } from 'koa';
interface AuthenticationResponse {
    authenticated?: boolean;
    credentials?: unknown;
    ability?: unknown;
    error?: Error | null;
}
interface AuthenticationInfo {
    strategy: Strategy;
    credentials: unknown;
    ability: unknown;
}
interface Strategy {
    name: string;
    authenticate: (ctx: ParameterizedContext) => Promise<AuthenticationResponse>;
    verify?: (auth: AuthenticationInfo, config: Common.RouteConfig['auth']) => Promise<any>;
}
interface Authentication {
    register: (type: string, strategy: Strategy) => Authentication;
    authenticate: Common.MiddlewareHandler;
    verify: (auth: AuthenticationInfo, config?: Common.RouteConfig['auth']) => Promise<any>;
}
declare const createAuthentication: () => Authentication;
export default createAuthentication;
//# sourceMappingURL=index.d.ts.map
import type { Context, Next } from 'koa';
export interface ControllerHandler<TResponse = unknown> {
    (context: Context, next: Next): Promise<TResponse | void> | TResponse | void;
}
export type Controller = Record<string, ControllerHandler>;
//# sourceMappingURL=controller.d.ts.map
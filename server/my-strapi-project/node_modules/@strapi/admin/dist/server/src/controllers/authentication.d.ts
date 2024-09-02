import type { Context } from 'koa';
import '@strapi/types';
declare const _default: {
    login: import("koa").Middleware<import("koa").DefaultState, Context, any>;
    renewToken(ctx: Context): Promise<void>;
    registrationInfo(ctx: Context): Promise<void>;
    register(ctx: Context): Promise<void>;
    registerAdmin(ctx: Context): Promise<void>;
    forgotPassword(ctx: Context): Promise<void>;
    resetPassword(ctx: Context): Promise<void>;
    logout(ctx: Context): void;
};
export default _default;
//# sourceMappingURL=authentication.d.ts.map
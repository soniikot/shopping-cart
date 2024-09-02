/// <reference types="formidable" />
import type Koa from 'koa';
export declare const parseMultipartData: (ctx: Koa.Context) => Koa.Context | {
    data: any;
    files: import("formidable").Files;
};
//# sourceMappingURL=parse-multipart.d.ts.map
/// <reference types="formidable" />
import type Koa from 'koa';
import type { Schema } from '@strapi/types';
type TransformedEntry = {
    id: string;
    attributes: Record<string, unknown>;
    meta?: Record<string, unknown>;
};
declare const parseBody: (ctx: Koa.Context) => Koa.Context | {
    data: any;
    files: import("formidable").Files;
} | {
    data: any;
};
declare const transformResponse: (resource: any, meta?: unknown, opts?: {
    contentType?: Schema.ContentType | Schema.Component;
}) => {
    data: TransformedEntry | TransformedEntry[] | null;
    meta: unknown;
} | null | undefined;
export { parseBody, transformResponse };
//# sourceMappingURL=transform.d.ts.map
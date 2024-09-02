import type { Schema } from '@strapi/types';
export type ContentTypeDefinition = {
    schema: Schema.ContentType;
    actions: Record<string, unknown>;
    lifecycles: Record<string, unknown>;
};
declare const createContentType: (uid: string, definition: ContentTypeDefinition) => Schema.ContentType;
export { createContentType };
//# sourceMappingURL=index.d.ts.map
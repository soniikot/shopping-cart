import type { CoreApi, Schema } from '@strapi/types';
declare function createController<T extends Schema.SingleType | Schema.CollectionType>(opts: {
    contentType: T;
}): T extends Schema.SingleType ? CoreApi.Controller.SingleType : CoreApi.Controller.CollectionType;
export { createController };
//# sourceMappingURL=index.d.ts.map
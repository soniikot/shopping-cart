import type { Strapi, CustomFields } from '@strapi/types';
declare const customFieldsRegistry: (strapi: Strapi) => {
    getAll(): Record<string, unknown>;
    get(customField: string): {};
    add(customField: CustomFields.CustomFieldServerOptions | CustomFields.CustomFieldServerOptions[]): void;
};
export default customFieldsRegistry;
//# sourceMappingURL=custom-fields.d.ts.map
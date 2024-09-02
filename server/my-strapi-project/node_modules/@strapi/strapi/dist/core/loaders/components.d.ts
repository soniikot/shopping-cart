import type { Strapi, Common, Schema } from '@strapi/types';
type ComponentMap = {
    [uid in Common.UID.Component]: Schema.Component;
};
export default function loadComponents(strapi: Strapi): Promise<ComponentMap>;
export {};
//# sourceMappingURL=components.d.ts.map
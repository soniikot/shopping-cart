import { LoadedStrapi as Strapi, Schema } from '@strapi/types';
declare const _default: ({ strapi }: {
    strapi: Strapi;
}) => {
    canConfigureContentType({ userAbility, contentType, }: {
        userAbility: any;
        contentType: Schema.ContentType;
    }): any;
    registerPermissions(): Promise<void>;
};
export default _default;
//# sourceMappingURL=permission.d.ts.map
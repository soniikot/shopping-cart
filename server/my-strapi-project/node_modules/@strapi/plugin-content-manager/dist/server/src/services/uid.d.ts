import { LoadedStrapi as Strapi, UID } from '@strapi/types';
declare const _default: ({ strapi }: {
    strapi: Strapi;
}) => {
    generateUIDField({ contentTypeUID, field, data, }: {
        contentTypeUID: UID.ContentType;
        field: string;
        data: Record<string, any>;
    }): Promise<string>;
    findUniqueUID({ contentTypeUID, field, value, }: {
        contentTypeUID: UID.ContentType;
        field: string;
        value: string;
    }): Promise<string>;
    checkUIDAvailability({ contentTypeUID, field, value, }: {
        contentTypeUID: UID.ContentType;
        field: string;
        value: string;
    }): Promise<boolean>;
};
export default _default;
//# sourceMappingURL=uid.d.ts.map
import { LoadedStrapi as Strapi, UID, Schema } from '@strapi/types';
import type { ConfigurationUpdate } from './configuration';
declare const service: ({ strapi }: {
    strapi: Strapi;
}) => {
    findAllContentTypes(): unknown[];
    findContentType(uid: UID.ContentType): any;
    findDisplayedContentTypes(): unknown[];
    findContentTypesByKind(kind: {
        kind: Schema.ContentTypeKind | undefined;
    }): unknown[];
    findConfiguration(contentType: Schema.ContentType): Promise<any>;
    updateConfiguration(contentType: Schema.ContentType, newConfiguration: ConfigurationUpdate): Promise<any>;
    findComponentsConfigurations(contentType: Schema.ContentType): any;
    syncConfigurations(): Promise<void>;
};
export default service;
//# sourceMappingURL=content-types.d.ts.map
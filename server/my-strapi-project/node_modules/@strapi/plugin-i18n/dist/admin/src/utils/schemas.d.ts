import type { Schema } from '@strapi/strapi';
declare const mutateCTBContentTypeSchema: (nextSchema: Schema.ContentType, prevSchema?: {
    apiID?: string;
    schema?: Schema.ContentType;
    uid?: string;
}) => Schema.ContentType | {
    pluginOptions: Pick<{
        i18n: {
            localized: boolean;
        };
    }, never>;
    attributes: Record<string, OmitByPath<import("@strapi/types/dist/types/core/attributes").Any, ["pluginOptions", "i18n"]>>;
    modelType: "contentType";
    uid: import("@strapi/types/dist/types/core/common/uid").ContentType;
    kind: Schema.ContentTypeKind;
    info: Schema.ContentTypeInfo;
    modelName: string;
    globalId: string;
    options?: Schema.Options | undefined;
    collectionName?: string | undefined;
};
type OmitByPath<T extends object, K extends string[]> = Pick<T, Exclude<keyof T, K[number]>>;
export { mutateCTBContentTypeSchema };

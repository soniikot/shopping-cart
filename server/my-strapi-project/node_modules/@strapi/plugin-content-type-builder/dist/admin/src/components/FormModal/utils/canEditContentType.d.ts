import type { AttributeType } from '../../../types';
import type { Schema, UID } from '@strapi/types';
export type EditableContentTypeSchema = {
    kind: Schema.ContentTypeKind;
    name: string;
    attributes: AttributeType[];
};
export type EditableContentTypeData = {
    contentType: {
        uid: UID.Any;
        schema: EditableContentTypeSchema;
    };
};
type ModifiedData = {
    kind: Schema.ContentTypeKind;
};
export declare const canEditContentType: (data: Record<string, any>, modifiedData: ModifiedData) => boolean;
export {};

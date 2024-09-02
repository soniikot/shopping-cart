import type { Components, ContentType, ContentTypes } from '../../../../types';
type DataType = {
    initialComponents: Components;
    rawData: {
        components: Components;
        contentTypesToSort: ContentTypes;
        contentTypeToCreate: ContentType;
        contentTypeToEdit: ContentType;
    };
};
export declare const data: DataType;
export {};

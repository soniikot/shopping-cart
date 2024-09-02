import { LoadedStrapi as Strapi, CustomFields } from '@strapi/types';
type FieldSize = CustomFields.CustomFieldServerOptions['inputSize'];
declare const createFieldSizesService: ({ strapi }: {
    strapi: Strapi;
}) => {
    getAllFieldSizes(): Record<string, {
        default: 4 | 8 | 6 | 12;
        isResizable: boolean;
    } | undefined>;
    hasFieldSize(type: string): boolean;
    getFieldSize(type?: string): {
        default: 4 | 8 | 6 | 12;
        isResizable: boolean;
    };
    setFieldSize(type: string, size: FieldSize): void;
    setCustomFieldInputSizes(): void;
};
export default createFieldSizesService;
//# sourceMappingURL=field-sizes.d.ts.map
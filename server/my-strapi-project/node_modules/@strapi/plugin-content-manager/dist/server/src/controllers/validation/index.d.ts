import createModelConfigurationSchema from './model-configuration';
declare const validateUIDField: (contentTypeUID: any, field: any) => void;
declare const validatePagination: ({ page, pageSize }: any) => void;
declare const validateKind: (body: unknown, errorMessage?: string | undefined) => Promise<any>;
declare const validateBulkActionInput: (body: unknown, errorMessage?: string | undefined) => Promise<any>;
declare const validateGenerateUIDInput: (body: unknown, errorMessage?: string | undefined) => Promise<any>;
declare const validateCheckUIDAvailabilityInput: (body: unknown, errorMessage?: string | undefined) => Promise<any>;
export { createModelConfigurationSchema, validateUIDField, validatePagination, validateKind, validateBulkActionInput, validateGenerateUIDInput, validateCheckUIDAvailabilityInput, };
//# sourceMappingURL=index.d.ts.map
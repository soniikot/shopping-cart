import * as yup from 'yup';
declare const handleYupError: (error: yup.ValidationError, errorMessage?: string) => never;
declare const validateYupSchema: (schema: yup.AnySchema, options?: {}) => (body: unknown, errorMessage?: string) => Promise<any>;
declare const validateYupSchemaSync: (schema: yup.AnySchema, options?: {}) => (body: unknown, errorMessage?: string) => any;
export { handleYupError, validateYupSchema, validateYupSchemaSync };
//# sourceMappingURL=validators.d.ts.map
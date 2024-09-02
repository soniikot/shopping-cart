import type { Attribute, Schema } from '@strapi/types';
import { modelTypes } from '../../services/constants';
export type GetTypeValidatorOptions = {
    types: ReadonlyArray<string>;
    attributes?: Schema.Attributes;
    modelType?: (typeof modelTypes)[keyof typeof modelTypes];
};
export declare const getTypeValidator: (attribute: Attribute.Any, { types, modelType, attributes }: GetTypeValidatorOptions) => import("yup/lib/object").OptionalObjectSchema<any, Record<string, any>, import("yup/lib/object").TypeOfShape<any>>;
//# sourceMappingURL=types.d.ts.map
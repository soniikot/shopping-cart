import { yup } from '@strapi/utils';
import type { Attribute } from '@strapi/types';
export declare const VALID_RELATIONS: string[];
export declare const VALID_TYPES: string[];
export declare const componentSchema: any;
export declare const nestedComponentSchema: yup.ArraySchema<any, import("yup/lib/types").AnyObject, any[] | undefined, any[] | undefined>;
export declare const componentInputSchema: import("yup/lib/object").OptionalObjectSchema<{
    component: any;
    components: yup.ArraySchema<any, import("yup/lib/types").AnyObject, any[] | undefined, any[] | undefined>;
}, Record<string, any>, import("yup/lib/object").TypeOfShape<{
    component: any;
    components: yup.ArraySchema<any, import("yup/lib/types").AnyObject, any[] | undefined, any[] | undefined>;
}>>;
export declare const validateComponentInput: (body: unknown, errorMessage?: string | undefined) => Promise<any>;
export declare const validateUpdateComponentInput: (data: {
    component?: Attribute.Component;
    components?: Attribute.Component[];
}) => Promise<any>;
//# sourceMappingURL=component.d.ts.map
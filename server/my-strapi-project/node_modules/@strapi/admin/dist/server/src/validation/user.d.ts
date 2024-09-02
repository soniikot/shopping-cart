import { yup } from '@strapi/utils';
export declare const validateUserCreationInput: (body: unknown, errorMessage?: string | undefined) => Promise<any>;
export declare const validateProfileUpdateInput: (body: unknown, errorMessage?: string | undefined) => Promise<any>;
export declare const validateUserUpdateInput: (body: unknown, errorMessage?: string | undefined) => Promise<any>;
export declare const validateUsersDeleteInput: (body: unknown, errorMessage?: string | undefined) => Promise<any>;
export declare const schemas: {
    userCreationSchema: import("yup").ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        email: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        firstname: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        lastname: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        roles: import("yup/lib/array").OptionalArraySchema<yup.StrapiIDSchema, import("yup/lib/types").AnyObject, any[] | undefined>;
        preferedLanguage: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
    }>, Record<string, any>, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        email: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        firstname: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        lastname: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        roles: import("yup/lib/array").OptionalArraySchema<yup.StrapiIDSchema, import("yup/lib/types").AnyObject, any[] | undefined>;
        preferedLanguage: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        email: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        firstname: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        lastname: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        roles: import("yup/lib/array").OptionalArraySchema<yup.StrapiIDSchema, import("yup/lib/types").AnyObject, any[] | undefined>;
        preferedLanguage: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
    }>>>;
    usersDeleteSchema: import("yup").ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        ids: import("yup/lib/array").RequiredArraySchema<yup.StrapiIDSchema, import("yup/lib/types").AnyObject, any[] | undefined>;
    }>, Record<string, any>, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        ids: import("yup/lib/array").RequiredArraySchema<yup.StrapiIDSchema, import("yup/lib/types").AnyObject, any[] | undefined>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        ids: import("yup/lib/array").RequiredArraySchema<yup.StrapiIDSchema, import("yup/lib/types").AnyObject, any[] | undefined>;
    }>>>;
    userUpdateSchema: import("yup").ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        email: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        firstname: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        lastname: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        username: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        password: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        isActive: yup.BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
        roles: import("yup/lib/array").OptionalArraySchema<yup.StrapiIDSchema, import("yup/lib/types").AnyObject, any[] | undefined>;
    }>, Record<string, any>, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        email: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        firstname: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        lastname: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        username: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        password: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        isActive: yup.BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
        roles: import("yup/lib/array").OptionalArraySchema<yup.StrapiIDSchema, import("yup/lib/types").AnyObject, any[] | undefined>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        email: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        firstname: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        lastname: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        username: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        password: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        isActive: yup.BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
        roles: import("yup/lib/array").OptionalArraySchema<yup.StrapiIDSchema, import("yup/lib/types").AnyObject, any[] | undefined>;
    }>>>;
};
declare const _default: {
    validateUserCreationInput: (body: unknown, errorMessage?: string | undefined) => Promise<any>;
    validateProfileUpdateInput: (body: unknown, errorMessage?: string | undefined) => Promise<any>;
    validateUserUpdateInput: (body: unknown, errorMessage?: string | undefined) => Promise<any>;
    validateUsersDeleteInput: (body: unknown, errorMessage?: string | undefined) => Promise<any>;
    schemas: {
        userCreationSchema: import("yup").ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            email: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
            firstname: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
            lastname: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
            roles: import("yup/lib/array").OptionalArraySchema<yup.StrapiIDSchema, import("yup/lib/types").AnyObject, any[] | undefined>;
            preferedLanguage: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        }>, Record<string, any>, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            email: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
            firstname: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
            lastname: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
            roles: import("yup/lib/array").OptionalArraySchema<yup.StrapiIDSchema, import("yup/lib/types").AnyObject, any[] | undefined>;
            preferedLanguage: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            email: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
            firstname: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
            lastname: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
            roles: import("yup/lib/array").OptionalArraySchema<yup.StrapiIDSchema, import("yup/lib/types").AnyObject, any[] | undefined>;
            preferedLanguage: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        }>>>;
        usersDeleteSchema: import("yup").ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            ids: import("yup/lib/array").RequiredArraySchema<yup.StrapiIDSchema, import("yup/lib/types").AnyObject, any[] | undefined>;
        }>, Record<string, any>, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            ids: import("yup/lib/array").RequiredArraySchema<yup.StrapiIDSchema, import("yup/lib/types").AnyObject, any[] | undefined>;
        }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            ids: import("yup/lib/array").RequiredArraySchema<yup.StrapiIDSchema, import("yup/lib/types").AnyObject, any[] | undefined>;
        }>>>;
        userUpdateSchema: import("yup").ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            email: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
            firstname: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
            lastname: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
            username: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
            password: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
            isActive: yup.BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
            roles: import("yup/lib/array").OptionalArraySchema<yup.StrapiIDSchema, import("yup/lib/types").AnyObject, any[] | undefined>;
        }>, Record<string, any>, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            email: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
            firstname: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
            lastname: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
            username: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
            password: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
            isActive: yup.BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
            roles: import("yup/lib/array").OptionalArraySchema<yup.StrapiIDSchema, import("yup/lib/types").AnyObject, any[] | undefined>;
        }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            email: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
            firstname: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
            lastname: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
            username: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
            password: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
            isActive: yup.BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
            roles: import("yup/lib/array").OptionalArraySchema<yup.StrapiIDSchema, import("yup/lib/types").AnyObject, any[] | undefined>;
        }>>>;
    };
};
export default _default;
//# sourceMappingURL=user.d.ts.map
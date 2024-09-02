import * as yup from 'yup';
/**
 * @description This needs wrapping in `yup.object().shape()` before use.
 */
declare const COMMON_USER_SCHEMA: {
    firstname: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
    lastname: yup.default<string | undefined, Record<string, any>, string | undefined>;
    email: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
    username: yup.default<string | null | undefined, Record<string, any>, string | null | undefined>;
    password: yup.default<string | undefined, Record<string, any>, string | undefined>;
    confirmPassword: yup.default<string | undefined, Record<string, any>, string | undefined>;
};
export { COMMON_USER_SCHEMA };

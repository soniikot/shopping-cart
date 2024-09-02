import strapiUtils from '@strapi/utils';
import type { Attribute, Schema } from '@strapi/types';
interface ValidatorMetas<TAttribute extends Attribute.Any> {
    attr: TAttribute;
    model: Schema.ContentType;
    updatedAttribute: {
        name: string;
        value: unknown;
    };
    entity: Record<string, unknown> | null;
}
interface ValidatorOptions {
    isDraft: boolean;
}
declare const _default: {
    string: (metas: ValidatorMetas<Attribute.Email | Attribute.Password | Attribute.RichText | (Attribute.OfType<"string"> & Attribute.StringProperties & Attribute.ConfigurableOption & Attribute.DefaultOption<string> & Attribute.MinMaxLengthOption & Attribute.PrivateOption & Attribute.UniqueOption & Attribute.RequiredOption & Attribute.WritableOption & Attribute.VisibleOption) | Attribute.Text | Attribute.UID<never, string, Attribute.UIDOptions>>, options: ValidatorOptions) => import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    text: (metas: ValidatorMetas<Attribute.Email | Attribute.Password | Attribute.RichText | (Attribute.OfType<"string"> & Attribute.StringProperties & Attribute.ConfigurableOption & Attribute.DefaultOption<string> & Attribute.MinMaxLengthOption & Attribute.PrivateOption & Attribute.UniqueOption & Attribute.RequiredOption & Attribute.WritableOption & Attribute.VisibleOption) | Attribute.Text | Attribute.UID<never, string, Attribute.UIDOptions>>, options: ValidatorOptions) => import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    richtext: (metas: ValidatorMetas<Attribute.Email | Attribute.Password | Attribute.RichText | (Attribute.OfType<"string"> & Attribute.StringProperties & Attribute.ConfigurableOption & Attribute.DefaultOption<string> & Attribute.MinMaxLengthOption & Attribute.PrivateOption & Attribute.UniqueOption & Attribute.RequiredOption & Attribute.WritableOption & Attribute.VisibleOption) | Attribute.Text | Attribute.UID<never, string, Attribute.UIDOptions>>, options: ValidatorOptions) => import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    password: (metas: ValidatorMetas<Attribute.Email | Attribute.Password | Attribute.RichText | (Attribute.OfType<"string"> & Attribute.StringProperties & Attribute.ConfigurableOption & Attribute.DefaultOption<string> & Attribute.MinMaxLengthOption & Attribute.PrivateOption & Attribute.UniqueOption & Attribute.RequiredOption & Attribute.WritableOption & Attribute.VisibleOption) | Attribute.Text | Attribute.UID<never, string, Attribute.UIDOptions>>, options: ValidatorOptions) => import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    email: (metas: ValidatorMetas<Attribute.Email>, options: ValidatorOptions) => import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    enumeration: ({ attr }: {
        attr: Attribute.Enumeration<[]>;
    }) => import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    boolean: () => strapiUtils.yup.BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
    uid: (metas: ValidatorMetas<Attribute.UID<never, string, Attribute.UIDOptions>>, options: ValidatorOptions) => import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    json: () => import("yup/lib/mixed").MixedSchema<any, Record<string, any>, any>;
    integer: (metas: ValidatorMetas<Attribute.BigInteger | Attribute.Integer>) => strapiUtils.yup.NumberSchema<number | undefined, Record<string, any>, number | undefined>;
    biginteger: (metas: ValidatorMetas<Attribute.BigInteger>) => import("yup/lib/mixed").MixedSchema<any, Record<string, any>, any>;
    float: (metas: ValidatorMetas<Attribute.Decimal | Attribute.Float>) => strapiUtils.yup.NumberSchema<number | undefined, Record<string, any>, number | undefined>;
    decimal: (metas: ValidatorMetas<Attribute.Decimal | Attribute.Float>) => strapiUtils.yup.NumberSchema<number | undefined, Record<string, any>, number | undefined>;
    date: (metas: ValidatorMetas<Attribute.DateTime | Attribute.Date | Attribute.Time | Attribute.Timestamp>) => import("yup/lib/mixed").MixedSchema<any, Record<string, any>, any>;
    time: (metas: ValidatorMetas<Attribute.DateTime | Attribute.Date | Attribute.Time | Attribute.Timestamp>) => import("yup/lib/mixed").MixedSchema<any, Record<string, any>, any>;
    datetime: (metas: ValidatorMetas<Attribute.DateTime | Attribute.Date | Attribute.Time | Attribute.Timestamp>) => import("yup/lib/mixed").MixedSchema<any, Record<string, any>, any>;
    timestamp: (metas: ValidatorMetas<Attribute.DateTime | Attribute.Date | Attribute.Time | Attribute.Timestamp>) => import("yup/lib/mixed").MixedSchema<any, Record<string, any>, any>;
    blocks: (metas: any, options: any) => strapiUtils.yup.ArraySchema<any, import("yup/lib/types").AnyObject, any[] | undefined, any[] | undefined>;
};
export default _default;
//# sourceMappingURL=validators.d.ts.map
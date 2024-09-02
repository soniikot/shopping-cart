import type { Attribute, Schema } from '@strapi/types';
export declare const hasComponent: (model: Schema.Schema) => boolean;
export declare const isConfigurable: (attribute: Attribute.Any) => boolean;
export declare const isRelation: (attribute: Attribute.Any) => boolean;
/**
 * Formats a component's attributes
 */
export declare const formatAttributes: (model: any) => any;
/**
 * Formats a component attribute
 */
export declare const formatAttribute: (attribute: Attribute.Any & Record<string, any>) => (Attribute.OfType<"biginteger"> & Attribute.ConfigurableOption & Attribute.DefaultOption<string> & Attribute.MinMaxOption<string> & Attribute.PrivateOption & Attribute.RequiredOption & Attribute.WritableOption & Attribute.VisibleOption & Attribute.UniqueOption & Record<string, any>) | (Attribute.OfType<"boolean"> & Attribute.ConfigurableOption & Attribute.DefaultOption<boolean> & Attribute.PrivateOption & Attribute.RequiredOption & Attribute.WritableOption & Attribute.VisibleOption & Record<string, any>) | (Attribute.OfType<"blocks"> & Attribute.ConfigurableOption & Attribute.PrivateOption & Attribute.RequiredOption & Attribute.WritableOption & Attribute.VisibleOption & Record<string, any>) | (Attribute.OfType<"component"> & Attribute.ComponentProperties<`${string}.${string}`, boolean> & Attribute.ConfigurableOption & Attribute.MinMaxOption<number> & Attribute.PrivateOption & Attribute.RequiredOption & Attribute.WritableOption & Attribute.VisibleOption & Record<string, any>) | (Attribute.OfType<"datetime"> & Attribute.ConfigurableOption & Attribute.DefaultOption<Attribute.DateTimeValue> & Attribute.PrivateOption & Attribute.RequiredOption & Attribute.UniqueOption & Attribute.WritableOption & Attribute.VisibleOption & Record<string, any>) | (Attribute.OfType<"date"> & Attribute.ConfigurableOption & Attribute.DefaultOption<Attribute.DateValue> & Attribute.PrivateOption & Attribute.RequiredOption & Attribute.UniqueOption & Attribute.WritableOption & Attribute.VisibleOption & Record<string, any>) | (Attribute.OfType<"decimal"> & Attribute.ConfigurableOption & Attribute.DefaultOption<number> & Attribute.MinMaxOption<number> & Attribute.PrivateOption & Attribute.RequiredOption & Attribute.WritableOption & Attribute.VisibleOption & Attribute.UniqueOption & Record<string, any>) | (Attribute.OfType<"dynamiczone"> & Attribute.DynamicZoneProperties<`${string}.${string}`[]> & Attribute.ConfigurableOption & Attribute.MinMaxOption<number> & Attribute.RequiredOption & Attribute.WritableOption & Attribute.VisibleOption & Record<string, any>) | (Attribute.OfType<"email"> & Attribute.ConfigurableOption & Attribute.DefaultOption<string> & Attribute.MinMaxLengthOption & Attribute.PrivateOption & Attribute.RequiredOption & Attribute.UniqueOption & Attribute.WritableOption & Attribute.VisibleOption & Record<string, any>) | (Attribute.OfType<"enumeration"> & Attribute.EnumerationProperties<string[]> & Attribute.ConfigurableOption & Attribute.DefaultOption<string> & Attribute.PrivateOption & Attribute.RequiredOption & Attribute.WritableOption & Attribute.VisibleOption & Record<string, any>) | (Attribute.OfType<"float"> & Attribute.ConfigurableOption & Attribute.DefaultOption<number> & Attribute.MinMaxOption<number> & Attribute.PrivateOption & Attribute.RequiredOption & Attribute.WritableOption & Attribute.VisibleOption & Attribute.UniqueOption & Record<string, any>) | (Attribute.OfType<"integer"> & Attribute.ConfigurableOption & Attribute.DefaultOption<number> & Attribute.MinMaxOption<number> & Attribute.PrivateOption & Attribute.RequiredOption & Attribute.WritableOption & Attribute.VisibleOption & Attribute.UniqueOption & Record<string, any>) | (Attribute.OfType<"json"> & Attribute.ConfigurableOption & Attribute.RequiredOption & Attribute.PrivateOption & Attribute.WritableOption & Attribute.VisibleOption & Attribute.DefaultOption<string | number | boolean | null> & Record<string, any>) | (Attribute.OfType<"password"> & Attribute.ConfigurableOption & Attribute.DefaultOption<string> & Attribute.MinMaxLengthOption & Attribute.PrivateOption & Attribute.RequiredOption & Attribute.WritableOption & Attribute.VisibleOption & Record<string, any>) | (Attribute.OfType<"richtext"> & Attribute.ConfigurableOption & Attribute.DefaultOption<string> & Attribute.MinMaxLengthOption & Attribute.PrivateOption & Attribute.RequiredOption & Attribute.WritableOption & Attribute.VisibleOption & Record<string, any>) | (Attribute.OfType<"string"> & Attribute.StringProperties & Attribute.ConfigurableOption & Attribute.DefaultOption<string> & Attribute.MinMaxLengthOption & Attribute.PrivateOption & Attribute.UniqueOption & Attribute.RequiredOption & Attribute.WritableOption & Attribute.VisibleOption & Record<string, any>) | (Attribute.OfType<"text"> & Attribute.TextProperties & Attribute.ConfigurableOption & Attribute.DefaultOption<string> & Attribute.MinMaxLengthOption & Attribute.PrivateOption & Attribute.UniqueOption & Attribute.RequiredOption & Attribute.WritableOption & Attribute.VisibleOption & Record<string, any>) | (Attribute.OfType<"time"> & Attribute.ConfigurableOption & Attribute.DefaultOption<Attribute.TimeValue> & Attribute.PrivateOption & Attribute.RequiredOption & Attribute.UniqueOption & Attribute.WritableOption & Attribute.VisibleOption & Record<string, any>) | (Attribute.OfType<"timestamp"> & Attribute.ConfigurableOption & Attribute.DefaultOption<Attribute.TimestampValue> & Attribute.PrivateOption & Attribute.RequiredOption & Attribute.UniqueOption & Attribute.WritableOption & Attribute.VisibleOption & Record<string, any>) | (Attribute.OfType<"uid"> & Attribute.UIDProperties<string, Attribute.UIDOptions> & Attribute.ConfigurableOption & Attribute.DefaultOption<string> & Attribute.MinMaxLengthOption & Attribute.PrivateOption & Attribute.RequiredOption & Attribute.WritableOption & Attribute.VisibleOption & Record<string, any>) | {
    type: string;
    multiple: boolean;
    required: boolean;
    configurable: boolean | undefined;
    private: boolean;
    allowedTypes: Attribute.MediaKind | (Attribute.MediaKind | undefined)[] | undefined;
    pluginOptions: object | undefined;
} | {
    type: string;
    target: any;
    targetAttribute: any;
    configurable: boolean | undefined;
    private: boolean;
    pluginOptions: object | undefined;
    autoPopulate: any;
    useJoinTable?: boolean | undefined;
    relation: "morphToOne";
    writable?: boolean | undefined;
    visible?: boolean | undefined;
    required?: boolean | undefined;
    multiple?: undefined;
    allowedTypes?: undefined;
} | {
    type: string;
    target: any;
    targetAttribute: any;
    configurable: boolean | undefined;
    private: boolean;
    pluginOptions: object | undefined;
    autoPopulate: any;
    useJoinTable?: boolean | undefined;
    relation: "morphToMany";
    writable?: boolean | undefined;
    visible?: boolean | undefined;
    required?: boolean | undefined;
    multiple?: undefined;
    allowedTypes?: undefined;
} | {
    type: string;
    target: any;
    targetAttribute: any;
    configurable: boolean | undefined;
    private: boolean;
    pluginOptions: object | undefined;
    autoPopulate: any;
    useJoinTable?: boolean | undefined;
    relation: "oneToOne" | "oneToMany" | "manyToOne" | "manyToMany";
    inversedBy?: undefined;
    mappedBy?: string | undefined;
    writable?: boolean | undefined;
    visible?: boolean | undefined;
    required?: boolean | undefined;
    multiple?: undefined;
    allowedTypes?: undefined;
} | {
    type: string;
    target: any;
    targetAttribute: any;
    configurable: boolean | undefined;
    private: boolean;
    pluginOptions: object | undefined;
    autoPopulate: any;
    useJoinTable?: boolean | undefined;
    relation: "oneToOne" | "oneToMany" | "manyToOne" | "manyToMany";
    mappedBy?: undefined;
    inversedBy?: string | undefined;
    writable?: boolean | undefined;
    visible?: boolean | undefined;
    required?: boolean | undefined;
    multiple?: undefined;
    allowedTypes?: undefined;
} | {
    type: string;
    target: any;
    targetAttribute: any;
    configurable: boolean | undefined;
    private: boolean;
    pluginOptions: object | undefined;
    autoPopulate: any;
    useJoinTable?: boolean | undefined;
    relation: "oneWay" | "manyWay";
    writable?: boolean | undefined;
    visible?: boolean | undefined;
    required?: boolean | undefined;
    multiple?: undefined;
    allowedTypes?: undefined;
} | {
    type: string;
    target: any;
    targetAttribute: any;
    configurable: boolean | undefined;
    private: boolean;
    pluginOptions: object | undefined;
    autoPopulate: any;
    useJoinTable?: boolean | undefined;
    relation: "morphOne" | "morphMany";
    morphBy?: string | undefined;
    writable?: boolean | undefined;
    visible?: boolean | undefined;
    required?: boolean | undefined;
    multiple?: undefined;
    allowedTypes?: undefined;
};
export declare const replaceTemporaryUIDs: (uidMap: any) => (schema: any) => any;
//# sourceMappingURL=attributes.d.ts.map
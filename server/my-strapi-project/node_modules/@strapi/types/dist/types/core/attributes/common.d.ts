/**
 * Strapi custom scalar types
 */
import type { Attribute, Common } from '..';
/**
 * Setters for the attributes options
 */
export type Required = {
    required: true;
};
export type NonRequired = {
    required: false;
};
export type Private = {
    private: true;
};
export type NonPrivate = {
    private: false;
};
export type Unique = {
    unique: true;
};
export type NonUnique = {
    unique: false;
};
export type Configurable = {
    configurable: true;
};
export type NonConfigurable = {
    configurable: false;
};
export type Writable = {
    writable: true;
};
export type NonWritable = {
    writable: false;
};
export type Visible = {
    visible: true;
};
export type NonVisible = {
    visible: false;
};
export type CustomField<TKind extends string, TOptions extends object | undefined = undefined> = {
    customField: TKind;
    options?: TOptions;
};
export type SetMinMax<TConfig extends Attribute.MinMaxOption<TType>, TType = number> = TConfig;
export type SetMinMaxLength<TConfig extends Attribute.MinMaxLengthOption> = TConfig;
export type SetPluginOptions<TConfig extends object = object> = {
    pluginOptions?: TConfig;
};
export type DefaultTo<T> = {
    default: T;
};
export type Any = Attribute.BigInteger | Attribute.Boolean | Attribute.Blocks | Attribute.Component<Common.UID.Component, boolean> | Attribute.DateTime | Attribute.Date | Attribute.Decimal | Attribute.DynamicZone | Attribute.Email | Attribute.Enumeration<string[]> | Attribute.Float | Attribute.Integer | Attribute.JSON | Attribute.Media<Attribute.MediaKind | undefined, boolean> | Attribute.Password | Attribute.Relation | Attribute.RichText | Attribute.String | Attribute.Text | Attribute.Time | Attribute.Timestamp | Attribute.UID<Common.UID.Schema>;
export type PopulatableKind = Extract<Attribute.Kind, 'relation' | 'component' | 'dynamiczone' | 'media'>;
export type NonPopulatableKind = Exclude<Attribute.Kind, 'relation' | 'component' | 'dynamiczone' | 'media'>;
//# sourceMappingURL=common.d.ts.map
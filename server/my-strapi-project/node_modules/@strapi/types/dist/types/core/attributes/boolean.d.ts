import type { Attribute } from '..';
type BooleanAttribute = Attribute.OfType<'boolean'> & Attribute.ConfigurableOption & Attribute.DefaultOption<BooleanValue> & Attribute.PrivateOption & Attribute.RequiredOption & Attribute.WritableOption & Attribute.VisibleOption;
export type BooleanValue = boolean;
export type GetBooleanValue<T extends Attribute.Attribute> = T extends BooleanAttribute ? BooleanValue : never;
export type Boolean = BooleanAttribute;
export {};
//# sourceMappingURL=boolean.d.ts.map
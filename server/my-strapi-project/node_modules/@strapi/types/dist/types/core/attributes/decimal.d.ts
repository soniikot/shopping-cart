import type { Attribute } from '..';
export type Decimal = Attribute.OfType<'decimal'> & Attribute.ConfigurableOption & Attribute.DefaultOption<DecimalValue> & Attribute.MinMaxOption & Attribute.PrivateOption & Attribute.RequiredOption & Attribute.WritableOption & Attribute.VisibleOption & Attribute.UniqueOption;
export type DecimalValue = number;
export type GetDecimalValue<T extends Attribute.Attribute> = T extends Decimal ? DecimalValue : never;
//# sourceMappingURL=decimal.d.ts.map
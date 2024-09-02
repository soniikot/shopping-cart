import type { Attribute } from '..';
export type DateTime = Attribute.OfType<'datetime'> & Attribute.ConfigurableOption & Attribute.DefaultOption<DateTimeValue> & Attribute.PrivateOption & Attribute.RequiredOption & Attribute.UniqueOption & Attribute.WritableOption & Attribute.VisibleOption;
export type DateTimeValue = globalThis.Date | string;
export type GetDateTimeValue<T extends Attribute.Attribute> = T extends DateTime ? DateTimeValue : never;
//# sourceMappingURL=date-time.d.ts.map
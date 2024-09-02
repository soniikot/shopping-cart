import type { Attribute } from '..';
export type Date = Attribute.OfType<'date'> & Attribute.ConfigurableOption & Attribute.DefaultOption<DateValue> & Attribute.PrivateOption & Attribute.RequiredOption & Attribute.UniqueOption & Attribute.WritableOption & Attribute.VisibleOption;
export type DateValue = globalThis.Date | string;
export type GetDateValue<T extends Attribute.Attribute> = T extends Date ? DateValue : never;
//# sourceMappingURL=date.d.ts.map
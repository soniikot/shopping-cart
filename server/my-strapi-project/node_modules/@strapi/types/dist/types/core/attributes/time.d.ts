import type { Attribute } from '..';
export type Time = Attribute.OfType<'time'> & Attribute.ConfigurableOption & Attribute.DefaultOption<TimeValue> & Attribute.PrivateOption & Attribute.RequiredOption & Attribute.UniqueOption & Attribute.WritableOption & Attribute.VisibleOption;
export type TimeValue = globalThis.Date | string;
export type GetTimeValue<T extends Attribute.Attribute> = T extends Time ? TimeValue : never;
//# sourceMappingURL=time.d.ts.map
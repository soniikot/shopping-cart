import type { Attribute, Common } from '..';
import type { Utils } from '../..';
export interface DynamicZoneProperties<TComponentsUID extends Common.UID.Component[]> {
    components: TComponentsUID;
}
export type DynamicZone<TComponentsUID extends Common.UID.Component[] = Common.UID.Component[]> = Attribute.OfType<'dynamiczone'> & DynamicZoneProperties<TComponentsUID> & Attribute.ConfigurableOption & Attribute.MinMaxOption & Attribute.RequiredOption & Attribute.WritableOption & Attribute.VisibleOption;
type DynamicZoneValue<TComponentsUID extends Common.UID.Component[]> = Array<Utils.Array.Values<TComponentsUID> extends infer TComponentUID ? TComponentUID extends Common.UID.Component ? Attribute.GetValues<TComponentUID> & {
    __component: TComponentUID;
} : never : never>;
export type GetDynamicZoneValue<TAttribute extends Attribute.Attribute> = TAttribute extends DynamicZone<infer TComponentsUID> ? DynamicZoneValue<TComponentsUID> : never;
export type GetDynamicZoneTargets<TAttribute extends Attribute.Attribute> = TAttribute extends DynamicZone<infer TComponentsUID> ? Utils.Array.Values<TComponentsUID> : never;
export {};
//# sourceMappingURL=dynamic-zone.d.ts.map
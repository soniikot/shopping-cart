import type { Model } from '../types';
import type { ForeignKey, Index } from '../schema/types';
import type { Action, SubscriberFn } from '../lifecycles';
export interface ComponentLinkMeta extends Meta {
    componentLink: Meta;
}
export interface Meta extends Model {
    columnToAttribute: Record<string, string>;
    componentLink?: Meta;
    indexes: Index[];
    foreignKeys: ForeignKey[];
    lifecycles: Partial<Record<Action, SubscriberFn>>;
}
export declare class Metadata extends Map<string, Meta> {
    get(key: string): Meta;
    add(meta: Meta): this;
    /**
     * Validate the DB metadata, throwing an error if a duplicate DB table name is detected
     */
    validate(): void;
}
//# sourceMappingURL=metadata.d.ts.map
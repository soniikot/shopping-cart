import type { Attribute, Common, Utils } from '../../../../types';
import type * as Operator from './operators';
import type * as AttributeUtils from '../attributes';
import type * as Params from '..';
export { Operator };
type IDKey = 'id';
/**
 * Generic object notation for filters.
 * @template TSchemaUID The type of the schema UID for the object notation.
 */
export type Any<TSchemaUID extends Common.UID.Schema> = ObjectNotation<TSchemaUID>;
/**
 * Type that unites root-level operators and attributes filtering for a specific schema query.
 *
 * It is used to define the structure of filters objects in a specific schema.
 * @template TSchemaUID The UID of the schema defining the object notation.
 */
export type ObjectNotation<TSchemaUID extends Common.UID.Schema> = TSchemaUID extends infer TUIDs extends Common.UID.Schema ? {
    [TUID in TUIDs]: RootLevelOperatorFiltering<TUID> & AttributesFiltering<TUID>;
}[TSchemaUID] : never;
/**
 * Object for root level operator filtering.
 * @template TSchemaUID - The type of the schema UID.
 */
export type RootLevelOperatorFiltering<TSchemaUID extends Common.UID.Schema> = {
    [TIter in Operator.Group]?: ObjectNotation<TSchemaUID>[];
} & {
    [TIter in Operator.Logical]?: ObjectNotation<TSchemaUID>;
};
/**
 * Represents a type for filtering on attributes based on a given schema.
 *  @template TSchemaUID - The UID of the schema.
 */
export type AttributesFiltering<TSchemaUID extends Common.UID.Schema> = IDFiltering & Utils.Expression.If<Common.AreSchemaRegistriesExtended, ScalarAttributesFiltering<TSchemaUID> & NestedAttributeFiltering<TSchemaUID>, AbstractAttributesFiltering<TSchemaUID>>;
/**
 * Definition of scalar attribute filtering for a given schema UID.
 * @template TSchemaUID - The UID of the schema.
 */
export type ScalarAttributesFiltering<TSchemaUID extends Common.UID.Schema> = {
    [TKey in AttributeUtils.GetScalarKeys<TSchemaUID>]?: AttributeCondition<TSchemaUID, TKey>;
};
/**
 * Filters object for nested schema attributes.
 * @template TSchemaUID - The UID of the schema to perform filtering on.
 */
export type NestedAttributeFiltering<TSchemaUID extends Common.UID.Schema> = {
    [TKey in AttributeUtils.GetNestedKeys<TSchemaUID>]?: ObjectNotation<Attribute.GetTarget<TSchemaUID, TKey>>;
};
type IDFiltering = {
    id?: AttributeCondition<never, IDKey>;
};
/**
 * Filter condition for scalar attributes.
 * @template TSchemaUID - The unique identifier of the schema.
 * @template TAttributeName - The name of the attribute.
 */
type AttributeCondition<TSchemaUID extends Common.UID.Schema, TAttributeName extends IDKey | AttributeUtils.GetScalarKeys<TSchemaUID>> = GetScalarAttributeValue<TSchemaUID, TAttributeName> extends infer TAttributeValue ? TAttributeValue | ({
    [TIter in Operator.BooleanValue]?: boolean;
} & {
    [TIter in Operator.DynamicValue]?: TAttributeValue;
} & {
    [TIter in Operator.DynamicArrayValue]?: TAttributeValue[];
} & {
    [TIter in Operator.DynamicBoundValue]?: [TAttributeValue, TAttributeValue];
} & {
    [TIter in Operator.Logical]?: AttributeCondition<TSchemaUID, TAttributeName>;
} & {
    [TIter in Operator.Group]?: AttributeCondition<TSchemaUID, TAttributeName>[];
}) : never;
/**
 * Utility type that retrieves the value of a scalar attribute in a schema.
 * @template TSchemaUID The UID type of the schema.
 * @template TAttributeName The name of the attribute.
 */
type GetScalarAttributeValue<TSchemaUID extends Common.UID.Schema, TAttributeName extends IDKey | AttributeUtils.GetScalarKeys<TSchemaUID>> = Utils.Expression.MatchFirst<[
    [
        Utils.Expression.StrictEqual<TAttributeName, IDKey>,
        Params.Attribute.ID
    ],
    [
        Utils.Expression.IsNotNever<TAttributeName>,
        AttributeUtils.GetValue<Attribute.Get<TSchemaUID, Utils.Cast<TAttributeName, AttributeUtils.GetScalarKeys<TSchemaUID>>>>
    ]
], AttributeUtils.ScalarValues>;
/**
 * Nested filter condition based on the given schema and attribute name
 * @template TSchemaUID - The (literal) UID of the schema.
 * @template TAttributeName - The attribute name in the schema.
 */
type NestedAttributeCondition<TSchemaUID extends Common.UID.Schema, TAttributeName extends Attribute.GetKeys<TSchemaUID>> = ObjectNotation<Utils.Guard.Never<Attribute.GetTarget<TSchemaUID, TAttributeName>, Common.UID.Schema>>;
export type AbstractAttributesFiltering<TSchemaUID extends Common.UID.Schema> = {
    [TKey in string]?: AttributeCondition<TSchemaUID, never> | NestedAttributeCondition<TSchemaUID, never>;
};
//# sourceMappingURL=index.d.ts.map
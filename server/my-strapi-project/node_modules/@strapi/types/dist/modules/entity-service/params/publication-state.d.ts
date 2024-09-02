import type { Common, Utils } from '../../../types';
export type Kind = 'preview' | 'live';
export type IsEnabled<TSchemaUID extends Common.UID.Schema> = Utils.Expression.MatchFirst<[
    [
        Common.UID.IsContentType<TSchemaUID>,
        Utils.Expression.IsTrue<NonNullable<Common.Schemas[TSchemaUID]['options']>['draftAndPublish']>
    ],
    [
        Utils.Expression.And<Utils.Expression.Not<Utils.Expression.Extends<TSchemaUID, Common.UID.ContentType>>, Common.UID.IsComponent<TSchemaUID>>,
        Utils.Expression.False
    ]
], Utils.Expression.BooleanValue>;
export type For<TSchemaUID extends Common.UID.Schema> = IsEnabled<TSchemaUID> extends infer TEnabled ? Utils.Expression.If<Utils.Expression.Or<Utils.Expression.IsTrue<TEnabled>, Utils.Expression.Extends<Utils.Expression.BooleanValue, TEnabled>>, {
    publicationState?: Kind;
}, unknown> : never;
//# sourceMappingURL=publication-state.d.ts.map
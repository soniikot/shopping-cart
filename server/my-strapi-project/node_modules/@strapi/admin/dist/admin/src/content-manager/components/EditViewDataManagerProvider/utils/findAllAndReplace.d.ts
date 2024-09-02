import type { FormattedComponentLayout } from '../../../utils/layouts';
import type { Attribute } from '@strapi/types';
type ReplacementFn<TData extends Record<string, any>, TKey extends keyof TData, TReplacementValue> = (data: TData[TKey], args: {
    path: string[];
    parent: TData;
}) => TReplacementValue;
/**
 * This function will recursively find everything and replace it with a value
 * based on the boolean return of the predicate function e.g. `type === 'relation'`.
 *
 * If you provide a function it will call that function with data value you're replacing with
 * a second argument with the path to the value and it's parent.
 *
 * It's original use was for the preperation of action items for the INIT_FORM action. It requires
 * knowledge of the `components` in the entity, however `components` doesn't change nor does the predicate
 * function so we don't need to pass it everytime hence why it's curried.
 *
 */
declare const findAllAndReplaceSetup: <TReplacementValue, TData extends Record<string, any> = Record<string, any>>(components: Record<string, FormattedComponentLayout>, predicate?: (value: FormattedComponentLayout['attributes'][string], args: {
    path: string[];
    parent: Attribute.Any | {
        [key: string]: Attribute.Any;
    };
}) => boolean, replacement?: TReplacementValue | ReplacementFn<TData, keyof TData, TReplacementValue> | undefined) => <TData_1 extends Record<string, any> = Record<string, any>>(data: TData_1, attributes: {
    [key: string]: Attribute.Any;
}, { ignoreFalseyValues, path, parent, }?: {
    ignoreFalseyValues?: boolean | undefined;
    path?: string[] | undefined;
    parent?: Attribute.Any | {
        [key: string]: Attribute.Any;
    } | undefined;
}) => Record<string, any>;
export { findAllAndReplaceSetup as findAllAndReplace };

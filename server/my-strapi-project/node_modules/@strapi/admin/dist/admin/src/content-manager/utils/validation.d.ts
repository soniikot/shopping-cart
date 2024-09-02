import * as yup from 'yup';
import { FormattedComponentLayout, FormattedContentTypeLayout } from './layouts';
import type Lazy from 'yup/lib/Lazy';
import type { MixedSchema } from 'yup/lib/mixed';
/**
 * TODO: this whole thing needs actually fixing because it's useless without types
 * but it obviously something has gone wrong between conception and now for it to need
 * this many ts-error directives.
 *
 * See CONTENT-2107
 */
interface CreateYupSchemaOpts {
    isCreatingEntry?: boolean;
    isDraft?: boolean;
    isFromComponent?: boolean;
    isJSONTestDisabled?: boolean;
}
declare const createYupSchema: (model: FormattedContentTypeLayout | FormattedComponentLayout, { components }: {
    components: Record<string, FormattedComponentLayout>;
}, options?: CreateYupSchemaOpts) => yup.default<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, Record<string, Lazy<any, unknown> | MixedSchema<any, import("yup/lib/types").AnyObject, any>>>, Record<string, any>, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, Record<string, Lazy<any, unknown> | MixedSchema<any, import("yup/lib/types").AnyObject, any>>>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, Record<string, Lazy<any, unknown> | MixedSchema<any, import("yup/lib/types").AnyObject, any>>>>>;
export { createYupSchema };

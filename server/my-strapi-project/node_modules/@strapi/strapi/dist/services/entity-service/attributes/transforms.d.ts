import type { Attribute } from '@strapi/types';
type Transforms = {
    [TKind in Attribute.Kind]?: (value: unknown, context: {
        attribute: Attribute.Any;
        attributeName: string;
    }) => any;
};
declare const transforms: Transforms;
export default transforms;
//# sourceMappingURL=transforms.d.ts.map
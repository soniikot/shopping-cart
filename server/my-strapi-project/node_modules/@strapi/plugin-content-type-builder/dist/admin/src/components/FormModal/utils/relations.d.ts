import { Attribute } from '@strapi/types';
declare const shouldPluralizeName: (nature: Attribute.RelationKind.Any) => 1 | 2;
declare const shouldPluralizeTargetAttribute: (nature: Attribute.RelationKind.Any) => 1 | 2;
export { shouldPluralizeName, shouldPluralizeTargetAttribute };

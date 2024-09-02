import type { Attribute } from '@strapi/types';
/**
 *
 * Retrieves the relation type
 */
export declare const getRelationType: (relation: Attribute.RelationKind.WithTarget | undefined, targetAttribute?: string | null) => Attribute.RelationKind.WithTarget | undefined;

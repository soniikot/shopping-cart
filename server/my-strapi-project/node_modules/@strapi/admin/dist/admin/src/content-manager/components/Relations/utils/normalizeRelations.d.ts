import type { Contracts } from '@strapi/plugin-content-manager/_internal/shared';
export interface NormalizeRelationArgs {
    shouldAddLink: boolean;
    mainFieldName: string;
    targetModel: string;
}
export type NormalizedRelation = Contracts.Relations.RelationResult & {
    href?: string;
    mainField: string;
    publicationState?: false | 'published' | 'draft';
};
export declare const normalizeRelation: (relation: Contracts.Relations.RelationResult, { shouldAddLink, mainFieldName, targetModel }: NormalizeRelationArgs) => NormalizedRelation;
export declare const normalizeRelations: (relations: Contracts.Relations.RelationResult[], args: NormalizeRelationArgs) => NormalizedRelation[];

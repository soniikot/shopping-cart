import { NormalizeRelationArgs, NormalizedRelation } from './utils/normalizeRelations';
import type { Contracts } from '@strapi/plugin-content-manager/_internal/shared';
interface UseRelationArgs {
    relation: {
        enabled: boolean;
        endpoint: string;
        normalizeArguments: NormalizeRelationArgs;
        onLoad: (data: NormalizedRelation[]) => void;
        pageParams?: Record<string, any>;
        pageGoal?: number;
    };
    search: {
        endpoint: string;
        pageParams?: Record<string, any>;
    };
}
declare const useRelation: (cacheKey: any[] | undefined, { relation, search }: UseRelationArgs) => {
    relations: import("react-query").UseInfiniteQueryResult<{
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        } | undefined;
        results: Contracts.Relations.RelationResult[];
    } | null, unknown>;
    search: import("react-query").UseInfiniteQueryResult<Contracts.Relations.FindAvailable.Response | null, unknown>;
    searchFor: (term: string, options?: object) => void;
};
export { useRelation };
export type { UseRelationArgs };

import { RootState } from '../../../../../../../admin/src/core/store/configure';
import { REDUX_NAMESPACE } from './constants';
import { State } from './reducer';
interface Store extends RootState {
    [REDUX_NAMESPACE]: State;
}
export declare const selectNamespace: (state: Store) => State;
export declare const selectContentTypes: ((state: Store) => {
    collectionTypes: import("@strapi/types/dist/types/core/schemas").CollectionType[];
    singleTypes: import("@strapi/types/dist/types/core/schemas").SingleType[];
} | undefined) & import("reselect").OutputSelectorFields<(args_0: State) => {
    collectionTypes: import("@strapi/types/dist/types/core/schemas").CollectionType[];
    singleTypes: import("@strapi/types/dist/types/core/schemas").SingleType[];
} | undefined, {
    clearCache: () => void;
}> & {
    clearCache: () => void;
};
export declare const selectRoles: ((state: Store) => import("../../../../../../../shared/contracts/shared").AdminRole[] | undefined) & import("reselect").OutputSelectorFields<(args_0: State) => import("../../../../../../../shared/contracts/shared").AdminRole[] | undefined, {
    clearCache: () => void;
}> & {
    clearCache: () => void;
};
export declare const selectCurrentWorkflow: ((state: Store) => Partial<Omit<Partial<Pick<import("../../../../../../../shared/contracts/review-workflows").Workflow, "id" | "name" | "contentTypes" | "stages"> & {
    permissions?: import("../../../../../../../shared/contracts/review-workflows").StagePermission[] | undefined;
}>, "stages"> & {
    stages: import("./reducer").StageWithTempKey[];
}>) & import("reselect").OutputSelectorFields<(args_0: State) => Partial<Omit<Partial<Pick<import("../../../../../../../shared/contracts/review-workflows").Workflow, "id" | "name" | "contentTypes" | "stages"> & {
    permissions?: import("../../../../../../../shared/contracts/review-workflows").StagePermission[] | undefined;
}>, "stages"> & {
    stages: import("./reducer").StageWithTempKey[];
}>, {
    clearCache: () => void;
}> & {
    clearCache: () => void;
};
export declare const selectWorkflows: ((state: Store) => import("../../../../../../../shared/contracts/review-workflows").Workflow[] | undefined) & import("reselect").OutputSelectorFields<(args_0: State) => import("../../../../../../../shared/contracts/review-workflows").Workflow[] | undefined, {
    clearCache: () => void;
}> & {
    clearCache: () => void;
};
export declare const selectIsWorkflowDirty: ((state: Store) => boolean) & import("reselect").OutputSelectorFields<(args_0: State) => boolean, {
    clearCache: () => void;
}> & {
    clearCache: () => void;
};
export declare const selectHasDeletedServerStages: ((state: Store) => boolean) & import("reselect").OutputSelectorFields<(args_0: State) => boolean, {
    clearCache: () => void;
}> & {
    clearCache: () => void;
};
export declare const selectIsLoading: ((state: Store) => boolean | undefined) & import("reselect").OutputSelectorFields<(args_0: State) => boolean | undefined, {
    clearCache: () => void;
}> & {
    clearCache: () => void;
};
export declare const selectServerState: ((state: Store) => import("./reducer").ServerState) & import("reselect").OutputSelectorFields<(args_0: State) => import("./reducer").ServerState, {
    clearCache: () => void;
}> & {
    clearCache: () => void;
};
export {};

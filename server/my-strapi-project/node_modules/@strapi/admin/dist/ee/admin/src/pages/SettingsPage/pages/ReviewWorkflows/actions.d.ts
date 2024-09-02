import { Contracts } from '@strapi/plugin-content-manager/_internal/shared';
import { Stage, Workflow } from '../../../../../../../shared/contracts/review-workflows';
import { Permission, SanitizedAdminRole } from '../../../../../../../shared/contracts/shared';
export declare function cloneStage(id: number): {
    type: string;
    payload: {
        id: number;
    };
};
export declare function setWorkflow({ workflow }: {
    workflow: Workflow | null;
}): {
    type: string;
    payload: Workflow | null;
};
export declare function setWorkflows({ workflows }: {
    workflows: Workflow[];
}): {
    type: string;
    payload: Workflow[];
};
export declare function deleteStage(stageId: number): {
    type: string;
    payload: {
        stageId: number;
    };
};
export declare function addStage(stage: Partial<Stage>): {
    type: string;
    payload: Partial<Stage>;
};
export interface PartialStage extends Omit<Stage, 'permissions'> {
    permissions?: Partial<Permission>[];
}
export declare function updateStage(stageId: number, payload: Partial<PartialStage>): {
    type: string;
    payload: {
        permissions?: Partial<Permission>[] | undefined;
        id?: import("@strapi/types/dist/types/core/entity").ID | undefined;
        createdAt?: string | undefined;
        updatedAt?: string | undefined;
        name?: string | undefined;
        color?: string | undefined;
        stageId: number;
    };
};
export declare function updateStages(payload: Partial<PartialStage>): {
    type: string;
    payload: Partial<PartialStage>;
};
export declare function updateStagePosition(oldIndex: number, newIndex: number): {
    type: string;
    payload: {
        newIndex: number;
        oldIndex: number;
    };
};
export declare function updateWorkflow(payload: Partial<Workflow>): {
    type: string;
    payload: Partial<Workflow>;
};
export declare function resetWorkflow(): {
    type: string;
};
export declare function setContentTypes(payload: {
    collectionTypes?: Contracts.ContentTypes.ContentType[];
    singleTypes?: Contracts.ContentTypes.ContentType[];
}): {
    type: string;
    payload: {
        collectionTypes?: Contracts.ContentTypes.ContentType[] | undefined;
        singleTypes?: Contracts.ContentTypes.ContentType[] | undefined;
    };
};
export declare function setRoles(payload?: (SanitizedAdminRole & {
    usersCount?: number | undefined;
})[]): {
    type: string;
    payload: (SanitizedAdminRole & {
        usersCount?: number | undefined;
    })[] | undefined;
};
export declare function setIsLoading(isLoading: boolean): {
    type: string;
    payload: boolean;
};

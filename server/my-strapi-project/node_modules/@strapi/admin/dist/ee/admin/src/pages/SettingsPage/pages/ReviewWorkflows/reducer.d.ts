import { Schema } from '@strapi/types';
import { Stage, StagePermission, Workflow } from '../../../../../../../shared/contracts/review-workflows';
import { AdminRole } from '../../../../../../../shared/contracts/shared';
export type CurrentWorkflow = Partial<Pick<Workflow, 'name' | 'contentTypes' | 'stages' | 'id'> & {
    permissions?: StagePermission[];
}>;
export type PartialWorkflow = Omit<CurrentWorkflow, 'stages'> & {
    stages?: Partial<Stage>[];
};
export interface ServerState {
    contentTypes?: {
        collectionTypes: Schema.CollectionType[];
        singleTypes: Schema.SingleType[];
    };
    roles?: AdminRole[];
    workflow?: PartialWorkflow | null;
    workflows?: Workflow[];
}
export type StageWithTempKey = Stage & {
    __temp_key__?: number;
};
export interface ClientState {
    currentWorkflow: {
        data: Partial<Omit<CurrentWorkflow, 'stages'> & {
            stages: StageWithTempKey[];
        }>;
    };
    isLoading?: boolean;
}
export type State = {
    serverState: ServerState;
    clientState: ClientState;
};
export declare const initialState: State;
export declare function reducer(state: State | undefined, action: {
    type: string;
    payload?: any;
}): State;

import { CLEAR_SET_MODIFIED_DATA_ONLY, GET_DATA, GET_DATA_SUCCEEDED, INIT_FORM, RESET_PROPS, SET_DATA_STRUCTURES, SET_STATUS, SUBMIT_SUCCEEDED } from './constants';
import { CrudState } from './reducer';
interface GetDataAction {
    type: typeof GET_DATA;
}
declare const getData: () => {
    type: "ContentManager/CrudReducer/GET_DATA";
};
interface GetDataSucceededAction extends Pick<CrudState, 'data'> {
    type: typeof GET_DATA_SUCCEEDED;
    setModifiedDataOnly?: boolean;
}
declare const getDataSucceeded: (data: GetDataSucceededAction['data']) => {
    type: "ContentManager/CrudReducer/GET_DATA_SUCCEEDED";
    data: import("./reducer").EntityData | null;
};
interface InitFormAction extends Partial<Pick<CrudState, 'data'>> {
    type: typeof INIT_FORM;
    rawQuery?: unknown;
    isSingleType?: boolean;
}
declare const initForm: (rawQuery?: InitFormAction['rawQuery'], isSingleType?: boolean) => {
    type: "ContentManager/CrudReducer/INIT_FORM";
    rawQuery: unknown;
    isSingleType: boolean;
};
interface ResetPropsAction {
    type: typeof RESET_PROPS;
}
declare const resetProps: () => {
    type: "ContentManager/CrudReducer/RESET_PROPS";
};
interface SetDataStructuresAction extends Pick<CrudState, 'componentsDataStructure' | 'contentTypeDataStructure'> {
    type: typeof SET_DATA_STRUCTURES;
}
declare const setDataStructures: (componentsDataStructure: SetDataStructuresAction['componentsDataStructure'], contentTypeDataStructure: SetDataStructuresAction['contentTypeDataStructure']) => {
    type: "ContentManager/CrudReducer/SET_DATA_STRUCTURES";
    componentsDataStructure: import("./reducer").EntityData;
    contentTypeDataStructure: import("./reducer").EntityData;
};
interface SetStatusAction extends Pick<CrudState, 'status'> {
    type: typeof SET_STATUS;
}
declare const setStatus: (status: SetStatusAction['status']) => {
    type: "ContentManager/CrudReducer/SET_STATUS";
    status: string;
};
interface SubmitSucceededAction extends Pick<CrudState, 'data'> {
    type: typeof SUBMIT_SUCCEEDED;
}
declare const submitSucceeded: (data: SubmitSucceededAction['data']) => {
    type: "ContentManager/CrudReducer/SUBMIT_SUCCEEDED";
    data: import("./reducer").EntityData | null;
};
interface ClearSetModifiedDataOnlyAction {
    type: typeof CLEAR_SET_MODIFIED_DATA_ONLY;
}
declare const clearSetModifiedDataOnly: () => {
    type: "ContentManager/CrudReducer/CLEAR_SET_MODIFIED_DATA_ONLY";
};
export { getData, getDataSucceeded, initForm, resetProps, setDataStructures, setStatus, submitSucceeded, clearSetModifiedDataOnly, };
type CrudAction = GetDataAction | GetDataSucceededAction | InitFormAction | ResetPropsAction | SetDataStructuresAction | SetStatusAction | SubmitSucceededAction | ClearSetModifiedDataOnlyAction;
export type { GetDataAction, GetDataSucceededAction, InitFormAction, ResetPropsAction, SetDataStructuresAction, SetStatusAction, SubmitSucceededAction, ClearSetModifiedDataOnlyAction, CrudAction, };

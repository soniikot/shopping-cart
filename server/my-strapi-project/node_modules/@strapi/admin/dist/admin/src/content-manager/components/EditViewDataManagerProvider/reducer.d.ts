import type { FormattedComponentLayout, FormattedContentTypeLayout } from '../../utils/layouts';
import type { Attribute, Entity } from '@strapi/types';
interface EditViewDataManagerState {
    componentsDataStructure: Record<string, any>;
    contentTypeDataStructure: Record<string, any>;
    formErrors: Record<string, any>;
    initialData: Record<string, Attribute.GetValue<Attribute.Any>>;
    modifiedData: Record<string, Attribute.GetValue<Attribute.Any>>;
    shouldCheckErrors: boolean;
    modifiedDZName: string | null;
    publishConfirmation: {
        show: boolean;
        draftCount: number;
    };
}
declare const initialState: {
    componentsDataStructure: {};
    contentTypeDataStructure: {};
    formErrors: {};
    initialData: {};
    modifiedData: {};
    shouldCheckErrors: false;
    modifiedDZName: null;
    publishConfirmation: {
        show: false;
        draftCount: number;
    };
};
interface AddNonRepeatableComponentToFieldAction {
    type: 'ADD_NON_REPEATABLE_COMPONENT_TO_FIELD';
    componentLayoutData: FormattedComponentLayout;
    allComponents: Record<string, FormattedComponentLayout>;
    keys: string[];
}
interface AddComponentToDynamicZoneAction {
    type: 'ADD_COMPONENT_TO_DYNAMIC_ZONE';
    componentLayoutData: FormattedComponentLayout;
    allComponents: Record<string, FormattedComponentLayout>;
    keys: string[];
    shouldCheckErrors: boolean;
    position?: number;
}
interface AddRepeatableComponentToFieldAction extends Omit<AddComponentToDynamicZoneAction, 'type'> {
    type: 'ADD_REPEATABLE_COMPONENT_TO_FIELD';
}
interface LoadRelationAction {
    type: 'LOAD_RELATION';
    initialDataPath: string[];
    modifiedDataPath: string[];
    value: Omit<RelationData, '__temp_key__'>[];
}
interface ConnectRelationAction {
    type: 'CONNECT_RELATION';
    keys: string[];
    value: Omit<RelationData, '__temp_key__'>;
    toOneRelation?: boolean;
}
interface DisconnectRelationAction {
    type: 'DISCONNECT_RELATION';
    keys: string[];
    id: Entity.ID;
}
interface MoveComponentFieldAction {
    type: 'MOVE_COMPONENT_FIELD';
    keys: string[];
    oldIndex: number;
    newIndex: number;
}
interface MoveComponentUpAction {
    type: 'MOVE_COMPONENT_UP';
    currentIndex: number;
    dynamicZoneName: string;
    shouldCheckErrors: boolean;
}
interface MoveComponentDownAction extends Omit<MoveComponentUpAction, 'type'> {
    type: 'MOVE_COMPONENT_DOWN';
}
interface MoveFieldAction {
    type: 'MOVE_FIELD';
    keys: string[];
    dragIndex: number;
    overIndex: number;
}
interface InitFormAction {
    type: 'INIT_FORM';
    initialValues: Record<string, any>;
    components: Record<string, FormattedComponentLayout>;
    attributes: FormattedContentTypeLayout['attributes'];
    setModifiedDataOnly?: boolean;
}
interface OnChangeAction {
    type: 'ON_CHANGE';
    keys: string[];
    value: Attribute.GetValue<Attribute.Any>;
    shouldSetInitialValue?: boolean;
}
interface RemoveComponentFromDynamicZoneAction {
    type: 'REMOVE_COMPONENT_FROM_DYNAMIC_ZONE';
    dynamicZoneName: string;
    index: number;
    shouldCheckErrors: boolean;
}
interface RemoveComponentFromFieldAction {
    type: 'REMOVE_COMPONENT_FROM_FIELD';
    keys: string[];
}
interface RemovePasswordFieldAction {
    type: 'REMOVE_PASSWORD_FIELD';
    keys: string[];
}
interface RemoveRepeatableFieldAction {
    type: 'REMOVE_REPEATABLE_FIELD';
    keys: string[];
}
interface ReorderRelationAction {
    type: 'REORDER_RELATION';
    keys: string[];
    oldIndex: number;
    newIndex: number;
}
interface SetDefaultDataStructuresAction {
    type: 'SET_DEFAULT_DATA_STRUCTURES';
    componentsDataStructure: Record<string, any>;
    contentTypeDataStructure: Record<string, any>;
}
interface SetFormErrorsAction {
    type: 'SET_FORM_ERRORS';
    errors: Record<string, any>;
}
interface TriggerFormValidationAction {
    type: 'TRIGGER_FORM_VALIDATION';
}
interface SetPublishConfirmationAction {
    type: 'SET_PUBLISH_CONFIRMATION';
    publishConfirmation: {
        show: boolean;
        draftCount: number;
    };
}
interface ResetPublishConfirmationAction {
    type: 'RESET_PUBLISH_CONFIRMATION';
}
type Action = AddNonRepeatableComponentToFieldAction | AddComponentToDynamicZoneAction | AddRepeatableComponentToFieldAction | LoadRelationAction | ConnectRelationAction | DisconnectRelationAction | MoveComponentFieldAction | MoveComponentUpAction | MoveComponentDownAction | MoveFieldAction | InitFormAction | OnChangeAction | RemoveComponentFromDynamicZoneAction | RemoveComponentFromFieldAction | RemovePasswordFieldAction | RemoveRepeatableFieldAction | ReorderRelationAction | SetDefaultDataStructuresAction | SetFormErrorsAction | TriggerFormValidationAction | SetPublishConfirmationAction | ResetPublishConfirmationAction;
export interface RelationData {
    id: Entity.ID;
    __temp_key__: number;
}
declare const reducer: (state: EditViewDataManagerState, action: Action) => EditViewDataManagerState;
export { reducer, initialState };
export type { EditViewDataManagerState };

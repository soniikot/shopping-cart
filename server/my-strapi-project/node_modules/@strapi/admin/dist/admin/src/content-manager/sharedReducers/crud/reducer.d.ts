import { Attribute } from '@strapi/types';
import type { CrudAction } from './actions';
interface EntityData {
    [key: string]: Attribute.GetValue<Attribute.Any>;
}
interface CrudState {
    componentsDataStructure: EntityData;
    contentTypeDataStructure: EntityData;
    isLoading: boolean;
    data: EntityData | null;
    status: string;
    setModifiedDataOnly: boolean;
}
declare const initialState: {
    componentsDataStructure: {};
    contentTypeDataStructure: {};
    isLoading: true;
    data: null;
    status: string;
    setModifiedDataOnly: false;
};
declare const reducer: (state: CrudState | undefined, action: CrudAction) => CrudState;
export { reducer, initialState };
export type { CrudState, EntityData, CrudAction };

import type { DataManagerStateType } from '../../types';
export type Action = {
    type: string;
    uid?: string;
    mainDataKey: 'component' | 'components' | 'contentTypes' | 'contentType';
    schemaType: 'component' | 'contentType';
    attributeToRemoveName?: string;
    [key: string]: any;
};
declare const initialState: DataManagerStateType;
declare const reducer: (state: DataManagerStateType | undefined, action: Action) => DataManagerStateType;
export { initialState, reducer };

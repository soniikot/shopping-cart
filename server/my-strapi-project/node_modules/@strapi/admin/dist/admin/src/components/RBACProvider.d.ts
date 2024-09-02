import * as React from 'react';
import { Permission, RBACContextValue } from '@strapi/helper-plugin';
interface RBACProviderProps {
    children: React.ReactNode;
    permissions: Permission[];
    refetchPermissions: RBACContextValue['refetchPermissions'];
}
declare const RBACProvider: ({ children, permissions, refetchPermissions }: RBACProviderProps) => import("react/jsx-runtime").JSX.Element;
interface RBACState {
    allPermissions: null | Permission[];
    collectionTypesRelatedPermissions: Record<string, Record<string, Permission[]>>;
}
declare const RESET_STORE = "StrapiAdmin/RBACProvider/RESET_STORE";
declare const SET_PERMISSIONS = "StrapiAdmin/RBACProvider/SET_PERMISSIONS";
interface ResetStoreAction {
    type: typeof RESET_STORE;
}
declare const resetStoreAction: () => ResetStoreAction;
interface SetPermissionsAction {
    type: typeof SET_PERMISSIONS;
    permissions: Permission[];
}
declare const setPermissionsAction: (permissions: SetPermissionsAction['permissions']) => SetPermissionsAction;
type Actions = ResetStoreAction | SetPermissionsAction;
declare const RBACReducer: (state: RBACState | undefined, action: Actions) => RBACState;
export { RBACProvider, RBACReducer, resetStoreAction, setPermissionsAction };
export type { RBACState, Actions, RBACProviderProps, ResetStoreAction, SetPermissionsAction, Permission, };

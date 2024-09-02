import { Permission } from '@strapi/helper-plugin';
import type { RBACState } from '../../components/RBACProvider';
declare const useSyncRbac: (query: {
    plugins?: object;
}, collectionTypeUID: string, containerName?: string) => {
    isValid: boolean;
    permissions: Permission[] | null;
};
interface SyncRbacState {
    permissions: RBACState['collectionTypesRelatedPermissions'][string][string] | null;
}
declare const SET_PERMISSIONS = "ContentManager/RBACManager/SET_PERMISSIONS";
declare const RESET_PERMISSIONS = "ContentManager/RBACManager/RESET_PERMISSIONS";
interface SetPermissionsAction {
    type: typeof SET_PERMISSIONS;
    permissions: RBACState['collectionTypesRelatedPermissions'][string];
    __meta__?: {
        plugins: object;
        containerName: string;
    };
}
interface ResetPermissionsAction {
    type: typeof RESET_PERMISSIONS;
}
type Action = SetPermissionsAction | ResetPermissionsAction;
declare const reducer: (state: SyncRbacState | undefined, action: Action) => SyncRbacState;
export { useSyncRbac, reducer };
export type { SyncRbacState, RBACState };

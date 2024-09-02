import { Selector } from '@reduxjs/toolkit';
import { TypedUseSelectorHook } from 'react-redux';
import type { RootState, Store } from './configure';
type AppDispatch = Store['dispatch'];
declare const useTypedDispatch: () => AppDispatch;
declare const useTypedStore: () => Store;
declare const useTypedSelector: TypedUseSelectorHook<RootState>;
declare const createTypedSelector: <TResult>(selector: (state: {
    readonly adminApi: import("@reduxjs/toolkit/query").CombinedState<{
        regenerateToken: import("@reduxjs/toolkit/query").MutationDefinition<string, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("../../utils/baseQuery").QueryArguments, unknown, import("../../utils/baseQuery").BaseQueryError>, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", import("../../../../shared/contracts/transfer").TransferToken, "adminApi">;
    }, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", "adminApi">;
    readonly admin_app: import("../../reducer").AppState;
    readonly rbacProvider: import("../../components/RBACProvider").RBACState;
    readonly 'content-manager_app': import("../../content-manager/pages/App").ContentManagerAppState;
    readonly 'content-manager_listView': import("../../content-manager/pages/ListViewLayoutManager").ListViewLayoutManagerState;
    readonly 'content-manager_rbacManager': import("../../content-manager/hooks/useSyncRbac").SyncRbacState;
    readonly 'content-manager_editViewLayoutManager': import("../../content-manager/pages/EditViewLayoutManager").EditViewLayoutManagerState;
    readonly 'content-manager_editViewCrudReducer': import("../../content-manager/sharedReducers/crud/reducer").CrudState;
}, ...params: any[]) => TResult) => ((state: {
    readonly adminApi: import("@reduxjs/toolkit/query").CombinedState<{
        regenerateToken: import("@reduxjs/toolkit/query").MutationDefinition<string, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("../../utils/baseQuery").QueryArguments, unknown, import("../../utils/baseQuery").BaseQueryError>, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", import("../../../../shared/contracts/transfer").TransferToken, "adminApi">;
    }, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", "adminApi">;
    readonly admin_app: import("../../reducer").AppState;
    readonly rbacProvider: import("../../components/RBACProvider").RBACState;
    readonly 'content-manager_app': import("../../content-manager/pages/App").ContentManagerAppState;
    readonly 'content-manager_listView': import("../../content-manager/pages/ListViewLayoutManager").ListViewLayoutManagerState;
    readonly 'content-manager_rbacManager': import("../../content-manager/hooks/useSyncRbac").SyncRbacState;
    readonly 'content-manager_editViewLayoutManager': import("../../content-manager/pages/EditViewLayoutManager").EditViewLayoutManagerState;
    readonly 'content-manager_editViewCrudReducer': import("../../content-manager/sharedReducers/crud/reducer").CrudState;
}) => TResult) & import("reselect").OutputSelectorFields<(args_0: {
    readonly adminApi: import("@reduxjs/toolkit/query").CombinedState<{
        regenerateToken: import("@reduxjs/toolkit/query").MutationDefinition<string, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("../../utils/baseQuery").QueryArguments, unknown, import("../../utils/baseQuery").BaseQueryError>, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", import("../../../../shared/contracts/transfer").TransferToken, "adminApi">;
    }, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", "adminApi">;
    readonly admin_app: import("../../reducer").AppState;
    readonly rbacProvider: import("../../components/RBACProvider").RBACState;
    readonly 'content-manager_app': import("../../content-manager/pages/App").ContentManagerAppState;
    readonly 'content-manager_listView': import("../../content-manager/pages/ListViewLayoutManager").ListViewLayoutManagerState;
    readonly 'content-manager_rbacManager': import("../../content-manager/hooks/useSyncRbac").SyncRbacState;
    readonly 'content-manager_editViewLayoutManager': import("../../content-manager/pages/EditViewLayoutManager").EditViewLayoutManagerState;
    readonly 'content-manager_editViewCrudReducer': import("../../content-manager/sharedReducers/crud/reducer").CrudState;
}) => TResult, {
    clearCache: () => void;
}> & {
    clearCache: () => void;
};
export { useTypedDispatch, useTypedStore, useTypedSelector, createTypedSelector };

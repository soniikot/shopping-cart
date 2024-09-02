import { Middleware, Reducer } from '@reduxjs/toolkit';
import { RBACState } from '../../components/RBACProvider';
import { AppState } from '../../reducer';
type PreloadState = Partial<{
    admin_app: AppState;
}>;
/**
 * @description This is the main store configuration function, injected Reducers use our legacy app.addReducer API,
 * which we're trying to phase out. App Middlewares could potentially be improved...?
 */
declare const configureStoreImpl: (preloadedState?: PreloadState, appMiddlewares?: Array<() => Middleware>, injectedReducers?: Record<string, Reducer>) => import("@reduxjs/toolkit/dist/configureStore").ToolkitStore<{
    readonly adminApi: import("@reduxjs/toolkit/query").CombinedState<{
        regenerateToken: import("@reduxjs/toolkit/query").MutationDefinition<string, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("../../utils/baseQuery").QueryArguments, unknown, import("../../utils/baseQuery").BaseQueryError>, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", import("../../../../shared/contracts/transfer").TransferToken, "adminApi">;
    }, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", "adminApi">;
    readonly admin_app: AppState;
    readonly rbacProvider: RBACState;
    readonly 'content-manager_app': import("../../content-manager/pages/App").ContentManagerAppState;
    readonly 'content-manager_listView': import("../../content-manager/pages/ListViewLayoutManager").ListViewLayoutManagerState;
    readonly 'content-manager_rbacManager': import("../../content-manager/hooks/useSyncRbac").SyncRbacState;
    readonly 'content-manager_editViewLayoutManager': import("../../content-manager/pages/EditViewLayoutManager").EditViewLayoutManagerState;
    readonly 'content-manager_editViewCrudReducer': import("../../content-manager/sharedReducers/crud/reducer").CrudState;
}, import("redux").AnyAction, (import("@reduxjs/toolkit").ThunkMiddleware<{
    readonly adminApi: import("@reduxjs/toolkit/query").CombinedState<{
        regenerateToken: import("@reduxjs/toolkit/query").MutationDefinition<string, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("../../utils/baseQuery").QueryArguments, unknown, import("../../utils/baseQuery").BaseQueryError>, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", import("../../../../shared/contracts/transfer").TransferToken, "adminApi">;
    }, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", "adminApi">;
    readonly admin_app: AppState;
    readonly rbacProvider: RBACState;
    readonly 'content-manager_app': import("../../content-manager/pages/App").ContentManagerAppState;
    readonly 'content-manager_listView': import("../../content-manager/pages/ListViewLayoutManager").ListViewLayoutManagerState;
    readonly 'content-manager_rbacManager': import("../../content-manager/hooks/useSyncRbac").SyncRbacState;
    readonly 'content-manager_editViewLayoutManager': import("../../content-manager/pages/EditViewLayoutManager").EditViewLayoutManagerState;
    readonly 'content-manager_editViewCrudReducer': import("../../content-manager/sharedReducers/crud/reducer").CrudState;
}, import("redux").AnyAction> | Middleware<{}, import("@reduxjs/toolkit/query").RootState<{
    regenerateToken: import("@reduxjs/toolkit/query").MutationDefinition<string, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("../../utils/baseQuery").QueryArguments, unknown, import("../../utils/baseQuery").BaseQueryError>, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", import("../../../../shared/contracts/transfer").TransferToken, "adminApi">;
}, string, "adminApi">, import("@reduxjs/toolkit").ThunkDispatch<any, any, import("redux").AnyAction>>)[]>;
type Store = ReturnType<typeof configureStoreImpl> & {
    asyncReducers: Record<string, Reducer>;
    injectReducer: (key: string, asyncReducer: Reducer) => void;
};
type RootState = ReturnType<Store['getState']>;
export { configureStoreImpl as configureStore };
export type { RootState, AppState, RBACState, Store, PreloadState };

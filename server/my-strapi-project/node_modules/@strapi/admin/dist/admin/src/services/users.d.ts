import { Entity } from '@strapi/types';
import * as Permissions from '../../../shared/contracts/permissions';
import * as Roles from '../../../shared/contracts/roles';
import * as Users from '../../../shared/contracts/user';
type GetUsersParams = Users.FindOne.Params | (Users.FindAll.Request['query'] & {
    id?: never;
});
type GetRolesParams = Roles.FindRole.Request['params'] | (Roles.FindRoles.Request['query'] & {
    id?: never;
});
interface GetRolePermissionsParams {
    id: Entity.ID;
}
declare const useCreateUserMutation: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseMutation<import("@reduxjs/toolkit/query").MutationDefinition<import("../../../shared/contracts/shared").AdminUserCreationPayload, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("../utils/baseQuery").QueryArguments, unknown, import("../utils/baseQuery").BaseQueryError>, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", import("..").SanitizedAdminUser, "adminApi">>, useUpdateUserMutation: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseMutation<import("@reduxjs/toolkit/query").MutationDefinition<Omit<Omit<import("../../../shared/contracts/shared").AdminUser, keyof import("../../../shared/contracts/shared").Entity | "roles"> & {
    roles: Entity.ID[];
} & Users.Update.Params, "blocked">, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("../utils/baseQuery").QueryArguments, unknown, import("../utils/baseQuery").BaseQueryError>, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", import("..").SanitizedAdminUser, "adminApi">>, useDeleteManyUsersMutation: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseMutation<import("@reduxjs/toolkit/query").MutationDefinition<{
    ids: Entity.ID[];
}, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("../utils/baseQuery").QueryArguments, unknown, import("../utils/baseQuery").BaseQueryError>, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", import("..").SanitizedAdminUser[], "adminApi">>, useGetRolesQuery: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseQuery<import("@reduxjs/toolkit/query").QueryDefinition<void | GetRolesParams, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("../utils/baseQuery").QueryArguments, unknown, import("../utils/baseQuery").BaseQueryError>, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", (import("../../../shared/contracts/shared").SanitizedAdminRole & {
    usersCount?: number | undefined;
})[], "adminApi">>, useCreateRoleMutation: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseMutation<import("@reduxjs/toolkit/query").MutationDefinition<{
    name: string;
    description?: string | undefined;
}, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("../utils/baseQuery").QueryArguments, unknown, import("../utils/baseQuery").BaseQueryError>, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", import("../../../shared/contracts/shared").SanitizedAdminRole, "adminApi">>, useUpdateRoleMutation: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseMutation<import("@reduxjs/toolkit/query").MutationDefinition<{
    name?: string | undefined;
    description?: string | undefined;
} & {
    id: string;
}, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("../utils/baseQuery").QueryArguments, unknown, import("../utils/baseQuery").BaseQueryError>, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", import("../../../shared/contracts/shared").SanitizedAdminRole, "adminApi">>, useGetRolePermissionsQuery: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseQuery<import("@reduxjs/toolkit/query").QueryDefinition<GetRolePermissionsParams, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("../utils/baseQuery").QueryArguments, unknown, import("../utils/baseQuery").BaseQueryError>, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", import("../../../shared/contracts/shared").Permission[], "adminApi">>, useGetRolePermissionLayoutQuery: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseQuery<import("@reduxjs/toolkit/query").QueryDefinition<{
    role: Entity.ID;
}, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("../utils/baseQuery").QueryArguments, unknown, import("../utils/baseQuery").BaseQueryError>, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", {
    conditions: Permissions.Condition[];
    sections: {
        collectionTypes: Permissions.ContentPermission;
        plugins: Permissions.PluginPermission[];
        settings: Permissions.SettingPermission[];
        singleTypes: Permissions.ContentPermission;
    };
}, "adminApi">>, useUpdateRolePermissionsMutation: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseMutation<import("@reduxjs/toolkit/query").MutationDefinition<{
    permissions: Omit<import("../../../shared/contracts/shared").Permission, "id" | "createdAt" | "updatedAt" | "actionParameters">[];
} & {
    id: Entity.ID;
}, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("../utils/baseQuery").QueryArguments, unknown, import("../utils/baseQuery").BaseQueryError>, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", Roles.SanitizedPermission[], "adminApi">>;
declare const useAdminUsers: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseQuery<import("@reduxjs/toolkit/query").QueryDefinition<void | GetUsersParams, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("../utils/baseQuery").QueryArguments, unknown, import("../utils/baseQuery").BaseQueryError>, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", {
    users: Users.FindAll.Response['data']['results'];
    pagination: Users.FindAll.Response['data']['pagination'] | null;
}, "adminApi">>;
export { useUpdateUserMutation, useGetRolesQuery, useAdminUsers, useDeleteManyUsersMutation, useCreateUserMutation, useGetRolePermissionsQuery, useGetRolePermissionLayoutQuery, useCreateRoleMutation, useUpdateRolePermissionsMutation, useUpdateRoleMutation, };
export type { GetRolesParams, GetUsersParams, GetRolePermissionsParams };

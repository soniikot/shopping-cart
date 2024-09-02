/**
 * This will 100% be moved into it's own reducer space when
 * we move the content-manager back to it's plugin.
 */
import type { Contracts } from '@strapi/plugin-content-manager/_internal/shared';
declare const useGetComponentsQuery: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseQuery<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("../utils/baseQuery").QueryArguments, unknown, import("../utils/baseQuery").BaseQueryError>, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", Contracts.Components.Component[], "adminApi">>, useGetContentTypesQuery: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseQuery<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("../utils/baseQuery").QueryArguments, unknown, import("../utils/baseQuery").BaseQueryError>, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", Contracts.ContentTypes.ContentType[], "adminApi">>;
export { useGetComponentsQuery, useGetContentTypesQuery };

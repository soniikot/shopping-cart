declare const useGetPermissionsQuery: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseQuery<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("../utils/baseQuery").QueryArguments, unknown, import("../utils/baseQuery").BaseQueryError>, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", import("../../../shared/contracts/content-api/permissions").ContentApiPermission, "adminApi">>, useGetRoutesQuery: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseQuery<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("../utils/baseQuery").QueryArguments, unknown, import("../utils/baseQuery").BaseQueryError>, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", {
    [x: string]: {
        config: {
            auth: {
                scope: string[];
            };
        };
        handler: string;
        info: {
            apiName: string;
            type: string;
        };
        method: "GET" | "DELETE" | "POST" | "PUT";
        path: string;
    }[];
}, "adminApi">>;
export { useGetPermissionsQuery, useGetRoutesQuery };

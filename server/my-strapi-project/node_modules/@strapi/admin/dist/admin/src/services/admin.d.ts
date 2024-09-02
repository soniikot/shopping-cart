import { type UpdateProjectSettings, type Plugins, type GetLicenseLimitInformation } from '../../../shared/contracts/admin';
interface ConfigurationLogo {
    custom?: {
        name?: string;
        url?: string;
    };
    default: string;
}
declare const useInitQuery: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseQuery<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("../utils/baseQuery").QueryArguments, unknown, import("../utils/baseQuery").BaseQueryError>, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", {
    uuid: string | false;
    hasAdmin: boolean;
    menuLogo: string | null;
    authLogo: string | null;
}, "adminApi">>, useTelemetryPropertiesQuery: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseQuery<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("../utils/baseQuery").QueryArguments, unknown, import("../utils/baseQuery").BaseQueryError>, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", {
    useTypescriptOnServer: boolean;
    useTypescriptOnAdmin: boolean;
    isHostedOnStrapiCloud: boolean;
    numberOfAllContentTypes: number;
    numberOfComponents: number;
    numberOfDynamicZones: number;
}, "adminApi">>, useInformationQuery: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseQuery<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("../utils/baseQuery").QueryArguments, unknown, import("../utils/baseQuery").BaseQueryError>, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", {
    currentEnvironment: string;
    autoReload: boolean;
    strapiVersion: string | null;
    dependencies: Record<string, string>;
    projectId: string | null;
    nodeVersion: string;
    communityEdition: boolean;
    useYarn: boolean;
}, "adminApi">>, useProjectSettingsQuery: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseQuery<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("../utils/baseQuery").QueryArguments, unknown, import("../utils/baseQuery").BaseQueryError>, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", {
    authLogo?: ConfigurationLogo['custom'];
    menuLogo?: ConfigurationLogo['custom'];
}, "adminApi">>, useUpdateProjectSettingsMutation: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseMutation<import("@reduxjs/toolkit/query").MutationDefinition<FormData, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("../utils/baseQuery").QueryArguments, unknown, import("../utils/baseQuery").BaseQueryError>, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", UpdateProjectSettings.Response, "adminApi">>, useGetPluginsQuery: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseQuery<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("../utils/baseQuery").QueryArguments, unknown, import("../utils/baseQuery").BaseQueryError>, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", Plugins.Response, "adminApi">>, useGetLicenseLimitsQuery: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseQuery<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("../utils/baseQuery").QueryArguments, unknown, import("../utils/baseQuery").BaseQueryError>, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", GetLicenseLimitInformation.Response, "adminApi">>;
export { useInitQuery, useTelemetryPropertiesQuery, useInformationQuery, useProjectSettingsQuery, useUpdateProjectSettingsMutation, useGetPluginsQuery, useGetLicenseLimitsQuery, };
export type { ConfigurationLogo };

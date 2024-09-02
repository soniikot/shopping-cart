import { Contracts } from '@strapi/plugin-content-manager/_internal/shared';
import * as ReviewWorkflows from '../../../../shared/contracts/review-workflows';
type GetWorkflowsParams = ReviewWorkflows.Get.Params | (ReviewWorkflows.GetAll.Request['query'] & {
    id?: never;
});
declare const useGetWorkflowsQuery: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseQuery<import("@reduxjs/toolkit/query").QueryDefinition<void | GetWorkflowsParams, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("../../../../admin/src/utils/baseQuery").QueryArguments, unknown, import("../../../../admin/src/utils/baseQuery").BaseQueryError>, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", {
    workflows: ReviewWorkflows.GetAll.Response['data'];
    meta?: ReviewWorkflows.GetAll.Response['meta'];
}, "adminApi">>, useCreateWorkflowMutation: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseMutation<import("@reduxjs/toolkit/query").MutationDefinition<{
    data: Omit<ReviewWorkflows.Workflow, "id" | "createdAt" | "updatedAt">;
}, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("../../../../admin/src/utils/baseQuery").QueryArguments, unknown, import("../../../../admin/src/utils/baseQuery").BaseQueryError>, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", ReviewWorkflows.Workflow, "adminApi">>, useDeleteWorkflowMutation: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseMutation<import("@reduxjs/toolkit/query").MutationDefinition<ReviewWorkflows.Delete.Params, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("../../../../admin/src/utils/baseQuery").QueryArguments, unknown, import("../../../../admin/src/utils/baseQuery").BaseQueryError>, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", ReviewWorkflows.Workflow, "adminApi">>, useUpdateWorkflowMutation: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseMutation<import("@reduxjs/toolkit/query").MutationDefinition<{
    data: Partial<ReviewWorkflows.Workflow>;
} & ReviewWorkflows.Update.Params, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("../../../../admin/src/utils/baseQuery").QueryArguments, unknown, import("../../../../admin/src/utils/baseQuery").BaseQueryError>, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", ReviewWorkflows.Workflow, "adminApi">>, useGetStagesQuery: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseQuery<import("@reduxjs/toolkit/query").QueryDefinition<Contracts.ReviewWorkflows.GetStages.Params & {
    slug: string;
}, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("../../../../admin/src/utils/baseQuery").QueryArguments, unknown, import("../../../../admin/src/utils/baseQuery").BaseQueryError>, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", {
    stages: NonNullable<Contracts.ReviewWorkflows.GetStages.Response['data']>;
    meta: NonNullable<Contracts.ReviewWorkflows.GetStages.Response['meta']>;
}, "adminApi">>, useUpdateStageMutation: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseMutation<import("@reduxjs/toolkit/query").MutationDefinition<{
    data: {
        id: import("@strapi/types/dist/types/core/entity").ID;
    };
} & Contracts.ReviewWorkflows.UpdateStage.Params & {
    slug: string;
}, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("../../../../admin/src/utils/baseQuery").QueryArguments, unknown, import("../../../../admin/src/utils/baseQuery").BaseQueryError>, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", {
    id: import("@strapi/types/dist/types/core/entity").ID;
} & {
    [key: string]: any;
}, "adminApi">>, useUpdateAssigneeMutation: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseMutation<import("@reduxjs/toolkit/query").MutationDefinition<{
    data: {
        id: import("@strapi/types/dist/types/core/entity").ID | null;
    };
} & Contracts.ReviewWorkflows.UpdateAssignee.Params & {
    slug: string;
}, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("../../../../admin/src/utils/baseQuery").QueryArguments, unknown, import("../../../../admin/src/utils/baseQuery").BaseQueryError>, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", {
    id: import("@strapi/types/dist/types/core/entity").ID;
} & {
    [key: string]: any;
}, "adminApi">>;
export { useGetWorkflowsQuery, useCreateWorkflowMutation, useDeleteWorkflowMutation, useUpdateWorkflowMutation, useGetStagesQuery, useUpdateStageMutation, useUpdateAssigneeMutation, type GetWorkflowsParams, };

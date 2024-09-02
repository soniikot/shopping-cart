import { GetWorkflowsParams } from '../../../../../services/reviewWorkflows';
export declare function useReviewWorkflows(params?: GetWorkflowsParams): {
    meta: {
        workflowCount: number;
    } | undefined;
    workflows: import("../../../../../../../../shared/contracts/review-workflows").Workflow[] | undefined;
    isLoading: boolean;
    createWorkflow: import("@reduxjs/toolkit/dist/query/react/buildHooks").MutationTrigger<import("@reduxjs/toolkit/query").MutationDefinition<{
        data: Omit<import("../../../../../../../../shared/contracts/review-workflows").Workflow, "id" | "createdAt" | "updatedAt">;
    }, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("../../../../../../../../admin/src/utils/baseQuery").QueryArguments, unknown, import("../../../../../../../../admin/src/utils/baseQuery").BaseQueryError>, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", import("../../../../../../../../shared/contracts/review-workflows").Workflow, "adminApi">>;
    updateWorkflow: import("@reduxjs/toolkit/dist/query/react/buildHooks").MutationTrigger<import("@reduxjs/toolkit/query").MutationDefinition<{
        data: Partial<import("../../../../../../../../shared/contracts/review-workflows").Workflow>;
    } & import("../../../../../../../../shared/contracts/review-workflows").Update.Params, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("../../../../../../../../admin/src/utils/baseQuery").QueryArguments, unknown, import("../../../../../../../../admin/src/utils/baseQuery").BaseQueryError>, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", import("../../../../../../../../shared/contracts/review-workflows").Workflow, "adminApi">>;
    deleteWorkflow: import("@reduxjs/toolkit/dist/query/react/buildHooks").MutationTrigger<import("@reduxjs/toolkit/query").MutationDefinition<import("../../../../../../../../shared/contracts/review-workflows").Delete.Params, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("../../../../../../../../admin/src/utils/baseQuery").QueryArguments, unknown, import("../../../../../../../../admin/src/utils/baseQuery").BaseQueryError>, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", import("../../../../../../../../shared/contracts/review-workflows").Workflow, "adminApi">>;
};

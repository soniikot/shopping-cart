import { SerializedError } from '@reduxjs/toolkit';
import { GetWebhook } from '../../../../../../../shared/contracts/webhooks';
import { useGetWebhooksQuery } from '../../../../../services/webhooks';
import { BaseQueryError } from '../../../../../utils/baseQuery';
declare const useWebhooks: (args?: GetWebhook.Params | void, queryArgs?: Parameters<typeof useGetWebhooksQuery>[1]) => {
    webhooks: import("@strapi/types").Webhook[] | undefined;
    isLoading: boolean;
    error: BaseQueryError | SerializedError;
    createWebhook: import("@reduxjs/toolkit/dist/query/react/buildHooks").MutationTrigger<import("@reduxjs/toolkit/query").MutationDefinition<Omit<import("@strapi/types").Webhook, "id" | "isEnabled">, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("../../../../../utils/baseQuery").QueryArguments, unknown, BaseQueryError>, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", import("@strapi/types").Webhook, "adminApi">>;
    updateWebhook: import("@reduxjs/toolkit/dist/query/react/buildHooks").MutationTrigger<import("@reduxjs/toolkit/query").MutationDefinition<Partial<import("@strapi/types").Webhook> & import("../../../../../../../shared/contracts/webhooks").UpdateWebhook.Params, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("../../../../../utils/baseQuery").QueryArguments, unknown, BaseQueryError>, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", import("@strapi/types").Webhook, "adminApi">>;
    triggerWebhook: import("@reduxjs/toolkit/dist/query/react/buildHooks").MutationTrigger<import("@reduxjs/toolkit/query").MutationDefinition<string, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("../../../../../utils/baseQuery").QueryArguments, unknown, BaseQueryError>, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", {
        statusCode: number;
        message?: string | undefined;
    }, "adminApi">>;
    deleteManyWebhooks: import("@reduxjs/toolkit/dist/query/react/buildHooks").MutationTrigger<import("@reduxjs/toolkit/query").MutationDefinition<{
        ids: string[];
    }, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("../../../../../utils/baseQuery").QueryArguments, unknown, BaseQueryError>, "ApiToken" | "LicenseLimits" | "Me" | "ProjectSettings" | "ProvidersOptions" | "ReviewWorkflow" | "ReviewWorkflowStage" | "Role" | "RolePermissions" | "TransferToken" | "User" | "Webhook", {}, "adminApi">>;
};
export { useWebhooks };

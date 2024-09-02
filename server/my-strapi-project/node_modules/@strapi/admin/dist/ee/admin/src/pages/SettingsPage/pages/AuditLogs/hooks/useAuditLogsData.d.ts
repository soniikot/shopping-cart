export declare const useAuditLogsData: ({ canReadAuditLogs, canReadUsers, }: {
    canReadAuditLogs: boolean;
    canReadUsers: boolean;
}) => {
    auditLogs: import("../../../../../../../../shared/contracts/audit-logs").GetAll.Response | undefined;
    users: import("../../../../../../../../admin/src").SanitizedAdminUser[];
    isLoading: boolean;
    hasError: boolean;
};

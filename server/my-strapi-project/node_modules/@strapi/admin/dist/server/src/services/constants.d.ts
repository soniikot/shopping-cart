declare const constants: {
    CONTENT_TYPE_SECTION: string;
    SUPER_ADMIN_CODE: string;
    EDITOR_CODE: string;
    AUTHOR_CODE: string;
    READ_ACTION: string;
    CREATE_ACTION: string;
    UPDATE_ACTION: string;
    DELETE_ACTION: string;
    PUBLISH_ACTION: string;
    API_TOKEN_TYPE: {
        READ_ONLY: string;
        FULL_ACCESS: string;
        CUSTOM: string;
    };
    API_TOKEN_LIFESPANS: {
        UNLIMITED: null;
        DAYS_7: number;
        DAYS_30: number;
        DAYS_90: number;
    };
    TRANSFER_TOKEN_TYPE: {
        PUSH: string;
        PULL: string;
    };
    TRANSFER_TOKEN_LIFESPANS: {
        UNLIMITED: null;
        DAYS_7: number;
        DAYS_30: number;
        DAYS_90: number;
    };
};
export default constants;
//# sourceMappingURL=constants.d.ts.map
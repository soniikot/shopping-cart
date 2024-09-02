export declare const REVIEW_WORKFLOW_COLUMNS_EE: ({
    key: string;
    name: string;
    fieldSchema: {
        type: "relation";
        relation: "oneToMany";
        target: "admin::review-workflow-stage";
    };
    metadatas: {
        label: {
            id: string;
            defaultMessage: string;
        };
        searchable: false;
        sortable: true;
        mainField: {
            name: string;
            type: "string";
        };
    };
} | {
    key: string;
    name: string;
    fieldSchema: {
        type: "relation";
        target: "admin::user";
        relation: "oneToMany";
    };
    metadatas: {
        label: {
            id: string;
            defaultMessage: string;
        };
        searchable: false;
        sortable: true;
        mainField: {
            name: string;
            type: "string";
        };
    };
})[];
export declare const REVIEW_WORKFLOW_FILTERS: ({
    fieldSchema: {
        type: "relation";
        mainField: {
            name: string;
            type: "string";
        };
    };
    metadatas: {
        customInput: ({ value, onChange, uid }: import("./components/StageFilter").StageFilterProps) => import("react/jsx-runtime").JSX.Element;
        label: {
            id: string;
            defaultMessage: string;
        };
        customOperators?: undefined;
    };
    name: string;
} | {
    fieldSchema: {
        type: "relation";
        mainField: {
            name: string;
            type: "integer";
        };
    };
    metadatas: {
        customInput: ({ value, onChange }: import("./components/AssigneeFilter").AssigneeFilterProps) => import("react/jsx-runtime").JSX.Element;
        customOperators: {
            intlLabel: {
                id: string;
                defaultMessage: string;
            };
            value: string;
        }[];
        label: {
            id: string;
            defaultMessage: string;
        };
    };
    name: string;
})[];

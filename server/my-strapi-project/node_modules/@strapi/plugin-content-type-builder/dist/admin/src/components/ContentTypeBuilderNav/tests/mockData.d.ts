export declare const mockData: ({
    name: string;
    title: {
        id: string;
        defaultMessage: string;
    };
    customLink: {
        id: string;
        defaultMessage: string;
    };
    links: {
        visible: boolean;
        name: string;
        title: string;
        plugin: null;
        uid: string;
        to: string;
        kind: string;
        restrictRelationsTo: null;
    }[];
} | {
    name: string;
    title: {
        id: string;
        defaultMessage: string;
    };
    customLink: {
        id: string;
        defaultMessage: string;
    };
    links: {
        name: string;
        title: string;
        isEditable: boolean;
        links: {
            name: string;
            to: string;
            title: string;
        }[];
    }[];
})[];

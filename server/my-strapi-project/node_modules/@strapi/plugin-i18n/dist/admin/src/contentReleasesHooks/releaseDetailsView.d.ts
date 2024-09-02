import { Attribute } from '@strapi/types';
interface AddLocaleToReleasesHookArgs {
    displayedHeaders: {
        key: string;
        fieldSchema: Attribute.Kind | 'custom';
        metadatas: {
            label: {
                id: string;
                defaultMessage: string;
            };
            searchable: boolean;
            sortable: boolean;
        };
        name: string;
    }[];
    hasI18nEnabled: boolean;
}
declare const addLocaleToReleasesHook: ({ displayedHeaders }: AddLocaleToReleasesHookArgs) => {
    displayedHeaders: ({
        key: string;
        fieldSchema: Attribute.Kind | 'custom';
        metadatas: {
            label: {
                id: string;
                defaultMessage: string;
            };
            searchable: boolean;
            sortable: boolean;
        };
        name: string;
    } | {
        key: string;
        fieldSchema: {
            type: string;
        };
        metadatas: {
            label: {
                id: string;
                defaultMessage: string;
            };
            searchable: boolean;
            sortable: boolean;
        };
        name: string;
    })[];
    hasI18nEnabled: boolean;
};
export { addLocaleToReleasesHook };

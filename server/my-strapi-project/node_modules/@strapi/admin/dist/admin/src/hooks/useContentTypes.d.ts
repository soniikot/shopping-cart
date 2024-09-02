import { Contracts } from '@strapi/plugin-content-manager/_internal/shared';
export declare function useContentTypes(): {
    isLoading: boolean;
    components: Contracts.Components.Component[];
    collectionTypes: Contracts.ContentTypes.ContentType[];
    singleTypes: Contracts.ContentTypes.ContentType[];
};

import { Contracts } from '@strapi/plugin-content-manager/_internal/shared';
declare const useContentTypeLayout: (contentTypeUID: string) => {
    isLoading: boolean;
    layout: import("../utils/layouts").FormattedLayouts | null;
    updateLayout: <TPageData>(options?: (import("react-query").RefetchOptions & import("react-query").RefetchQueryFilters<TPageData>) | undefined) => Promise<import("react-query").QueryObserverResult<{
        contentType: Contracts.ContentTypes.Configuration;
        components: Record<string, Contracts.Components.ComponentConfiguration>;
    }, unknown>>;
};
export { useContentTypeLayout };

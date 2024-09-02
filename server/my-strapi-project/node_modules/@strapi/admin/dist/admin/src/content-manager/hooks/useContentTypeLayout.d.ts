declare const useContentTypeLayout: () => {
    getComponentLayout: (componentUid: string) => import("../utils/layouts").FormattedComponentLayout;
    components: Record<string, import("../utils/layouts").FormattedComponentLayout>;
    contentType: import("../utils/layouts").FormattedContentTypeLayout | null;
};
export { useContentTypeLayout };

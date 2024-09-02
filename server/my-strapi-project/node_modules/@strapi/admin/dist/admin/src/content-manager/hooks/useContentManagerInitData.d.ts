import { Permission } from '@strapi/helper-plugin';
import { Contracts } from '@strapi/plugin-content-manager/_internal/shared';
interface ContentManagerLink {
    permissions: Permission[];
    search: string | null;
    kind: string;
    title: string;
    to: string;
    uid: string;
    name: string;
    isDisplayed: boolean;
}
/**
 * TODO: refactor this whole thing.
 */
declare const useContentManagerInitData: () => {
    refetchData: () => Promise<void>;
    collectionTypeLinks: ContentManagerLink[];
    components: Contracts.Components.Component[];
    fieldSizes: Record<string, {
        default: number;
        isResizeable: boolean;
    }>;
    models: Contracts.ContentTypes.ContentType[];
    singleTypeLinks: ContentManagerLink[];
    status: "error" | "loading" | "resolved";
};
export { useContentManagerInitData };
export type { ContentManagerLink };

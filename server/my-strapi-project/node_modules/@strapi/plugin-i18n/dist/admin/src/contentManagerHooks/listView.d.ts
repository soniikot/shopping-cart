import type { CMAdminConfiguration } from '../types';
interface AddColumnToTableHookArgs {
    layout: {
        components: Record<string, CMAdminConfiguration>;
        contentType: CMAdminConfiguration;
    };
    /**
     * TODO: this should come from the admin package.
     */
    displayedHeaders: unknown[];
}
declare const addColumnToTableHook: ({ displayedHeaders, layout }: AddColumnToTableHookArgs) => {
    displayedHeaders: unknown[];
    layout: {
        components: Record<string, CMAdminConfiguration>;
        contentType: CMAdminConfiguration;
    };
};
export { addColumnToTableHook };

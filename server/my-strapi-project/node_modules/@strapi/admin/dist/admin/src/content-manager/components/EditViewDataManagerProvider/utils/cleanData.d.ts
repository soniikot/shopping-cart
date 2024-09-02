import type { FormattedComponentLayout, FormattedContentTypeLayout } from '../../../utils/layouts';
declare const cleanData: ({ browserState, serverState, }: {
    browserState: Record<string, any>;
    serverState: Record<string, any>;
}, currentSchema: FormattedContentTypeLayout, componentsSchema: Record<string, FormattedComponentLayout>) => Record<string, any>;
export { cleanData };

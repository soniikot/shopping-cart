import { LoadedStrapi as Strapi, Schema } from '@strapi/types';
import type { Configuration } from '../../../shared/contracts/content-types';
declare const _default: ({ strapi }: {
    strapi: Strapi;
}) => {
    sendDidConfigureListView: (contentType: Schema.ContentType, configuration: Configuration) => Promise<void>;
};
export default _default;
//# sourceMappingURL=metrics.d.ts.map
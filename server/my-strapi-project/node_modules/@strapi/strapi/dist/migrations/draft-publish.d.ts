import { Schema } from '@strapi/types';
interface Input {
    oldContentTypes: Record<string, Schema.ContentType>;
    contentTypes: Record<string, Schema.ContentType>;
}
declare const enableDraftAndPublish: ({ oldContentTypes, contentTypes }: Input) => Promise<void>;
declare const disableDraftAndPublish: ({ oldContentTypes, contentTypes }: Input) => Promise<void>;
export { enableDraftAndPublish as enable, disableDraftAndPublish as disable };
//# sourceMappingURL=draft-publish.d.ts.map
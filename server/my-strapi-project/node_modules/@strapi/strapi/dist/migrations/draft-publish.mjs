import { contentTypes } from "@strapi/utils";
const enableDraftAndPublish = async ({ oldContentTypes, contentTypes: contentTypes$1 }) => {
  if (!oldContentTypes) {
    return;
  }
  for (const uid in contentTypes$1) {
    if (!oldContentTypes[uid]) {
      continue;
    }
    const oldContentType = oldContentTypes[uid];
    const contentType = contentTypes$1[uid];
    if (!contentTypes.hasDraftAndPublish(oldContentType) && contentTypes.hasDraftAndPublish(contentType)) {
      const qb = strapi.db?.queryBuilder(uid);
      await qb.update({ published_at: qb.ref("created_at") }).where({ published_at: null }).execute();
    }
  }
};
const disableDraftAndPublish = async ({ oldContentTypes, contentTypes: contentTypes$1 }) => {
  if (!oldContentTypes) {
    return;
  }
  for (const uid in contentTypes$1) {
    if (!oldContentTypes[uid]) {
      continue;
    }
    const oldContentType = oldContentTypes[uid];
    const contentType = contentTypes$1[uid];
    if (contentTypes.hasDraftAndPublish(oldContentType) && !contentTypes.hasDraftAndPublish(contentType)) {
      await strapi.db?.queryBuilder(uid).delete().where({ published_at: null }).execute();
    }
  }
};
export {
  disableDraftAndPublish as disable,
  enableDraftAndPublish as enable
};
//# sourceMappingURL=draft-publish.mjs.map

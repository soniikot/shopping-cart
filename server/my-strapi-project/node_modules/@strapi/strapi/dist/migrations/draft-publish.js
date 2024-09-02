"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const strapiUtils = require("@strapi/utils");
const enableDraftAndPublish = async ({ oldContentTypes, contentTypes }) => {
  if (!oldContentTypes) {
    return;
  }
  for (const uid in contentTypes) {
    if (!oldContentTypes[uid]) {
      continue;
    }
    const oldContentType = oldContentTypes[uid];
    const contentType = contentTypes[uid];
    if (!strapiUtils.contentTypes.hasDraftAndPublish(oldContentType) && strapiUtils.contentTypes.hasDraftAndPublish(contentType)) {
      const qb = strapi.db?.queryBuilder(uid);
      await qb.update({ published_at: qb.ref("created_at") }).where({ published_at: null }).execute();
    }
  }
};
const disableDraftAndPublish = async ({ oldContentTypes, contentTypes }) => {
  if (!oldContentTypes) {
    return;
  }
  for (const uid in contentTypes) {
    if (!oldContentTypes[uid]) {
      continue;
    }
    const oldContentType = oldContentTypes[uid];
    const contentType = contentTypes[uid];
    if (strapiUtils.contentTypes.hasDraftAndPublish(oldContentType) && !strapiUtils.contentTypes.hasDraftAndPublish(contentType)) {
      await strapi.db?.queryBuilder(uid).delete().where({ published_at: null }).execute();
    }
  }
};
exports.disable = disableDraftAndPublish;
exports.enable = enableDraftAndPublish;
//# sourceMappingURL=draft-publish.js.map

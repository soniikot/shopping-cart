"use strict";
const fp = require("lodash/fp");
async function isInitialized(strapi) {
  try {
    if (fp.isEmpty(strapi.admin)) {
      return true;
    }
    const anyAdministrator = await strapi.query("admin::user").findOne({ select: ["id"] });
    return !fp.isNil(anyAdministrator);
  } catch (err) {
    strapi.stopWithError(err);
  }
}
module.exports = isInitialized;
//# sourceMappingURL=is-initialized.js.map

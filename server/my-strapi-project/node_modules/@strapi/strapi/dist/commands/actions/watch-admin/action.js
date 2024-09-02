"use strict";
const admin = require("@strapi/admin");
const action = async ({ browser }, _cmd, { logger }) => {
  logger.warn("[@strapi/strapi]: watch-admin is deprecated, please use strapi develop instead");
  await admin.watchAdmin({
    browser
  });
};
module.exports = action;
//# sourceMappingURL=action.js.map

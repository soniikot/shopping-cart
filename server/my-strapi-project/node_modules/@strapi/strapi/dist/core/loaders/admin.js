"use strict";
const _ = require("lodash");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const ___default = /* @__PURE__ */ _interopDefault(_);
async function loadAdmin(strapi) {
  strapi.admin = require("@strapi/admin/strapi-server");
  strapi.container.get("services").add(`admin::`, strapi.admin?.services);
  strapi.container.get("controllers").add(`admin::`, strapi.admin?.controllers);
  strapi.container.get("content-types").add(`admin::`, strapi.admin?.contentTypes);
  strapi.container.get("policies").add(`admin::`, strapi.admin?.policies);
  strapi.container.get("middlewares").add(`admin::`, strapi.admin?.middlewares);
  const userAdminConfig = strapi.config.get("admin");
  strapi.container.get("config").set("admin", ___default.default.merge(strapi.admin?.config, userAdminConfig));
}
module.exports = loadAdmin;
//# sourceMappingURL=admin.js.map

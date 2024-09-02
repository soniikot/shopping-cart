"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const api = require("./api.js");
const createAdminAPI = (strapi) => {
  const opts = {
    prefix: "",
    // '/admin';
    type: "admin"
  };
  return api.createAPI(strapi, opts);
};
exports.createAdminAPI = createAdminAPI;
//# sourceMappingURL=admin-api.js.map

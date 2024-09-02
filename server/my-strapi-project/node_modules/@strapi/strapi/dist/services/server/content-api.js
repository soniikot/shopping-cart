"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const api = require("./api.js");
const createContentAPI = (strapi) => {
  const opts = {
    prefix: strapi.config.get("api.rest.prefix", "/api"),
    type: "content-api"
  };
  return api.createAPI(strapi, opts);
};
exports.createContentAPI = createContentAPI;
//# sourceMappingURL=content-api.js.map

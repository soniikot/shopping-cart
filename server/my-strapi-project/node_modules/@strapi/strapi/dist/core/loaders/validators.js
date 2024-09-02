"use strict";
const loadValidators = (strapi) => {
  strapi.container.get("validators").set("content-api", { input: [], query: [] });
};
module.exports = loadValidators;
//# sourceMappingURL=validators.js.map

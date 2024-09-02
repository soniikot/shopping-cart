"use strict";
const loadSanitizers = (strapi) => {
  strapi.container.get("sanitizers").set("content-api", { input: [], output: [], query: [] });
};
module.exports = loadSanitizers;
//# sourceMappingURL=sanitizers.js.map

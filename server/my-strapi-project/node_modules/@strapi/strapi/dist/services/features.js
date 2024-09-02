"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const createFeaturesService = (strapi) => {
  const service = {
    get config() {
      return strapi.config.get("features");
    },
    future: {
      isEnabled(futureFlagName) {
        return service.config?.future?.[futureFlagName] === true;
      }
    }
  };
  return service;
};
exports.createFeaturesService = createFeaturesService;
//# sourceMappingURL=features.js.map

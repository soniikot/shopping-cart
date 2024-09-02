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
export {
  createFeaturesService
};
//# sourceMappingURL=features.mjs.map

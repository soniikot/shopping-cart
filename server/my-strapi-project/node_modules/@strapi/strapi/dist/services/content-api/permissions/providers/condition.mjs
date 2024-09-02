import { providerFactory } from "@strapi/utils";
const createConditionProvider = (options = {}) => {
  const provider = providerFactory(options);
  return {
    ...provider,
    async register(condition) {
      if (strapi.isLoaded) {
        throw new Error(`You can't register new conditions outside the bootstrap function.`);
      }
      return provider.register(condition.name, condition);
    }
  };
};
export {
  createConditionProvider as default
};
//# sourceMappingURL=condition.mjs.map

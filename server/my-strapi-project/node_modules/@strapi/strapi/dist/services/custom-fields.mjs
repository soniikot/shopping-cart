const createCustomFields = (strapi) => {
  return {
    register(customField) {
      strapi.container.get("custom-fields").add(customField);
    }
  };
};
export {
  createCustomFields as default
};
//# sourceMappingURL=custom-fields.mjs.map

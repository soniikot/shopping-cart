const loadValidators = (strapi) => {
  strapi.container.get("validators").set("content-api", { input: [], query: [] });
};
export {
  loadValidators as default
};
//# sourceMappingURL=validators.mjs.map

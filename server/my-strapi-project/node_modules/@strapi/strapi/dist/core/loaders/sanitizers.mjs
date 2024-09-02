const loadSanitizers = (strapi) => {
  strapi.container.get("sanitizers").set("content-api", { input: [], output: [], query: [] });
};
export {
  loadSanitizers as default
};
//# sourceMappingURL=sanitizers.mjs.map

const createContainer = (strapi) => {
  const registered = /* @__PURE__ */ new Map();
  const resolved = /* @__PURE__ */ new Map();
  return {
    register(name, resolver) {
      if (registered.has(name)) {
        throw new Error(`Cannot register already registered service ${name}`);
      }
      registered.set(name, resolver);
      return this;
    },
    get(name, args) {
      if (resolved.has(name)) {
        return resolved.get(name);
      }
      if (registered.has(name)) {
        const resolver = registered.get(name);
        if (typeof resolver === "function") {
          resolved.set(name, resolver({ strapi }, args));
        } else {
          resolved.set(name, resolver);
        }
        return resolved.get(name);
      }
      throw new Error(`Could not resolve service ${name}`);
    },
    // TODO: implement
    extend() {
      return this;
    }
  };
};
export {
  createContainer
};
//# sourceMappingURL=container.mjs.map

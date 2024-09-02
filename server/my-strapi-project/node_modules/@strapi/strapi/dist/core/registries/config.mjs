import _ from "lodash";
const createConfigProvider = (initialConfig = {}) => {
  const _config = { ...initialConfig };
  return {
    ..._config,
    // TODO: to remove
    get(path, defaultValue) {
      return _.get(_config, path, defaultValue);
    },
    set(path, val) {
      _.set(_config, path, val);
      return this;
    },
    has(path) {
      return _.has(_config, path);
    }
  };
};
export {
  createConfigProvider as default
};
//# sourceMappingURL=config.mjs.map

"use strict";
const _ = require("lodash");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const ___default = /* @__PURE__ */ _interopDefault(_);
const createConfigProvider = (initialConfig = {}) => {
  const _config = { ...initialConfig };
  return {
    ..._config,
    // TODO: to remove
    get(path, defaultValue) {
      return ___default.default.get(_config, path, defaultValue);
    },
    set(path, val) {
      ___default.default.set(_config, path, val);
      return this;
    },
    has(path) {
      return ___default.default.has(_config, path);
    }
  };
};
module.exports = createConfigProvider;
//# sourceMappingURL=config.js.map

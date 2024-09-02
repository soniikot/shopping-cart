"use strict";
const _ = require("lodash");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const ___default = /* @__PURE__ */ _interopDefault(_);
const sanitizersRegistry = () => {
  const sanitizers = {};
  return {
    get(path) {
      return ___default.default.get(sanitizers, path, []);
    },
    add(path, sanitizer) {
      this.get(path).push(sanitizer);
      return this;
    },
    set(path, value = []) {
      ___default.default.set(sanitizers, path, value);
      return this;
    },
    has(path) {
      return ___default.default.has(sanitizers, path);
    }
  };
};
module.exports = sanitizersRegistry;
//# sourceMappingURL=sanitizers.js.map

"use strict";
const _ = require("lodash");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const ___default = /* @__PURE__ */ _interopDefault(_);
const isTruthy = (val) => {
  return [1, true].includes(val) || ["true", "1"].includes(___default.default.toLower(val));
};
module.exports = isTruthy;
//# sourceMappingURL=is-truthy.js.map

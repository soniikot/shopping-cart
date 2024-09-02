"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const fp = require("lodash/fp");
const pickSelectionParams = (data) => {
  return fp.pick(["fields", "populate"], data);
};
exports.pickSelectionParams = pickSelectionParams;
//# sourceMappingURL=params.js.map

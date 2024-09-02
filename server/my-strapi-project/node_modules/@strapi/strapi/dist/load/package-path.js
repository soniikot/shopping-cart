"use strict";
const path = require("path");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const path__default = /* @__PURE__ */ _interopDefault(path);
const findPackagePath = (moduleName) => path__default.default.dirname(require.resolve(`${moduleName}/package.json`));
module.exports = findPackagePath;
//# sourceMappingURL=package-path.js.map

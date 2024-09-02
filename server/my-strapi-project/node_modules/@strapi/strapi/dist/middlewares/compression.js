"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const compress = require("koa-compress");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const compress__default = /* @__PURE__ */ _interopDefault(compress);
const compression = (config) => compress__default.default(config);
exports.compression = compression;
//# sourceMappingURL=compression.js.map

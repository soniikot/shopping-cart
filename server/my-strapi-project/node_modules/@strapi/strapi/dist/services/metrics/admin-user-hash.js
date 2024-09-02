"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const crypto = require("crypto");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const crypto__default = /* @__PURE__ */ _interopDefault(crypto);
const generateAdminUserHash = (strapi) => {
  const ctx = strapi?.requestContext?.get();
  if (!ctx?.state?.user?.email) {
    return "";
  }
  return crypto__default.default.createHash("sha256").update(ctx.state.user.email).digest("hex");
};
exports.generateAdminUserHash = generateAdminUserHash;
//# sourceMappingURL=admin-user-hash.js.map

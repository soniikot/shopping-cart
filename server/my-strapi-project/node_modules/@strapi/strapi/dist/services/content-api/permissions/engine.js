"use strict";
const permissions = require("@strapi/permissions");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const permissions__default = /* @__PURE__ */ _interopDefault(permissions);
const createPermissionEngine = ({ providers }) => permissions__default.default.engine.new({ providers });
module.exports = createPermissionEngine;
//# sourceMappingURL=engine.js.map

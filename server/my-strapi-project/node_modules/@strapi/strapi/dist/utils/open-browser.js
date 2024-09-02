"use strict";
const open = require("open");
const strapiUtils = require("@strapi/utils");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const open__default = /* @__PURE__ */ _interopDefault(open);
async function openBrowser(config) {
  const url = strapiUtils.getAbsoluteAdminUrl(config);
  return open__default.default(url);
}
module.exports = openBrowser;
//# sourceMappingURL=open-browser.js.map

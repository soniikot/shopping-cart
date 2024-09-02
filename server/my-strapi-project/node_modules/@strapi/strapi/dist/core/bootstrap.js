"use strict";
const strapiUtils = require("@strapi/utils");
const fse = require("fs-extra");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const fse__default = /* @__PURE__ */ _interopDefault(fse);
async function bootstrap({ strapi }) {
  strapi.config.port = strapi.config.get("server.port") || strapi.config.port;
  strapi.config.host = strapi.config.get("server.host") || strapi.config.host;
  const { serverUrl, adminUrl, adminPath } = strapiUtils.getConfigUrls(strapi.config);
  strapi.config.server = strapi.config.server || {};
  strapi.config.server.url = serverUrl;
  strapi.config.admin.url = adminUrl;
  strapi.config.admin.path = adminPath;
  const shouldServeAdmin = strapi.config.get(
    "admin.serveAdminPanel",
    strapi.config.get("serveAdminPanel")
  );
  if (!shouldServeAdmin) {
    strapi.config.serveAdminPanel = false;
  }
  if (!await fse__default.default.pathExists(strapi.dirs.static.public)) {
    throw new Error(
      `The public folder (${strapi.dirs.static.public}) doesn't exist or is not accessible. Please make sure it exists.`
    );
  }
}
module.exports = bootstrap;
//# sourceMappingURL=bootstrap.js.map

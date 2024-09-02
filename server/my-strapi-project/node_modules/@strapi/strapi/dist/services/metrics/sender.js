"use strict";
const os = require("os");
const path = require("path");
const _ = require("lodash");
const isDocker = require("is-docker");
const ciEnv = require("ci-info");
const tsUtils = require("@strapi/typescript-utils");
const strapiUtils = require("@strapi/utils");
const machineId = require("../../utils/machine-id.js");
const adminUserHash = require("./admin-user-hash.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const os__default = /* @__PURE__ */ _interopDefault(os);
const path__default = /* @__PURE__ */ _interopDefault(path);
const ___default = /* @__PURE__ */ _interopDefault(_);
const isDocker__default = /* @__PURE__ */ _interopDefault(isDocker);
const ciEnv__default = /* @__PURE__ */ _interopDefault(ciEnv);
const tsUtils__default = /* @__PURE__ */ _interopDefault(tsUtils);
const defaultQueryOpts = {
  timeout: 1e3,
  headers: { "Content-Type": "application/json" }
};
const ANALYTICS_URI = "https://analytics.strapi.io";
const addPackageJsonStrapiMetadata = (metadata, strapi) => {
  const { packageJsonStrapi = {} } = strapi.config;
  ___default.default.defaults(metadata, packageJsonStrapi);
};
const createSender = (strapi) => {
  const { uuid } = strapi.config;
  const deviceId = machineId();
  const serverRootPath = strapi.dirs.app.root;
  const adminRootPath = path__default.default.join(strapi.dirs.app.root, "src", "admin");
  const anonymousUserProperties = {
    environment: strapi.config.environment,
    os: os__default.default.type(),
    osPlatform: os__default.default.platform(),
    osArch: os__default.default.arch(),
    osRelease: os__default.default.release(),
    nodeVersion: process.versions.node
  };
  const anonymousGroupProperties = {
    docker: process.env.DOCKER || isDocker__default.default(),
    isCI: ciEnv__default.default.isCI,
    version: strapi.config.get("info.strapi"),
    useTypescriptOnServer: tsUtils__default.default.isUsingTypeScriptSync(serverRootPath),
    useTypescriptOnAdmin: tsUtils__default.default.isUsingTypeScriptSync(adminRootPath),
    projectId: uuid,
    isHostedOnStrapiCloud: strapiUtils.env("STRAPI_HOSTING", null) === "strapi.cloud"
  };
  addPackageJsonStrapiMetadata(anonymousGroupProperties, strapi);
  return async (event, payload = {}, opts = {}) => {
    const userId = adminUserHash.generateAdminUserHash(strapi);
    const reqParams = {
      method: "POST",
      body: JSON.stringify({
        event,
        userId,
        deviceId,
        eventProperties: payload.eventProperties,
        userProperties: userId ? { ...anonymousUserProperties, ...payload.userProperties } : {},
        groupProperties: {
          ...anonymousGroupProperties,
          projectType: strapi.EE ? "Enterprise" : "Community",
          ...payload.groupProperties
        }
      }),
      ...___default.default.merge({ headers: { "X-Strapi-Event": event } }, defaultQueryOpts, opts)
    };
    try {
      const res = await strapi.fetch(`${ANALYTICS_URI}/api/v2/track`, reqParams);
      return res.ok;
    } catch (err) {
      return false;
    }
  };
};
module.exports = createSender;
//# sourceMappingURL=sender.js.map

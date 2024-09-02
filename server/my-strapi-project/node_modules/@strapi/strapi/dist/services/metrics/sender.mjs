import os from "os";
import path from "path";
import _ from "lodash";
import isDocker from "is-docker";
import ciEnv from "ci-info";
import tsUtils from "@strapi/typescript-utils";
import { env } from "@strapi/utils";
import machineId from "../../utils/machine-id.mjs";
import { generateAdminUserHash } from "./admin-user-hash.mjs";
const defaultQueryOpts = {
  timeout: 1e3,
  headers: { "Content-Type": "application/json" }
};
const ANALYTICS_URI = "https://analytics.strapi.io";
const addPackageJsonStrapiMetadata = (metadata, strapi) => {
  const { packageJsonStrapi = {} } = strapi.config;
  _.defaults(metadata, packageJsonStrapi);
};
const createSender = (strapi) => {
  const { uuid } = strapi.config;
  const deviceId = machineId();
  const serverRootPath = strapi.dirs.app.root;
  const adminRootPath = path.join(strapi.dirs.app.root, "src", "admin");
  const anonymousUserProperties = {
    environment: strapi.config.environment,
    os: os.type(),
    osPlatform: os.platform(),
    osArch: os.arch(),
    osRelease: os.release(),
    nodeVersion: process.versions.node
  };
  const anonymousGroupProperties = {
    docker: process.env.DOCKER || isDocker(),
    isCI: ciEnv.isCI,
    version: strapi.config.get("info.strapi"),
    useTypescriptOnServer: tsUtils.isUsingTypeScriptSync(serverRootPath),
    useTypescriptOnAdmin: tsUtils.isUsingTypeScriptSync(adminRootPath),
    projectId: uuid,
    isHostedOnStrapiCloud: env("STRAPI_HOSTING", null) === "strapi.cloud"
  };
  addPackageJsonStrapiMetadata(anonymousGroupProperties, strapi);
  return async (event, payload = {}, opts = {}) => {
    const userId = generateAdminUserHash(strapi);
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
      ..._.merge({ headers: { "X-Strapi-Event": event } }, defaultQueryOpts, opts)
    };
    try {
      const res = await strapi.fetch(`${ANALYTICS_URI}/api/v2/track`, reqParams);
      return res.ok;
    } catch (err) {
      return false;
    }
  };
};
export {
  createSender as default
};
//# sourceMappingURL=sender.mjs.map

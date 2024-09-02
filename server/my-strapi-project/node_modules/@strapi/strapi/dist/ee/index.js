"use strict";
const fp = require("lodash/fp");
const license = require("./license.js");
const cron = require("../utils/cron.js");
const ONE_MINUTE = 1e3 * 60;
const ee = {
  enabled: false,
  licenseInfo: {}
};
const disable = (message) => {
  const shouldEmitEvent = ee.enabled !== false;
  ee.logger?.warn(`${message} Switching to CE.`);
  ee.licenseInfo = fp.pick("licenseKey", ee.licenseInfo);
  ee.enabled = false;
  if (shouldEmitEvent) {
    strapi.eventHub.emit("ee.disable");
  }
};
const enable = () => {
  const shouldEmitEvent = ee.enabled !== true;
  ee.enabled = true;
  if (shouldEmitEvent) {
    strapi.eventHub.emit("ee.enable");
  }
};
let initialized = false;
const init = (licenseDir, logger) => {
  if (initialized) {
    return;
  }
  initialized = true;
  ee.logger = logger;
  if (process.env.STRAPI_DISABLE_EE?.toLowerCase() === "true") {
    return;
  }
  try {
    const license$1 = process.env.STRAPI_LICENSE || license.readLicense(licenseDir);
    if (license$1) {
      ee.licenseInfo = license.verifyLicense(license$1);
      enable();
    }
  } catch (error) {
    if (error instanceof Error) {
      disable(error.message);
    } else {
      disable("Invalid license.");
    }
  }
};
const onlineUpdate = async ({ strapi: strapi2 }) => {
  const { get: get2, commit, rollback } = await strapi2.db?.transaction();
  const transaction = get2();
  try {
    const storedInfo = await strapi2.db?.queryBuilder("strapi::core-store").where({ key: "ee_information" }).select("value").first().transacting(transaction).forUpdate().execute().then((result2) => result2 ? JSON.parse(result2.value) : result2);
    const shouldContactRegistry = (storedInfo?.lastCheckAt ?? 0) < Date.now() - ONE_MINUTE;
    const result = { lastCheckAt: Date.now() };
    const fallback = (error) => {
      if (error instanceof license.LicenseCheckError && error.shouldFallback && storedInfo?.license) {
        ee.logger?.warn(
          `${error.message} The last stored one will be used as a potential fallback.`
        );
        return storedInfo.license;
      }
      result.error = error.message;
      disable(error.message);
    };
    if (!ee?.licenseInfo?.licenseKey) {
      throw new Error("Missing license key.");
    }
    const license$1 = shouldContactRegistry ? await license.fetchLicense({ strapi: strapi2 }, ee.licenseInfo.licenseKey, strapi2.config.get("uuid")).catch(
      fallback
    ) : storedInfo.license;
    if (license$1) {
      try {
        const newLicenseInfo = license.verifyLicense(license$1);
        const licenseInfoChanged = !fp.isEqual(newLicenseInfo.features, ee.licenseInfo.features) || newLicenseInfo.seats !== ee.licenseInfo.seats || newLicenseInfo.type !== ee.licenseInfo.type;
        ee.licenseInfo = newLicenseInfo;
        const wasEnabled = ee.enabled;
        validateInfo();
        if (licenseInfoChanged && wasEnabled) {
          strapi2.eventHub.emit("ee.update");
        }
      } catch (error) {
        if (error instanceof Error) {
          disable(error.message);
        } else {
          disable("Invalid license.");
        }
      }
    } else if (!shouldContactRegistry) {
      disable(storedInfo.error);
    }
    if (shouldContactRegistry) {
      result.license = license$1 ?? null;
      const query = strapi2.db.queryBuilder("strapi::core-store").transacting(transaction);
      if (!storedInfo) {
        query.insert({ key: "ee_information", value: JSON.stringify(result) });
      } else {
        query.update({ value: JSON.stringify(result) }).where({ key: "ee_information" });
      }
      await query.execute();
    }
    await commit();
  } catch (error) {
    await rollback();
  }
};
const validateInfo = () => {
  if (typeof ee.licenseInfo.expireAt === "undefined") {
    throw new Error("Missing license key.");
  }
  const expirationTime = new Date(ee.licenseInfo.expireAt).getTime();
  if (expirationTime < (/* @__PURE__ */ new Date()).getTime()) {
    return disable("License expired.");
  }
  enable();
};
const checkLicense = async ({ strapi: strapi2 }) => {
  const shouldStayOffline = ee.licenseInfo.type === "gold" && // This env variable support is temporarily used to ease the migration between online vs offline
  process.env.STRAPI_DISABLE_LICENSE_PING?.toLowerCase() === "true";
  if (!shouldStayOffline) {
    await onlineUpdate({ strapi: strapi2 });
    strapi2.cron.add({ [cron.shiftCronExpression("0 0 */12 * * *")]: onlineUpdate });
  } else {
    if (!ee.licenseInfo.expireAt) {
      return disable("Your license does not have offline support.");
    }
    validateInfo();
  }
};
const list = () => {
  return ee.licenseInfo.features?.map(
    (feature) => typeof feature === "object" ? feature : { name: feature }
  ) || [];
};
const get = (featureName) => list().find((feature) => feature.name === featureName);
const EE = Object.freeze({
  init,
  checkLicense,
  get isEE() {
    return ee.enabled;
  },
  get seats() {
    return ee.licenseInfo.seats;
  },
  features: Object.freeze({
    list,
    get,
    isEnabled: (featureName) => get(featureName) !== void 0
  })
});
module.exports = EE;
//# sourceMappingURL=index.js.map

"use strict";
const path = require("path");
const crypto = require("crypto");
const fse = require("fs-extra");
const chalk = require("chalk");
const fetch = require("node-fetch");
const machineId = require("../../../../utils/machine-id.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const fse__default = /* @__PURE__ */ _interopDefault(fse);
const chalk__default = /* @__PURE__ */ _interopDefault(chalk);
const fetch__default = /* @__PURE__ */ _interopDefault(fetch);
const readPackageJSON = async (path2) => {
  try {
    const packageObj = await fse__default.default.readJson(path2);
    return packageObj;
  } catch (err) {
    if (err instanceof Error) {
      console.error(`${chalk__default.default.red("Error")}: ${err.message}`);
    } else {
      throw err;
    }
  }
};
const writePackageJSON = async (path2, file, spacing) => {
  try {
    await fse__default.default.writeJson(path2, file, { spaces: spacing });
    return true;
  } catch (err) {
    if (err instanceof Error) {
      console.error(`${chalk__default.default.red("Error")}: ${err.message}`);
      console.log(
        `${chalk__default.default.yellow(
          "Warning"
        )}: There has been an error, please set "telemetryDisabled": false in the "strapi" object of your package.json manually.`
      );
      return false;
    }
    throw err;
  }
};
const generateNewPackageJSON = (packageObj) => {
  if (!packageObj.strapi) {
    return {
      ...packageObj,
      strapi: {
        uuid: crypto.randomUUID(),
        telemetryDisabled: false
      }
    };
  }
  return {
    ...packageObj,
    strapi: {
      ...packageObj.strapi,
      uuid: packageObj.strapi.uuid ? packageObj.strapi.uuid : crypto.randomUUID(),
      telemetryDisabled: false
    }
  };
};
const sendEvent = async (uuid) => {
  try {
    const event = "didOptInTelemetry";
    await fetch__default.default("https://analytics.strapi.io/api/v2/track", {
      method: "POST",
      body: JSON.stringify({
        event,
        deviceId: machineId(),
        groupProperties: { projectId: uuid }
      }),
      headers: {
        "Content-Type": "application/json",
        "X-Strapi-Event": event
      }
    });
  } catch (e) {
  }
};
async function optInTelemetry() {
  const packageJSONPath = path.resolve(process.cwd(), "package.json");
  const exists = await fse__default.default.pathExists(packageJSONPath);
  if (!exists) {
    console.log(`${chalk__default.default.yellow("Warning")}: could not find package.json`);
    process.exit(0);
  }
  const packageObj = await readPackageJSON(packageJSONPath);
  if (packageObj.strapi && packageObj.strapi.uuid) {
    if (packageObj.strapi.telemetryDisabled === false) {
      console.log(`${chalk__default.default.yellow("Warning:")} telemetry is already enabled`);
      process.exit(0);
    }
  }
  const updatedPackageJSON = generateNewPackageJSON(packageObj);
  const write = await writePackageJSON(packageJSONPath, updatedPackageJSON, 2);
  if (!write) {
    process.exit(0);
  }
  await sendEvent(updatedPackageJSON.strapi.uuid);
  console.log(`${chalk__default.default.green("Successfully opted into and enabled Strapi telemetry")}`);
  process.exit(0);
}
module.exports = optInTelemetry;
//# sourceMappingURL=action.js.map

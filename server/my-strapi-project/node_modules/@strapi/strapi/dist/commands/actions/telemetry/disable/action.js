"use strict";
const path = require("path");
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
    const uuid = packageObj.strapi ? packageObj.strapi.uuid : null;
    return { uuid, packageObj };
  } catch (err) {
    if (err instanceof Error) {
      console.error(`${chalk__default.default.red("Error")}: ${err.message}`);
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
    }
  }
};
const sendEvent = async (uuid) => {
  try {
    const event = "didOptOutTelemetry";
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
async function optOutTelemetry() {
  const packageJSONPath = path.resolve(process.cwd(), "package.json");
  const exists = await fse__default.default.pathExists(packageJSONPath);
  if (!exists) {
    console.log(`${chalk__default.default.yellow("Warning")}: could not find package.json`);
    process.exit(0);
  }
  const { uuid, packageObj } = await readPackageJSON(packageJSONPath) ?? {};
  if (packageObj.strapi && packageObj.strapi.telemetryDisabled || !uuid) {
    console.log(`${chalk__default.default.yellow("Warning:")} telemetry is already disabled`);
    process.exit(0);
  }
  const updatedPackageJSON = {
    ...packageObj,
    strapi: {
      ...packageObj.strapi,
      telemetryDisabled: true
    }
  };
  const write = await writePackageJSON(packageJSONPath, updatedPackageJSON, 2);
  if (!write) {
    console.log(
      `${chalk__default.default.yellow(
        "Warning"
      )}: There has been an error, please set "telemetryDisabled": true in the "strapi" object of your package.json manually.`
    );
    process.exit(0);
  }
  await sendEvent(uuid);
  console.log(`${chalk__default.default.green("Successfully opted out of Strapi telemetry")}`);
  process.exit(0);
}
module.exports = optOutTelemetry;
//# sourceMappingURL=action.js.map

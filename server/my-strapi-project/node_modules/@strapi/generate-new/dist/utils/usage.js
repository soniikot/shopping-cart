"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const os = require("os");
const _ = require("lodash");
const fetch = require("node-fetch");
const sentry = require("@sentry/node");
const types = require("../types.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const os__default = /* @__PURE__ */ _interopDefault(os);
const ___default = /* @__PURE__ */ _interopDefault(_);
const fetch__default = /* @__PURE__ */ _interopDefault(fetch);
const sentry__default = /* @__PURE__ */ _interopDefault(sentry);
function addPackageJsonStrapiMetadata(metadata, scope) {
  const { packageJsonStrapi = {} } = scope;
  return ___default.default.defaults(metadata, packageJsonStrapi);
}
async function captureException(error) {
  try {
    sentry__default.default.captureException(error);
    await sentry__default.default.flush();
  } catch (err) {
    return Promise.resolve();
  }
}
async function captureError(message) {
  try {
    sentry__default.default.captureMessage(message, sentry.Severity.Error);
    await sentry__default.default.flush();
  } catch (err) {
    return Promise.resolve();
  }
}
function captureStderr(name, error) {
  if (types.isStderrError(error) && error.stderr.trim() !== "") {
    error.stderr.trim().split("\n").forEach((line) => {
      sentry__default.default.addBreadcrumb({
        category: "stderr",
        message: line,
        level: sentry.Severity.Error
      });
    });
  }
  return captureError(name);
}
const getProperties = (scope, error) => {
  const eventProperties = {
    error: typeof error === "string" ? error : error && error.message
  };
  const userProperties = {
    os: os__default.default.type(),
    osPlatform: os__default.default.platform(),
    osArch: os__default.default.arch(),
    osRelease: os__default.default.release(),
    nodeVersion: process.versions.node
  };
  const groupProperties = {
    version: scope.strapiVersion,
    docker: scope.docker,
    useYarn: scope.useYarn,
    useTypescriptOnServer: scope.useTypescript,
    useTypescriptOnAdmin: scope.useTypescript,
    isHostedOnStrapiCloud: process.env.STRAPI_HOSTING === "strapi.cloud",
    noRun: (scope.runQuickstartApp !== true).toString(),
    projectId: scope.uuid
  };
  return {
    eventProperties,
    userProperties,
    groupProperties: addPackageJsonStrapiMetadata(groupProperties, scope)
  };
};
function trackEvent(event, payload) {
  if (process.env.NODE_ENV === "test") {
    return;
  }
  try {
    return fetch__default.default("https://analytics.strapi.io/api/v2/track", {
      method: "POST",
      body: JSON.stringify({
        event,
        ...payload
      }),
      timeout: 1e3,
      headers: {
        "Content-Type": "application/json",
        "X-Strapi-Event": event
      }
    }).catch(() => {
    });
  } catch (err) {
    return Promise.resolve();
  }
}
async function trackError({ scope, error }) {
  const properties = getProperties(scope, error);
  try {
    return await trackEvent("didNotCreateProject", {
      deviceId: scope.deviceId,
      ...properties
    });
  } catch (err) {
    return Promise.resolve();
  }
}
async function trackUsage({
  event,
  scope,
  error
}) {
  const properties = getProperties(scope, error);
  try {
    return await trackEvent(event, {
      deviceId: scope.deviceId,
      ...properties
    });
  } catch (err) {
    return Promise.resolve();
  }
}
exports.captureException = captureException;
exports.captureStderr = captureStderr;
exports.trackError = trackError;
exports.trackUsage = trackUsage;
//# sourceMappingURL=usage.js.map

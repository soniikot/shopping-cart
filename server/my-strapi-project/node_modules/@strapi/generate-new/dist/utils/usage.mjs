import os from "os";
import _ from "lodash";
import fetch from "node-fetch";
import sentry__default, { Severity } from "@sentry/node";
import { isStderrError } from "../types.mjs";
function addPackageJsonStrapiMetadata(metadata, scope) {
  const { packageJsonStrapi = {} } = scope;
  return _.defaults(metadata, packageJsonStrapi);
}
async function captureException(error) {
  try {
    sentry__default.captureException(error);
    await sentry__default.flush();
  } catch (err) {
    return Promise.resolve();
  }
}
async function captureError(message) {
  try {
    sentry__default.captureMessage(message, Severity.Error);
    await sentry__default.flush();
  } catch (err) {
    return Promise.resolve();
  }
}
function captureStderr(name, error) {
  if (isStderrError(error) && error.stderr.trim() !== "") {
    error.stderr.trim().split("\n").forEach((line) => {
      sentry__default.addBreadcrumb({
        category: "stderr",
        message: line,
        level: Severity.Error
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
    os: os.type(),
    osPlatform: os.platform(),
    osArch: os.arch(),
    osRelease: os.release(),
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
    return fetch("https://analytics.strapi.io/api/v2/track", {
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
export {
  captureException,
  captureStderr,
  trackError,
  trackUsage
};
//# sourceMappingURL=usage.mjs.map

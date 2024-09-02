"use strict";
const nodeSchedule = require("node-schedule");
const rateLimiter = require("./rate-limiter.js");
const sender = require("./sender.js");
const middleware = require("./middleware.js");
const isTruthy = require("./is-truthy.js");
const LIMITED_EVENTS = [
  "didSaveMediaWithAlternativeText",
  "didSaveMediaWithCaption",
  "didDisableResponsiveDimensions",
  "didEnableResponsiveDimensions",
  "didInitializePluginUpload"
];
const createTelemetryInstance = (strapi) => {
  const uuid = strapi.config.get("uuid");
  const telemetryDisabled = strapi.config.get("packageJsonStrapi.telemetryDisabled");
  const isDisabled = !uuid || isTruthy(process.env.STRAPI_TELEMETRY_DISABLED) || isTruthy(telemetryDisabled);
  const crons = [];
  const sender$1 = sender(strapi);
  const sendEvent = rateLimiter(sender$1, { limitedEvents: LIMITED_EVENTS });
  return {
    get isDisabled() {
      return isDisabled;
    },
    register() {
      if (!isDisabled) {
        const pingCron = nodeSchedule.scheduleJob("0 0 12 * * *", () => sendEvent("ping"));
        crons.push(pingCron);
        strapi.server.use(middleware({ sendEvent }));
      }
    },
    bootstrap() {
    },
    destroy() {
      crons.forEach((cron) => cron.cancel());
    },
    async send(event, payload = {}) {
      if (isDisabled)
        return true;
      return sendEvent(event, payload);
    }
  };
};
module.exports = createTelemetryInstance;
//# sourceMappingURL=index.js.map

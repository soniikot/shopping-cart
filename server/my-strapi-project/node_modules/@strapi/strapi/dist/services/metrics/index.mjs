import { scheduleJob } from "node-schedule";
import wrapWithRateLimit from "./rate-limiter.mjs";
import createSender from "./sender.mjs";
import createMiddleware from "./middleware.mjs";
import isTruthy from "./is-truthy.mjs";
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
  const sender = createSender(strapi);
  const sendEvent = wrapWithRateLimit(sender, { limitedEvents: LIMITED_EVENTS });
  return {
    get isDisabled() {
      return isDisabled;
    },
    register() {
      if (!isDisabled) {
        const pingCron = scheduleJob("0 0 12 * * *", () => sendEvent("ping"));
        crons.push(pingCron);
        strapi.server.use(createMiddleware({ sendEvent }));
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
export {
  createTelemetryInstance as default
};
//# sourceMappingURL=index.mjs.map

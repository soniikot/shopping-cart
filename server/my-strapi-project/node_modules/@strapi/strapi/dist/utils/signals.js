"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const destroyOnSignal = (strapi) => {
  let signalReceived = false;
  const terminateStrapi = async () => {
    if (!signalReceived) {
      signalReceived = true;
      await strapi.destroy();
      process.exit();
    }
  };
  ["SIGTERM", "SIGINT"].forEach((signal) => {
    process.on(signal, terminateStrapi);
  });
};
exports.destroyOnSignal = destroyOnSignal;
//# sourceMappingURL=signals.js.map

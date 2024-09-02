"use strict";
const wrapWithRateLimit = (sender, { limitedEvents = [] } = {}) => {
  let currentDay = (/* @__PURE__ */ new Date()).getDate();
  const eventCache = /* @__PURE__ */ new Map();
  return async (event, ...args) => {
    if (!limitedEvents.includes(event)) {
      return sender(event, ...args);
    }
    if ((/* @__PURE__ */ new Date()).getDate() !== currentDay) {
      eventCache.clear();
      currentDay = (/* @__PURE__ */ new Date()).getDate();
    }
    if (eventCache.has(event)) {
      return false;
    }
    eventCache.set(event, true);
    return sender(event, ...args);
  };
};
module.exports = wrapWithRateLimit;
//# sourceMappingURL=rate-limiter.js.map

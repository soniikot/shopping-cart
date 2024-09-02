"use strict";
function createEventHub() {
  const listeners = /* @__PURE__ */ new Map();
  const defaultSubscriber = async (eventName, ...args) => {
    if (listeners.has(eventName)) {
      for (const listener of listeners.get(eventName)) {
        await listener(...args);
      }
    }
  };
  const subscribers = [defaultSubscriber];
  const eventHub = {
    async emit(eventName, ...args) {
      for (const subscriber of subscribers) {
        await subscriber(eventName, ...args);
      }
    },
    subscribe(subscriber) {
      subscribers.push(subscriber);
      return () => {
        eventHub.unsubscribe(subscriber);
      };
    },
    unsubscribe(subscriber) {
      const subscriberIndex = subscribers.indexOf(subscriber);
      if (subscriberIndex >= 0) {
        subscribers.splice(subscriberIndex, 1);
      }
    },
    on(eventName, listener) {
      if (!listeners.has(eventName)) {
        listeners.set(eventName, [listener]);
      } else {
        listeners.get(eventName).push(listener);
      }
      return () => {
        eventHub.off(eventName, listener);
      };
    },
    off(eventName, listener) {
      listeners.get(eventName).splice(listeners.get(eventName).indexOf(listener), 1);
    },
    once(eventName, listener) {
      return eventHub.on(eventName, async (...args) => {
        eventHub.off(eventName, listener);
        return listener(...args);
      });
    },
    destroy() {
      listeners.clear();
      subscribers.length = 0;
      return this;
    },
    removeListener(eventName, listener) {
      return eventHub.off(eventName, listener);
    },
    removeAllListeners() {
      return eventHub.destroy();
    },
    addListener(eventName, listener) {
      return eventHub.on(eventName, listener);
    }
  };
  return eventHub;
}
module.exports = createEventHub;
//# sourceMappingURL=event-hub.js.map

"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const strapiUtils = require("@strapi/utils");
const { ValidationError } = strapiUtils.errors;
const webhookModel = {
  uid: "webhook",
  collectionName: "strapi_webhooks",
  attributes: {
    name: {
      type: "string"
    },
    url: {
      type: "text"
    },
    headers: {
      type: "json"
    },
    events: {
      type: "json"
    },
    enabled: {
      type: "boolean"
    }
  }
};
const toDBObject = (data) => {
  return {
    name: data.name,
    url: data.url,
    headers: data.headers,
    events: data.events,
    enabled: data.isEnabled
  };
};
const fromDBObject = (row) => {
  return {
    id: row.id,
    name: row.name,
    url: row.url,
    headers: row.headers,
    events: row.events,
    isEnabled: row.enabled
  };
};
const webhookEventValidator = async (allowedEvents, events) => {
  const allowedValues = Array.from(allowedEvents.values());
  events.forEach((event) => {
    if (allowedValues.includes(event)) {
      return;
    }
    throw new ValidationError(`Webhook event ${event} is not supported`);
  });
};
const createWebhookStore = ({ db }) => {
  const webhookQueries = db.query("webhook");
  return {
    allowedEvents: /* @__PURE__ */ new Map([]),
    addAllowedEvent(key, value) {
      this.allowedEvents.set(key, value);
    },
    removeAllowedEvent(key) {
      this.allowedEvents.delete(key);
    },
    listAllowedEvents() {
      return Array.from(this.allowedEvents.keys());
    },
    getAllowedEvent(key) {
      return this.allowedEvents.get(key);
    },
    async findWebhooks() {
      const results = await webhookQueries.findMany();
      return results.map(fromDBObject);
    },
    async findWebhook(id) {
      const result = await webhookQueries.findOne({ where: { id } });
      return result ? fromDBObject(result) : null;
    },
    async createWebhook(data) {
      await webhookEventValidator(this.allowedEvents, data.events);
      return webhookQueries.create({
        data: toDBObject({ ...data, isEnabled: true })
      }).then(fromDBObject);
    },
    async updateWebhook(id, data) {
      await webhookEventValidator(this.allowedEvents, data.events);
      const webhook = await webhookQueries.update({
        where: { id },
        data: toDBObject(data)
      });
      return webhook ? fromDBObject(webhook) : null;
    },
    async deleteWebhook(id) {
      const webhook = await webhookQueries.delete({ where: { id } });
      return webhook ? fromDBObject(webhook) : null;
    }
  };
};
exports.createWebhookStore = createWebhookStore;
exports.webhookModel = webhookModel;
//# sourceMappingURL=webhook-store.js.map

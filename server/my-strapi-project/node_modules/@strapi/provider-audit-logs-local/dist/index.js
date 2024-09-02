"use strict";
const schema = {
  kind: "collectionType",
  collectionName: "strapi_audit_logs",
  info: {
    singularName: "audit-log",
    pluralName: "audit-logs",
    displayName: "Audit Log"
  },
  options: {
    draftAndPublish: false,
    timestamps: false
  },
  pluginOptions: {
    "content-manager": {
      visible: false
    },
    "content-type-builder": {
      visible: false
    }
  },
  attributes: {
    action: {
      type: "string",
      required: true
    },
    date: {
      type: "datetime",
      required: true
    },
    user: {
      type: "relation",
      relation: "oneToOne",
      target: "admin::user"
    },
    payload: {
      type: "json"
    }
  }
};
const auditLogContentType = {
  schema
};
const index = {
  async register({ strapi }) {
    const contentTypes = strapi.container.get("content-types");
    if (!contentTypes.keys().includes("admin::audit-log")) {
      strapi.container.get("content-types").add("admin::", { "audit-log": auditLogContentType });
    }
    return {
      async saveEvent(event) {
        const { userId, ...rest } = event;
        const auditLog = { ...rest, user: userId };
        await strapi.entityService?.create("admin::audit-log", { data: auditLog });
        return this;
      },
      findMany(query) {
        return strapi.entityService?.findPage("admin::audit-log", {
          populate: ["user"],
          fields: ["action", "date", "payload"],
          ...query
        });
      },
      findOne(id) {
        return strapi.entityService?.findOne("admin::audit-log", id, {
          populate: ["user"],
          fields: ["action", "date", "payload"]
        });
      },
      deleteExpiredEvents(expirationDate) {
        return strapi.entityService?.deleteMany("admin::audit-log", {
          filters: {
            date: {
              $lt: expirationDate.toISOString()
            }
          }
        });
      }
    };
  }
};
module.exports = index;
//# sourceMappingURL=index.js.map

"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const fp = require("lodash/fp");
const _ = require("lodash");
const strapiUtils = require("@strapi/utils");
const validator = require("./validator.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const ___default = /* @__PURE__ */ _interopDefault(_);
const {
  CREATED_AT_ATTRIBUTE,
  UPDATED_AT_ATTRIBUTE,
  PUBLISHED_AT_ATTRIBUTE,
  CREATED_BY_ATTRIBUTE,
  UPDATED_BY_ATTRIBUTE
} = strapiUtils.contentTypes.constants;
const createContentType = (uid, definition) => {
  try {
    validator.validateContentTypeDefinition(definition);
  } catch (e) {
    if (e instanceof strapiUtils.yup.ValidationError) {
      throw new Error(`Content Type Definition is invalid for ${uid}'.
${e.errors}`);
    }
    throw e;
  }
  const { schema, actions, lifecycles } = fp.cloneDeep(definition);
  Object.assign(schema, {
    kind: schema.kind || "collectionType",
    __schema__: pickSchema(definition.schema),
    modelType: "contentType",
    modelName: definition.schema.info.singularName,
    connection: "default"
  });
  if (uid.startsWith("api::")) {
    Object.assign(schema, {
      uid,
      apiName: uid.split("::")[1].split(".")[0],
      collectionName: schema.collectionName || schema.info.singularName,
      globalId: getGlobalId(schema, schema.info.singularName)
    });
  } else if (uid.startsWith("plugin::")) {
    const pluginName = uid.split("::")[1].split(".")[0];
    Object.assign(schema, {
      uid,
      plugin: pluginName,
      // TODO: to be set in load-plugins.js
      collectionName: schema.collectionName || `${pluginName}_${schema.info.singularName}`.toLowerCase(),
      globalId: getGlobalId(schema, schema.info.singularName, pluginName)
    });
  } else if (uid.startsWith("admin::")) {
    Object.assign(schema, {
      uid,
      plugin: "admin",
      globalId: getGlobalId(schema, schema.info.singularName, "admin")
    });
  } else {
    throw new Error(
      `Incorrect Content Type UID "${uid}". The UID should start with api::, plugin:: or admin::.`
    );
  }
  Object.assign(schema.attributes, {
    [CREATED_AT_ATTRIBUTE]: {
      type: "datetime"
    },
    // TODO: handle on edit set to new date
    [UPDATED_AT_ATTRIBUTE]: {
      type: "datetime"
    }
  });
  if (strapiUtils.contentTypes.hasDraftAndPublish(schema)) {
    schema.attributes[PUBLISHED_AT_ATTRIBUTE] = {
      type: "datetime",
      configurable: false,
      writable: true,
      visible: false
    };
  }
  const isPrivate = !___default.default.get(schema, "options.populateCreatorFields", false);
  schema.attributes[CREATED_BY_ATTRIBUTE] = {
    type: "relation",
    relation: "oneToOne",
    target: "admin::user",
    configurable: false,
    writable: false,
    visible: false,
    useJoinTable: false,
    private: isPrivate
  };
  schema.attributes[UPDATED_BY_ATTRIBUTE] = {
    type: "relation",
    relation: "oneToOne",
    target: "admin::user",
    configurable: false,
    writable: false,
    visible: false,
    useJoinTable: false,
    private: isPrivate
  };
  Object.assign(schema, { actions, lifecycles });
  return schema;
};
const getGlobalId = (model, modelName, prefix) => {
  const globalId = prefix ? `${prefix}-${modelName}` : modelName;
  return model.globalId || ___default.default.upperFirst(___default.default.camelCase(globalId));
};
const pickSchema = (model) => {
  const schema = ___default.default.cloneDeep(
    ___default.default.pick(model, [
      "connection",
      "collectionName",
      "info",
      "options",
      "pluginOptions",
      "attributes"
    ])
  );
  schema.kind = model.kind || "collectionType";
  return schema;
};
exports.createContentType = createContentType;
//# sourceMappingURL=index.js.map

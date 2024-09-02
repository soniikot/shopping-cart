"use strict";
const _ = require("lodash");
const fp = require("lodash/fp");
const utils = require("@strapi/utils");
const path = require("path");
const fse = require("fs-extra");
const pluralize = require("pluralize");
require("koa-bodyparser");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
function _interopNamespace(e) {
  if (e && e.__esModule)
    return e;
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const ___default = /* @__PURE__ */ _interopDefault(_);
const utils__default = /* @__PURE__ */ _interopDefault(utils);
const path__namespace = /* @__PURE__ */ _interopNamespace(path);
const fse__namespace = /* @__PURE__ */ _interopNamespace(fse);
const pluralize__default = /* @__PURE__ */ _interopDefault(pluralize);
const config = {
  default: {},
  validator() {
  }
};
const bootstrap = async ({ strapi: strapi2 }) => {
  const actions = [
    {
      section: "plugins",
      displayName: "Read",
      uid: "read",
      pluginName: "content-type-builder"
    }
  ];
  await strapi2.admin.services.permission.actionProvider.registerMany(actions);
};
const { ApplicationError: ApplicationError$3 } = utils.errors;
const hasComponent = (model) => {
  const compoKeys = Object.keys(model.attributes || {}).filter((key) => {
    return model.attributes[key].type === "component";
  });
  return compoKeys.length > 0;
};
const isConfigurable = (attribute) => ___default.default.get(attribute, "configurable", true);
const isRelation = (attribute) => attribute.type === "relation";
const formatAttributes = (model) => {
  const { getVisibleAttributes } = utils__default.default.contentTypes;
  return getVisibleAttributes(model).reduce((acc, key) => {
    acc[key] = formatAttribute(model.attributes[key]);
    return acc;
  }, {});
};
const formatAttribute = (attribute) => {
  const { configurable, required, autoPopulate, pluginOptions } = attribute;
  if (attribute.type === "media") {
    return {
      type: "media",
      multiple: !!attribute.multiple,
      required: !!required,
      configurable: configurable === false ? false : void 0,
      private: !!attribute.private,
      allowedTypes: attribute.allowedTypes,
      pluginOptions
    };
  }
  if (attribute.type === "relation") {
    return {
      ...attribute,
      type: "relation",
      target: attribute.target,
      targetAttribute: attribute.inversedBy || attribute.mappedBy || null,
      configurable: configurable === false ? false : void 0,
      private: !!attribute.private,
      pluginOptions,
      // TODO: remove
      autoPopulate
    };
  }
  return attribute;
};
const replaceTemporaryUIDs = (uidMap) => (schema) => {
  return {
    ...schema,
    attributes: Object.keys(schema.attributes).reduce((acc, key) => {
      const attr = schema.attributes[key];
      if (attr.type === "component") {
        if (___default.default.has(uidMap, attr.component)) {
          acc[key] = {
            ...attr,
            component: uidMap[attr.component]
          };
          return acc;
        }
        if (!___default.default.has(strapi.components, attr.component)) {
          throw new ApplicationError$3("component.notFound");
        }
      }
      if (attr.type === "dynamiczone" && ___default.default.intersection(attr.components, Object.keys(uidMap)).length > 0) {
        acc[key] = {
          ...attr,
          components: attr.components.map((value) => {
            if (___default.default.has(uidMap, value))
              return uidMap[value];
            if (!___default.default.has(strapi.components, value)) {
              throw new ApplicationError$3("component.notFound");
            }
            return value;
          })
        };
        return acc;
      }
      acc[key] = attr;
      return acc;
    }, {})
  };
};
function createSchemaHandler(infos) {
  const { category, modelName, plugin, uid, dir, filename, schema } = infos;
  const initialState = {
    modelName,
    plugin,
    category,
    uid,
    dir,
    filename,
    schema: schema || {
      info: {},
      options: {},
      attributes: {}
    }
  };
  const state = ___default.default.cloneDeep(initialState);
  Object.freeze(initialState.schema);
  let modified = false;
  let deleted = false;
  return {
    get modelName() {
      return initialState.modelName;
    },
    get plugin() {
      return initialState.plugin;
    },
    get category() {
      return initialState.category;
    },
    get kind() {
      return ___default.default.get(state.schema, "kind", "collectionType");
    },
    get uid() {
      return state.uid;
    },
    get writable() {
      return ___default.default.get(state, "plugin") !== "admin";
    },
    setUID(val) {
      modified = true;
      state.uid = val;
      return this;
    },
    setDir(val) {
      modified = true;
      state.dir = val;
      return this;
    },
    get schema() {
      return ___default.default.cloneDeep(state.schema);
    },
    setSchema(val) {
      modified = true;
      state.schema = ___default.default.cloneDeep(val);
      return this;
    },
    // get a particular path inside the schema
    get(path2) {
      return ___default.default.get(state.schema, path2);
    },
    // set a particular path inside the schema
    set(path2, val) {
      if (!state.schema)
        return this;
      modified = true;
      const value = ___default.default.defaultTo(val, ___default.default.get(state.schema, path2));
      ___default.default.set(state.schema, path2, value);
      return this;
    },
    // delete a particular path inside the schema
    unset(path2) {
      modified = true;
      ___default.default.unset(state.schema, path2);
      return this;
    },
    delete() {
      deleted = true;
      return this;
    },
    getAttribute(key) {
      return this.get(["attributes", key]);
    },
    setAttribute(key, attribute) {
      return this.set(["attributes", key], attribute);
    },
    deleteAttribute(key) {
      return this.unset(["attributes", key]);
    },
    setAttributes(newAttributes) {
      if (!this.schema)
        return this;
      for (const key in this.schema.attributes) {
        if (isConfigurable(this.schema.attributes[key])) {
          this.deleteAttribute(key);
        }
      }
      for (const key of Object.keys(newAttributes)) {
        this.setAttribute(key, newAttributes[key]);
      }
      return this;
    },
    removeContentType(uid2) {
      if (!state.schema)
        return this;
      const attributes = state.schema.attributes;
      Object.keys(attributes).forEach((key) => {
        const attribute = attributes[key];
        if (attribute.target === uid2) {
          this.deleteAttribute(key);
        }
      });
      return this;
    },
    // utils
    removeComponent(uid2) {
      if (!state.schema)
        return this;
      const attributes = state.schema.attributes;
      Object.keys(attributes).forEach((key) => {
        const attr = attributes[key];
        if (attr.type === "component" && attr.component === uid2) {
          this.deleteAttribute(key);
        }
        if (attr.type === "dynamiczone" && Array.isArray(attr.components) && attr.components.includes(uid2)) {
          const updatedComponentList = attributes[key].components.filter(
            (val) => val !== uid2
          );
          this.set(["attributes", key, "components"], updatedComponentList);
        }
      });
      return this;
    },
    updateComponent(uid2, newUID) {
      if (!state.schema)
        return this;
      const attributes = state.schema.attributes;
      Object.keys(attributes).forEach((key) => {
        const attr = attributes[key];
        if (attr.type === "component" && attr.component === uid2) {
          this.set(["attributes", key, "component"], newUID);
        }
        if (attr.type === "dynamiczone" && Array.isArray(attr.components) && attr.components.includes(uid2)) {
          const updatedComponentList = attr.components.map(
            (val) => val === uid2 ? newUID : val
          );
          this.set(["attributes", key, "components"], updatedComponentList);
        }
      });
      return this;
    },
    // save the schema to disk
    async flush() {
      if (!this.writable) {
        return;
      }
      const initialPath = path__namespace.default.join(initialState.dir, initialState.filename);
      const filePath = path__namespace.default.join(state.dir, state.filename);
      if (deleted) {
        await fse__namespace.default.remove(initialPath);
        const list = await fse__namespace.default.readdir(initialState.dir);
        if (list.length === 0) {
          await fse__namespace.default.remove(initialState.dir);
        }
        return;
      }
      if (modified) {
        if (!state.schema)
          return Promise.resolve();
        await fse__namespace.default.ensureFile(filePath);
        await fse__namespace.default.writeJSON(
          filePath,
          {
            kind: state.schema.kind,
            collectionName: state.schema.collectionName,
            info: state.schema.info,
            options: state.schema.options,
            pluginOptions: state.schema.pluginOptions,
            attributes: state.schema.attributes,
            config: state.schema.config
          },
          { spaces: 2 }
        );
        if (initialPath !== filePath) {
          await fse__namespace.default.remove(initialPath);
          const list = await fse__namespace.default.readdir(initialState.dir);
          if (list.length === 0) {
            await fse__namespace.default.remove(initialState.dir);
          }
        }
        return;
      }
      return Promise.resolve();
    },
    // reset the schema to its initial value
    async rollback() {
      if (!this.writable) {
        return;
      }
      const initialPath = path__namespace.default.join(initialState.dir, initialState.filename);
      const filePath = path__namespace.default.join(state.dir, state.filename);
      if (!initialState.uid) {
        await fse__namespace.default.remove(filePath);
        const list = await fse__namespace.default.readdir(state.dir);
        if (list.length === 0) {
          await fse__namespace.default.remove(state.dir);
        }
        return;
      }
      if (modified || deleted) {
        await fse__namespace.default.ensureFile(initialPath);
        await fse__namespace.default.writeJSON(initialPath, initialState.schema, { spaces: 2 });
        if (initialPath !== filePath) {
          await fse__namespace.default.remove(filePath);
          const list = await fse__namespace.default.readdir(state.dir);
          if (list.length === 0) {
            await fse__namespace.default.remove(state.dir);
          }
        }
      }
      return Promise.resolve();
    }
  };
}
const { ApplicationError: ApplicationError$2 } = utils.errors;
function createComponentBuilder$1() {
  return {
    createComponentUID({ category, displayName }) {
      return `${utils.nameToSlug(category)}.${utils.nameToSlug(displayName)}`;
    },
    createNewComponentUIDMap(components2) {
      return components2.reduce((uidMap, component) => {
        uidMap[component.tmpUID] = this.createComponentUID(component);
        return uidMap;
      }, {});
    },
    /**
     * create a component in the tmpComponent map
     */
    createComponent(infos) {
      const uid = this.createComponentUID(infos);
      if (this.components.has(uid)) {
        throw new ApplicationError$2("component.alreadyExists");
      }
      const handler = createSchemaHandler({
        dir: path__namespace.default.join(strapi.dirs.app.components, utils.nameToSlug(infos.category)),
        filename: `${utils.nameToSlug(infos.displayName)}.json`
      });
      const collectionName = `components_${utils.nameToCollectionName(
        infos.category
      )}_${utils.nameToCollectionName(pluralize__default.default(infos.displayName))}`;
      this.components.forEach((compo) => {
        if (compo.schema.collectionName === collectionName) {
          throw new ApplicationError$2("component.alreadyExists");
        }
      });
      handler.setUID(uid).set("collectionName", collectionName).set(["info", "displayName"], infos.displayName).set(["info", "icon"], infos.icon).set(["info", "description"], infos.description).set("pluginOptions", infos.pluginOptions).set("config", infos.config).setAttributes(this.convertAttributes(infos.attributes));
      if (this.components.size === 0) {
        strapi.telemetry.send("didCreateFirstComponent");
      } else {
        strapi.telemetry.send("didCreateComponent");
      }
      this.components.set(uid, handler);
      return handler;
    },
    /**
     * create a component in the tmpComponent map
     */
    editComponent(infos) {
      const { uid } = infos;
      if (!this.components.has(uid)) {
        throw new utils.errors.ApplicationError("component.notFound");
      }
      const component = this.components.get(uid);
      const [, nameUID] = uid.split(".");
      const newCategory = utils.nameToSlug(infos.category);
      const newUID = `${newCategory}.${nameUID}`;
      if (newUID !== uid && this.components.has(newUID)) {
        throw new utils.errors.ApplicationError("component.edit.alreadyExists");
      }
      const newDir = path__namespace.default.join(strapi.dirs.app.components, newCategory);
      const oldAttributes = component.schema.attributes;
      const newAttributes = ___default.default.omitBy(infos.attributes, (attr, key) => {
        return ___default.default.has(oldAttributes, key) && !isConfigurable(oldAttributes[key]);
      });
      component.setUID(newUID).setDir(newDir).set(["info", "displayName"], infos.displayName).set(["info", "icon"], infos.icon).set(["info", "description"], infos.description).set("pluginOptions", infos.pluginOptions).setAttributes(this.convertAttributes(newAttributes));
      if (newUID !== uid) {
        this.components.forEach((compo) => {
          compo.updateComponent(uid, newUID);
        });
        this.contentTypes.forEach((ct) => {
          ct.updateComponent(uid, newUID);
        });
      }
      return component;
    },
    deleteComponent(uid) {
      if (!this.components.has(uid)) {
        throw new utils.errors.ApplicationError("component.notFound");
      }
      this.components.forEach((compo) => {
        compo.removeComponent(uid);
      });
      this.contentTypes.forEach((ct) => {
        ct.removeComponent(uid);
      });
      return this.components.get(uid).delete();
    }
  };
}
const modelTypes = {
  CONTENT_TYPE: "CONTENT_TYPE",
  COMPONENT: "COMPONENT"
};
const typeKinds = {
  SINGLE_TYPE: "singleType",
  COLLECTION_TYPE: "collectionType"
};
const DEFAULT_TYPES = [
  // advanced types
  "media",
  // scalar types
  "string",
  "text",
  "richtext",
  "blocks",
  "json",
  "enumeration",
  "password",
  "email",
  "integer",
  "biginteger",
  "float",
  "decimal",
  "date",
  "time",
  "datetime",
  "timestamp",
  "boolean",
  "relation"
];
const VALID_UID_TARGETS = ["string", "text"];
const FORBIDDEN_ATTRIBUTE_NAMES = ["__component", "__contentType"];
const coreUids = {
  STRAPI_USER: "admin::user",
  PREFIX: "strapi::"
};
const pluginsUids = {
  UPLOAD_FILE: "plugin::upload.file"
};
const { ApplicationError: ApplicationError$1 } = utils.errors;
const reuseUnsetPreviousProperties = (newAttribute, oldAttribute) => {
  ___default.default.defaults(
    newAttribute,
    ___default.default.omit(oldAttribute, [
      "configurable",
      "required",
      "private",
      "unique",
      "pluginOptions",
      "inversedBy",
      "mappedBy"
    ])
  );
};
function createComponentBuilder() {
  return {
    setRelation({ key, uid, attribute }) {
      if (!___default.default.has(attribute, "target")) {
        return;
      }
      const targetCT = this.contentTypes.get(attribute.target);
      const targetAttribute = targetCT.getAttribute(attribute.targetAttribute);
      if (!attribute.targetAttribute) {
        return;
      }
      targetCT.setAttribute(
        attribute.targetAttribute,
        generateRelation({ key, attribute, uid, targetAttribute })
      );
    },
    unsetRelation(attribute) {
      if (!___default.default.has(attribute, "target")) {
        return;
      }
      const targetCT = this.contentTypes.get(attribute.target);
      const targetAttributeName = attribute.inversedBy || attribute.mappedBy;
      const targetAttribute = targetCT.getAttribute(targetAttributeName);
      if (!targetAttribute)
        return;
      return targetCT.deleteAttribute(targetAttributeName);
    },
    /**
     * Creates a content type in memory to be written to files later on
     */
    createContentType(infos) {
      const uid = createContentTypeUID(infos);
      if (this.contentTypes.has(uid)) {
        throw new ApplicationError$1("contentType.alreadyExists");
      }
      const contentType = createSchemaHandler({
        modelName: infos.singularName,
        dir: path__namespace.default.join(
          strapi.dirs.app.api,
          infos.singularName,
          "content-types",
          infos.singularName
        ),
        filename: `schema.json`
      });
      this.contentTypes.set(uid, contentType);
      Object.keys(infos.attributes).forEach((key) => {
        const { target } = infos.attributes[key];
        if (target === "__self__") {
          infos.attributes[key].target = uid;
        }
      });
      contentType.setUID(uid).set("kind", infos.kind || typeKinds.COLLECTION_TYPE).set("collectionName", infos.collectionName || utils.nameToCollectionName(infos.pluralName)).set("info", {
        singularName: infos.singularName,
        pluralName: infos.pluralName,
        displayName: infos.displayName,
        description: infos.description
      }).set("options", {
        ...infos.options ?? {},
        draftAndPublish: infos.draftAndPublish || false
      }).set("pluginOptions", infos.pluginOptions).set("config", infos.config).setAttributes(this.convertAttributes(infos.attributes));
      Object.keys(infos.attributes).forEach((key) => {
        const attribute = infos.attributes[key];
        if (isRelation(attribute)) {
          if (["manyToMany", "oneToOne"].includes(attribute.relation)) {
            attribute.dominant = true;
          }
          this.setRelation({
            key,
            uid,
            attribute
          });
        }
      });
      return contentType;
    },
    editContentType(infos) {
      const { uid } = infos;
      if (!this.contentTypes.has(uid)) {
        throw new ApplicationError$1("contentType.notFound");
      }
      const contentType = this.contentTypes.get(uid);
      const oldAttributes = contentType.schema.attributes;
      const newAttributes = ___default.default.omitBy(infos.attributes, (attr, key) => {
        return ___default.default.has(oldAttributes, key) && !isConfigurable(oldAttributes[key]);
      });
      const newKeys = ___default.default.difference(Object.keys(newAttributes), Object.keys(oldAttributes));
      const deletedKeys = ___default.default.difference(Object.keys(oldAttributes), Object.keys(newAttributes));
      const remainingKeys = ___default.default.intersection(Object.keys(oldAttributes), Object.keys(newAttributes));
      deletedKeys.forEach((key) => {
        const attribute = oldAttributes[key];
        const targetAttributeName = attribute.inversedBy || attribute.mappedBy;
        if (isConfigurable(attribute) && isRelation(attribute) && !___default.default.isNil(targetAttributeName)) {
          this.unsetRelation(attribute);
        }
      });
      remainingKeys.forEach((key) => {
        const oldAttribute = oldAttributes[key];
        const newAttribute = newAttributes[key];
        if (!isRelation(oldAttribute) && isRelation(newAttribute)) {
          return this.setRelation({
            key,
            uid,
            attribute: newAttributes[key]
          });
        }
        if (isRelation(oldAttribute) && !isRelation(newAttribute)) {
          return this.unsetRelation(oldAttribute);
        }
        if (isRelation(oldAttribute) && isRelation(newAttribute)) {
          const oldTargetAttributeName = oldAttribute.inversedBy || oldAttribute.mappedBy;
          const sameRelation = oldAttribute.relation === newAttribute.relation;
          const targetAttributeHasChanged = oldTargetAttributeName !== newAttribute.targetAttribute;
          if (!sameRelation || targetAttributeHasChanged) {
            this.unsetRelation(oldAttribute);
          }
          reuseUnsetPreviousProperties(newAttribute, oldAttribute);
          if (oldAttribute.inversedBy) {
            newAttribute.dominant = true;
          } else if (oldAttribute.mappedBy) {
            newAttribute.dominant = false;
          }
          return this.setRelation({
            key,
            uid,
            attribute: newAttribute
          });
        }
      });
      newKeys.forEach((key) => {
        const attribute = newAttributes[key];
        if (isRelation(attribute)) {
          if (["manyToMany", "oneToOne"].includes(attribute.relation)) {
            attribute.dominant = true;
          }
          this.setRelation({
            key,
            uid,
            attribute
          });
        }
      });
      contentType.set("kind", infos.kind || contentType.schema.kind).set(["info", "displayName"], infos.displayName).set(["info", "description"], infos.description).set("options", {
        ...infos.options ?? {},
        draftAndPublish: infos.draftAndPublish || false
      }).set("pluginOptions", infos.pluginOptions).setAttributes(this.convertAttributes(newAttributes));
      return contentType;
    },
    deleteContentType(uid) {
      if (!this.contentTypes.has(uid)) {
        throw new ApplicationError$1("contentType.notFound");
      }
      this.components.forEach((compo) => {
        compo.removeContentType(uid);
      });
      this.contentTypes.forEach((ct) => {
        ct.removeContentType(uid);
      });
      return this.contentTypes.get(uid).delete();
    }
  };
}
const createContentTypeUID = ({ singularName }) => `api::${singularName}.${singularName}`;
const generateRelation = ({ key, attribute, uid, targetAttribute = {} }) => {
  const opts = {
    type: "relation",
    target: uid,
    autoPopulate: targetAttribute.autoPopulate,
    private: targetAttribute.private || void 0,
    pluginOptions: targetAttribute.pluginOptions || void 0
  };
  switch (attribute.relation) {
    case "oneToOne": {
      opts.relation = "oneToOne";
      if (attribute.dominant) {
        opts.mappedBy = key;
      } else {
        opts.inversedBy = key;
      }
      break;
    }
    case "oneToMany": {
      opts.relation = "manyToOne";
      opts.inversedBy = key;
      break;
    }
    case "manyToOne": {
      opts.relation = "oneToMany";
      opts.mappedBy = key;
      break;
    }
    case "manyToMany": {
      opts.relation = "manyToMany";
      if (attribute.dominant) {
        opts.mappedBy = key;
      } else {
        opts.inversedBy = key;
      }
      break;
    }
  }
  const { type, relation, target, ...restOptions } = opts;
  return {
    type,
    relation,
    target,
    ...restOptions
  };
};
function createBuilder() {
  const components2 = Object.values(strapi.components).map((componentInput) => ({
    category: componentInput.category,
    modelName: componentInput.modelName,
    plugin: componentInput.modelName,
    uid: componentInput.uid,
    filename: componentInput.__filename__,
    dir: path.join(strapi.dirs.app.components, componentInput.category),
    schema: componentInput.__schema__,
    config: componentInput.config
  }));
  const contentTypes2 = Object.values(strapi.contentTypes).map((contentTypeInput) => {
    const dir = contentTypeInput.plugin ? path.join(
      strapi.dirs.app.extensions,
      contentTypeInput.plugin,
      "content-types",
      contentTypeInput.info.singularName
    ) : path.join(
      strapi.dirs.app.api,
      contentTypeInput.apiName,
      "content-types",
      contentTypeInput.info.singularName
    );
    return {
      modelName: contentTypeInput.modelName,
      plugin: contentTypeInput.plugin,
      uid: contentTypeInput.uid,
      filename: "schema.json",
      dir,
      schema: contentTypeInput.__schema__,
      config: contentTypeInput.config
    };
  });
  return createSchemaBuilder({
    components: components2,
    contentTypes: contentTypes2
  });
}
function createSchemaBuilder({ components: components2, contentTypes: contentTypes2 }) {
  const tmpComponents = /* @__PURE__ */ new Map();
  const tmpContentTypes = /* @__PURE__ */ new Map();
  Object.keys(contentTypes2).forEach((key) => {
    tmpContentTypes.set(contentTypes2[key].uid, createSchemaHandler(contentTypes2[key]));
  });
  Object.keys(components2).forEach((key) => {
    tmpComponents.set(components2[key].uid, createSchemaHandler(components2[key]));
  });
  return {
    get components() {
      return tmpComponents;
    },
    get contentTypes() {
      return tmpContentTypes;
    },
    /**
     * Convert Attributes received from the API to the right syntax
     */
    convertAttributes(attributes) {
      return Object.keys(attributes).reduce((acc, key) => {
        const attribute = attributes[key];
        const { configurable, private: isPrivate } = attribute;
        const baseProperties = {
          private: isPrivate === true ? true : void 0,
          configurable: configurable === false ? false : void 0
        };
        if (attribute.type === "relation") {
          const { target, relation, targetAttribute, dominant, ...restOfProperties } = attribute;
          const attr = {
            type: "relation",
            relation,
            target,
            ...restOfProperties,
            ...baseProperties
          };
          acc[key] = attr;
          if (target && !this.contentTypes.has(target)) {
            throw new utils.errors.ApplicationError(`target: ${target} does not exist`);
          }
          if (___default.default.isNil(targetAttribute)) {
            return acc;
          }
          if (["oneToOne", "manyToMany"].includes(relation) && dominant === true) {
            attr.inversedBy = targetAttribute;
          } else if (["oneToOne", "manyToMany"].includes(relation) && dominant === false) {
            attr.mappedBy = targetAttribute;
          } else if (["oneToOne", "manyToOne", "manyToMany"].includes(relation)) {
            attr.inversedBy = targetAttribute;
          } else if (["oneToMany"].includes(relation)) {
            attr.mappedBy = targetAttribute;
          }
          return acc;
        }
        acc[key] = {
          ...attribute,
          ...baseProperties
        };
        return acc;
      }, {});
    },
    ...createComponentBuilder$1(),
    ...createComponentBuilder(),
    /**
     * Write all type to files
     */
    writeFiles() {
      const schemas = [
        ...Array.from(tmpComponents.values()),
        ...Array.from(tmpContentTypes.values())
      ];
      return Promise.all(schemas.map((schema) => schema.flush())).catch((error) => {
        strapi.log.error("Error writing schema files");
        strapi.log.error(error);
        return this.rollback();
      }).catch((error) => {
        strapi.log.error(
          "Error rolling back schema files. You might need to fix your files manually"
        );
        strapi.log.error(error);
        throw new utils.errors.ApplicationError("Invalid schema edition");
      });
    },
    /**
     * rollback all files
     */
    rollback() {
      return Promise.all(
        [...Array.from(tmpComponents.values()), ...Array.from(tmpContentTypes.values())].map(
          (schema) => schema.rollback()
        )
      );
    }
  };
}
const { ApplicationError } = utils.errors;
const isContentTypeVisible = (model) => fp.getOr(true, "pluginOptions.content-type-builder.visible", model) === true;
const getRestrictRelationsTo = (contentType) => {
  const { uid } = contentType;
  if (uid === coreUids.STRAPI_USER) {
    return ["oneWay", "manyWay"];
  }
  if (uid.startsWith(coreUids.PREFIX) || uid === pluginsUids.UPLOAD_FILE || !isContentTypeVisible(contentType)) {
    return [];
  }
  return null;
};
const formatContentType = (contentType) => {
  const { uid, kind, modelName, plugin, collectionName, info } = contentType;
  return {
    uid,
    plugin,
    apiID: modelName,
    schema: {
      ...utils.contentTypes.getOptions(contentType),
      displayName: info.displayName,
      singularName: info.singularName,
      pluralName: info.pluralName,
      description: ___default.default.get(info, "description", ""),
      pluginOptions: contentType.pluginOptions,
      kind: kind || "collectionType",
      collectionName,
      attributes: formatAttributes(contentType),
      visible: isContentTypeVisible(contentType),
      restrictRelationsTo: getRestrictRelationsTo(contentType)
    }
  };
};
const createContentTypes = async (contentTypes2) => {
  const builder2 = createBuilder();
  const createdContentTypes = [];
  for (const contentType of contentTypes2) {
    createdContentTypes.push(await createContentType(contentType, { defaultBuilder: builder2 }));
  }
  await builder2.writeFiles();
  return createdContentTypes;
};
const createContentType = async ({ contentType, components: components2 }, options = {}) => {
  const builder2 = options.defaultBuilder || createBuilder();
  const uidMap = builder2.createNewComponentUIDMap(components2 || []);
  const replaceTmpUIDs = replaceTemporaryUIDs(uidMap);
  const newContentType = builder2.createContentType(replaceTmpUIDs(contentType));
  const targetContentType = (infos) => {
    Object.keys(infos.attributes).forEach((key) => {
      const { target } = infos.attributes[key];
      if (target === "__contentType__") {
        infos.attributes[key].target = newContentType.uid;
      }
    });
    return infos;
  };
  components2?.forEach((component) => {
    const options2 = replaceTmpUIDs(targetContentType(component));
    if (!___default.default.has(component, "uid")) {
      return builder2.createComponent(options2);
    }
    return builder2.editComponent(options2);
  });
  await generateAPI({
    displayName: contentType.displayName || contentType.info.displayName,
    singularName: contentType.singularName,
    pluralName: contentType.pluralName,
    kind: contentType.kind
  });
  if (!options.defaultBuilder) {
    await builder2.writeFiles();
  }
  strapi.eventHub.emit("content-type.create", { contentType: newContentType });
  return newContentType;
};
const generateAPI = ({
  singularName,
  kind = "collectionType",
  pluralName,
  displayName
}) => {
  const strapiGenerators = require("@strapi/generators");
  return strapiGenerators.generate(
    "content-type",
    {
      kind,
      singularName,
      id: singularName,
      pluralName,
      displayName,
      destination: "new",
      bootstrapApi: true,
      attributes: []
    },
    { dir: strapi.dirs.app.root }
  );
};
const editContentType = async (uid, { contentType, components: components2 = [] }) => {
  const builder2 = createBuilder();
  const previousSchema = builder2.contentTypes.get(uid).schema;
  const previousKind = previousSchema.kind;
  const newKind = contentType.kind || previousKind;
  const previousAttributes = previousSchema.attributes;
  const prevNonVisibleAttributes = utils.contentTypes.getNonVisibleAttributes(previousSchema).reduce((acc, key) => {
    if (key in previousAttributes) {
      acc[key] = previousAttributes[key];
    }
    return acc;
  }, {});
  contentType.attributes = ___default.default.merge(prevNonVisibleAttributes, contentType.attributes);
  if (newKind !== previousKind && newKind === "singleType") {
    const entryCount = await strapi.query(uid).count();
    if (entryCount > 1) {
      throw new ApplicationError(
        "You cannot convert a collectionType to a singleType when having multiple entries in DB"
      );
    }
  }
  const uidMap = builder2.createNewComponentUIDMap(components2);
  const replaceTmpUIDs = replaceTemporaryUIDs(uidMap);
  const updatedContentType = builder2.editContentType({
    uid,
    ...replaceTmpUIDs(contentType)
  });
  components2.forEach((component) => {
    if (!___default.default.has(component, "uid")) {
      return builder2.createComponent(replaceTmpUIDs(component));
    }
    return builder2.editComponent(replaceTmpUIDs(component));
  });
  if (newKind !== previousKind) {
    const apiHandler2 = strapi.plugin("content-type-builder").service("api-handler");
    await apiHandler2.backup(uid);
    try {
      await apiHandler2.clear(uid);
      await generateAPI({
        displayName: updatedContentType.schema.info.displayName,
        singularName: updatedContentType.schema.info.singularName,
        pluralName: updatedContentType.schema.info.pluralName,
        kind: updatedContentType.schema.kind
      });
      await builder2.writeFiles();
    } catch (error) {
      strapi.log.error(error);
      await apiHandler2.rollback(uid);
    }
    return updatedContentType;
  }
  await builder2.writeFiles();
  strapi.eventHub.emit("content-type.update", { contentType: updatedContentType });
  return updatedContentType;
};
const deleteContentTypes = async (uids) => {
  const builder2 = createBuilder();
  const apiHandler2 = strapi.plugin("content-type-builder").service("api-handler");
  for (const uid of uids) {
    await deleteContentType(uid, builder2);
  }
  await builder2.writeFiles();
  for (const uid of uids) {
    try {
      await apiHandler2.clear(uid);
    } catch (error) {
      strapi.log.error(error);
      await apiHandler2.rollback(uid);
    }
  }
};
const deleteContentType = async (uid, defaultBuilder = void 0) => {
  const builder2 = defaultBuilder || createBuilder();
  const apiHandler2 = strapi.plugin("content-type-builder").service("api-handler");
  await apiHandler2.backup(uid);
  const contentType = builder2.deleteContentType(uid);
  if (!defaultBuilder) {
    try {
      await builder2.writeFiles();
      await apiHandler2.clear(uid);
    } catch (error) {
      await apiHandler2.rollback(uid);
    }
  }
  strapi.eventHub.emit("content-type.delete", { contentType });
  return contentType;
};
const contentTypes$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createContentType,
  createContentTypes,
  deleteContentType,
  deleteContentTypes,
  editContentType,
  formatContentType,
  generateAPI,
  getRestrictRelationsTo,
  isContentTypeVisible
}, Symbol.toStringTag, { value: "Module" }));
const formatComponent = (component) => {
  const { uid, modelName, connection, collectionName, info, category } = component;
  return {
    uid,
    category,
    apiId: modelName,
    schema: {
      displayName: _.get(info, "displayName"),
      description: _.get(info, "description", ""),
      icon: _.get(info, "icon"),
      connection,
      collectionName,
      pluginOptions: component.pluginOptions,
      attributes: formatAttributes(component)
    }
  };
};
const createComponent = async ({ component, components: components2 = [] }) => {
  const builder2 = createBuilder();
  const uidMap = builder2.createNewComponentUIDMap(components2);
  const replaceTmpUIDs = replaceTemporaryUIDs(uidMap);
  const newComponent = builder2.createComponent(replaceTmpUIDs(component));
  components2.forEach((component2) => {
    if (!_.has(component2, "uid")) {
      return builder2.createComponent(replaceTmpUIDs(component2));
    }
    return builder2.editComponent(replaceTmpUIDs(component2));
  });
  await builder2.writeFiles();
  strapi.eventHub.emit("component.create", { component: newComponent });
  return newComponent;
};
const editComponent = async (uid, { component, components: components2 = [] }) => {
  const builder2 = createBuilder();
  const uidMap = builder2.createNewComponentUIDMap(components2);
  const replaceTmpUIDs = replaceTemporaryUIDs(uidMap);
  const updatedComponent = builder2.editComponent({
    uid,
    ...replaceTmpUIDs(component)
  });
  components2.forEach((component2) => {
    if (!_.has(component2, "uid")) {
      return builder2.createComponent(replaceTmpUIDs(component2));
    }
    return builder2.editComponent(replaceTmpUIDs(component2));
  });
  await builder2.writeFiles();
  strapi.eventHub.emit("component.update", { component: updatedComponent });
  return updatedComponent;
};
const deleteComponent = async (uid) => {
  const builder2 = createBuilder();
  const deletedComponent = builder2.deleteComponent(uid);
  await builder2.writeFiles();
  strapi.eventHub.emit("component.delete", { component: deletedComponent });
  return deletedComponent;
};
const components$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createComponent,
  deleteComponent,
  editComponent,
  formatComponent
}, Symbol.toStringTag, { value: "Module" }));
const editCategory = async (name, infos) => {
  const newName = utils.nameToSlug(infos.name);
  if (name === newName)
    return;
  if (!categoryExists(name)) {
    throw new utils.errors.ApplicationError("category not found");
  }
  if (categoryExists(newName)) {
    throw new utils.errors.ApplicationError("Name already taken");
  }
  const builder2 = createBuilder();
  builder2.components.forEach((component) => {
    const oldUID = component.uid;
    const newUID = `${newName}.${component.modelName}`;
    if (component.category !== name)
      return;
    component.setUID(newUID).setDir(path.join(strapi.dirs.app.components, newName));
    builder2.components.forEach((compo) => {
      compo.updateComponent(oldUID, newUID);
    });
    builder2.contentTypes.forEach((ct) => {
      ct.updateComponent(oldUID, newUID);
    });
  });
  await builder2.writeFiles();
  return newName;
};
const deleteCategory = async (name) => {
  if (!categoryExists(name)) {
    throw new utils.errors.ApplicationError("category not found");
  }
  const builder2 = createBuilder();
  builder2.components.forEach((component) => {
    if (component.category === name) {
      builder2.deleteComponent(component.uid);
    }
  });
  await builder2.writeFiles();
};
const categoryExists = (name) => {
  const matchingIndex = Object.values(strapi.components).findIndex(
    (component) => component.category === name
  );
  return matchingIndex > -1;
};
const componentCategories$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  deleteCategory,
  editCategory
}, Symbol.toStringTag, { value: "Module" }));
const getReservedNames = () => {
  return {
    // use kebab case everywhere since singularName and pluralName are validated that way
    models: [
      "boolean",
      "date",
      "date-time",
      "time",
      "upload",
      "then",
      // https://github.com/strapi/strapi/issues/15557
      "rest"
      // https://github.com/strapi/strapi/issues/13643
    ],
    // attributes are compared with snake_case(name), so only snake_case is needed here and camelCase + UPPER_CASE matches will still be caught
    attributes: [
      // TODO V5: these need to come from a centralized place so we don't break things accidentally in the future
      "id",
      "created_at",
      "updated_at",
      "published_at",
      "created_by_id",
      "updated_by_id",
      // TODO v5: restricting 'locale' would be a breaking change in v4 but we will need it if this is not resolved: https://github.com/strapi/strapi/issues/10181
      // not actually breaking but we'll leave it to avoid confusion
      "created_by",
      "updated_by"
    ]
  };
};
const builder$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getReservedNames
}, Symbol.toStringTag, { value: "Module" }));
async function clear(uid) {
  const { apiName, modelName } = strapi.contentTypes[uid];
  const apiFolder = path__namespace.join(strapi.dirs.app.api, apiName);
  await recursiveRemoveFiles(apiFolder, createDeleteApiFunction(modelName));
  await deleteBackup(uid);
}
async function backup(uid) {
  const { apiName } = strapi.contentTypes[uid];
  const apiFolder = path__namespace.join(strapi.dirs.app.api, apiName);
  const backupFolder = path__namespace.join(strapi.dirs.app.api, ".backup", apiName);
  await fse__namespace.copy(apiFolder, backupFolder);
}
async function deleteBackup(uid) {
  const { apiName } = strapi.contentTypes[uid];
  const backupFolder = path__namespace.join(strapi.dirs.app.api, ".backup");
  const apiBackupFolder = path__namespace.join(strapi.dirs.app.api, ".backup", apiName);
  await fse__namespace.remove(apiBackupFolder);
  const list = await fse__namespace.readdir(backupFolder);
  if (list.length === 0) {
    await fse__namespace.remove(backupFolder);
  }
}
async function rollback(uid) {
  const { apiName } = strapi.contentTypes[uid];
  const apiFolder = path__namespace.join(strapi.dirs.app.api, apiName);
  const backupFolder = path__namespace.join(strapi.dirs.app.api, ".backup", apiName);
  try {
    await fse__namespace.access(backupFolder);
  } catch {
    throw new Error("Cannot rollback api that was not backed up");
  }
  await fse__namespace.remove(apiFolder);
  await fse__namespace.copy(backupFolder, apiFolder);
  await deleteBackup(uid);
}
const createDeleteApiFunction = (baseName) => {
  return async (filePath) => {
    const fileName = path__namespace.basename(filePath, path__namespace.extname(filePath));
    const isSchemaFile = filePath.endsWith(`${baseName}/schema.json`);
    if (fileName === baseName || isSchemaFile) {
      return fse__namespace.remove(filePath);
    }
  };
};
const recursiveRemoveFiles = async (folder, deleteFn) => {
  const filesName = await fse__namespace.readdir(folder);
  for (const fileName of filesName) {
    const filePath = path__namespace.join(folder, fileName);
    const stat = await fse__namespace.stat(filePath);
    if (stat.isDirectory()) {
      await recursiveRemoveFiles(filePath, deleteFn);
    } else {
      await deleteFn(filePath);
    }
  }
  const files = await fse__namespace.readdir(folder);
  if (files.length === 0) {
    await fse__namespace.remove(folder);
  }
};
const apiHandler = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  backup,
  clear,
  rollback
}, Symbol.toStringTag, { value: "Module" }));
const services = {
  "content-types": contentTypes$1,
  components: components$1,
  "component-categories": componentCategories$1,
  builder: builder$1,
  "api-handler": apiHandler
};
function getService(name) {
  return strapi.plugin("content-type-builder").service(name);
}
const builder = {
  getReservedNames(ctx) {
    ctx.body = getService("builder").getReservedNames();
  }
};
const validators = {
  required: utils.yup.boolean(),
  unique: utils.yup.boolean(),
  minLength: utils.yup.number().integer().positive(),
  maxLength: utils.yup.number().integer().positive()
};
const NAME_REGEX = /^[A-Za-z][_0-9A-Za-z]*$/;
const COLLECTION_NAME_REGEX = /^[A-Za-z][-_0-9A-Za-z]*$/;
const CATEGORY_NAME_REGEX = /^[A-Za-z][-_0-9A-Za-z]*$/;
const ICON_REGEX = /^[A-Za-z0-9][-A-Za-z0-9]*$/;
const UID_REGEX = /^[A-Za-z0-9-_.~]*$/;
const isValidName = {
  name: "isValidName",
  message: `\${path} must match the following regex: ${NAME_REGEX}`,
  test: (val) => val === "" || NAME_REGEX.test(val)
};
const isValidIcon = {
  name: "isValidIcon",
  message: `\${path} is not a valid icon name. Make sure your icon name starts with an alphanumeric character and only includes alphanumeric characters or dashes.`,
  test: (val) => val === "" || ICON_REGEX.test(val)
};
const isValidUID = {
  name: "isValidUID",
  message: `\${path} must match the following regex: ${UID_REGEX}`,
  test: (val) => val === "" || UID_REGEX.test(val)
};
const isValidCategoryName = {
  name: "isValidCategoryName",
  message: `\${path} must match the following regex: ${CATEGORY_NAME_REGEX}`,
  test: (val) => val === "" || CATEGORY_NAME_REGEX.test(val)
};
const isValidCollectionName = {
  name: "isValidCollectionName",
  message: `\${path} must match the following regex: ${COLLECTION_NAME_REGEX}`,
  test: (val) => val === "" || COLLECTION_NAME_REGEX.test(val)
};
const isValidKey = (key) => ({
  name: "isValidKey",
  message: `Attribute name '${key}' must match the following regex: ${NAME_REGEX}`,
  test: () => NAME_REGEX.test(key)
});
const isValidEnum = {
  name: "isValidEnum",
  message: "${path} should not start with number",
  test: (val) => val === "" || !utils.startsWithANumber(val)
};
const areEnumValuesUnique = {
  name: "areEnumValuesUnique",
  message: "${path} cannot contain duplicate values",
  test(values) {
    const filtered = [...new Set(values)];
    return filtered.length === values.length;
  }
};
const isValidRegExpPattern = {
  name: "isValidRegExpPattern",
  message: "${path} must be a valid RexExp pattern string",
  test: (val) => val === "" || !!new RegExp(val)
};
const isValidDefaultJSON = {
  name: "isValidDefaultJSON",
  message: "${path} is not a valid JSON",
  test(val) {
    if (val === void 0) {
      return true;
    }
    if (___default.default.isNumber(val) || ___default.default.isNull(val) || ___default.default.isObject(val) || ___default.default.isArray(val)) {
      return true;
    }
    try {
      JSON.parse(val);
      return true;
    } catch (err) {
      return false;
    }
  }
};
const componentCategorySchema = utils.yup.object({
  name: utils.yup.string().min(3).test(isValidCategoryName).required("name.required")
}).noUnknown();
const validateComponentCategory = utils.validateYupSchema(componentCategorySchema);
const componentCategories = {
  async editCategory(ctx) {
    const { body } = ctx.request;
    try {
      await validateComponentCategory(body);
    } catch (error) {
      return ctx.send({ error }, 400);
    }
    const { name } = ctx.params;
    strapi.reload.isWatching = false;
    const componentCategoryService = getService("component-categories");
    const newName = await componentCategoryService.editCategory(name, body);
    setImmediate(() => strapi.reload());
    ctx.send({ name: newName });
  },
  async deleteCategory(ctx) {
    const { name } = ctx.params;
    strapi.reload.isWatching = false;
    const componentCategoryService = getService("component-categories");
    await componentCategoryService.deleteCategory(name);
    setImmediate(() => strapi.reload());
    ctx.send({ name });
  }
};
const maxLengthIsGreaterThanOrEqualToMinLength = {
  name: "isGreaterThanMin",
  message: "maxLength must be greater or equal to minLength",
  test(value) {
    const { minLength } = this.parent;
    return !(!___default.default.isUndefined(minLength) && !___default.default.isUndefined(value) && value < minLength);
  }
};
const getTypeValidator = (attribute, { types, modelType, attributes }) => {
  return utils.yup.object({
    type: utils.yup.string().oneOf([...types]).required(),
    configurable: utils.yup.boolean().nullable(),
    private: utils.yup.boolean().nullable(),
    pluginOptions: utils.yup.object(),
    ...getTypeShape(attribute, { modelType, attributes })
  });
};
const getTypeShape = (attribute, { modelType, attributes } = {}) => {
  switch (attribute.type) {
    case "media": {
      return {
        multiple: utils.yup.boolean(),
        required: validators.required,
        allowedTypes: utils.yup.array().of(utils.yup.string().oneOf(["images", "videos", "files", "audios"])).min(1)
      };
    }
    case "uid": {
      return {
        required: validators.required,
        targetField: utils.yup.string().oneOf(
          Object.keys(attributes).filter(
            (key) => VALID_UID_TARGETS.includes(___default.default.get(attributes[key], "type"))
          )
        ).nullable(),
        default: utils.yup.string().test(
          "isValidDefaultUID",
          "cannot define a default UID if the targetField is set",
          function(value) {
            const { targetField } = this.parent;
            return !!(___default.default.isNil(targetField) || ___default.default.isNil(value));
          }
        ).test(isValidUID),
        minLength: validators.minLength,
        maxLength: validators.maxLength.max(256).test(maxLengthIsGreaterThanOrEqualToMinLength),
        options: utils.yup.object().shape({
          separator: utils.yup.string(),
          lowercase: utils.yup.boolean(),
          decamelize: utils.yup.boolean(),
          customReplacements: utils.yup.array().of(utils.yup.array().of(utils.yup.string()).min(2).max(2)),
          preserveLeadingUnderscore: utils.yup.boolean()
        })
      };
    }
    case "string":
    case "text": {
      return {
        default: utils.yup.string(),
        required: validators.required,
        unique: validators.unique,
        minLength: validators.minLength,
        maxLength: validators.maxLength,
        regex: utils.yup.string().test(isValidRegExpPattern)
      };
    }
    case "richtext": {
      return {
        default: utils.yup.string(),
        required: validators.required,
        minLength: validators.minLength,
        maxLength: validators.maxLength
      };
    }
    case "blocks": {
      return {
        required: validators.required
      };
    }
    case "json": {
      return {
        default: utils.yup.mixed().test(isValidDefaultJSON),
        required: validators.required
      };
    }
    case "enumeration": {
      return {
        enum: utils.yup.array().of(utils.yup.string().test(isValidEnum).required()).min(1).test(areEnumValuesUnique).required(),
        default: utils.yup.string().when("enum", (enumVal) => utils.yup.string().oneOf(enumVal)),
        enumName: utils.yup.string().test(isValidName),
        required: validators.required
      };
    }
    case "password": {
      return {
        required: validators.required,
        minLength: validators.minLength,
        maxLength: validators.maxLength
      };
    }
    case "email": {
      return {
        default: utils.yup.string().email(),
        required: validators.required,
        unique: validators.unique,
        minLength: validators.minLength,
        maxLength: validators.maxLength
      };
    }
    case "integer": {
      return {
        default: utils.yup.number().integer(),
        required: validators.required,
        unique: validators.unique,
        min: utils.yup.number().integer(),
        max: utils.yup.number().integer()
      };
    }
    case "biginteger": {
      return {
        default: utils.yup.string().nullable().matches(/^\d*$/),
        required: validators.required,
        unique: validators.unique,
        min: utils.yup.string().nullable().matches(/^\d*$/),
        max: utils.yup.string().nullable().matches(/^\d*$/)
      };
    }
    case "float": {
      return {
        default: utils.yup.number(),
        required: validators.required,
        unique: validators.unique,
        min: utils.yup.number(),
        max: utils.yup.number()
      };
    }
    case "decimal": {
      return {
        default: utils.yup.number(),
        required: validators.required,
        unique: validators.unique,
        min: utils.yup.number(),
        max: utils.yup.number()
      };
    }
    case "time":
    case "datetime":
    case "date": {
      return {
        default: utils.yup.string(),
        required: validators.required,
        unique: validators.unique
      };
    }
    case "boolean": {
      return {
        default: utils.yup.boolean(),
        required: validators.required
      };
    }
    case "component": {
      return {
        required: validators.required,
        repeatable: utils.yup.boolean(),
        component: utils.yup.string().test({
          name: "Check max component nesting is 1 lvl",
          test(compoUID) {
            const targetCompo = strapi.components[compoUID];
            if (!targetCompo)
              return true;
            if (modelType === modelTypes.COMPONENT && hasComponent(targetCompo)) {
              return this.createError({
                path: this.path,
                message: `${targetCompo.modelName} already is a nested component. You cannot have more than one level of nesting inside your components.`
              });
            }
            return true;
          }
        }).required(),
        min: utils.yup.number(),
        max: utils.yup.number()
      };
    }
    case "dynamiczone": {
      return {
        required: validators.required,
        components: utils.yup.array().of(utils.yup.string().required()).test("isArray", "${path} must be an array", (value) => Array.isArray(value)).min(1),
        min: utils.yup.number(),
        max: utils.yup.number()
      };
    }
    default: {
      return {};
    }
  }
};
const STRAPI_USER_RELATIONS = ["oneToOne", "oneToMany"];
const isValidRelation = (validNatures) => function(value) {
  if (value === void 0) {
    return true;
  }
  if (this.parent.target === coreUids.STRAPI_USER) {
    if (!validNatures.includes(value) || !fp.isUndefined(this.parent.targetAttribute)) {
      return this.createError({
        path: this.path,
        message: `must be one of the following values: ${STRAPI_USER_RELATIONS.join(", ")}`
      });
    }
  }
  return validNatures.includes(value) ? true : this.createError({
    path: this.path,
    message: `must be one of the following values: ${validNatures.join(", ")}`
  });
};
const getRelationValidator = (attribute, allowedRelations) => {
  const contentTypesUIDs = Object.keys(strapi.contentTypes).filter((key) => strapi.contentTypes[key].kind === typeKinds.COLLECTION_TYPE).filter((key) => !key.startsWith(coreUids.PREFIX) || key === coreUids.STRAPI_USER).concat(["__self__", "__contentType__"]);
  const base = {
    type: utils.yup.string().oneOf(["relation"]).required(),
    relation: utils.yup.string().test("isValidRelation", isValidRelation(allowedRelations)).required(),
    configurable: utils.yup.boolean().nullable(),
    private: utils.yup.boolean().nullable(),
    pluginOptions: utils.yup.object()
  };
  switch (attribute.relation) {
    case "oneToOne":
    case "oneToMany":
    case "manyToOne":
    case "manyToMany":
    case "morphOne":
    case "morphMany": {
      return utils.yup.object({
        ...base,
        target: utils.yup.string().oneOf(contentTypesUIDs).required(),
        targetAttribute: utils.yup.string().test(isValidName).nullable()
      });
    }
    case "morphToOne":
    case "morphToMany":
    default: {
      return utils.yup.object({ ...base });
    }
  }
};
const createSchema = (types, relations, { modelType } = {}) => {
  const shape = {
    description: utils.yup.string(),
    draftAndPublish: utils.yup.boolean(),
    options: utils.yup.object(),
    pluginOptions: utils.yup.object(),
    collectionName: utils.yup.string().nullable().test(isValidCollectionName),
    attributes: createAttributesValidator({ types, relations, modelType }),
    reviewWorkflows: utils.yup.boolean()
  };
  if (modelType === modelTypes.CONTENT_TYPE) {
    shape.kind = utils.yup.string().oneOf([typeKinds.SINGLE_TYPE, typeKinds.COLLECTION_TYPE]).nullable();
  }
  return utils.yup.object(shape).noUnknown();
};
const createAttributesValidator = ({ types, modelType, relations }) => {
  return utils.yup.lazy((attributes) => {
    return utils.yup.object().shape(
      ___default.default.mapValues(attributes, (attribute, key) => {
        if (isForbiddenKey(key)) {
          return forbiddenValidator();
        }
        if (isConflictingKey(key, attributes)) {
          return conflictingKeysValidator(key);
        }
        if (attribute.type === "relation") {
          return getRelationValidator(attribute, relations).test(isValidKey(key));
        }
        if (___default.default.has(attribute, "type")) {
          return getTypeValidator(attribute, { types, modelType, attributes }).test(
            isValidKey(key)
          );
        }
        return typeOrRelationValidator;
      })
    ).required("attributes.required");
  });
};
const isConflictingKey = (key, attributes) => {
  const snakeCaseKey = fp.snakeCase(key);
  return Object.keys(attributes).some((existingKey) => {
    if (existingKey === key)
      return false;
    return fp.snakeCase(existingKey) === snakeCaseKey;
  });
};
const isForbiddenKey = (key) => {
  const snakeCaseKey = fp.snakeCase(key);
  const reservedNames = [
    ...FORBIDDEN_ATTRIBUTE_NAMES,
    ...getService("builder").getReservedNames().attributes
  ];
  return reservedNames.some((reserved) => {
    return fp.snakeCase(reserved) === snakeCaseKey;
  });
};
const forbiddenValidator = () => {
  const reservedNames = [
    ...FORBIDDEN_ATTRIBUTE_NAMES,
    ...getService("builder").getReservedNames().attributes
  ];
  return utils.yup.mixed().test({
    name: "forbiddenKeys",
    message: `Attribute keys cannot be one of ${reservedNames.join(", ")}`,
    test: () => false
  });
};
const conflictingKeysValidator = (key) => {
  return utils.yup.mixed().test({
    name: "conflictingKeys",
    message: `Attribute ${key} conflicts with an existing key`,
    test: () => false
  });
};
const typeOrRelationValidator = utils.yup.object().test({
  name: "mustHaveTypeOrTarget",
  message: "Attribute must have either a type or a target",
  test: () => false
});
const hasDefaultAttribute = (attribute) => {
  return "default" in attribute;
};
const removeEmptyDefaults = (data) => {
  const { attributes } = data || {};
  Object.keys(attributes).forEach((attributeName) => {
    const attribute = attributes[attributeName];
    if (hasDefaultAttribute(attribute) && attribute.default === "") {
      attribute.default = void 0;
    }
  });
};
const removeDeletedUIDTargetFields = (data) => {
  if (___default.default.has(data, "attributes")) {
    Object.values(data.attributes).forEach((attribute) => {
      if (attribute.type === "uid" && !___default.default.isUndefined(attribute.targetField) && !___default.default.has(data.attributes, attribute.targetField)) {
        attribute.targetField = void 0;
      }
    });
  }
};
const VALID_RELATIONS$1 = ["oneToOne", "oneToMany"];
const VALID_TYPES$1 = [...DEFAULT_TYPES, "component", "customField"];
const componentSchema = createSchema(VALID_TYPES$1, VALID_RELATIONS$1, {
  modelType: modelTypes.COMPONENT
}).shape({
  displayName: utils.yup.string().min(1).required("displayName.required"),
  icon: utils.yup.string().nullable().test(isValidIcon),
  category: utils.yup.string().nullable().test(isValidCategoryName).required("category.required")
}).required().noUnknown();
const nestedComponentSchema = utils.yup.array().of(
  componentSchema.shape({
    uid: utils.yup.string(),
    tmpUID: utils.yup.string()
  }).test({
    name: "mustHaveUIDOrTmpUID",
    message: "Component must have a uid or a tmpUID",
    test(attr) {
      if (___default.default.has(attr, "uid") && ___default.default.has(attr, "tmpUID"))
        return false;
      if (!___default.default.has(attr, "uid") && !___default.default.has(attr, "tmpUID"))
        return false;
      return true;
    }
  }).required().noUnknown()
);
const componentInputSchema = utils.yup.object({
  component: componentSchema,
  components: nestedComponentSchema
}).noUnknown();
const validateComponentInput = utils.validateYupSchema(componentInputSchema);
const updateComponentInputSchema = utils.yup.object({
  component: componentSchema,
  components: nestedComponentSchema
}).noUnknown();
const validateUpdateComponentInput = (data) => {
  if (___default.default.has(data, "component") && data.component) {
    removeEmptyDefaults(data.component);
  }
  if (___default.default.has(data, "components") && Array.isArray(data.components)) {
    data.components.forEach((data2) => {
      if (___default.default.has(data2, "uid")) {
        removeEmptyDefaults(data2);
      }
    });
  }
  return utils.validateYupSchema(updateComponentInputSchema)(data);
};
const components = {
  /**
   * GET /components handler
   * Returns a list of available components
   * @param {Object} ctx - koa context
   */
  async getComponents(ctx) {
    const componentService = getService("components");
    const data = Object.keys(strapi.components).map((uid) => {
      return componentService.formatComponent(strapi.components[uid]);
    });
    ctx.send({ data });
  },
  /**
   * GET /components/:uid
   * Returns a specific component
   * @param {Object} ctx - koa context
   */
  async getComponent(ctx) {
    const { uid } = ctx.params;
    const component = strapi.components[uid];
    if (!component) {
      return ctx.send({ error: "component.notFound" }, 404);
    }
    const componentService = getService("components");
    ctx.send({ data: componentService.formatComponent(component) });
  },
  /**
   * POST /components
   * Creates a component and returns its infos
   * @param {Object} ctx - koa context
   */
  async createComponent(ctx) {
    const { body } = ctx.request;
    try {
      await validateComponentInput(body);
    } catch (error) {
      return ctx.send({ error }, 400);
    }
    try {
      strapi.reload.isWatching = false;
      const componentService = getService("components");
      const component = await componentService.createComponent({
        component: body.component,
        components: body.components
      });
      setImmediate(() => strapi.reload());
      ctx.send({ data: { uid: component.uid } }, 201);
    } catch (error) {
      strapi.log.error(error);
      ctx.send({ error: error?.message || "Unknown error" }, 400);
    }
  },
  /**
   * PUT /components/:uid
   * Updates a component and return its infos
   * @param {Object} ctx - koa context - enhanced koa context
   */
  async updateComponent(ctx) {
    const { uid } = ctx.params;
    const { body } = ctx.request;
    if (!___default.default.has(strapi.components, uid)) {
      return ctx.send({ error: "component.notFound" }, 404);
    }
    try {
      await validateUpdateComponentInput(body);
    } catch (error) {
      return ctx.send({ error }, 400);
    }
    try {
      strapi.reload.isWatching = false;
      const componentService = getService("components");
      const component = await componentService.editComponent(uid, {
        component: body.component,
        components: body.components
      });
      setImmediate(() => strapi.reload());
      ctx.send({ data: { uid: component.uid } });
    } catch (error) {
      strapi.log.error(error);
      ctx.send({ error: error?.message || "Unknown error" }, 400);
    }
  },
  /**
   * DELETE /components/:uid
   * Deletes a components and returns its old infos
   * @param {Object} ctx - koa context
   */
  async deleteComponent(ctx) {
    const { uid } = ctx.params;
    if (!___default.default.has(strapi.components, uid)) {
      return ctx.send({ error: "component.notFound" }, 404);
    }
    try {
      strapi.reload.isWatching = false;
      const componentService = getService("components");
      const component = await componentService.deleteComponent(uid);
      setImmediate(() => strapi.reload());
      ctx.send({ data: { uid: component.uid } });
    } catch (error) {
      strapi.log.error(error);
      ctx.send({ error: error?.message || "Unknown error" }, 400);
    }
  }
};
const VALID_RELATIONS = {
  [typeKinds.SINGLE_TYPE]: [
    "oneToOne",
    "oneToMany",
    "morphOne",
    "morphMany",
    "morphToOne",
    "morphToMany"
  ],
  [typeKinds.COLLECTION_TYPE]: [
    "oneToOne",
    "oneToMany",
    "manyToOne",
    "manyToMany",
    "morphOne",
    "morphMany",
    "morphToOne",
    "morphToMany"
  ]
};
const VALID_TYPES = [...DEFAULT_TYPES, "uid", "component", "dynamiczone", "customField"];
const createContentTypeSchema = (data, { isEdition = false } = {}) => {
  const kind = fp.getOr(
    typeKinds.COLLECTION_TYPE,
    "contentType.kind",
    data
  );
  const contentTypeSchema = createSchema(VALID_TYPES, VALID_RELATIONS[kind] || [], {
    modelType: modelTypes.CONTENT_TYPE
  }).shape({
    displayName: utils.yup.string().min(1).required(),
    singularName: utils.yup.string().min(1).test(nameIsAvailable(isEdition)).test(forbiddenContentTypeNameValidator()).isKebabCase().required(),
    pluralName: utils.yup.string().min(1).test(nameIsAvailable(isEdition)).test(nameIsNotExistingCollectionName(isEdition)).test(forbiddenContentTypeNameValidator()).isKebabCase().required()
  }).test(
    "singularName-not-equal-pluralName",
    "${path}: singularName and pluralName should be different",
    (value) => value.singularName !== value.pluralName
  );
  return utils.yup.object({
    // FIXME .noUnknown(false) will strip off the unwanted properties without throwing an error
    // Why not having .noUnknown() ? Because we want to be able to add options relatable to EE features
    // without having any reference to them in CE.
    // Why not handle an "options" object in the content-type ? The admin panel needs lots of rework
    // to be able to send this options object instead of top-level attributes.
    // @nathan-pichon 20/02/2023
    contentType: contentTypeSchema.required().noUnknown(false),
    components: nestedComponentSchema
  }).noUnknown();
};
const validateContentTypeInput = (data) => {
  return utils.validateYupSchema(createContentTypeSchema(data))(data);
};
const validateUpdateContentTypeInput = (data) => {
  if (fp.has("contentType", data)) {
    removeEmptyDefaults(data.contentType);
    removeDeletedUIDTargetFields(data.contentType);
  }
  if (fp.has("components", data) && Array.isArray(data.components)) {
    data.components.forEach((comp) => {
      if (fp.has("uid", comp)) {
        removeEmptyDefaults(comp);
      }
    });
  }
  return utils.validateYupSchema(createContentTypeSchema(data, { isEdition: true }))(data);
};
const forbiddenContentTypeNameValidator = () => {
  const reservedNames = getService("builder").getReservedNames().models;
  return {
    name: "forbiddenContentTypeName",
    message: `Content Type name cannot be one of ${reservedNames.join(", ")}`,
    test(value) {
      if (typeof value !== "string") {
        return true;
      }
      return reservedNames.every((reservedName) => fp.snakeCase(reservedName) !== fp.snakeCase(value));
    }
  };
};
const nameIsAvailable = (isEdition) => {
  const usedNames = fp.flatMap((ct) => {
    return [ct.info?.singularName, ct.info?.pluralName];
  })(strapi.contentTypes);
  return {
    name: "nameAlreadyUsed",
    message: "contentType: name `${value}` is already being used by another content type.",
    test(value) {
      if (isEdition)
        return true;
      if (typeof value !== "string") {
        return true;
      }
      return usedNames.every((usedName) => fp.snakeCase(usedName) !== fp.snakeCase(value));
    }
  };
};
const nameIsNotExistingCollectionName = (isEdition) => {
  const usedNames = Object.keys(strapi.contentTypes).map(
    (key) => strapi.contentTypes[key].collectionName
  );
  return {
    name: "nameAlreadyUsed",
    message: "contentType: name `${value}` is already being used by another content type.",
    test(value) {
      if (isEdition)
        return true;
      if (typeof value !== "string") {
        return true;
      }
      return usedNames.every((usedName) => fp.snakeCase(usedName) !== fp.snakeCase(value));
    }
  };
};
const kindSchema = utils.yup.string().oneOf([typeKinds.SINGLE_TYPE, typeKinds.COLLECTION_TYPE]);
const validateKind = utils.validateYupSchema(kindSchema);
const { hasDraftAndPublish } = utils.contentTypes;
const contentTypes = {
  async getContentTypes(ctx) {
    const { kind } = ctx.query;
    try {
      await validateKind(kind);
    } catch (error) {
      return ctx.send({ error }, 400);
    }
    const contentTypeService = getService("content-types");
    const contentTypes2 = Object.keys(strapi.contentTypes).filter(
      (uid) => !kind || ___default.default.get(strapi.contentTypes[uid], "kind", "collectionType") === kind
    ).map(
      (uid) => contentTypeService.formatContentType(strapi.contentTypes[uid])
    );
    ctx.send({
      data: contentTypes2
    });
  },
  getContentType(ctx) {
    const { uid } = ctx.params;
    const contentType = strapi.contentTypes[uid];
    if (!contentType) {
      return ctx.send({ error: "contentType.notFound" }, 404);
    }
    const contentTypeService = getService("content-types");
    ctx.send({ data: contentTypeService.formatContentType(contentType) });
  },
  async createContentType(ctx) {
    const { body } = ctx.request;
    try {
      await validateContentTypeInput(body);
    } catch (error) {
      return ctx.send({ error }, 400);
    }
    try {
      strapi.reload.isWatching = false;
      const contentTypeService = getService("content-types");
      const contentType = await contentTypeService.createContentType({
        contentType: body.contentType,
        components: body.components
      });
      const metricsPayload = {
        eventProperties: {
          kind: contentType.kind,
          hasDraftAndPublish: hasDraftAndPublish(contentType.schema)
        }
      };
      if (___default.default.isEmpty(strapi.api)) {
        await strapi.telemetry.send("didCreateFirstContentType", metricsPayload);
      } else {
        await strapi.telemetry.send("didCreateContentType", metricsPayload);
      }
      setImmediate(() => strapi.reload());
      ctx.send({ data: { uid: contentType.uid } }, 201);
    } catch (err) {
      strapi.log.error(err);
      await strapi.telemetry.send("didNotCreateContentType", {
        eventProperties: { error: err.message || err }
      });
      ctx.send({ error: err.message || "Unknown error" }, 400);
    }
  },
  async updateContentType(ctx) {
    const { uid } = ctx.params;
    const { body } = ctx.request;
    if (!___default.default.has(strapi.contentTypes, uid)) {
      return ctx.send({ error: "contentType.notFound" }, 404);
    }
    try {
      await validateUpdateContentTypeInput(body);
    } catch (error) {
      return ctx.send({ error }, 400);
    }
    try {
      strapi.reload.isWatching = false;
      const contentTypeService = getService("content-types");
      const component = await contentTypeService.editContentType(uid, {
        contentType: body.contentType,
        components: body.components
      });
      setImmediate(() => strapi.reload());
      ctx.send({ data: { uid: component.uid } }, 201);
    } catch (error) {
      strapi.log.error(error);
      ctx.send({ error: error?.message || "Unknown error" }, 400);
    }
  },
  async deleteContentType(ctx) {
    const { uid } = ctx.params;
    if (!___default.default.has(strapi.contentTypes, uid)) {
      return ctx.send({ error: "contentType.notFound" }, 404);
    }
    try {
      strapi.reload.isWatching = false;
      const contentTypeService = getService("content-types");
      const component = await contentTypeService.deleteContentType(uid);
      setImmediate(() => strapi.reload());
      ctx.send({ data: { uid: component.uid } });
    } catch (error) {
      strapi.log.error(error);
      ctx.send({ error: error?.message || "Unknown error" }, 400);
    }
  }
};
const exportObject = {
  builder,
  "component-categories": componentCategories,
  components,
  "content-types": contentTypes
};
const admin = {
  type: "admin",
  routes: [
    {
      method: "GET",
      path: "/reserved-names",
      handler: "builder.getReservedNames",
      config: {
        policies: [
          {
            name: "admin::hasPermissions",
            config: { actions: ["plugin::content-type-builder.read"] }
          }
        ]
      }
    },
    {
      method: "GET",
      path: "/content-types",
      handler: "content-types.getContentTypes",
      config: {
        policies: [
          {
            name: "admin::hasPermissions",
            config: { actions: ["plugin::content-type-builder.read"] }
          }
        ]
      }
    },
    {
      method: "GET",
      path: "/content-types/:uid",
      handler: "content-types.getContentType",
      config: {
        policies: [
          {
            name: "admin::hasPermissions",
            config: { actions: ["plugin::content-type-builder.read"] }
          }
        ]
      }
    },
    {
      method: "POST",
      path: "/content-types",
      handler: "content-types.createContentType",
      config: {
        policies: [
          {
            name: "admin::hasPermissions",
            config: { actions: ["plugin::content-type-builder.read"] }
          }
        ]
      }
    },
    {
      method: "PUT",
      path: "/content-types/:uid",
      handler: "content-types.updateContentType",
      config: {
        policies: [
          {
            name: "admin::hasPermissions",
            config: { actions: ["plugin::content-type-builder.read"] }
          }
        ]
      }
    },
    {
      method: "DELETE",
      path: "/content-types/:uid",
      handler: "content-types.deleteContentType",
      config: {
        policies: [
          {
            name: "admin::hasPermissions",
            config: { actions: ["plugin::content-type-builder.read"] }
          }
        ]
      }
    },
    {
      method: "GET",
      path: "/components",
      handler: "components.getComponents",
      config: {
        policies: [
          {
            name: "admin::hasPermissions",
            config: { actions: ["plugin::content-type-builder.read"] }
          }
        ]
      }
    },
    {
      method: "GET",
      path: "/components/:uid",
      handler: "components.getComponent",
      config: {
        policies: [
          {
            name: "admin::hasPermissions",
            config: { actions: ["plugin::content-type-builder.read"] }
          }
        ]
      }
    },
    {
      method: "POST",
      path: "/components",
      handler: "components.createComponent",
      config: {
        policies: [
          {
            name: "admin::hasPermissions",
            config: { actions: ["plugin::content-type-builder.read"] }
          }
        ]
      }
    },
    {
      method: "PUT",
      path: "/components/:uid",
      handler: "components.updateComponent",
      config: {
        policies: [
          {
            name: "admin::hasPermissions",
            config: { actions: ["plugin::content-type-builder.read"] }
          }
        ]
      }
    },
    {
      method: "DELETE",
      path: "/components/:uid",
      handler: "components.deleteComponent",
      config: {
        policies: [
          {
            name: "admin::hasPermissions",
            config: { actions: ["plugin::content-type-builder.read"] }
          }
        ]
      }
    },
    {
      method: "PUT",
      path: "/component-categories/:name",
      handler: "component-categories.editCategory",
      config: {
        policies: [
          {
            name: "admin::hasPermissions",
            config: { actions: ["plugin::content-type-builder.read"] }
          }
        ]
      }
    },
    {
      method: "DELETE",
      path: "/component-categories/:name",
      handler: "component-categories.deleteCategory",
      config: {
        policies: [
          {
            name: "admin::hasPermissions",
            config: { actions: ["plugin::content-type-builder.read"] }
          }
        ]
      }
    }
  ]
};
const contentApi = {
  type: "content-api",
  routes: [
    {
      method: "GET",
      path: "/content-types",
      handler: "content-types.getContentTypes"
    },
    {
      method: "GET",
      path: "/content-types/:uid",
      handler: "content-types.getContentType"
    },
    {
      method: "GET",
      path: "/components",
      handler: "components.getComponents"
    },
    {
      method: "GET",
      path: "/components/:uid",
      handler: "components.getComponent"
    }
  ]
};
const routes = {
  admin,
  "content-api": contentApi
};
const index = () => ({
  config,
  bootstrap,
  services,
  controllers: exportObject,
  routes
});
module.exports = index;
//# sourceMappingURL=index.js.map

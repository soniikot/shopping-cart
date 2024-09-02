import "@strapi/types";
import isNil from "lodash/isNil";
import strapiUtils, { contentTypes as contentTypes$1, yup, validateYupSchemaSync, policy, traverse, validateYupSchema, errors, setCreatorFields, pipeAsync, isOperatorOfType, relations as relations$1, mapAsync, sanitize } from "@strapi/utils";
import _, { intersection as intersection$1, difference } from "lodash";
import { intersection, pipe, propOr, pick, isEqual, isEmpty, set, has, prop, assoc, mapValues, flow, uniq, uniqBy, concat, isNil as isNil$1, getOr, propEq, merge, castArray, omit } from "lodash/fp";
import qs from "qs";
import slugify from "@sindresorhus/slugify";
const getService = (name) => {
  return strapi.plugin("content-manager").service(name);
};
const ALLOWED_WEBHOOK_EVENTS = {
  ENTRY_PUBLISH: "entry.publish",
  ENTRY_UNPUBLISH: "entry.unpublish"
};
const bootstrap = async () => {
  Object.entries(ALLOWED_WEBHOOK_EVENTS).forEach(([key, value]) => {
    strapi.webhookStore.addAllowedEvent(key, value);
  });
  getService("field-sizes").setCustomFieldInputSizes();
  await getService("components").syncConfigurations();
  await getService("content-types").syncConfigurations();
  await getService("permission").registerPermissions();
};
const routing = async (ctx, next) => {
  const { model } = ctx.params;
  const ct = strapi.contentTypes[model];
  if (!ct) {
    return ctx.send({ error: "contentType.notFound" }, 404);
  }
  let target;
  if (!ct.plugin || ct.plugin === "admin") {
    target = strapi.admin;
  } else {
    target = strapi.plugin(ct.plugin);
  }
  const { route } = ctx.state;
  if (typeof route.handler !== "string") {
    return next();
  }
  const [, action] = route.handler.split(".");
  const configPath = ct.plugin === "admin" ? ["admin.layout", ct.modelName, "actions", action] : ["plugin", ct.plugin, "layout", ct.modelName, "actions", action];
  const actionConfig = strapi.config.get(configPath);
  if (!isNil(actionConfig)) {
    const [controller, action2] = actionConfig.split(".");
    if (controller && action2) {
      return target.controllers[controller.toLowerCase()][action2](ctx, next);
    }
  }
  await next();
};
const admin = {
  type: "admin",
  routes: [
    {
      method: "GET",
      path: "/init",
      handler: "init.getInitData",
      config: {
        policies: []
      }
    },
    {
      method: "GET",
      path: "/content-types",
      handler: "content-types.findContentTypes",
      config: {
        policies: []
      }
    },
    {
      method: "GET",
      path: "/content-types-settings",
      handler: "content-types.findContentTypesSettings",
      config: {
        policies: []
      }
    },
    {
      method: "GET",
      path: "/content-types/:uid/configuration",
      handler: "content-types.findContentTypeConfiguration",
      config: {
        policies: []
      }
    },
    {
      method: "PUT",
      path: "/content-types/:uid/configuration",
      handler: "content-types.updateContentTypeConfiguration",
      config: {
        policies: ["admin::isAuthenticatedAdmin"]
      }
    },
    {
      method: "GET",
      path: "/components",
      handler: "components.findComponents",
      config: {
        policies: []
      }
    },
    {
      method: "GET",
      path: "/components/:uid/configuration",
      handler: "components.findComponentConfiguration",
      config: {
        policies: []
      }
    },
    {
      method: "PUT",
      path: "/components/:uid/configuration",
      handler: "components.updateComponentConfiguration",
      config: {
        policies: []
      }
    },
    {
      method: "POST",
      path: "/uid/generate",
      handler: "uid.generateUID",
      config: {
        policies: []
      }
    },
    {
      method: "POST",
      path: "/uid/check-availability",
      handler: "uid.checkUIDAvailability",
      config: {
        policies: []
      }
    },
    {
      method: "GET",
      path: "/relations/:model/:targetField",
      handler: "relations.findAvailable",
      config: {
        policies: ["admin::isAuthenticatedAdmin"]
      }
    },
    {
      method: "GET",
      path: "/relations/:model/:id/:targetField",
      handler: "relations.findExisting",
      config: {
        policies: ["admin::isAuthenticatedAdmin"]
      }
    },
    {
      method: "GET",
      path: "/single-types/:model",
      handler: "single-types.find",
      config: {
        middlewares: [routing],
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "plugin::content-manager.hasPermissions",
            config: { actions: ["plugin::content-manager.explorer.read"] }
          }
        ]
      }
    },
    {
      method: "PUT",
      path: "/single-types/:model",
      handler: "single-types.createOrUpdate",
      config: {
        middlewares: [routing],
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "plugin::content-manager.hasPermissions",
            config: {
              actions: [
                "plugin::content-manager.explorer.create",
                "plugin::content-manager.explorer.update"
              ],
              hasAtLeastOne: true
            }
          }
        ]
      }
    },
    {
      method: "DELETE",
      path: "/single-types/:model",
      handler: "single-types.delete",
      config: {
        middlewares: [routing],
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "plugin::content-manager.hasPermissions",
            config: { actions: ["plugin::content-manager.explorer.delete"] }
          }
        ]
      }
    },
    {
      method: "POST",
      path: "/single-types/:model/actions/publish",
      handler: "single-types.publish",
      config: {
        middlewares: [routing],
        policies: [
          "plugin::content-manager.has-draft-and-publish",
          "admin::isAuthenticatedAdmin",
          {
            name: "plugin::content-manager.hasPermissions",
            config: { actions: ["plugin::content-manager.explorer.publish"] }
          }
        ]
      }
    },
    {
      method: "POST",
      path: "/single-types/:model/actions/unpublish",
      handler: "single-types.unpublish",
      config: {
        middlewares: [routing],
        policies: [
          "plugin::content-manager.has-draft-and-publish",
          "admin::isAuthenticatedAdmin",
          {
            name: "plugin::content-manager.hasPermissions",
            config: { actions: ["plugin::content-manager.explorer.publish"] }
          }
        ]
      }
    },
    {
      method: "GET",
      path: "/single-types/:model/actions/countDraftRelations",
      handler: "single-types.countDraftRelations",
      config: {
        middlewares: [routing],
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "plugin::content-manager.hasPermissions",
            config: { actions: ["plugin::content-manager.explorer.read"] }
          }
        ]
      }
    },
    {
      method: "GET",
      path: "/collection-types/:model",
      handler: "collection-types.find",
      config: {
        middlewares: [routing],
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "plugin::content-manager.hasPermissions",
            config: { actions: ["plugin::content-manager.explorer.read"] }
          }
        ]
      }
    },
    {
      method: "POST",
      path: "/collection-types/:model",
      handler: "collection-types.create",
      config: {
        middlewares: [routing],
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "plugin::content-manager.hasPermissions",
            config: { actions: ["plugin::content-manager.explorer.create"] }
          }
        ]
      }
    },
    {
      method: "POST",
      path: "/collection-types/:model/clone/:sourceId",
      handler: "collection-types.clone",
      config: {
        middlewares: [routing],
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "plugin::content-manager.hasPermissions",
            config: { actions: ["plugin::content-manager.explorer.create"] }
          }
        ]
      }
    },
    {
      method: "POST",
      path: "/collection-types/:model/auto-clone/:sourceId",
      handler: "collection-types.autoClone",
      config: {
        middlewares: [routing],
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "plugin::content-manager.hasPermissions",
            config: { actions: ["plugin::content-manager.explorer.create"] }
          }
        ]
      }
    },
    {
      method: "GET",
      path: "/collection-types/:model/:id",
      handler: "collection-types.findOne",
      config: {
        middlewares: [routing],
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "plugin::content-manager.hasPermissions",
            config: { actions: ["plugin::content-manager.explorer.read"] }
          }
        ]
      }
    },
    {
      method: "PUT",
      path: "/collection-types/:model/:id",
      handler: "collection-types.update",
      config: {
        middlewares: [routing],
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "plugin::content-manager.hasPermissions",
            config: { actions: ["plugin::content-manager.explorer.update"] }
          }
        ]
      }
    },
    {
      method: "DELETE",
      path: "/collection-types/:model/:id",
      handler: "collection-types.delete",
      config: {
        middlewares: [routing],
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "plugin::content-manager.hasPermissions",
            config: { actions: ["plugin::content-manager.explorer.delete"] }
          }
        ]
      }
    },
    {
      method: "POST",
      path: "/collection-types/:model/:id/actions/publish",
      handler: "collection-types.publish",
      config: {
        middlewares: [routing],
        policies: [
          "plugin::content-manager.has-draft-and-publish",
          "admin::isAuthenticatedAdmin",
          {
            name: "plugin::content-manager.hasPermissions",
            config: { actions: ["plugin::content-manager.explorer.publish"] }
          }
        ]
      }
    },
    {
      method: "POST",
      path: "/collection-types/:model/:id/actions/unpublish",
      handler: "collection-types.unpublish",
      config: {
        middlewares: [routing],
        policies: [
          "plugin::content-manager.has-draft-and-publish",
          "admin::isAuthenticatedAdmin",
          {
            name: "plugin::content-manager.hasPermissions",
            config: { actions: ["plugin::content-manager.explorer.publish"] }
          }
        ]
      }
    },
    {
      method: "POST",
      path: "/collection-types/:model/actions/bulkDelete",
      handler: "collection-types.bulkDelete",
      config: {
        middlewares: [routing],
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "plugin::content-manager.hasPermissions",
            config: { actions: ["plugin::content-manager.explorer.delete"] }
          }
        ]
      }
    },
    {
      method: "POST",
      path: "/collection-types/:model/actions/bulkPublish",
      handler: "collection-types.bulkPublish",
      config: {
        middlewares: [routing],
        policies: [
          "plugin::content-manager.has-draft-and-publish",
          "admin::isAuthenticatedAdmin",
          {
            name: "plugin::content-manager.hasPermissions",
            config: { actions: ["plugin::content-manager.explorer.publish"] }
          }
        ]
      }
    },
    {
      method: "POST",
      path: "/collection-types/:model/actions/bulkUnpublish",
      handler: "collection-types.bulkUnpublish",
      config: {
        middlewares: [routing],
        policies: [
          "plugin::content-manager.has-draft-and-publish",
          "admin::isAuthenticatedAdmin",
          {
            name: "plugin::content-manager.hasPermissions",
            config: { actions: ["plugin::content-manager.explorer.publish"] }
          }
        ]
      }
    },
    {
      method: "GET",
      path: "/collection-types/:model/:id/actions/countDraftRelations",
      handler: "collection-types.countDraftRelations",
      config: {
        middlewares: [routing],
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "plugin::content-manager.hasPermissions",
            config: { actions: ["plugin::content-manager.explorer.read"] }
          }
        ]
      }
    },
    {
      method: "GET",
      path: "/collection-types/:model/actions/countManyEntriesDraftRelations",
      handler: "collection-types.countManyEntriesDraftRelations",
      config: {
        middlewares: [routing],
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "plugin::content-manager.hasPermissions",
            config: { actions: ["plugin::content-manager.explorer.read"] }
          }
        ]
      }
    }
  ]
};
const routes = { admin };
const { hasDraftAndPublish: hasDraftAndPublish$4 } = contentTypes$1;
const hasDraftAndPublish$5 = (ctx, config, { strapi: strapi2 }) => {
  const { model: modelUID } = ctx.params;
  const model = strapi2.contentTypes[modelUID];
  return hasDraftAndPublish$4(model);
};
const hasPermissionsSchema = yup.object({
  actions: yup.array().of(yup.string()),
  hasAtLeastOne: yup.boolean()
});
const validateHasPermissionsInput = validateYupSchemaSync(hasPermissionsSchema);
const { createPolicy } = policy;
const hasPermissions = createPolicy({
  name: "plugin::content-manager.hasPermissions",
  validator: validateHasPermissionsInput,
  /**
   * NOTE: Action aliases are currently not checked at this level (policy).
   *       This is currently the intended behavior to avoid changing the behavior of API related permissions.
   *       If you want to add support for it, please create a dedicated RFC with a list of potential side effect this could have.
   */
  handler(ctx, config = {}) {
    const { actions = [], hasAtLeastOne = false } = config;
    const { userAbility } = ctx.state;
    const { model } = ctx.params;
    const isAuthorized = hasAtLeastOne ? actions.some((action) => userAbility.can(action, model)) : actions.every((action) => userAbility.can(action, model));
    return isAuthorized;
  }
});
const policies = {
  "has-draft-and-publish": hasDraftAndPublish$5,
  hasPermissions
};
const { getNonVisibleAttributes, getWritableAttributes } = contentTypes$1;
const { PUBLISHED_AT_ATTRIBUTE: PUBLISHED_AT_ATTRIBUTE$3, CREATED_BY_ATTRIBUTE, UPDATED_BY_ATTRIBUTE } = contentTypes$1.constants;
const NON_SORTABLES = ["component", "json", "media", "richtext", "dynamiczone", "blocks"];
const SORTABLE_RELATIONS = ["oneToOne", "manyToOne"];
const NON_LISTABLES = ["json", "password", "richtext", "dynamiczone", "blocks"];
const LISTABLE_RELATIONS = ["oneToOne", "oneToMany", "manyToOne", "manyToMany"];
const isHidden = (schema, name) => {
  if (!_.has(schema.attributes, name)) {
    return false;
  }
  const isHidden2 = _.get(schema, ["config", "attributes", name, "hidden"], false);
  if (isHidden2 === true) {
    return true;
  }
  return false;
};
const isListable = (schema, name) => {
  if (!_.has(schema.attributes, name)) {
    return false;
  }
  if (isHidden(schema, name)) {
    return false;
  }
  const attribute = schema.attributes[name];
  if (NON_LISTABLES.includes(attribute.type)) {
    return false;
  }
  if (isRelation$1(attribute) && !LISTABLE_RELATIONS.includes(attribute.relationType)) {
    return false;
  }
  return true;
};
const isSortable = (schema, name) => {
  if (!_.has(schema.attributes, name)) {
    return false;
  }
  if (schema.modelType === "component" && name === "id")
    return false;
  const attribute = schema.attributes[name];
  if (NON_SORTABLES.includes(attribute.type)) {
    return false;
  }
  if (isRelation$1(attribute) && !SORTABLE_RELATIONS.includes(attribute.relationType)) {
    return false;
  }
  return true;
};
const isSearchable = (schema, name) => {
  return isSortable(schema, name);
};
const isVisible$1 = (schema, name) => {
  if (!_.has(schema.attributes, name)) {
    return false;
  }
  if (isHidden(schema, name)) {
    return false;
  }
  if (isTimestamp(schema, name) || name === "id") {
    return false;
  }
  if (isPublicationField(name)) {
    return false;
  }
  if (isCreatorField(schema, name)) {
    return false;
  }
  return true;
};
const isPublicationField = (name) => PUBLISHED_AT_ATTRIBUTE$3 === name;
const isTimestamp = (schema, name) => {
  if (!_.has(schema.attributes, name)) {
    return false;
  }
  const timestamps = contentTypes$1.getTimestamps(schema);
  if (!timestamps || !Array.isArray(timestamps)) {
    return false;
  }
  if (timestamps.includes(name)) {
    return true;
  }
};
const isCreatorField = (schema, name) => {
  if (!_.has(schema.attributes, name)) {
    return false;
  }
  const creatorFields = contentTypes$1.getCreatorFields(schema);
  if (!creatorFields || !Array.isArray(creatorFields)) {
    return false;
  }
  if (creatorFields.includes(name)) {
    return true;
  }
};
const isRelation$1 = (attribute) => attribute.type === "relation";
const hasRelationAttribute = (schema, name) => {
  if (!_.has(schema.attributes, name)) {
    return false;
  }
  if (isHidden(schema, name)) {
    return false;
  }
  if (!isVisible$1(schema, name)) {
    return false;
  }
  return isRelation$1(schema.attributes[name]);
};
const hasEditableAttribute = (schema, name) => {
  if (!_.has(schema.attributes, name)) {
    return false;
  }
  if (isHidden(schema, name)) {
    return false;
  }
  if (!isVisible$1(schema, name)) {
    return false;
  }
  return true;
};
const findFirstStringAttribute = (schema) => {
  return Object.keys(schema.attributes || {}).find((key) => {
    const { type } = schema.attributes[key];
    return type === "string" && key !== "id";
  });
};
const getDefaultMainField = (schema) => findFirstStringAttribute(schema) || "id";
const getSortableAttributes = (schema) => {
  const validAttributes = Object.keys(schema.attributes).filter((key) => isListable(schema, key));
  const model = strapi.getModel(schema.uid);
  const nonVisibleWritableAttributes = intersection(
    getNonVisibleAttributes(model),
    getWritableAttributes(model)
  );
  return [
    "id",
    ...validAttributes,
    ...nonVisibleWritableAttributes,
    CREATED_BY_ATTRIBUTE,
    UPDATED_BY_ATTRIBUTE
  ];
};
const DEFAULT_SETTINGS = {
  bulkable: true,
  filterable: true,
  searchable: true,
  pageSize: 10
};
const settingsFields = [
  "searchable",
  "filterable",
  "bulkable",
  "pageSize",
  "mainField",
  "defaultSortBy",
  "defaultSortOrder"
];
const getModelSettings = pipe([propOr({}, "config.settings"), pick(settingsFields)]);
async function isValidDefaultSort(schema, value) {
  const parsedValue = qs.parse(value);
  const omitNonSortableAttributes = ({ schema: schema2, key }, { remove }) => {
    const sortableAttributes = getSortableAttributes(schema2);
    if (!sortableAttributes.includes(key)) {
      remove(key);
    }
  };
  const sanitizedValue = await traverse.traverseQuerySort(
    omitNonSortableAttributes,
    { schema },
    parsedValue
  );
  return isEqual(parsedValue, sanitizedValue);
}
const createDefaultSettings = async (schema) => {
  const defaultField = getDefaultMainField(schema);
  return {
    ...DEFAULT_SETTINGS,
    mainField: defaultField,
    defaultSortBy: defaultField,
    defaultSortOrder: "ASC",
    ...getModelSettings(schema)
  };
};
const syncSettings = async (configuration, schema) => {
  if (isEmpty(configuration.settings))
    return createDefaultSettings(schema);
  const defaultField = getDefaultMainField(schema);
  const { mainField = defaultField, defaultSortBy = defaultField } = configuration.settings || {};
  return {
    ...configuration.settings,
    mainField: isSortable(schema, mainField) ? mainField : defaultField,
    defaultSortBy: await isValidDefaultSort(schema, defaultSortBy) ? defaultSortBy : defaultField
  };
};
const createModelConfigurationSchema = (schema, opts = {}) => yup.object().shape({
  settings: createSettingsSchema(schema).default(null).nullable(),
  metadatas: createMetadasSchema(schema).default(null).nullable(),
  layouts: createLayoutsSchema(schema, opts).default(null).nullable(),
  options: yup.object().optional()
}).noUnknown();
const createSettingsSchema = (schema) => {
  const validAttributes = Object.keys(schema.attributes).filter((key) => isListable(schema, key));
  return yup.object().shape({
    bulkable: yup.boolean().required(),
    filterable: yup.boolean().required(),
    pageSize: yup.number().integer().min(10).max(100).required(),
    searchable: yup.boolean().required(),
    // should be reset when the type changes
    mainField: yup.string().oneOf(validAttributes.concat("id")).default("id"),
    // should be reset when the type changes
    defaultSortBy: yup.string().test(
      "is-valid-sort-attribute",
      "${path} is not a valid sort attribute",
      async (value) => isValidDefaultSort(schema, value)
    ).default("id"),
    defaultSortOrder: yup.string().oneOf(["ASC", "DESC"]).default("ASC")
  }).noUnknown();
};
const createMetadasSchema = (schema) => {
  return yup.object().shape(
    Object.keys(schema.attributes).reduce((acc, key) => {
      acc[key] = yup.object().shape({
        edit: yup.object().shape({
          label: yup.string(),
          description: yup.string(),
          placeholder: yup.string(),
          editable: yup.boolean(),
          visible: yup.boolean(),
          mainField: yup.lazy((value) => {
            if (!value) {
              return yup.string();
            }
            const targetSchema = getService("content-types").findContentType(
              schema.attributes[key].targetModel
            );
            if (!targetSchema) {
              return yup.string();
            }
            const validAttributes = Object.keys(targetSchema.attributes).filter(
              (key2) => isListable(targetSchema, key2)
            );
            return yup.string().oneOf(validAttributes.concat("id")).default("id");
          })
        }).noUnknown().required(),
        list: yup.object().shape({
          label: yup.string(),
          searchable: yup.boolean(),
          sortable: yup.boolean()
        }).noUnknown().required()
      }).noUnknown();
      return acc;
    }, {})
  );
};
const createArrayTest = ({ allowUndefined = false } = {}) => ({
  name: "isArray",
  message: "${path} is required and must be an array",
  test: (val) => allowUndefined === true && val === void 0 ? true : Array.isArray(val)
});
const createLayoutsSchema = (schema, opts = {}) => {
  const validAttributes = Object.keys(schema.attributes).filter((key) => isListable(schema, key));
  const editAttributes = Object.keys(schema.attributes).filter(
    (key) => hasEditableAttribute(schema, key)
  );
  return yup.object().shape({
    edit: yup.array().of(
      yup.array().of(
        yup.object().shape({
          name: yup.string().oneOf(editAttributes).required(),
          size: yup.number().integer().positive().required()
        }).noUnknown()
      )
    ).test(createArrayTest(opts)),
    list: yup.array().of(yup.string().oneOf(validAttributes)).test(createArrayTest(opts))
  });
};
const { PaginationError, ValidationError } = errors;
const TYPES = ["singleType", "collectionType"];
const kindSchema = yup.string().oneOf(TYPES).nullable();
const bulkActionInputSchema = yup.object({
  ids: yup.array().of(yup.strapiID()).min(1).required()
}).required();
const generateUIDInputSchema = yup.object({
  contentTypeUID: yup.string().required(),
  field: yup.string().required(),
  data: yup.object().required()
});
const checkUIDAvailabilityInputSchema = yup.object({
  contentTypeUID: yup.string().required(),
  field: yup.string().required(),
  value: yup.string().matches(/^[A-Za-z0-9-_.~]*$/).required()
});
const validateUIDField = (contentTypeUID, field) => {
  const model = strapi.contentTypes[contentTypeUID];
  if (!model) {
    throw new ValidationError("ContentType not found");
  }
  if (!_.has(model, ["attributes", field]) || _.get(model, ["attributes", field, "type"]) !== "uid") {
    throw new ValidationError(`${field} must be a valid \`uid\` attribute`);
  }
};
const validateKind = validateYupSchema(kindSchema);
const validateBulkActionInput = validateYupSchema(bulkActionInputSchema);
const validateGenerateUIDInput = validateYupSchema(generateUIDInputSchema);
const validateCheckUIDAvailabilityInput = validateYupSchema(checkUIDAvailabilityInputSchema);
const { isVisibleAttribute: isVisibleAttribute$3 } = strapiUtils.contentTypes;
function checkRelation(model, attributeName, path) {
  if (!isVisibleAttribute$3(model, attributeName)) {
    return [];
  }
  const { relation, inversedBy, mappedBy } = model.attributes[attributeName];
  if (["oneToOne", "oneToMany"].includes(relation) && [mappedBy, inversedBy].some((key) => key != null)) {
    return [[[...path, attributeName], "relation"]];
  }
  return [];
}
const getProhibitedCloningFields = (uid2, pathPrefix = []) => {
  const model = strapi.getModel(uid2);
  const prohibitedFields = Object.keys(model.attributes).reduce(
    (acc, attributeName) => {
      const attribute = model.attributes[attributeName];
      const attributePath = [...pathPrefix, attributeName];
      switch (attribute.type) {
        case "relation":
          return [...acc, ...checkRelation(model, attributeName, pathPrefix)];
        case "component":
          return [...acc, ...getProhibitedCloningFields(attribute.component, attributePath)];
        case "dynamiczone":
          return [
            ...acc,
            ...(attribute.components || []).flatMap(
              (componentUID) => getProhibitedCloningFields(componentUID, [
                ...attributePath,
                strapi.getModel(componentUID).info.displayName
              ])
            )
          ];
        case "uid":
          return [...acc, [attributePath, "unique"]];
        default:
          if (attribute?.unique) {
            return [...acc, [attributePath, "unique"]];
          }
          return acc;
      }
    },
    []
  );
  return prohibitedFields;
};
const excludeNotCreatableFields = (uid2, permissionChecker2) => (body, path = []) => {
  const model = strapi.getModel(uid2);
  const canCreate = (path2) => permissionChecker2.can.create(null, path2);
  return Object.keys(model.attributes).reduce((body2, attributeName) => {
    const attribute = model.attributes[attributeName];
    const attributePath = [...path, attributeName].join(".");
    if (!isVisibleAttribute$3(model, attributeName)) {
      return body2;
    }
    switch (attribute.type) {
      case "relation": {
        if (canCreate(attributePath))
          return body2;
        return set(attributePath, { set: [] }, body2);
      }
      case "component": {
        return excludeNotCreatableFields(attribute.component, permissionChecker2)(body2, [
          ...path,
          attributeName
        ]);
      }
      default: {
        if (canCreate(attributePath))
          return body2;
        return set(attributePath, null, body2);
      }
    }
  }, body);
};
const collectionTypes = {
  async find(ctx) {
    const { userAbility } = ctx.state;
    const { model } = ctx.params;
    const { query } = ctx.request;
    const entityManager2 = getService("entity-manager");
    const permissionChecker2 = getService("permission-checker").create({ userAbility, model });
    if (permissionChecker2.cannot.read()) {
      return ctx.forbidden();
    }
    const permissionQuery = await permissionChecker2.sanitizedQuery.read(query);
    const populate = await getService("populate-builder")(model).populateFromQuery(permissionQuery).populateDeep(1).countRelations({ toOne: false, toMany: true }).build();
    const { results, pagination } = await entityManager2.findPage(
      { ...permissionQuery, populate },
      model
    );
    const sanitizedResults = await Promise.all(
      results.map((result) => permissionChecker2.sanitizeOutput(result))
    );
    ctx.body = {
      results: sanitizedResults,
      pagination
    };
  },
  async findOne(ctx) {
    const { userAbility } = ctx.state;
    const { model, id } = ctx.params;
    const entityManager2 = getService("entity-manager");
    const permissionChecker2 = getService("permission-checker").create({ userAbility, model });
    if (permissionChecker2.cannot.read()) {
      return ctx.forbidden();
    }
    const permissionQuery = await permissionChecker2.sanitizedQuery.read(ctx.query);
    const populate = await getService("populate-builder")(model).populateFromQuery(permissionQuery).populateDeep(Infinity).countRelations().build();
    const entity = await entityManager2.findOne(id, model, { populate });
    if (!entity) {
      return ctx.notFound();
    }
    if (permissionChecker2.cannot.read(entity)) {
      return ctx.forbidden();
    }
    ctx.body = await permissionChecker2.sanitizeOutput(entity);
  },
  async create(ctx) {
    const { userAbility, user } = ctx.state;
    const { model } = ctx.params;
    const { body } = ctx.request;
    const totalEntries = await strapi.query(model).count();
    const entityManager2 = getService("entity-manager");
    const permissionChecker2 = getService("permission-checker").create({ userAbility, model });
    if (permissionChecker2.cannot.create()) {
      return ctx.forbidden();
    }
    const pickPermittedFields = permissionChecker2.sanitizeCreateInput;
    const setCreator = setCreatorFields({ user });
    const sanitizeFn = pipeAsync(pickPermittedFields, setCreator);
    const sanitizedBody = await sanitizeFn(body);
    const entity = await entityManager2.create(sanitizedBody, model);
    ctx.body = await permissionChecker2.sanitizeOutput(entity);
    if (totalEntries === 0) {
      strapi.telemetry.send("didCreateFirstContentTypeEntry", {
        eventProperties: { model }
      });
    }
  },
  async update(ctx) {
    const { userAbility, user } = ctx.state;
    const { id, model } = ctx.params;
    const { body } = ctx.request;
    const entityManager2 = getService("entity-manager");
    const permissionChecker2 = getService("permission-checker").create({ userAbility, model });
    if (permissionChecker2.cannot.update()) {
      return ctx.forbidden();
    }
    const permissionQuery = await permissionChecker2.sanitizedQuery.update(ctx.query);
    const populate = await getService("populate-builder")(model).populateFromQuery(permissionQuery).build();
    const entity = await entityManager2.findOne(id, model, { populate });
    if (!entity) {
      return ctx.notFound();
    }
    if (permissionChecker2.cannot.update(entity)) {
      return ctx.forbidden();
    }
    const pickPermittedFields = permissionChecker2.sanitizeUpdateInput(entity);
    const setCreator = setCreatorFields({ user, isEdition: true });
    const sanitizeFn = pipeAsync(pickPermittedFields, setCreator);
    const sanitizedBody = await sanitizeFn(body);
    const updatedEntity = await entityManager2.update(entity, sanitizedBody, model);
    ctx.body = await permissionChecker2.sanitizeOutput(updatedEntity);
  },
  async clone(ctx) {
    const { userAbility, user } = ctx.state;
    const { model, sourceId: id } = ctx.params;
    const { body } = ctx.request;
    const entityManager2 = getService("entity-manager");
    const permissionChecker2 = getService("permission-checker").create({ userAbility, model });
    if (permissionChecker2.cannot.create()) {
      return ctx.forbidden();
    }
    const permissionQuery = await permissionChecker2.sanitizedQuery.create(ctx.query);
    const populate = await getService("populate-builder")(model).populateFromQuery(permissionQuery).build();
    const entity = await entityManager2.findOne(id, model, { populate });
    if (!entity) {
      return ctx.notFound();
    }
    const pickPermittedFields = permissionChecker2.sanitizeCreateInput;
    const setCreator = setCreatorFields({ user });
    const excludeNotCreatable = excludeNotCreatableFields(model, permissionChecker2);
    const sanitizeFn = pipeAsync(pickPermittedFields, setCreator, excludeNotCreatable);
    const sanitizedBody = await sanitizeFn(body);
    const clonedEntity = await entityManager2.clone(entity, sanitizedBody, model);
    ctx.body = await permissionChecker2.sanitizeOutput(clonedEntity);
  },
  async autoClone(ctx) {
    const { model } = ctx.params;
    const prohibitedFields = getProhibitedCloningFields(model);
    if (prohibitedFields.length > 0) {
      return ctx.badRequest(
        "Entity could not be cloned as it has unique and/or relational fields. Please edit those fields manually and save to complete the cloning.",
        {
          prohibitedFields
        }
      );
    }
    await this.clone(ctx);
  },
  async delete(ctx) {
    const { userAbility } = ctx.state;
    const { id, model } = ctx.params;
    const entityManager2 = getService("entity-manager");
    const permissionChecker2 = getService("permission-checker").create({ userAbility, model });
    if (permissionChecker2.cannot.delete()) {
      return ctx.forbidden();
    }
    const permissionQuery = await permissionChecker2.sanitizedQuery.delete(ctx.query);
    const populate = await getService("populate-builder")(model).populateFromQuery(permissionQuery).build();
    const entity = await entityManager2.findOne(id, model, { populate });
    if (!entity) {
      return ctx.notFound();
    }
    if (permissionChecker2.cannot.delete(entity)) {
      return ctx.forbidden();
    }
    const result = await entityManager2.delete(entity, model);
    ctx.body = await permissionChecker2.sanitizeOutput(result);
  },
  async publish(ctx) {
    const { userAbility, user } = ctx.state;
    const { id, model } = ctx.params;
    const entityManager2 = getService("entity-manager");
    const permissionChecker2 = getService("permission-checker").create({ userAbility, model });
    if (permissionChecker2.cannot.publish()) {
      return ctx.forbidden();
    }
    const permissionQuery = await permissionChecker2.sanitizedQuery.publish(ctx.query);
    const populate = await getService("populate-builder")(model).populateFromQuery(permissionQuery).populateDeep(Infinity).countRelations().build();
    const entity = await entityManager2.findOne(id, model, { populate });
    if (!entity) {
      return ctx.notFound();
    }
    if (permissionChecker2.cannot.publish(entity)) {
      return ctx.forbidden();
    }
    const result = await entityManager2.publish(
      entity,
      model,
      setCreatorFields({ user, isEdition: true })({})
    );
    ctx.body = await permissionChecker2.sanitizeOutput(result);
  },
  async bulkPublish(ctx) {
    const { userAbility } = ctx.state;
    const { model } = ctx.params;
    const { body } = ctx.request;
    const { ids } = body;
    await validateBulkActionInput(body);
    const entityManager2 = getService("entity-manager");
    const permissionChecker2 = getService("permission-checker").create({ userAbility, model });
    if (permissionChecker2.cannot.publish()) {
      return ctx.forbidden();
    }
    const permissionQuery = await permissionChecker2.sanitizedQuery.publish(ctx.query);
    const populate = await getService("populate-builder")(model).populateFromQuery(permissionQuery).populateDeep(Infinity).countRelations().build();
    const entityPromises = ids.map((id) => entityManager2.findOne(id, model, { populate }));
    const entities = await Promise.all(entityPromises);
    for (const entity of entities) {
      if (!entity) {
        return ctx.notFound();
      }
      if (permissionChecker2.cannot.publish(entity)) {
        return ctx.forbidden();
      }
    }
    const { count } = await entityManager2.publishMany(entities, model);
    ctx.body = { count };
  },
  async bulkUnpublish(ctx) {
    const { userAbility } = ctx.state;
    const { model } = ctx.params;
    const { body } = ctx.request;
    const { ids } = body;
    await validateBulkActionInput(body);
    const entityManager2 = getService("entity-manager");
    const permissionChecker2 = getService("permission-checker").create({ userAbility, model });
    if (permissionChecker2.cannot.unpublish()) {
      return ctx.forbidden();
    }
    const permissionQuery = await permissionChecker2.sanitizedQuery.publish(ctx.query);
    const populate = await getService("populate-builder")(model).populateFromQuery(permissionQuery).build();
    const entityPromises = ids.map((id) => entityManager2.findOne(id, model, { populate }));
    const entities = await Promise.all(entityPromises);
    for (const entity of entities) {
      if (!entity) {
        return ctx.notFound();
      }
      if (permissionChecker2.cannot.publish(entity)) {
        return ctx.forbidden();
      }
    }
    const { count } = await entityManager2.unpublishMany(entities, model);
    ctx.body = { count };
  },
  async unpublish(ctx) {
    const { userAbility, user } = ctx.state;
    const { id, model } = ctx.params;
    const entityManager2 = getService("entity-manager");
    const permissionChecker2 = getService("permission-checker").create({ userAbility, model });
    if (permissionChecker2.cannot.unpublish()) {
      return ctx.forbidden();
    }
    const permissionQuery = await permissionChecker2.sanitizedQuery.unpublish(ctx.query);
    const populate = await getService("populate-builder")(model).populateFromQuery(permissionQuery).build();
    const entity = await entityManager2.findOne(id, model, { populate });
    if (!entity) {
      return ctx.notFound();
    }
    if (permissionChecker2.cannot.unpublish(entity)) {
      return ctx.forbidden();
    }
    const result = await entityManager2.unpublish(
      entity,
      model,
      setCreatorFields({ user, isEdition: true })({})
    );
    ctx.body = await permissionChecker2.sanitizeOutput(result);
  },
  async bulkDelete(ctx) {
    const { userAbility } = ctx.state;
    const { model } = ctx.params;
    const { query, body } = ctx.request;
    const { ids } = body;
    await validateBulkActionInput(body);
    const entityManager2 = getService("entity-manager");
    const permissionChecker2 = getService("permission-checker").create({ userAbility, model });
    if (permissionChecker2.cannot.delete()) {
      return ctx.forbidden();
    }
    const permissionQuery = await permissionChecker2.sanitizedQuery.delete(query);
    const idsWhereClause = { id: { $in: ids } };
    const params = {
      ...permissionQuery,
      filters: {
        $and: [idsWhereClause].concat(permissionQuery.filters || [])
      }
    };
    const { count } = await entityManager2.deleteMany(params, model);
    ctx.body = { count };
  },
  async countDraftRelations(ctx) {
    const { userAbility } = ctx.state;
    const { model, id } = ctx.params;
    const entityManager2 = getService("entity-manager");
    const permissionChecker2 = getService("permission-checker").create({ userAbility, model });
    if (permissionChecker2.cannot.read()) {
      return ctx.forbidden();
    }
    const permissionQuery = await permissionChecker2.sanitizedQuery.read(ctx.query);
    const populate = await getService("populate-builder")(model).populateFromQuery(permissionQuery).build();
    const entity = await entityManager2.findOne(id, model, { populate });
    if (!entity) {
      return ctx.notFound();
    }
    if (permissionChecker2.cannot.read(entity)) {
      return ctx.forbidden();
    }
    const number = await entityManager2.countDraftRelations(id, model);
    return {
      data: number
    };
  },
  async countManyEntriesDraftRelations(ctx) {
    const { userAbility } = ctx.state;
    const ids = ctx.request.query.ids;
    const locale = ctx.request.query.locale;
    const { model } = ctx.params;
    const entityManager2 = getService("entity-manager");
    const permissionChecker2 = getService("permission-checker").create({ userAbility, model });
    if (permissionChecker2.cannot.read()) {
      return ctx.forbidden();
    }
    const entities = await entityManager2.find({ ids, locale }, model);
    if (!entities) {
      return ctx.notFound();
    }
    const number = await entityManager2.countManyEntriesDraftRelations(ids, model, locale);
    return {
      data: number
    };
  }
};
const components$1 = {
  findComponents(ctx) {
    const components2 = getService("components").findAllComponents();
    const { toDto } = getService("data-mapper");
    ctx.body = { data: components2.map(toDto) };
  },
  async findComponentConfiguration(ctx) {
    const { uid: uid2 } = ctx.params;
    const componentService = getService("components");
    const component = componentService.findComponent(uid2);
    if (!component) {
      return ctx.notFound("component.notFound");
    }
    const configuration = await componentService.findConfiguration(component);
    const componentsConfigurations = await componentService.findComponentsConfigurations(component);
    ctx.body = {
      data: {
        component: configuration,
        components: componentsConfigurations
      }
    };
  },
  async updateComponentConfiguration(ctx) {
    const { uid: uid2 } = ctx.params;
    const { body } = ctx.request;
    const componentService = getService("components");
    const component = componentService.findComponent(uid2);
    if (!component) {
      return ctx.notFound("component.notFound");
    }
    let input;
    try {
      input = await createModelConfigurationSchema(component).validate(body, {
        abortEarly: false,
        stripUnknown: true,
        strict: true
      });
    } catch (error) {
      return ctx.badRequest(null, {
        name: "validationError",
        errors: error.errors
      });
    }
    const newConfiguration = await componentService.updateConfiguration(component, input);
    ctx.body = { data: newConfiguration };
  }
};
const hasEditMainField = has("edit.mainField");
const getEditMainField = prop("edit.mainField");
const assocListMainField = assoc("list.mainField");
const assocMainField = (metadata) => hasEditMainField(metadata) ? assocListMainField(getEditMainField(metadata), metadata) : metadata;
const contentTypes = {
  async findContentTypes(ctx) {
    const { kind } = ctx.query;
    try {
      await validateKind(kind);
    } catch (error) {
      return ctx.send({ error }, 400);
    }
    const contentTypes2 = getService("content-types").findContentTypesByKind(kind);
    const { toDto } = getService("data-mapper");
    ctx.body = { data: contentTypes2.map(toDto) };
  },
  async findContentTypesSettings(ctx) {
    const { findAllContentTypes, findConfiguration } = getService("content-types");
    const contentTypes2 = await findAllContentTypes();
    const configurations = await Promise.all(
      contentTypes2.map(async (contentType) => {
        const { uid: uid2, settings } = await findConfiguration(contentType);
        return { uid: uid2, settings };
      })
    );
    ctx.body = {
      data: configurations
    };
  },
  async findContentTypeConfiguration(ctx) {
    const { uid: uid2 } = ctx.params;
    const contentTypeService = getService("content-types");
    const contentType = await contentTypeService.findContentType(uid2);
    if (!contentType) {
      return ctx.notFound("contentType.notFound");
    }
    const configuration = await contentTypeService.findConfiguration(contentType);
    const confWithUpdatedMetadata = {
      ...configuration,
      metadatas: mapValues(assocMainField, configuration.metadatas)
    };
    const components2 = await contentTypeService.findComponentsConfigurations(contentType);
    ctx.body = {
      data: {
        contentType: confWithUpdatedMetadata,
        components: components2
      }
    };
  },
  async updateContentTypeConfiguration(ctx) {
    const { userAbility } = ctx.state;
    const { uid: uid2 } = ctx.params;
    const { body } = ctx.request;
    const contentTypeService = getService("content-types");
    const metricsService = getService("metrics");
    const contentType = await contentTypeService.findContentType(uid2);
    if (!contentType) {
      return ctx.notFound("contentType.notFound");
    }
    if (!getService("permission").canConfigureContentType({ userAbility, contentType })) {
      return ctx.forbidden();
    }
    let input;
    try {
      input = await createModelConfigurationSchema(contentType).validate(body, {
        abortEarly: false,
        stripUnknown: true,
        strict: true
      });
    } catch (error) {
      return ctx.badRequest(null, {
        name: "validationError",
        errors: error.errors
      });
    }
    const newConfiguration = await contentTypeService.updateConfiguration(contentType, input);
    await metricsService.sendDidConfigureListView(contentType, newConfiguration);
    const confWithUpdatedMetadata = {
      ...newConfiguration,
      metadatas: mapValues(assocMainField, newConfiguration.metadatas)
    };
    const components2 = await contentTypeService.findComponentsConfigurations(contentType);
    ctx.body = {
      data: {
        contentType: confWithUpdatedMetadata,
        components: components2
      }
    };
  }
};
const init = {
  getInitData(ctx) {
    const { toDto } = getService("data-mapper");
    const { findAllComponents } = getService("components");
    const { getAllFieldSizes } = getService("field-sizes");
    const { findAllContentTypes } = getService("content-types");
    ctx.body = {
      data: {
        fieldSizes: getAllFieldSizes(),
        components: findAllComponents().map(toDto),
        contentTypes: findAllContentTypes().map(toDto)
      }
    };
  }
};
const validateFindAvailableSchema = yup.object().shape({
  component: yup.string(),
  entityId: yup.strapiID(),
  _q: yup.string(),
  idsToOmit: yup.array().of(yup.strapiID()),
  idsToInclude: yup.array().of(yup.strapiID()),
  page: yup.number().integer().min(1),
  pageSize: yup.number().integer().min(1).max(100)
}).required();
const validateFindExistingSchema = yup.object().shape({
  page: yup.number().integer().min(1),
  pageSize: yup.number().integer().min(1).max(100)
}).required();
const validateFindAvailable = validateYupSchema(validateFindAvailableSchema, { strict: false });
const validateFindExisting = validateYupSchema(validateFindExistingSchema, { strict: false });
const { hasDraftAndPublish: hasDraftAndPublish$3 } = contentTypes$1;
const { PUBLISHED_AT_ATTRIBUTE: PUBLISHED_AT_ATTRIBUTE$2 } = contentTypes$1.constants;
const { isAnyToMany: isAnyToMany$1 } = relations$1;
const addFiltersClause = (params, filtersClause) => {
  params.filters = params.filters || {};
  if (params.filters.$and) {
    params.filters.$and.push(filtersClause);
  } else {
    params.filters.$and = [filtersClause];
  }
};
const sanitizeMainField = (model, mainField, userAbility) => {
  const permissionChecker2 = getService("permission-checker").create({
    userAbility,
    model: model.uid
  });
  const isMainFieldListable = isListable(model, mainField);
  const canReadMainField = permissionChecker2.can.read(null, mainField);
  if (!isMainFieldListable || !canReadMainField) {
    return "id";
  }
  if (model.uid === "plugin::users-permissions.role") {
    return "name";
  }
  return mainField;
};
const relations = {
  async findAvailable(ctx) {
    const { userAbility } = ctx.state;
    const { model, targetField } = ctx.params;
    await validateFindAvailable(ctx.request.query);
    const { entityId, idsToOmit, idsToInclude, _q, ...query } = ctx.request.query;
    const modelSchema = strapi.getModel(model);
    if (!modelSchema) {
      return ctx.badRequest("The model doesn't exist");
    }
    const attribute = modelSchema.attributes[targetField];
    if (!attribute || attribute.type !== "relation") {
      return ctx.badRequest("This relational field doesn't exist");
    }
    const isComponent2 = modelSchema.modelType === "component";
    if (!isComponent2) {
      const permissionChecker22 = getService("permission-checker").create({
        userAbility,
        model
      });
      if (permissionChecker22.cannot.read(null, targetField)) {
        return ctx.forbidden();
      }
      if (entityId) {
        const entityManager2 = getService("entity-manager");
        const permissionQuery2 = await permissionChecker22.sanitizedQuery.read(ctx.query);
        const populate = await getService("populate-builder")(model).populateFromQuery(permissionQuery2).build();
        const entity = await entityManager2.findOne(entityId, model, { populate });
        if (!entity) {
          return ctx.notFound();
        }
        if (permissionChecker22.cannot.read(entity, targetField)) {
          return ctx.forbidden();
        }
      }
    } else {
      if (entityId) {
        const entity = await strapi.entityService.findOne(model, entityId);
        if (!entity) {
          return ctx.notFound();
        }
      }
    }
    const targetedModel = strapi.getModel(attribute.target);
    const modelConfig = isComponent2 ? await getService("components").findConfiguration(modelSchema) : await getService("content-types").findConfiguration(modelSchema);
    const mainField = flow(
      prop(`metadatas.${targetField}.edit.mainField`),
      (mainField2) => mainField2 || "id",
      (mainField2) => sanitizeMainField(targetedModel, mainField2, userAbility)
    )(modelConfig);
    const fieldsToSelect = uniq(["id", mainField]);
    if (hasDraftAndPublish$3(targetedModel)) {
      fieldsToSelect.push(PUBLISHED_AT_ATTRIBUTE$2);
    }
    const permissionChecker2 = getService("permission-checker").create({
      userAbility,
      model: targetedModel.uid
    });
    const permissionQuery = await permissionChecker2.sanitizedQuery.read(query);
    const queryParams = {
      sort: mainField,
      fields: fieldsToSelect,
      // cannot select other fields as the user may not have the permissions
      ...permissionQuery
    };
    if (!isEmpty(idsToOmit)) {
      addFiltersClause(queryParams, { id: { $notIn: idsToOmit } });
    }
    if (_q) {
      const _filter = isOperatorOfType("where", query._filter) ? query._filter : "$containsi";
      addFiltersClause(queryParams, { [mainField]: { [_filter]: _q } });
    }
    if (entityId) {
      const subQuery = strapi.db.queryBuilder(modelSchema.uid);
      const alias = subQuery.getAlias();
      const where = {
        id: entityId,
        [`${alias}.id`]: { $notNull: true }
      };
      if (!isEmpty(idsToInclude)) {
        where[`${alias}.id`].$notIn = idsToInclude;
      }
      const knexSubQuery = subQuery.where(where).join({ alias, targetField }).select(`${alias}.id`).getKnexQuery();
      addFiltersClause(queryParams, { id: { $notIn: knexSubQuery } });
    }
    ctx.body = await strapi.entityService.findPage(targetedModel.uid, queryParams);
  },
  async findExisting(ctx) {
    const { userAbility } = ctx.state;
    const { model, id, targetField } = ctx.params;
    await validateFindExisting(ctx.request.query);
    const modelSchema = strapi.getModel(model);
    if (!modelSchema) {
      return ctx.badRequest("The model doesn't exist");
    }
    const attribute = modelSchema.attributes[targetField];
    if (!attribute || attribute.type !== "relation") {
      return ctx.badRequest("This relational field doesn't exist");
    }
    const isComponent2 = modelSchema.modelType === "component";
    if (!isComponent2) {
      const entityManager2 = getService("entity-manager");
      const permissionChecker22 = getService("permission-checker").create({
        userAbility,
        model
      });
      if (permissionChecker22.cannot.read(null, targetField)) {
        return ctx.forbidden();
      }
      const permissionQuery2 = await permissionChecker22.sanitizedQuery.read(ctx.query);
      const populate = await getService("populate-builder")(model).populateFromQuery(permissionQuery2).build();
      const entity = await entityManager2.findOne(id, model, { populate });
      if (!entity) {
        return ctx.notFound();
      }
      if (permissionChecker22.cannot.read(entity, targetField)) {
        return ctx.forbidden();
      }
    } else {
      const entity = await strapi.entityService.findOne(model, id);
      if (!entity) {
        return ctx.notFound();
      }
    }
    const targetedModel = strapi.getModel(attribute.target);
    const modelConfig = isComponent2 ? await getService("components").findConfiguration(modelSchema) : await getService("content-types").findConfiguration(modelSchema);
    const mainField = flow(
      prop(`metadatas.${targetField}.edit.mainField`),
      (mainField2) => mainField2 || "id",
      (mainField2) => sanitizeMainField(targetedModel, mainField2, userAbility)
    )(modelConfig);
    const fieldsToSelect = uniq(["id", mainField]);
    if (hasDraftAndPublish$3(targetedModel)) {
      fieldsToSelect.push(PUBLISHED_AT_ATTRIBUTE$2);
    }
    const queryParams = {
      fields: fieldsToSelect
    };
    const permissionChecker2 = getService("permission-checker").create({
      userAbility,
      model: targetedModel.uid
    });
    const permissionQuery = await permissionChecker2.sanitizedQuery.read(queryParams);
    if (isAnyToMany$1(attribute)) {
      const res = await strapi.entityService.loadPages(
        model,
        { id },
        targetField,
        {
          fields: ["id"],
          ordering: "desc"
        },
        {
          page: ctx.request.query.page,
          pageSize: ctx.request.query.pageSize
        }
      );
      const ids = res.results.map((item) => item.id);
      addFiltersClause(permissionQuery, { id: { $in: ids } });
      const sanitizedRes = await strapi.entityService.loadPages(
        model,
        { id },
        targetField,
        {
          ...permissionQuery,
          ordering: "desc"
        },
        {
          page: 1,
          pageSize: ids.length
        }
      );
      res.results = uniqBy("id", concat(sanitizedRes.results, res.results));
      ctx.body = res;
    } else {
      const [resWithOnlyId, res] = await Promise.all([
        strapi.entityService.load(model, { id }, targetField, {
          fields: ["id"]
        }),
        strapi.entityService.load(model, { id }, targetField, {
          ...permissionQuery
        })
      ]);
      const result = res || resWithOnlyId;
      ctx.body = {
        data: result
      };
    }
  }
};
const findEntity = async (query, model) => {
  const entityManager2 = getService("entity-manager");
  const populate = await getService("populate-builder")(model).populateFromQuery(query).populateDeep(Infinity).countRelations().build();
  return entityManager2.find(query, model, { populate });
};
const singleTypes = {
  async find(ctx) {
    const { userAbility } = ctx.state;
    const { model } = ctx.params;
    const { query = {} } = ctx.request;
    const permissionChecker2 = getService("permission-checker").create({ userAbility, model });
    if (permissionChecker2.cannot.read()) {
      return ctx.forbidden();
    }
    const permissionQuery = await permissionChecker2.sanitizedQuery.read(query);
    const entity = await findEntity(permissionQuery, model);
    if (!entity) {
      if (permissionChecker2.cannot.create()) {
        return ctx.forbidden();
      }
      return ctx.notFound();
    }
    if (permissionChecker2.cannot.read(entity)) {
      return ctx.forbidden();
    }
    ctx.body = await permissionChecker2.sanitizeOutput(entity);
  },
  async createOrUpdate(ctx) {
    const { user, userAbility } = ctx.state;
    const { model } = ctx.params;
    const { body, query } = ctx.request;
    const entityManager2 = getService("entity-manager");
    const permissionChecker2 = getService("permission-checker").create({ userAbility, model });
    if (permissionChecker2.cannot.create() && permissionChecker2.cannot.update()) {
      return ctx.forbidden();
    }
    const sanitizedQuery = await permissionChecker2.sanitizedQuery.update(query);
    const entity = await findEntity(sanitizedQuery, model);
    const pickPermittedFields = entity ? permissionChecker2.sanitizeUpdateInput(entity) : permissionChecker2.sanitizeCreateInput;
    const setCreator = entity ? setCreatorFields({ user, isEdition: true }) : setCreatorFields({ user });
    const sanitizeFn = pipeAsync(pickPermittedFields, setCreator);
    if (!entity) {
      const sanitizedBody2 = await sanitizeFn(body);
      const newEntity = await entityManager2.create(sanitizedBody2, model, {
        params: sanitizedQuery
      });
      ctx.body = await permissionChecker2.sanitizeOutput(newEntity);
      await strapi.telemetry.send("didCreateFirstContentTypeEntry", {
        eventProperties: { model }
      });
      return;
    }
    if (permissionChecker2.cannot.update(entity)) {
      return ctx.forbidden();
    }
    const sanitizedBody = await sanitizeFn(body);
    const updatedEntity = await entityManager2.update(entity, sanitizedBody, model);
    ctx.body = await permissionChecker2.sanitizeOutput(updatedEntity);
  },
  async delete(ctx) {
    const { userAbility } = ctx.state;
    const { model } = ctx.params;
    const { query = {} } = ctx.request;
    const entityManager2 = getService("entity-manager");
    const permissionChecker2 = getService("permission-checker").create({ userAbility, model });
    if (permissionChecker2.cannot.delete()) {
      return ctx.forbidden();
    }
    const sanitizedQuery = await permissionChecker2.sanitizedQuery.delete(query);
    const entity = await findEntity(sanitizedQuery, model);
    if (!entity) {
      return ctx.notFound();
    }
    if (permissionChecker2.cannot.delete(entity)) {
      return ctx.forbidden();
    }
    const deletedEntity = await entityManager2.delete(entity, model);
    ctx.body = await permissionChecker2.sanitizeOutput(deletedEntity);
  },
  async publish(ctx) {
    const { userAbility, user } = ctx.state;
    const { model } = ctx.params;
    const { query = {} } = ctx.request;
    const entityManager2 = getService("entity-manager");
    const permissionChecker2 = getService("permission-checker").create({ userAbility, model });
    if (permissionChecker2.cannot.publish()) {
      return ctx.forbidden();
    }
    const sanitizedQuery = await permissionChecker2.sanitizedQuery.publish(query);
    const entity = await findEntity(sanitizedQuery, model);
    if (!entity) {
      return ctx.notFound();
    }
    if (permissionChecker2.cannot.publish(entity)) {
      return ctx.forbidden();
    }
    const publishedEntity = await entityManager2.publish(
      entity,
      model,
      setCreatorFields({ user, isEdition: true })({})
    );
    ctx.body = await permissionChecker2.sanitizeOutput(publishedEntity);
  },
  async unpublish(ctx) {
    const { userAbility, user } = ctx.state;
    const { model } = ctx.params;
    const { query = {} } = ctx.request;
    const entityManager2 = getService("entity-manager");
    const permissionChecker2 = getService("permission-checker").create({ userAbility, model });
    if (permissionChecker2.cannot.unpublish()) {
      return ctx.forbidden();
    }
    const sanitizedQuery = await permissionChecker2.sanitizedQuery.unpublish(query);
    const entity = await findEntity(sanitizedQuery, model);
    if (!entity) {
      return ctx.notFound();
    }
    if (permissionChecker2.cannot.unpublish(entity)) {
      return ctx.forbidden();
    }
    const unpublishedEntity = await entityManager2.unpublish(
      entity,
      model,
      setCreatorFields({ user, isEdition: true })({})
    );
    ctx.body = await permissionChecker2.sanitizeOutput(unpublishedEntity);
  },
  async countDraftRelations(ctx) {
    const { userAbility } = ctx.state;
    const { model } = ctx.params;
    const entityManager2 = getService("entity-manager");
    const permissionChecker2 = getService("permission-checker").create({ userAbility, model });
    if (permissionChecker2.cannot.read()) {
      return ctx.forbidden();
    }
    const entity = await findEntity({}, model);
    if (!entity) {
      return ctx.notFound();
    }
    if (permissionChecker2.cannot.read(entity)) {
      return ctx.forbidden();
    }
    const number = await entityManager2.countDraftRelations(entity.id, model);
    return {
      data: number
    };
  }
};
const uid$1 = {
  async generateUID(ctx) {
    const { contentTypeUID, field, data } = await validateGenerateUIDInput(ctx.request.body);
    await validateUIDField(contentTypeUID, field);
    const uidService = getService("uid");
    ctx.body = {
      data: await uidService.generateUIDField({ contentTypeUID, field, data })
    };
  },
  async checkUIDAvailability(ctx) {
    const { contentTypeUID, field, value } = await validateCheckUIDAvailabilityInput(
      ctx.request.body
    );
    await validateUIDField(contentTypeUID, field);
    const uidService = getService("uid");
    const isAvailable = await uidService.checkUIDAvailability({ contentTypeUID, field, value });
    ctx.body = {
      isAvailable,
      suggestion: !isAvailable ? await uidService.findUniqueUID({ contentTypeUID, field, value }) : null
    };
  }
};
const controllers = {
  "collection-types": collectionTypes,
  components: components$1,
  "content-types": contentTypes,
  init,
  relations,
  "single-types": singleTypes,
  uid: uid$1
};
const keys = {
  CONFIGURATION: "configuration"
};
const getStore = () => strapi.store({ type: "plugin", name: "content_manager" });
const EMPTY_CONFIG = {
  settings: {},
  metadatas: {},
  layouts: {}
};
const configurationKey = (key) => `${keys.CONFIGURATION}_${key}`;
const getModelConfiguration = async (key) => {
  const config = await getStore().get({ key: configurationKey(key) });
  return _.merge({}, EMPTY_CONFIG, config);
};
const setModelConfiguration = async (key, value) => {
  const storedConfig = await getStore().get({ key: configurationKey(key) }) || {};
  const currentConfig = { ...storedConfig };
  Object.keys(value).forEach((key2) => {
    if (value[key2] !== null && value[key2] !== void 0) {
      _.set(currentConfig, key2, value[key2]);
    }
  });
  if (!_.isEqual(currentConfig, storedConfig)) {
    return getStore().set({
      key: configurationKey(key),
      value: currentConfig
    });
  }
};
const deleteKey = (key) => {
  return strapi.query("strapi::core-store").delete({ where: { key: `plugin_content_manager_configuration_${key}` } });
};
const findByKey = async (key) => {
  const results = await strapi.query("strapi::core-store").findMany({
    where: {
      key: {
        $startsWith: key
      }
    }
  });
  return results.map(({ value }) => JSON.parse(value));
};
const getAllConfigurations = () => findByKey("plugin_content_manager_configuration");
const storeUtils = {
  getAllConfigurations,
  findByKey,
  getModelConfiguration,
  setModelConfiguration,
  deleteKey,
  keys
};
function createDefaultMetadatas(schema) {
  return {
    ...Object.keys(schema.attributes).reduce((acc, name) => {
      acc[name] = createDefaultMetadata(schema, name);
      return acc;
    }, {}),
    id: {
      edit: {},
      list: {
        label: "id",
        searchable: true,
        sortable: true
      }
    }
  };
}
function createDefaultMetadata(schema, name) {
  const edit = {
    label: name,
    description: "",
    placeholder: "",
    visible: isVisible$1(schema, name),
    editable: true
  };
  const fieldAttributes = schema.attributes[name];
  if (isRelation$1(fieldAttributes)) {
    const { targetModel } = fieldAttributes;
    const targetSchema = getTargetSchema(targetModel);
    if (targetSchema) {
      edit.mainField = getDefaultMainField(targetSchema);
    }
  }
  _.assign(
    edit,
    _.pick(_.get(schema, ["config", "metadatas", name, "edit"], {}), [
      "label",
      "description",
      "placeholder",
      "visible",
      "editable",
      "mainField"
    ])
  );
  const list = {
    // @ts-expect-error we need to specify these properties
    label: name,
    // @ts-expect-error we need to specify these properties
    searchable: isSearchable(schema, name),
    // @ts-expect-error we need to specify these properties
    sortable: isSortable(schema, name),
    ..._.pick(_.get(schema, ["config", "metadatas", name, "list"], {}), [
      "label",
      "searchable",
      "sortable"
    ])
  };
  return { edit, list };
}
async function syncMetadatas(configuration, schema) {
  if (_.isEmpty(configuration.metadatas)) {
    return createDefaultMetadatas(schema);
  }
  const metasWithValidKeys = _.pick(configuration.metadatas, Object.keys(schema.attributes));
  const metasWithDefaults = _.merge({}, createDefaultMetadatas(schema), metasWithValidKeys);
  const updatedMetas = Object.keys(metasWithDefaults).reduce((acc, key) => {
    const { edit, list } = metasWithDefaults[key];
    const attr = schema.attributes[key];
    const updatedMeta = { edit, list };
    if (list.sortable && !isSortable(schema, key)) {
      _.set(updatedMeta, ["list", "sortable"], false);
      _.set(acc, [key], updatedMeta);
    }
    if (list.searchable && !isSearchable(schema, key)) {
      _.set(updatedMeta, ["list", "searchable"], false);
      _.set(acc, [key], updatedMeta);
    }
    if (!_.has(edit, "mainField"))
      return acc;
    if (!isRelation$1(attr)) {
      _.set(updatedMeta, "edit", _.omit(edit, ["mainField"]));
      _.set(acc, [key], updatedMeta);
      return acc;
    }
    if (edit.mainField === "id")
      return acc;
    const targetSchema = getTargetSchema(attr.targetModel);
    if (!targetSchema)
      return acc;
    if (!isSortable(targetSchema, edit.mainField) && !isListable(targetSchema, edit.mainField)) {
      _.set(updatedMeta, ["edit", "mainField"], getDefaultMainField(targetSchema));
      _.set(acc, [key], updatedMeta);
      return acc;
    }
    return acc;
  }, {});
  return _.assign(metasWithDefaults, updatedMetas);
}
const getTargetSchema = (targetModel) => {
  return getService("content-types").findContentType(targetModel);
};
const DEFAULT_LIST_LENGTH = 4;
const MAX_ROW_SIZE = 12;
const isAllowedFieldSize = (type, size) => {
  const { getFieldSize } = getService("field-sizes");
  const fieldSize = getFieldSize(type);
  if (!fieldSize.isResizable && size !== fieldSize.default) {
    return false;
  }
  return size <= MAX_ROW_SIZE;
};
const getDefaultFieldSize = (attribute) => {
  const { hasFieldSize, getFieldSize } = getService("field-sizes");
  return getFieldSize(hasFieldSize(attribute.customField) ? attribute.customField : attribute.type).default;
};
async function createDefaultLayouts(schema) {
  return {
    // @ts-expect-error necessary to provide this default layout
    list: createDefaultListLayout(schema),
    // @ts-expect-error necessary to provide this default layout
    edit: createDefaultEditLayout(schema),
    ..._.pick(_.get(schema, ["config", "layouts"], {}), ["list", "edit"])
  };
}
function createDefaultListLayout(schema) {
  return Object.keys(schema.attributes).filter((name) => isListable(schema, name)).slice(0, DEFAULT_LIST_LENGTH);
}
const rowSize = (els) => els.reduce((sum, el) => sum + el.size, 0);
function createDefaultEditLayout(schema) {
  const keys2 = Object.keys(schema.attributes).filter((name) => hasEditableAttribute(schema, name));
  return appendToEditLayout([], keys2, schema);
}
function syncLayouts(configuration, schema) {
  if (_.isEmpty(configuration.layouts))
    return createDefaultLayouts(schema);
  const { list = [], editRelations = [], edit = [] } = configuration.layouts || {};
  let cleanList = list.filter((attr) => isListable(schema, attr));
  const cleanEditRelations = editRelations.filter(
    (attr) => hasRelationAttribute(schema, attr)
  );
  const elementsToReAppend = [...cleanEditRelations];
  let cleanEdit = [];
  for (const row of edit) {
    const newRow = [];
    for (const el of row) {
      if (!hasEditableAttribute(schema, el.name))
        continue;
      const { hasFieldSize } = getService("field-sizes");
      const fieldType = hasFieldSize(schema.attributes[el.name].customField) ? schema.attributes[el.name].customField : schema.attributes[el.name].type;
      if (!isAllowedFieldSize(fieldType, el.size)) {
        elementsToReAppend.push(el.name);
        continue;
      }
      newRow.push(el);
    }
    if (newRow.length > 0) {
      cleanEdit.push(newRow);
    }
  }
  cleanEdit = appendToEditLayout(cleanEdit, elementsToReAppend, schema);
  const newAttributes = _.difference(
    Object.keys(schema.attributes),
    Object.keys(configuration.metadatas)
  );
  if (cleanList.length < DEFAULT_LIST_LENGTH) {
    cleanList = _.uniq(
      cleanList.concat(newAttributes.filter((key) => isListable(schema, key))).slice(0, DEFAULT_LIST_LENGTH)
    );
  }
  const newEditAttributes = newAttributes.filter((key) => hasEditableAttribute(schema, key));
  cleanEdit = appendToEditLayout(cleanEdit, newEditAttributes, schema);
  return {
    list: cleanList.length > 0 ? cleanList : createDefaultListLayout(schema),
    edit: cleanEdit.length > 0 ? cleanEdit : createDefaultEditLayout(schema)
  };
}
const appendToEditLayout = (layout = [], keysToAppend, schema) => {
  if (keysToAppend.length === 0)
    return layout;
  let currentRowIndex = Math.max(layout.length - 1, 0);
  if (!layout[currentRowIndex]) {
    layout[currentRowIndex] = [];
  }
  for (const key of keysToAppend) {
    const attribute = schema.attributes[key];
    const attributeSize = getDefaultFieldSize(attribute);
    const currenRowSize = rowSize(layout[currentRowIndex]);
    if (currenRowSize + attributeSize > MAX_ROW_SIZE) {
      currentRowIndex += 1;
      layout[currentRowIndex] = [];
    }
    layout[currentRowIndex].push({
      name: key,
      size: attributeSize
    });
  }
  return layout;
};
async function validateCustomConfig(schema) {
  try {
    await createModelConfigurationSchema(schema, {
      allowUndefined: true
    }).validate(schema.config);
  } catch (error) {
    throw new Error(
      `Invalid Model configuration for model ${schema.uid}. Verify your {{ modelName }}.config.js(on) file:
  - ${error.message}
`
    );
  }
}
async function createDefaultConfiguration(schema) {
  await validateCustomConfig(schema);
  return {
    settings: await createDefaultSettings(schema),
    metadatas: await createDefaultMetadatas(schema),
    layouts: await createDefaultLayouts(schema)
  };
}
async function syncConfiguration(conf, schema) {
  await validateCustomConfig(schema);
  return {
    settings: await syncSettings(conf, schema),
    layouts: await syncLayouts(conf, schema),
    metadatas: await syncMetadatas(conf, schema)
  };
}
const createConfigurationService = ({
  isComponent: isComponent2,
  prefix,
  storeUtils: storeUtils2,
  getModels
}) => {
  const uidToStoreKey = (uid2) => {
    return `${prefix}::${uid2}`;
  };
  const getConfiguration = (uid2) => {
    const storeKey = uidToStoreKey(uid2);
    return storeUtils2.getModelConfiguration(storeKey);
  };
  const setConfiguration = (uid2, input) => {
    const configuration = {
      ...input,
      uid: uid2,
      isComponent: isComponent2 ?? void 0
    };
    const storeKey = uidToStoreKey(uid2);
    return storeUtils2.setModelConfiguration(storeKey, configuration);
  };
  const deleteConfiguration = (uid2) => {
    const storeKey = uidToStoreKey(uid2);
    return storeUtils2.deleteKey(storeKey);
  };
  const syncConfigurations = async () => {
    const models = getModels();
    const configurations = await storeUtils2.findByKey(
      `plugin_content_manager_configuration_${prefix}`
    );
    const updateConfiguration = async (uid2) => {
      const conf = configurations.find((conf2) => conf2.uid === uid2);
      return setConfiguration(uid2, await syncConfiguration(conf, models[uid2]));
    };
    const generateNewConfiguration = async (uid2) => {
      return setConfiguration(uid2, await createDefaultConfiguration(models[uid2]));
    };
    const currentUIDS = Object.keys(models);
    const DBUIDs = configurations.map(({ uid: uid2 }) => uid2);
    const contentTypesToUpdate = intersection$1(currentUIDS, DBUIDs);
    const contentTypesToAdd = difference(currentUIDS, DBUIDs);
    const contentTypesToDelete = difference(DBUIDs, currentUIDS);
    await Promise.all(contentTypesToDelete.map((uid2) => deleteConfiguration(uid2)));
    await Promise.all(contentTypesToAdd.map((uid2) => generateNewConfiguration(uid2)));
    await Promise.all(contentTypesToUpdate.map((uid2) => updateConfiguration(uid2)));
  };
  return {
    getConfiguration,
    setConfiguration,
    deleteConfiguration,
    syncConfigurations
  };
};
const STORE_KEY_PREFIX = "components";
const configurationService$1 = createConfigurationService({
  storeUtils,
  isComponent: true,
  prefix: STORE_KEY_PREFIX,
  getModels() {
    const { toContentManagerModel } = getService("data-mapper");
    return mapValues(toContentManagerModel, strapi.components);
  }
});
const components = ({ strapi: strapi2 }) => ({
  findAllComponents() {
    const { toContentManagerModel } = getService("data-mapper");
    return Object.values(strapi2.components).map(toContentManagerModel);
  },
  findComponent(uid2) {
    const { toContentManagerModel } = getService("data-mapper");
    const component = strapi2.components[uid2];
    return isNil$1(component) ? component : toContentManagerModel(component);
  },
  async findConfiguration(component) {
    const configuration = await configurationService$1.getConfiguration(component.uid);
    return {
      uid: component.uid,
      category: component.category,
      ...configuration
    };
  },
  async updateConfiguration(component, newConfiguration) {
    await configurationService$1.setConfiguration(component.uid, newConfiguration);
    return this.findConfiguration(component);
  },
  async findComponentsConfigurations(model) {
    const componentsMap = {};
    const getComponentConfigurations = async (uid2) => {
      const component = this.findComponent(uid2);
      if (has(uid2, componentsMap)) {
        return;
      }
      const componentConfiguration = await this.findConfiguration(component);
      const componentsConfigurations = await this.findComponentsConfigurations(component);
      Object.assign(componentsMap, {
        [uid2]: componentConfiguration,
        ...componentsConfigurations
      });
    };
    for (const key of Object.keys(model.attributes)) {
      const attribute = model.attributes[key];
      if (attribute.type === "component") {
        await getComponentConfigurations(attribute.component);
      }
      if (attribute.type === "dynamiczone") {
        for (const componentUid of attribute.components) {
          await getComponentConfigurations(componentUid);
        }
      }
    }
    return componentsMap;
  },
  syncConfigurations() {
    return configurationService$1.syncConfigurations();
  }
});
const configurationService = createConfigurationService({
  storeUtils,
  prefix: "content_types",
  getModels() {
    const { toContentManagerModel } = getService("data-mapper");
    return mapValues(toContentManagerModel, strapi.contentTypes);
  }
});
const service = ({ strapi: strapi2 }) => ({
  findAllContentTypes() {
    const { toContentManagerModel } = getService("data-mapper");
    return Object.values(strapi2.contentTypes).map(toContentManagerModel);
  },
  findContentType(uid2) {
    const { toContentManagerModel } = getService("data-mapper");
    const contentType = strapi2.contentTypes[uid2];
    return isNil$1(contentType) ? contentType : toContentManagerModel(contentType);
  },
  findDisplayedContentTypes() {
    return this.findAllContentTypes().filter(
      // TODO
      // @ts-expect-error should be resolved from data-mapper types
      ({ isDisplayed }) => isDisplayed === true
    );
  },
  findContentTypesByKind(kind) {
    if (!kind) {
      return this.findAllContentTypes();
    }
    return this.findAllContentTypes().filter(contentTypes$1.isKind(kind));
  },
  async findConfiguration(contentType) {
    const configuration = await configurationService.getConfiguration(contentType.uid);
    return {
      uid: contentType.uid,
      ...configuration
    };
  },
  async updateConfiguration(contentType, newConfiguration) {
    await configurationService.setConfiguration(contentType.uid, newConfiguration);
    return this.findConfiguration(contentType);
  },
  findComponentsConfigurations(contentType) {
    return getService("components").findComponentsConfigurations(contentType);
  },
  syncConfigurations() {
    return configurationService.syncConfigurations();
  }
});
const dtoFields = [
  "uid",
  "isDisplayed",
  "apiID",
  "kind",
  "category",
  "info",
  "options",
  "pluginOptions",
  "attributes",
  "pluginOptions"
];
const dataMapper = () => ({
  toContentManagerModel(contentType) {
    return {
      ...contentType,
      apiID: contentType.modelName,
      isDisplayed: isVisible(contentType),
      attributes: {
        id: {
          type: "integer"
        },
        ...formatAttributes(contentType)
      }
    };
  },
  toDto: pick(dtoFields)
});
const formatAttributes = (contentType) => {
  const { getVisibleAttributes, getTimestamps, getCreatorFields } = contentTypes$1;
  return getVisibleAttributes(contentType).concat(getTimestamps(contentType)).concat(getCreatorFields(contentType)).reduce((acc, key) => {
    const attribute = contentType.attributes[key];
    if (attribute.type === "relation" && attribute.relation.toLowerCase().includes("morph")) {
      return acc;
    }
    acc[key] = formatAttribute(key, attribute);
    return acc;
  }, {});
};
const formatAttribute = (key, attribute) => {
  if (attribute.type === "relation") {
    return toRelation(attribute);
  }
  return attribute;
};
const toRelation = (attribute) => {
  return {
    ...attribute,
    type: "relation",
    targetModel: "target" in attribute ? attribute.target : void 0,
    relationType: attribute.relation
  };
};
const isVisible = (model) => getOr(true, "pluginOptions.content-manager.visible", model) === true;
const { hasDraftAndPublish: hasDraftAndPublish$2, isVisibleAttribute: isVisibleAttribute$2 } = strapiUtils.contentTypes;
const { isAnyToMany } = strapiUtils.relations;
const { PUBLISHED_AT_ATTRIBUTE: PUBLISHED_AT_ATTRIBUTE$1 } = strapiUtils.contentTypes.constants;
const isMorphToRelation = (attribute) => isRelation(attribute) && attribute.relation.includes("morphTo");
const isMedia = propEq("type", "media");
const isRelation = propEq("type", "relation");
const isComponent = propEq("type", "component");
const isDynamicZone = propEq("type", "dynamiczone");
function getPopulateForRelation(attribute, model, attributeName, { countMany, countOne, initialPopulate }) {
  const isManyRelation = isAnyToMany(attribute);
  if (initialPopulate) {
    return initialPopulate;
  }
  if (!isVisibleAttribute$2(model, attributeName)) {
    return true;
  }
  if (isManyRelation && countMany || !isManyRelation && countOne) {
    return { count: true };
  }
  return true;
}
function getPopulateForDZ(attribute, options, level) {
  const populatedComponents = (attribute.components || []).reduce(
    (acc, componentUID) => ({
      ...acc,
      [componentUID]: {
        populate: getDeepPopulate(componentUID, options, level + 1)
      }
    }),
    {}
  );
  return { on: populatedComponents };
}
function getPopulateFor(attributeName, model, options, level) {
  const attribute = model.attributes[attributeName];
  switch (attribute.type) {
    case "relation":
      return {
        [attributeName]: getPopulateForRelation(attribute, model, attributeName, options)
      };
    case "component":
      return {
        [attributeName]: {
          populate: getDeepPopulate(attribute.component, options, level + 1)
        }
      };
    case "media":
      return {
        [attributeName]: { populate: "folder" }
      };
    case "dynamiczone":
      return {
        [attributeName]: getPopulateForDZ(attribute, options, level)
      };
    default:
      return {};
  }
}
const getDeepPopulate = (uid2, {
  initialPopulate = {},
  countMany = false,
  countOne = false,
  maxLevel = Infinity
} = {}, level = 1) => {
  if (level > maxLevel) {
    return {};
  }
  const model = strapi.getModel(uid2);
  return Object.keys(model.attributes).reduce(
    (populateAcc, attributeName) => merge(
      populateAcc,
      getPopulateFor(
        attributeName,
        model,
        {
          // @ts-expect-error - improve types
          initialPopulate: initialPopulate?.[attributeName],
          countMany,
          countOne,
          maxLevel
        },
        level
      )
    ),
    {}
  );
};
const getDeepPopulateDraftCount = (uid2) => {
  const model = strapi.getModel(uid2);
  let hasRelations = false;
  const populate = Object.keys(model.attributes).reduce((populateAcc, attributeName) => {
    const attribute = model.attributes[attributeName];
    switch (attribute.type) {
      case "relation": {
        const childModel = strapi.getModel(attribute.target);
        if (hasDraftAndPublish$2(childModel) && isVisibleAttribute$2(model, attributeName)) {
          populateAcc[attributeName] = {
            count: true,
            filters: { [PUBLISHED_AT_ATTRIBUTE$1]: { $null: true } }
          };
          hasRelations = true;
        }
        break;
      }
      case "component": {
        const { populate: populate2, hasRelations: childHasRelations } = getDeepPopulateDraftCount(
          attribute.component
        );
        if (childHasRelations) {
          populateAcc[attributeName] = { populate: populate2 };
          hasRelations = true;
        }
        break;
      }
      case "dynamiczone": {
        const dzPopulate = (attribute.components || []).reduce((acc, componentUID) => {
          const { populate: populate2, hasRelations: childHasRelations } = getDeepPopulateDraftCount(componentUID);
          if (childHasRelations) {
            hasRelations = true;
            return merge(acc, populate2);
          }
          return acc;
        }, {});
        if (!isEmpty(dzPopulate)) {
          populateAcc[attributeName] = { populate: dzPopulate };
        }
        break;
      }
    }
    return populateAcc;
  }, {});
  return { populate, hasRelations };
};
const getQueryPopulate = async (uid2, query) => {
  let populateQuery = {};
  await strapiUtils.traverse.traverseQueryFilters(
    /**
     *
     * @param {Object} param0
     * @param {string} param0.key - Attribute name
     * @param {Object} param0.attribute - Attribute definition
     * @param {string} param0.path - Content Type path to the attribute
     * @returns
     */
    ({ attribute, path }) => {
      if (!attribute || isDynamicZone(attribute) || isMorphToRelation(attribute)) {
        return;
      }
      if (isRelation(attribute) || isMedia(attribute) || isComponent(attribute)) {
        const populatePath = path.attribute.replace(/\./g, ".populate.");
        populateQuery = set(populatePath, {}, populateQuery);
      }
    },
    { schema: strapi.getModel(uid2) },
    query
  );
  return populateQuery;
};
const isWebhooksPopulateRelationsEnabled = () => {
  return strapi.config.get("server.webhooks.populateRelations", true);
};
const { isVisibleAttribute: isVisibleAttribute$1 } = contentTypes$1;
function getCountForRelation(attributeName, entity, model) {
  if (!isVisibleAttribute$1(model, attributeName)) {
    return entity;
  }
  if (Array.isArray(entity)) {
    return { count: entity.length };
  }
  return entity ? { count: 1 } : { count: 0 };
}
function getCountForDZ(entity) {
  return entity.map((component) => {
    return getDeepRelationsCount(component, component.__component);
  });
}
function getCountFor(attributeName, entity, model) {
  const attribute = model.attributes[attributeName];
  switch (attribute?.type) {
    case "relation":
      return getCountForRelation(attributeName, entity, model);
    case "component":
      if (!entity)
        return null;
      if (attribute.repeatable) {
        return entity.map(
          (component) => getDeepRelationsCount(component, attribute.component)
        );
      }
      return getDeepRelationsCount(entity, attribute.component);
    case "dynamiczone":
      return getCountForDZ(entity);
    default:
      return entity;
  }
}
const getDeepRelationsCount = (entity, uid2) => {
  const model = strapi.getModel(uid2);
  return Object.keys(entity).reduce(
    (relationCountEntity, attributeName) => Object.assign(relationCountEntity, {
      [attributeName]: getCountFor(attributeName, entity[attributeName], model)
    }),
    {}
  );
};
const { hasDraftAndPublish: hasDraftAndPublish$1, isVisibleAttribute } = strapiUtils.contentTypes;
const sumDraftCounts = (entity, uid2) => {
  const model = strapi.getModel(uid2);
  return Object.keys(model.attributes).reduce((sum, attributeName) => {
    const attribute = model.attributes[attributeName];
    const value = entity[attributeName];
    if (!value) {
      return sum;
    }
    switch (attribute.type) {
      case "relation": {
        const childModel = strapi.getModel(attribute.target);
        if (hasDraftAndPublish$1(childModel) && isVisibleAttribute(model, attributeName)) {
          return sum + value.count;
        }
        return sum;
      }
      case "component": {
        const compoSum = castArray(value).reduce((acc, componentValue) => {
          return acc + sumDraftCounts(componentValue, attribute.component);
        }, 0);
        return sum + compoSum;
      }
      case "dynamiczone": {
        const dzSum = value.reduce((acc, componentValue) => {
          return acc + sumDraftCounts(componentValue, componentValue.__component);
        }, 0);
        return sum + dzSum;
      }
      default:
        return sum;
    }
  }, 0);
};
const { ApplicationError: ApplicationError$1 } = errors;
const { ENTRY_PUBLISH, ENTRY_UNPUBLISH } = ALLOWED_WEBHOOK_EVENTS;
const { hasDraftAndPublish } = contentTypes$1;
const { PUBLISHED_AT_ATTRIBUTE } = contentTypes$1.constants;
const omitPublishedAtField = omit(PUBLISHED_AT_ATTRIBUTE);
const emitEvent = async (uid2, event, entity) => {
  const modelDef = strapi.getModel(uid2);
  const sanitizedEntity = await sanitize.sanitizers.defaultSanitizeOutput(modelDef, entity);
  strapi.eventHub.emit(event, {
    model: modelDef.modelName,
    entry: sanitizedEntity
  });
};
const buildDeepPopulate = (uid2) => {
  return (
    // @ts-expect-error populate builder needs to be called with a UID
    getService("populate-builder")(uid2).populateDeep(Infinity).countRelationsIf(!isWebhooksPopulateRelationsEnabled()).build()
  );
};
const entityManager = ({ strapi: strapi2 }) => ({
  /**
   * Extend this function from other plugins to add custom mapping of entity
   * responses
   * @param {Object} entity
   * @returns
   */
  mapEntity(entity) {
    return entity;
  },
  /**
   * Some entity manager functions may return multiple entities or one entity.
   * This function maps the response in both cases
   * @param {Array|Object|null} entities
   * @param {string} uid
   */
  async mapEntitiesResponse(entities, uid2) {
    if (entities?.results) {
      const mappedResults = await mapAsync(
        entities.results,
        (entity) => (
          // @ts-expect-error mapEntity can be extended
          this.mapEntity(entity, uid2)
        )
      );
      return { ...entities, results: mappedResults };
    }
    return this.mapEntity(entities, uid2);
  },
  async find(opts, uid2) {
    const params = { ...opts, populate: getDeepPopulate(uid2) };
    const entities = await strapi2.entityService.findMany(uid2, params);
    return this.mapEntitiesResponse(entities, uid2);
  },
  async findPage(opts, uid2) {
    const entities = await strapi2.entityService.findPage(uid2, opts);
    return this.mapEntitiesResponse(entities, uid2);
  },
  async findOne(id, uid2, opts = {}) {
    return strapi2.entityService.findOne(uid2, id, opts).then((entity) => this.mapEntity(entity, uid2));
  },
  async create(body, uid2) {
    const modelDef = strapi2.getModel(uid2);
    const publishData = { ...body };
    const populate = await buildDeepPopulate(uid2);
    if (hasDraftAndPublish(modelDef)) {
      publishData[PUBLISHED_AT_ATTRIBUTE] = null;
    }
    const params = { data: publishData, populate };
    const entity = await strapi2.entityService.create(uid2, params).then((entity2) => this.mapEntity(entity2, uid2));
    if (isWebhooksPopulateRelationsEnabled()) {
      return getDeepRelationsCount(entity, uid2);
    }
    return entity;
  },
  async update(entity, body, uid2) {
    const publishData = omitPublishedAtField(body);
    const populate = await buildDeepPopulate(uid2);
    const params = { data: publishData, populate };
    const updatedEntity = await strapi2.entityService.update(uid2, entity.id, params).then((entity2) => this.mapEntity(entity2, uid2));
    if (isWebhooksPopulateRelationsEnabled()) {
      return getDeepRelationsCount(updatedEntity, uid2);
    }
    return updatedEntity;
  },
  async clone(entity, body, uid2) {
    const modelDef = strapi2.getModel(uid2);
    const populate = await buildDeepPopulate(uid2);
    const publishData = { ...body };
    if (hasDraftAndPublish(modelDef)) {
      publishData[PUBLISHED_AT_ATTRIBUTE] = null;
    }
    const params = {
      data: publishData,
      populate
    };
    const clonedEntity = await strapi2.entityService.clone(uid2, entity.id, params);
    if (clonedEntity && isWebhooksPopulateRelationsEnabled()) {
      return getDeepRelationsCount(clonedEntity, uid2);
    }
    return clonedEntity;
  },
  async delete(entity, uid2) {
    const populate = await buildDeepPopulate(uid2);
    const deletedEntity = await strapi2.entityService.delete(uid2, entity.id, { populate });
    if (deletedEntity && isWebhooksPopulateRelationsEnabled()) {
      return getDeepRelationsCount(deletedEntity, uid2);
    }
    return deletedEntity;
  },
  // FIXME: handle relations
  deleteMany(opts, uid2) {
    return strapi2.entityService.deleteMany(uid2, opts);
  },
  async publish(entity, uid2, body = {}) {
    if (entity[PUBLISHED_AT_ATTRIBUTE]) {
      throw new ApplicationError$1("already.published");
    }
    await strapi2.entityValidator.validateEntityCreation(
      strapi2.getModel(uid2),
      entity,
      void 0,
      // @ts-expect-error - FIXME: entity here is unnecessary
      entity
    );
    const data = { ...body, [PUBLISHED_AT_ATTRIBUTE]: /* @__PURE__ */ new Date() };
    const populate = await buildDeepPopulate(uid2);
    const params = { data, populate };
    const updatedEntity = await strapi2.entityService.update(uid2, entity.id, params);
    await emitEvent(uid2, ENTRY_PUBLISH, updatedEntity);
    const mappedEntity = await this.mapEntity(updatedEntity, uid2);
    if (mappedEntity && isWebhooksPopulateRelationsEnabled()) {
      return getDeepRelationsCount(mappedEntity, uid2);
    }
    return mappedEntity;
  },
  async publishMany(entities, uid2) {
    if (!entities.length) {
      return null;
    }
    await Promise.all(
      entities.map((entity) => {
        return strapi2.entityValidator.validateEntityCreation(
          strapi2.getModel(uid2),
          entity,
          void 0,
          // @ts-expect-error - FIXME: entity here is unnecessary
          entity
        );
      })
    );
    const entitiesToPublish = entities.filter((entity) => !entity[PUBLISHED_AT_ATTRIBUTE]).map((entity) => entity.id);
    const filters = { id: { $in: entitiesToPublish } };
    const data = { [PUBLISHED_AT_ATTRIBUTE]: /* @__PURE__ */ new Date() };
    const populate = await buildDeepPopulate(uid2);
    const publishedEntitiesCount = await strapi2.db.query(uid2).updateMany({
      where: filters,
      data
    });
    const publishedEntities = await strapi2.entityService.findMany(uid2, { filters, populate });
    await Promise.all(
      publishedEntities.map((entity) => emitEvent(uid2, ENTRY_PUBLISH, entity))
    );
    return publishedEntitiesCount;
  },
  async unpublishMany(entities, uid2) {
    if (!entities.length) {
      return null;
    }
    const entitiesToUnpublish = entities.filter((entity) => entity[PUBLISHED_AT_ATTRIBUTE]).map((entity) => entity.id);
    const filters = { id: { $in: entitiesToUnpublish } };
    const data = { [PUBLISHED_AT_ATTRIBUTE]: null };
    const populate = await buildDeepPopulate(uid2);
    const unpublishedEntitiesCount = await strapi2.db.query(uid2).updateMany({
      where: filters,
      data
    });
    const unpublishedEntities = await strapi2.entityService.findMany(uid2, { filters, populate });
    await Promise.all(
      unpublishedEntities.map((entity) => emitEvent(uid2, ENTRY_UNPUBLISH, entity))
    );
    return unpublishedEntitiesCount;
  },
  async unpublish(entity, uid2, body = {}) {
    if (!entity[PUBLISHED_AT_ATTRIBUTE]) {
      throw new ApplicationError$1("already.draft");
    }
    const data = { ...body, [PUBLISHED_AT_ATTRIBUTE]: null };
    const populate = await buildDeepPopulate(uid2);
    const params = { data, populate };
    const updatedEntity = await strapi2.entityService.update(uid2, entity.id, params);
    await emitEvent(uid2, ENTRY_UNPUBLISH, updatedEntity);
    const mappedEntity = await this.mapEntity(updatedEntity, uid2);
    if (mappedEntity && isWebhooksPopulateRelationsEnabled()) {
      return getDeepRelationsCount(mappedEntity, uid2);
    }
    return mappedEntity;
  },
  async countDraftRelations(id, uid2) {
    const { populate, hasRelations } = getDeepPopulateDraftCount(uid2);
    if (!hasRelations) {
      return 0;
    }
    const entity = await strapi2.entityService.findOne(uid2, id, { populate });
    return sumDraftCounts(entity, uid2);
  },
  async countManyEntriesDraftRelations(ids, uid2, locale = "en") {
    const { populate, hasRelations } = getDeepPopulateDraftCount(uid2);
    if (!hasRelations) {
      return 0;
    }
    const entities = await strapi2.entityService.findMany(uid2, {
      populate,
      filters: { id: { $in: ids } },
      locale
    });
    const totalNumberDraftRelations = entities.reduce(
      (count, entity) => sumDraftCounts(entity, uid2) + count,
      0
    );
    return totalNumberDraftRelations;
  }
});
const { ApplicationError } = errors;
const needsFullSize = {
  default: 12,
  isResizable: false
};
const smallSize = {
  default: 4,
  isResizable: true
};
const defaultSize = {
  default: 6,
  isResizable: true
};
const fieldSizes = {
  // Full row and not resizable
  dynamiczone: needsFullSize,
  component: needsFullSize,
  json: needsFullSize,
  richtext: needsFullSize,
  blocks: needsFullSize,
  // Small and resizable
  checkbox: smallSize,
  boolean: smallSize,
  date: smallSize,
  time: smallSize,
  biginteger: smallSize,
  decimal: smallSize,
  float: smallSize,
  integer: smallSize,
  number: smallSize,
  // Medium and resizable
  datetime: defaultSize,
  email: defaultSize,
  enumeration: defaultSize,
  media: defaultSize,
  password: defaultSize,
  relation: defaultSize,
  string: defaultSize,
  text: defaultSize,
  timestamp: defaultSize,
  uid: defaultSize
};
const createFieldSizesService = ({ strapi: strapi2 }) => {
  const fieldSizesService = {
    getAllFieldSizes() {
      return fieldSizes;
    },
    hasFieldSize(type) {
      return !!fieldSizes[type];
    },
    getFieldSize(type) {
      if (!type) {
        throw new ApplicationError("The type is required");
      }
      const fieldSize = fieldSizes[type];
      if (!fieldSize) {
        throw new ApplicationError(`Could not find field size for type ${type}`);
      }
      return fieldSize;
    },
    setFieldSize(type, size) {
      if (!type) {
        throw new ApplicationError("The type is required");
      }
      if (!size) {
        throw new ApplicationError("The size is required");
      }
      fieldSizes[type] = size;
    },
    setCustomFieldInputSizes() {
      const customFields = strapi2.container.get("custom-fields").getAll();
      Object.entries(customFields).forEach(([uid2, customField]) => {
        if (customField.inputSize) {
          fieldSizesService.setFieldSize(uid2, customField.inputSize);
        }
      });
    }
  };
  return fieldSizesService;
};
const { getRelationalFields } = relations$1;
const metrics = ({ strapi: strapi2 }) => {
  const sendDidConfigureListView = async (contentType, configuration) => {
    const displayedFields = prop("length", configuration.layouts.list);
    const relationalFields = getRelationalFields(contentType);
    const displayedRelationalFields = intersection(
      relationalFields,
      configuration.layouts.list
    ).length;
    const data = {
      eventProperties: { containsRelationalFields: !!displayedRelationalFields }
    };
    if (data.eventProperties.containsRelationalFields) {
      Object.assign(data.eventProperties, {
        displayedFields,
        displayedRelationalFields
      });
    }
    try {
      await strapi2.telemetry.send("didConfigureListView", data);
    } catch (e) {
    }
  };
  return {
    sendDidConfigureListView
  };
};
const ACTIONS = {
  read: "plugin::content-manager.explorer.read",
  create: "plugin::content-manager.explorer.create",
  update: "plugin::content-manager.explorer.update",
  delete: "plugin::content-manager.explorer.delete",
  publish: "plugin::content-manager.explorer.publish",
  unpublish: "plugin::content-manager.explorer.publish"
};
const createPermissionChecker = (strapi2) => ({ userAbility, model }) => {
  const permissionsManager = strapi2.admin.services.permission.createPermissionsManager({
    ability: userAbility,
    model
  });
  const { actionProvider } = strapi2.service("admin::permission");
  const toSubject = (entity) => {
    return entity ? permissionsManager.toSubject(entity, model) : model;
  };
  const can = (action, entity, field) => {
    const subject = toSubject(entity);
    const aliases = actionProvider.unstable_aliases(action, model);
    return (
      // Test the original action to see if it passes
      userAbility.can(action, subject, field) || // Else try every known alias if at least one of them succeed, then the user "can"
      aliases.some((alias) => userAbility.can(alias, subject, field))
    );
  };
  const cannot = (action, entity, field) => {
    const subject = toSubject(entity);
    const aliases = actionProvider.unstable_aliases(action, model);
    return (
      // Test both the original action
      userAbility.cannot(action, subject, field) && // and every known alias, if all of them fail (cannot), then the user truly "cannot"
      aliases.every((alias) => userAbility.cannot(alias, subject, field))
    );
  };
  const sanitizeOutput = (data, { action = ACTIONS.read } = {}) => {
    return permissionsManager.sanitizeOutput(data, { subject: toSubject(data), action });
  };
  const sanitizeQuery = (query, { action = ACTIONS.read } = {}) => {
    return permissionsManager.sanitizeQuery(query, { subject: model, action });
  };
  const sanitizeInput = (action, data, entity) => {
    return permissionsManager.sanitizeInput(data, {
      subject: entity ? toSubject(entity) : model,
      action
    });
  };
  const validateQuery = (query, { action = ACTIONS.read } = {}) => {
    return permissionsManager.validateQuery(query, { subject: model, action });
  };
  const validateInput = (action, data, entity) => {
    return permissionsManager.validateInput(data, {
      subject: entity ? toSubject(entity) : model,
      action
    });
  };
  const sanitizeCreateInput = (data) => sanitizeInput(ACTIONS.create, data);
  const sanitizeUpdateInput = (entity) => (data) => sanitizeInput(ACTIONS.update, data, entity);
  const buildPermissionQuery = (query, action = {}) => {
    return permissionsManager.addPermissionsQueryTo(query, action);
  };
  const sanitizedQuery = (query, action = {}) => {
    return pipeAsync(
      (q) => sanitizeQuery(q, action),
      (q) => buildPermissionQuery(q, action)
    )(query);
  };
  Object.keys(ACTIONS).forEach((action) => {
    sanitizedQuery[action] = (query) => sanitizedQuery(query, ACTIONS[action]);
  });
  Object.keys(ACTIONS).forEach((action) => {
    can[action] = (...args) => can(ACTIONS[action], ...args);
    cannot[action] = (...args) => cannot(ACTIONS[action], ...args);
  });
  return {
    // Permission utils
    can,
    // check if you have the permission
    cannot,
    // check if you don't have the permission
    // Sanitizers
    sanitizeOutput,
    sanitizeQuery,
    sanitizeCreateInput,
    sanitizeUpdateInput,
    // Validators
    validateQuery,
    validateInput,
    // Queries Builder
    sanitizedQuery
  };
};
const permissionChecker = ({ strapi: strapi2 }) => ({
  create: createPermissionChecker(strapi2)
});
const permission = ({ strapi: strapi2 }) => ({
  canConfigureContentType({
    userAbility,
    contentType
  }) {
    const action = contentTypes$1.isSingleType(contentType) ? "plugin::content-manager.single-types.configure-view" : "plugin::content-manager.collection-types.configure-view";
    return userAbility.can(action);
  },
  async registerPermissions() {
    const displayedContentTypes = getService("content-types").findDisplayedContentTypes();
    const contentTypesUids = displayedContentTypes.map(prop("uid"));
    const draftAndPublishContentTypesUids = displayedContentTypes.filter(contentTypes$1.hasDraftAndPublish).map(prop("uid"));
    const actions = [
      {
        section: "contentTypes",
        displayName: "Create",
        uid: "explorer.create",
        pluginName: "content-manager",
        subjects: contentTypesUids,
        options: {
          applyToProperties: ["fields"]
        }
      },
      {
        section: "contentTypes",
        displayName: "Read",
        uid: "explorer.read",
        pluginName: "content-manager",
        subjects: contentTypesUids,
        options: {
          applyToProperties: ["fields"]
        }
      },
      {
        section: "contentTypes",
        displayName: "Update",
        uid: "explorer.update",
        pluginName: "content-manager",
        subjects: contentTypesUids,
        options: {
          applyToProperties: ["fields"]
        }
      },
      {
        section: "contentTypes",
        displayName: "Delete",
        uid: "explorer.delete",
        pluginName: "content-manager",
        subjects: contentTypesUids
      },
      {
        section: "contentTypes",
        displayName: "Publish",
        uid: "explorer.publish",
        pluginName: "content-manager",
        subjects: draftAndPublishContentTypesUids
      },
      {
        section: "plugins",
        displayName: "Configure view",
        uid: "single-types.configure-view",
        subCategory: "single types",
        pluginName: "content-manager"
      },
      {
        section: "plugins",
        displayName: "Configure view",
        uid: "collection-types.configure-view",
        subCategory: "collection types",
        pluginName: "content-manager"
      },
      {
        section: "plugins",
        displayName: "Configure Layout",
        uid: "components.configure-layout",
        subCategory: "components",
        pluginName: "content-manager"
      }
    ];
    await strapi2.admin.services.permission.actionProvider.registerMany(actions);
  }
});
const populateBuilder = (uid2) => {
  let getInitialPopulate = async () => {
    return void 0;
  };
  const deepPopulateOptions = {
    countMany: false,
    countOne: false,
    maxLevel: -1
  };
  const builder = {
    /**
     * Populates all attribute fields present in a query.
     * @param query - Strapi query object
     */
    populateFromQuery(query) {
      getInitialPopulate = async () => getQueryPopulate(uid2, query);
      return builder;
    },
    /**
     * Populate relations as count if condition is true.
     * @param condition
     * @param [options]
     * @param [options.toMany] - Populate XtoMany relations as count if true.
     * @param [options.toOne] - Populate XtoOne relations as count if true.
     */
    countRelationsIf(condition, { toMany, toOne } = { toMany: true, toOne: true }) {
      if (condition) {
        return this.countRelations({ toMany, toOne });
      }
      return builder;
    },
    /**
     * Populate relations as count.
     * @param [options]
     * @param [options.toMany] - Populate XtoMany relations as count if true.
     * @param [options.toOne] - Populate XtoOne relations as count if true.
     */
    countRelations({ toMany, toOne } = { toMany: true, toOne: true }) {
      if (!isNil$1(toMany)) {
        deepPopulateOptions.countMany = toMany;
      }
      if (!isNil$1(toOne)) {
        deepPopulateOptions.countOne = toOne;
      }
      return builder;
    },
    /**
     * Populate relations deeply, up to a certain level.
     * @param [level=Infinity] - Max level of nested populate.
     */
    populateDeep(level = Infinity) {
      deepPopulateOptions.maxLevel = level;
      return builder;
    },
    /**
     * Construct the populate object based on the builder options.
     * @returns Populate object
     */
    async build() {
      const initialPopulate = await getInitialPopulate();
      if (deepPopulateOptions.maxLevel === -1) {
        return initialPopulate;
      }
      return getDeepPopulate(uid2, { ...deepPopulateOptions, initialPopulate });
    }
  };
  return builder;
};
const populateBuilder$1 = () => populateBuilder;
const uid = ({ strapi: strapi2 }) => ({
  async generateUIDField({
    contentTypeUID,
    field,
    data
  }) {
    const contentType = strapi2.contentTypes[contentTypeUID];
    const { attributes } = contentType;
    const { targetField, default: defaultValue, options } = attributes[field];
    const targetValue = _.get(data, targetField);
    if (!_.isEmpty(targetValue)) {
      return this.findUniqueUID({
        contentTypeUID,
        field,
        value: slugify(targetValue, options)
      });
    }
    return this.findUniqueUID({
      contentTypeUID,
      field,
      value: slugify(defaultValue || contentType.modelName, options)
    });
  },
  async findUniqueUID({
    contentTypeUID,
    field,
    value
  }) {
    const query = strapi2.db.query(contentTypeUID);
    const possibleColisions = await query.findMany({
      where: { [field]: { $contains: value } }
    }).then((results) => results.map((result) => result[field]));
    if (possibleColisions.length === 0) {
      return value;
    }
    let i = 1;
    let tmpUId = `${value}-${i}`;
    while (possibleColisions.includes(tmpUId)) {
      i += 1;
      tmpUId = `${value}-${i}`;
    }
    return tmpUId;
  },
  async checkUIDAvailability({
    contentTypeUID,
    field,
    value
  }) {
    const query = strapi2.db.query(contentTypeUID);
    const count = await query.count({
      where: { [field]: value }
    });
    if (count > 0) {
      return false;
    }
    return true;
  }
});
const services = {
  components,
  "content-types": service,
  "data-mapper": dataMapper,
  "entity-manager": entityManager,
  "field-sizes": createFieldSizesService,
  metrics,
  "permission-checker": permissionChecker,
  permission,
  "populate-builder": populateBuilder$1,
  uid
};
const index = () => {
  return {
    bootstrap,
    controllers,
    routes,
    policies,
    services
  };
};
export {
  index as default
};
//# sourceMappingURL=index.mjs.map

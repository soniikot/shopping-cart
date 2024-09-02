"use strict";
const _ = require("lodash");
const delegate = require("delegates");
const database = require("@strapi/database");
const strapiUtils = require("@strapi/utils");
const uploadFiles = require("../utils/upload-files.js");
const components = require("./components.js");
const params = require("./params.js");
const index = require("./attributes/index.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const ___default = /* @__PURE__ */ _interopDefault(_);
const delegate__default = /* @__PURE__ */ _interopDefault(delegate);
const { transformParamsToQuery } = strapiUtils.convertQueryParams;
const transformLoadParamsToQuery = (uid, field, params2, pagination = {}) => {
  const query = transformParamsToQuery(uid, { populate: { [field]: params2 } });
  const res = {
    ...query.populate[field],
    ...pagination
  };
  return res;
};
const databaseErrorsToTransform = [
  database.errors.InvalidTimeError,
  database.errors.InvalidDateTimeError,
  database.errors.InvalidDateError,
  database.errors.InvalidRelationError
];
const creationPipeline = (data, context) => {
  return index.applyTransforms(data, context);
};
const updatePipeline = (data, context) => {
  return index.applyTransforms(data, context);
};
const ALLOWED_WEBHOOK_EVENTS = {
  ENTRY_CREATE: "entry.create",
  ENTRY_UPDATE: "entry.update",
  ENTRY_DELETE: "entry.delete"
};
const getMediaPopulate = (uid) => {
  const model = strapi.getModel(uid);
  const attributes = Object.entries(model.attributes);
  return attributes.reduce((acc, [attributeName, attribute]) => {
    switch (attribute.type) {
      case "media": {
        acc[attributeName] = true;
        return acc;
      }
      case "component": {
        const populate = getMediaPopulate(attribute.component);
        acc[attributeName] = { populate };
        return acc;
      }
      case "dynamiczone": {
        const populatedComponents = (attribute.components || []).reduce(
          (acc2, componentUID) => {
            acc2[componentUID] = { populate: getMediaPopulate(componentUID) };
            return acc2;
          },
          {}
        );
        acc[attributeName] = { on: populatedComponents };
        break;
      }
    }
    return acc;
  }, {});
};
const createDefaultImplementation = ({
  strapi: strapi2,
  db,
  eventHub,
  entityValidator
}) => ({
  /**
   * Upload files utility
   */
  uploadFiles,
  async wrapParams(options = {}) {
    return options;
  },
  async wrapResult(result = {}) {
    return result;
  },
  async emitEvent(uid, event, entity) {
    if (uid === "admin::audit-log") {
      return;
    }
    const model = strapi2.getModel(uid);
    const sanitizedEntity = await strapiUtils.sanitize.sanitizers.defaultSanitizeOutput(model, entity);
    eventHub.emit(event, {
      model: model.modelName,
      uid: model.uid,
      entry: sanitizedEntity
    });
  },
  async findMany(uid, opts) {
    const { kind } = strapi2.getModel(uid);
    const wrappedParams = await this.wrapParams(opts, { uid, action: "findMany" });
    const query = transformParamsToQuery(uid, wrappedParams);
    if (kind === "singleType") {
      const entity = db.query(uid).findOne(query);
      return this.wrapResult(entity, { uid, action: "findOne" });
    }
    const entities = await db.query(uid).findMany(query);
    return this.wrapResult(entities, { uid, action: "findMany" });
  },
  async findPage(uid, opts) {
    const wrappedParams = await this.wrapParams(opts, { uid, action: "findPage" });
    const query = transformParamsToQuery(uid, wrappedParams);
    const page = await db.query(uid).findPage(query);
    return {
      ...page,
      results: await this.wrapResult(page.results, { uid, action: "findPage" })
    };
  },
  // TODO: streamline the logic based on the populate option
  async findWithRelationCountsPage(uid, opts) {
    const wrappedParams = await this.wrapParams(opts, { uid, action: "findWithRelationCounts" });
    const query = transformParamsToQuery(uid, wrappedParams);
    const entities = await db.query(uid).findPage(query);
    return {
      ...entities,
      results: await this.wrapResult(entities.results, { uid, action: "findWithRelationCounts" })
    };
  },
  async findWithRelationCounts(uid, opts) {
    const wrappedParams = await this.wrapParams(opts, { uid, action: "findWithRelationCounts" });
    const query = transformParamsToQuery(uid, wrappedParams);
    const entities = await db.query(uid).findMany(query);
    return this.wrapResult(entities, { uid, action: "findWithRelationCounts" });
  },
  async findOne(uid, entityId, opts) {
    const wrappedParams = await this.wrapParams(opts, { uid, action: "findOne" });
    const query = transformParamsToQuery(uid, params.pickSelectionParams(wrappedParams));
    const entity = await db.query(uid).findOne({ ...query, where: { id: entityId } });
    return this.wrapResult(entity, { uid, action: "findOne" });
  },
  async count(uid, opts) {
    const wrappedParams = await this.wrapParams(opts, { uid, action: "count" });
    const query = transformParamsToQuery(uid, wrappedParams);
    return db.query(uid).count(query);
  },
  async create(uid, params$1) {
    const wrappedParams = await this.wrapParams(params$1, { uid, action: "create" });
    const { data, files } = wrappedParams;
    if (!data) {
      throw new Error("cannot create");
    }
    const model = strapi2.getModel(uid);
    const isDraft = strapiUtils.contentTypes.isDraft(data, model);
    const validData = await entityValidator.validateEntityCreation(model, data, { isDraft });
    const query = transformParamsToQuery(uid, params.pickSelectionParams(wrappedParams));
    const componentData = await components.createComponents(uid, validData);
    const entityData = creationPipeline(
      Object.assign(components.omitComponentData(model, validData), componentData),
      {
        contentType: model
      }
    );
    let entity = await db.query(uid).create({
      ...query,
      data: entityData
    });
    if (files && Object.keys(files).length > 0) {
      await this.uploadFiles(uid, Object.assign(entityData, entity), files);
      entity = await this.findOne(uid, entity.id, wrappedParams);
    }
    entity = await this.wrapResult(entity, { uid, action: "create" });
    const { ENTRY_CREATE } = ALLOWED_WEBHOOK_EVENTS;
    await this.emitEvent(uid, ENTRY_CREATE, entity);
    return entity;
  },
  async update(uid, entityId, opts) {
    const wrappedParams = await this.wrapParams(opts, {
      uid,
      action: "update"
    });
    const { data, files } = wrappedParams;
    const model = strapi2.getModel(uid);
    const entityToUpdate = await db.query(uid).findOne({ where: { id: entityId } });
    if (!entityToUpdate) {
      return null;
    }
    const isDraft = strapiUtils.contentTypes.isDraft(entityToUpdate, model);
    const validData = await entityValidator.validateEntityUpdate(
      model,
      data,
      {
        isDraft
      },
      entityToUpdate
    );
    const query = transformParamsToQuery(uid, params.pickSelectionParams(wrappedParams));
    const componentData = await components.updateComponents(uid, entityToUpdate, validData);
    const entityData = updatePipeline(
      Object.assign(components.omitComponentData(model, validData), componentData),
      { contentType: model }
    );
    let entity = await db.query(uid).update({
      ...query,
      where: { id: entityId },
      data: entityData
    });
    if (files && Object.keys(files).length > 0) {
      await this.uploadFiles(uid, Object.assign(entityData, entity), files);
      entity = await this.findOne(uid, entity.id, wrappedParams);
    }
    entity = await this.wrapResult(entity, { uid, action: "update" });
    const { ENTRY_UPDATE } = ALLOWED_WEBHOOK_EVENTS;
    await this.emitEvent(uid, ENTRY_UPDATE, entity);
    return entity;
  },
  async delete(uid, entityId, opts) {
    const wrappedParams = await this.wrapParams(opts, { uid, action: "delete" });
    const query = transformParamsToQuery(uid, params.pickSelectionParams(wrappedParams));
    let entityToDelete = await db.query(uid).findOne({
      ...query,
      where: { id: entityId }
    });
    if (!entityToDelete) {
      return null;
    }
    const componentsToDelete = await components.getComponents(uid, entityToDelete);
    await db.query(uid).delete({ where: { id: entityToDelete.id } });
    await components.deleteComponents(uid, componentsToDelete, { loadComponents: false });
    entityToDelete = await this.wrapResult(entityToDelete, { uid, action: "delete" });
    const { ENTRY_DELETE } = ALLOWED_WEBHOOK_EVENTS;
    await this.emitEvent(uid, ENTRY_DELETE, entityToDelete);
    return entityToDelete;
  },
  async clone(uid, cloneId, opts) {
    const wrappedParams = await this.wrapParams(opts, { uid, action: "clone" });
    const { data, files } = wrappedParams;
    if (!data) {
      throw new Error("cannot clone");
    }
    const model = strapi2.getModel(uid);
    const populate = getMediaPopulate(uid);
    const entityToClone = await db.query(uid).findOne({
      where: { id: cloneId },
      populate
    });
    if (!entityToClone) {
      return null;
    }
    const isDraft = strapiUtils.contentTypes.isDraft(entityToClone, model);
    const validData = await entityValidator.validateEntityCreation(
      model,
      // Omit the id, the cloned entity id will be generated by the database
      ___default.default.omit(___default.default.merge(entityToClone, data), ["id"]),
      { isDraft }
    );
    const query = transformParamsToQuery(uid, params.pickSelectionParams(wrappedParams));
    const componentData = await components.cloneComponents(uid, entityToClone, validData);
    const entityData = creationPipeline(
      Object.assign(components.omitComponentData(model, validData), componentData),
      {
        contentType: model
      }
    );
    let entity = await db.query(uid).clone(cloneId, {
      ...query,
      data: entityData
    });
    if (files && Object.keys(files).length > 0) {
      await this.uploadFiles(uid, Object.assign(entityData, entity), files);
      entity = await this.findOne(uid, entity.id, wrappedParams);
    }
    const { ENTRY_CREATE } = ALLOWED_WEBHOOK_EVENTS;
    await this.emitEvent(uid, ENTRY_CREATE, entity);
    return entity;
  },
  // FIXME: used only for the CM to be removed
  async deleteMany(uid, opts) {
    const wrappedParams = await this.wrapParams(opts, { uid, action: "delete" });
    const query = transformParamsToQuery(uid, wrappedParams);
    let entitiesToDelete = await db.query(uid).findMany(query);
    if (!entitiesToDelete.length) {
      return { count: 0 };
    }
    const componentsToDelete = await Promise.all(
      entitiesToDelete.map((entityToDelete) => components.getComponents(uid, entityToDelete))
    );
    const deletedEntities = await db.query(uid).deleteMany(query);
    await Promise.all(
      componentsToDelete.map(
        (compos) => components.deleteComponents(uid, compos, { loadComponents: false })
      )
    );
    entitiesToDelete = await this.wrapResult(entitiesToDelete, { uid, action: "delete" });
    const { ENTRY_DELETE } = ALLOWED_WEBHOOK_EVENTS;
    await Promise.all(entitiesToDelete.map((entity) => this.emitEvent(uid, ENTRY_DELETE, entity)));
    return deletedEntities;
  },
  async load(uid, entity, field, params2) {
    if (!___default.default.isString(field)) {
      throw new Error(`Invalid load. Expected "${field}" to be a string`);
    }
    const loadedEntity = await db.query(uid).load(entity, field, transformLoadParamsToQuery(uid, field, params2 ?? {}));
    return this.wrapResult(loadedEntity, { uid, field, action: "load" });
  },
  async loadPages(uid, entity, field, params2, pagination = {}) {
    if (!___default.default.isString(field)) {
      throw new Error(`Invalid load. Expected "${field}" to be a string`);
    }
    const { attributes } = strapi2.getModel(uid);
    const attribute = attributes[field];
    if (!strapiUtils.relations.isAnyToMany(attribute)) {
      throw new Error(`Invalid load. Expected "${field}" to be an anyToMany relational attribute`);
    }
    const query = transformLoadParamsToQuery(uid, field, params2 ?? {}, pagination);
    const loadedPage = await db.query(uid).loadPages(entity, field, query);
    return {
      ...loadedPage,
      results: await this.wrapResult(loadedPage.results, { uid, field, action: "load" })
    };
  }
});
const createEntityService = (ctx) => {
  Object.entries(ALLOWED_WEBHOOK_EVENTS).forEach(([key, value]) => {
    ctx.strapi.webhookStore?.addAllowedEvent(key, value);
  });
  const implementation = createDefaultImplementation(ctx);
  const service = {
    implementation,
    decorate(decorator) {
      if (typeof decorator !== "function") {
        throw new Error(`Decorator must be a function, received ${typeof decorator}`);
      }
      this.implementation = { ...this.implementation, ...decorator(this.implementation) };
      return this;
    }
  };
  const delegator = delegate__default.default(service, "implementation");
  Object.keys(service.implementation).forEach((key) => delegator.method(key));
  service.decorate((oldService) => {
    const newService = ___default.default.mapValues(
      oldService,
      (method, methodName) => async function(...args) {
        try {
          return await oldService[methodName].call(this, ...args);
        } catch (error) {
          if (databaseErrorsToTransform.some(
            (errorToTransform) => error instanceof errorToTransform
          )) {
            if (error instanceof Error) {
              throw new strapiUtils.errors.ValidationError(error.message);
            }
            throw error;
          }
          throw error;
        }
      }
    );
    return newService;
  });
  return service;
};
module.exports = createEntityService;
//# sourceMappingURL=index.js.map

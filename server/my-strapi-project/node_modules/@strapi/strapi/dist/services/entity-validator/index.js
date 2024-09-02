"use strict";
const _ = require("lodash");
const fp = require("lodash/fp");
const strapiUtils = require("@strapi/utils");
const validators = require("./validators.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const strapiUtils__default = /* @__PURE__ */ _interopDefault(strapiUtils);
const { yup, validateYupSchema } = strapiUtils__default.default;
const { isMediaAttribute, isScalarAttribute, getWritableAttributes } = strapiUtils__default.default.contentTypes;
const { ValidationError } = strapiUtils__default.default.errors;
const isInteger = (value) => Number.isInteger(value);
const addMinMax = (validator, { attr, updatedAttribute }) => {
  let nextValidator = validator;
  if (isInteger(attr.min) && ("required" in attr && attr.required || Array.isArray(updatedAttribute.value) && updatedAttribute.value.length > 0)) {
    nextValidator = nextValidator.min(attr.min);
  }
  if (isInteger(attr.max)) {
    nextValidator = nextValidator.max(attr.max);
  }
  return nextValidator;
};
const addRequiredValidation = (createOrUpdate) => {
  return (validator, { attr: { required } }) => {
    let nextValidator = validator;
    if (required) {
      if (createOrUpdate === "creation") {
        nextValidator = nextValidator.notNil();
      } else if (createOrUpdate === "update") {
        nextValidator = nextValidator.notNull();
      }
    } else {
      nextValidator = nextValidator.nullable();
    }
    return nextValidator;
  };
};
const addDefault = (createOrUpdate) => {
  return (validator, { attr }) => {
    let nextValidator = validator;
    if (createOrUpdate === "creation") {
      if ((attr.type === "component" && attr.repeatable || attr.type === "dynamiczone") && !attr.required) {
        nextValidator = nextValidator.default([]);
      } else {
        nextValidator = nextValidator.default(attr.default);
      }
    } else {
      nextValidator = nextValidator.default(void 0);
    }
    return nextValidator;
  };
};
const preventCast = (validator) => validator.transform((val, originalVal) => originalVal);
const createComponentValidator = (createOrUpdate) => ({ attr, updatedAttribute }, { isDraft }) => {
  const model = strapi.getModel(attr.component);
  if (!model) {
    throw new Error("Validation failed: Model not found");
  }
  if (attr?.repeatable) {
    let validator2 = yup.array().of(
      yup.lazy(
        (item) => createModelValidator(createOrUpdate)({ model, data: item }, { isDraft }).notNull()
      )
    );
    validator2 = addRequiredValidation(createOrUpdate)(validator2, {
      attr: { required: true },
      updatedAttribute
    });
    validator2 = addMinMax(validator2, { attr, updatedAttribute });
    return validator2;
  }
  let validator = createModelValidator(createOrUpdate)(
    { model, data: updatedAttribute.value },
    { isDraft }
  );
  validator = addRequiredValidation(createOrUpdate)(validator, {
    attr: { required: !isDraft && attr.required },
    updatedAttribute
  });
  return validator;
};
const createDzValidator = (createOrUpdate) => ({ attr, updatedAttribute }, { isDraft }) => {
  let validator;
  validator = yup.array().of(
    yup.lazy((item) => {
      const model = strapi.getModel(fp.prop("__component", item));
      const schema = yup.object().shape({
        __component: yup.string().required().oneOf(Object.keys(strapi.components))
      }).notNull();
      return model ? schema.concat(createModelValidator(createOrUpdate)({ model, data: item }, { isDraft })) : schema;
    })
    // FIXME: yup v1
  );
  validator = addRequiredValidation(createOrUpdate)(validator, {
    attr: { required: true },
    updatedAttribute
  });
  validator = addMinMax(validator, { attr, updatedAttribute });
  return validator;
};
const createRelationValidator = (createOrUpdate) => ({ attr, updatedAttribute }, { isDraft }) => {
  let validator;
  if (Array.isArray(updatedAttribute.value)) {
    validator = yup.array().of(yup.mixed());
  } else {
    validator = yup.mixed();
  }
  validator = addRequiredValidation(createOrUpdate)(validator, {
    attr: { required: !isDraft && attr.required },
    updatedAttribute
  });
  return validator;
};
const createScalarAttributeValidator = (createOrUpdate) => (metas, options) => {
  let validator;
  if (fp.has(metas.attr.type, validators)) {
    validator = validators[metas.attr.type](metas, options);
  } else {
    validator = yup.mixed();
  }
  validator = addRequiredValidation(createOrUpdate)(validator, {
    attr: { required: !options.isDraft && metas.attr.required },
    updatedAttribute: metas.updatedAttribute
  });
  return validator;
};
const createAttributeValidator = (createOrUpdate) => (metas, options) => {
  let validator = yup.mixed();
  if (isMediaAttribute(metas.attr)) {
    validator = yup.mixed();
  } else if (isScalarAttribute(metas.attr)) {
    validator = createScalarAttributeValidator(createOrUpdate)(metas, options);
  } else {
    if (metas.attr.type === "component") {
      validator = createComponentValidator(createOrUpdate)(
        { attr: metas.attr, updatedAttribute: metas.updatedAttribute },
        options
      );
    } else if (metas.attr.type === "dynamiczone") {
      validator = createDzValidator(createOrUpdate)(metas, options);
    } else if (metas.attr.type === "relation") {
      validator = createRelationValidator(createOrUpdate)(
        {
          attr: metas.attr,
          updatedAttribute: metas.updatedAttribute
        },
        options
      );
    }
    validator = preventCast(validator);
  }
  validator = addDefault(createOrUpdate)(validator, metas);
  return validator;
};
const createModelValidator = (createOrUpdate) => ({ model, data, entity }, options) => {
  const writableAttributes = model ? getWritableAttributes(model) : [];
  const schema = writableAttributes.reduce((validators2, attributeName) => {
    const metas = {
      attr: model.attributes[attributeName],
      updatedAttribute: { name: attributeName, value: fp.prop(attributeName, data) },
      model,
      entity
    };
    const validator = createAttributeValidator(createOrUpdate)(metas, options);
    validators2[attributeName] = validator;
    return validators2;
  }, {});
  return yup.object().shape(schema);
};
const createValidateEntity = (createOrUpdate) => {
  return async (model, data, options, entity) => {
    if (!fp.isObject(data)) {
      const { displayName } = model.info;
      throw new ValidationError(
        `Invalid payload submitted for the ${createOrUpdate} of an entity of type ${displayName}. Expected an object, but got ${typeof data}`
      );
    }
    const validator = createModelValidator(createOrUpdate)(
      { model, data, entity },
      { isDraft: options?.isDraft ?? false }
    ).test("relations-test", "check that all relations exist", async function(data2) {
      try {
        await checkRelationsExist(buildRelationsStore({ uid: model.uid, data: data2 }));
      } catch (e) {
        return this.createError({
          path: this.path,
          message: e instanceof ValidationError && e.message || "Invalid relations"
        });
      }
      return true;
    }).required();
    return validateYupSchema(validator, {
      strict: false,
      abortEarly: false
    })(data);
  };
};
const buildRelationsStore = ({
  uid,
  data
}) => {
  if (!uid) {
    throw new ValidationError(`Cannot build relations store: "uid" is undefined`);
  }
  if (fp.isEmpty(data)) {
    return {};
  }
  const currentModel = strapi.getModel(uid);
  return Object.keys(currentModel.attributes).reduce((result, attributeName) => {
    const attribute = currentModel.attributes[attributeName];
    const value = data[attributeName];
    if (_.isNil(value)) {
      return result;
    }
    switch (attribute.type) {
      case "relation":
      case "media": {
        if (attribute.type === "relation" && (attribute.relation === "morphToMany" || attribute.relation === "morphToOne")) {
          break;
        }
        const target = (
          // eslint-disable-next-line no-nested-ternary
          attribute.type === "media" ? "plugin::upload.file" : attribute.target
        );
        let source;
        if (Array.isArray(value)) {
          source = value;
        } else if (fp.isObject(value)) {
          if ("connect" in value && !_.isNil(value.connect)) {
            source = value.connect;
          } else if ("set" in value && !_.isNil(value.set)) {
            source = value.set;
          } else {
            source = [];
          }
        } else {
          source = _.castArray(value);
        }
        const idArray = source.map((v) => ({
          id: typeof v === "object" ? v.id : v
        }));
        result[target] = result[target] || [];
        result[target].push(...idArray);
        break;
      }
      case "component": {
        return _.castArray(value).reduce((relationsStore, componentValue) => {
          if (!attribute.component) {
            throw new ValidationError(
              `Cannot build relations store from component, component identifier is undefined`
            );
          }
          return _.mergeWith(
            relationsStore,
            buildRelationsStore({
              uid: attribute.component,
              data: componentValue
            }),
            (objValue, srcValue) => {
              if (_.isArray(objValue)) {
                return objValue.concat(srcValue);
              }
            }
          );
        }, result);
      }
      case "dynamiczone": {
        return _.castArray(value).reduce((relationsStore, dzValue) => {
          const value2 = dzValue;
          if (!value2.__component) {
            throw new ValidationError(
              `Cannot build relations store from dynamiczone, component identifier is undefined`
            );
          }
          return _.mergeWith(
            relationsStore,
            buildRelationsStore({
              uid: value2.__component,
              data: value2
            }),
            (objValue, srcValue) => {
              if (_.isArray(objValue)) {
                return objValue.concat(srcValue);
              }
            }
          );
        }, result);
      }
    }
    return result;
  }, {});
};
const checkRelationsExist = async (relationsStore = {}) => {
  const promises = [];
  for (const [key, value] of Object.entries(relationsStore)) {
    const evaluate = async () => {
      const uniqueValues = _.uniqBy(value, `id`);
      const count = await strapi.query(key).count({
        where: {
          id: {
            $in: uniqueValues.map((v) => v.id)
          }
        }
      });
      if (count !== uniqueValues.length) {
        throw new ValidationError(
          `${uniqueValues.length - count} relation(s) of type ${key} associated with this entity do not exist`
        );
      }
    };
    promises.push(evaluate());
  }
  return Promise.all(promises);
};
const entityValidator = {
  validateEntityCreation: createValidateEntity("creation"),
  validateEntityUpdate: createValidateEntity("update")
};
module.exports = entityValidator;
//# sourceMappingURL=index.js.map

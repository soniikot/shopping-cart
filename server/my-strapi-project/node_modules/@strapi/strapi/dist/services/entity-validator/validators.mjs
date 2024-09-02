import _ from "lodash";
import strapiUtils from "@strapi/utils";
import blocksValidator from "./blocks-validator.mjs";
const { yup } = strapiUtils;
const addMinLengthValidator = (validator, {
  attr
}, { isDraft }) => {
  return attr.minLength && _.isInteger(attr.minLength) && !isDraft ? validator.min(attr.minLength) : validator;
};
const addMaxLengthValidator = (validator, {
  attr
}) => {
  return attr.maxLength && _.isInteger(attr.maxLength) ? validator.max(attr.maxLength) : validator;
};
const addMinIntegerValidator = (validator, {
  attr
}) => _.isNumber(attr.min) ? validator.min(_.toInteger(attr.min)) : validator;
const addMaxIntegerValidator = (validator, {
  attr
}) => _.isNumber(attr.max) ? validator.max(_.toInteger(attr.max)) : validator;
const addMinFloatValidator = (validator, {
  attr
}) => _.isNumber(attr.min) ? validator.min(attr.min) : validator;
const addMaxFloatValidator = (validator, {
  attr
}) => _.isNumber(attr.max) ? validator.max(attr.max) : validator;
const addStringRegexValidator = (validator, {
  attr
}) => {
  return "regex" in attr && !_.isUndefined(attr.regex) ? validator.matches(new RegExp(attr.regex), { excludeEmptyString: !attr.required }) : validator;
};
const addUniqueValidator = (validator, { attr, model, updatedAttribute, entity }) => {
  if (attr.type !== "uid" && !attr.unique) {
    return validator;
  }
  return validator.test("unique", "This attribute must be unique", async (value) => {
    if (_.isNil(updatedAttribute.value)) {
      return true;
    }
    if (entity && updatedAttribute.value === entity[updatedAttribute.name]) {
      return true;
    }
    const whereParams = entity ? { $and: [{ [updatedAttribute.name]: value }, { $not: { id: entity.id } }] } : { [updatedAttribute.name]: value };
    const record = await strapi.query(model.uid).findOne({
      select: ["id"],
      where: whereParams
    });
    return !record;
  });
};
const stringValidator = (metas, options) => {
  let schema = yup.string().transform((val, originalVal) => originalVal);
  schema = addMinLengthValidator(schema, metas, options);
  schema = addMaxLengthValidator(schema, metas);
  schema = addStringRegexValidator(schema, metas);
  schema = addUniqueValidator(schema, metas);
  return schema;
};
const emailValidator = (metas, options) => {
  const schema = stringValidator(metas, options);
  return schema.email().min(1, "${path} cannot be empty");
};
const uidValidator = (metas, options) => {
  const schema = stringValidator(metas, options);
  return schema.matches(/^[A-Za-z0-9-_.~]*$/);
};
const enumerationValidator = ({ attr }) => {
  return yup.string().oneOf((Array.isArray(attr.enum) ? attr.enum : [attr.enum]).concat(null));
};
const integerValidator = (metas) => {
  let schema = yup.number().integer();
  schema = addMinIntegerValidator(schema, metas);
  schema = addMaxIntegerValidator(schema, metas);
  schema = addUniqueValidator(schema, metas);
  return schema;
};
const floatValidator = (metas) => {
  let schema = yup.number();
  schema = addMinFloatValidator(schema, metas);
  schema = addMaxFloatValidator(schema, metas);
  schema = addUniqueValidator(schema, metas);
  return schema;
};
const bigintegerValidator = (metas) => {
  const schema = yup.mixed();
  return addUniqueValidator(schema, metas);
};
const datesValidator = (metas) => {
  const schema = yup.mixed();
  return addUniqueValidator(schema, metas);
};
const validators = {
  string: stringValidator,
  text: stringValidator,
  richtext: stringValidator,
  password: stringValidator,
  email: emailValidator,
  enumeration: enumerationValidator,
  boolean: () => yup.boolean(),
  uid: uidValidator,
  json: () => yup.mixed(),
  integer: integerValidator,
  biginteger: bigintegerValidator,
  float: floatValidator,
  decimal: floatValidator,
  date: datesValidator,
  time: datesValidator,
  datetime: datesValidator,
  timestamp: datesValidator,
  blocks: blocksValidator
};
export {
  validators as default
};
//# sourceMappingURL=validators.mjs.map

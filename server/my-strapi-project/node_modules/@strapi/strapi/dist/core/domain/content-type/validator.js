"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const _ = require("lodash");
const strapiUtils = require("@strapi/utils");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const ___default = /* @__PURE__ */ _interopDefault(_);
const LIFECYCLES = [
  "beforeCreate",
  "afterCreate",
  "beforeFindOne",
  "afterFindOne",
  "beforeFindMany",
  "afterFindMany",
  "beforeCount",
  "afterCount",
  "beforeCreateMany",
  "afterCreateMany",
  "beforeUpdate",
  "afterUpdate",
  "beforeUpdateMany",
  "afterUpdateMany",
  "beforeDelete",
  "afterDelete",
  "beforeDeleteMany",
  "afterDeleteMany"
];
const GRAPHQL_ENUM_REGEX = /^[_A-Za-z][_0-9A-Za-z]*$/;
const lifecyclesShape = ___default.default.mapValues(___default.default.keyBy(LIFECYCLES), () => strapiUtils.yup.mixed().nullable().isFunction());
const contentTypeSchemaValidator = strapiUtils.yup.object().shape({
  schema: strapiUtils.yup.object().shape({
    info: strapiUtils.yup.object().shape({
      displayName: strapiUtils.yup.string().required(),
      singularName: strapiUtils.yup.string().isKebabCase().required(),
      pluralName: strapiUtils.yup.string().isKebabCase().required()
    }).required(),
    attributes: strapiUtils.yup.object().test({
      name: "valuesCollide",
      message: "Some values collide when normalized",
      test(attributes) {
        for (const attrName of Object.keys(attributes)) {
          const attr = attributes[attrName];
          if (attr.type === "enumeration") {
            const regressedValues = attr.enum.map(strapiUtils.toRegressedEnumValue);
            if (!regressedValues.every((value) => GRAPHQL_ENUM_REGEX.test(value))) {
              const message = `Invalid enumeration value. Values should have at least one alphabetical character preceding the first occurence of a number. Update your enumeration '${attrName}'.`;
              return this.createError({ message });
            }
            if (regressedValues.some((value) => value === "")) {
              return this.createError({
                message: `At least one value of the enumeration '${attrName}' appears to be empty. Only alphanumerical characters are taken into account.`
              });
            }
            const duplicates = ___default.default.uniq(
              regressedValues.filter(
                (value, index, values) => values.indexOf(value) !== index
              )
            );
            if (duplicates.length) {
              const message = `Some enumeration values of the field '${attrName}' collide when normalized: ${duplicates.join(
                ", "
              )}. Please modify your enumeration.`;
              return this.createError({ message });
            }
          }
        }
        return true;
      }
    })
  }),
  actions: strapiUtils.yup.object().onlyContainsFunctions(),
  lifecycles: strapiUtils.yup.object().shape(lifecyclesShape).noUnknown()
});
const validateContentTypeDefinition = (data) => {
  return contentTypeSchemaValidator.validateSync(data, { strict: true, abortEarly: false });
};
exports.validateContentTypeDefinition = validateContentTypeDefinition;
//# sourceMappingURL=validator.js.map

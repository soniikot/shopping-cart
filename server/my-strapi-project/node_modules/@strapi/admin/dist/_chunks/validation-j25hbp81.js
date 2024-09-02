"use strict";
const helperPlugin = require("@strapi/helper-plugin");
const yup = require("yup");
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
const yup__namespace = /* @__PURE__ */ _interopNamespace(yup);
const COMMON_USER_SCHEMA = {
  firstname: yup__namespace.string().trim().required(helperPlugin.translatedErrors.required),
  lastname: yup__namespace.string(),
  email: yup__namespace.string().email(helperPlugin.translatedErrors.email).lowercase().required(helperPlugin.translatedErrors.required),
  username: yup__namespace.string().nullable(),
  password: yup__namespace.string().min(8, helperPlugin.translatedErrors.minLength).matches(/[a-z]/, "components.Input.error.contain.lowercase").matches(/[A-Z]/, "components.Input.error.contain.uppercase").matches(/\d/, "components.Input.error.contain.number"),
  confirmPassword: yup__namespace.string().min(8, helperPlugin.translatedErrors.minLength).oneOf([yup__namespace.ref("password"), null], "components.Input.error.password.noMatch").when("password", (password, passSchema) => {
    return password ? passSchema.required(helperPlugin.translatedErrors.required) : passSchema;
  })
};
exports.COMMON_USER_SCHEMA = COMMON_USER_SCHEMA;
//# sourceMappingURL=validation-j25hbp81.js.map

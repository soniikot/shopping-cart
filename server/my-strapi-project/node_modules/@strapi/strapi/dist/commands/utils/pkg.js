"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const fs = require("fs/promises");
const os = require("os");
const pkgUp = require("pkg-up");
const yup = require("yup");
const chalk = require("chalk");
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
const fs__default = /* @__PURE__ */ _interopDefault(fs);
const os__default = /* @__PURE__ */ _interopDefault(os);
const pkgUp__default = /* @__PURE__ */ _interopDefault(pkgUp);
const yup__namespace = /* @__PURE__ */ _interopNamespace(yup);
const chalk__default = /* @__PURE__ */ _interopDefault(chalk);
const packageJsonSchema = yup__namespace.object({
  name: yup__namespace.string().required(),
  exports: yup__namespace.lazy(
    (value) => yup__namespace.object(
      typeof value === "object" ? Object.entries(value).reduce((acc, [key, value2]) => {
        if (typeof value2 === "object") {
          acc[key] = yup__namespace.object({
            types: yup__namespace.string().optional(),
            source: yup__namespace.string().required(),
            module: yup__namespace.string().optional(),
            import: yup__namespace.string().required(),
            require: yup__namespace.string().required(),
            default: yup__namespace.string().required()
          }).noUnknown(true);
        } else {
          acc[key] = yup__namespace.string().matches(/^\.\/.*\.json$/).required();
        }
        return acc;
      }, {}) : void 0
    ).optional()
  )
});
const loadPkg = async ({ cwd, logger }) => {
  const pkgPath = await pkgUp__default.default({ cwd });
  if (!pkgPath) {
    throw new Error("Could not find a package.json in the current directory");
  }
  const buffer = await fs__default.default.readFile(pkgPath);
  const pkg = JSON.parse(buffer.toString());
  logger.debug("Loaded package.json:", os__default.default.EOL, pkg);
  return pkg;
};
const validatePkg = async ({ pkg }) => {
  try {
    const validatedPkg = await packageJsonSchema.validate(pkg, {
      strict: true
    });
    return validatedPkg;
  } catch (err) {
    if (err instanceof yup__namespace.ValidationError) {
      switch (err.type) {
        case "required":
          if (err.path) {
            throw new Error(
              `'${err.path}' in 'package.json' is required as type '${chalk__default.default.magenta(
                yup__namespace.reach(packageJsonSchema, err.path).type
              )}'`
            );
          }
          break;
        case "noUnknown":
          if (err.path && err.params && "unknown" in err.params) {
            throw new Error(
              `'${err.path}' in 'package.json' contains the unknown key ${chalk__default.default.magenta(
                err.params.unknown
              )}, for compatability only the following keys are allowed: ${chalk__default.default.magenta(
                "['types', 'source', 'import', 'require', 'default']"
              )}`
            );
          }
          break;
        default:
          if (err.path && err.params && "type" in err.params && "value" in err.params) {
            throw new Error(
              `'${err.path}' in 'package.json' must be of type '${chalk__default.default.magenta(
                err.params.type
              )}' (recieved '${chalk__default.default.magenta(typeof err.params.value)}')`
            );
          }
      }
    }
    throw err;
  }
};
exports.loadPkg = loadPkg;
exports.validatePkg = validatePkg;
//# sourceMappingURL=pkg.js.map

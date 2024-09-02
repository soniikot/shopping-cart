"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const _ = require("lodash/fp");
const qs = require("qs");
const utils = require("@strapi/utils");
const sift = require("sift");
const ability = require("@casl/ability");
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
const qs__default = /* @__PURE__ */ _interopDefault(qs);
const sift__namespace = /* @__PURE__ */ _interopNamespace(sift);
const PERMISSION_FIELDS = ["action", "subject", "properties", "conditions"];
const sanitizePermissionFields = ___default.default.pick(PERMISSION_FIELDS);
const getDefaultPermission = () => ({
  conditions: [],
  properties: {},
  subject: null
});
const create = ___default.default.pipe(___default.default.pick(PERMISSION_FIELDS), ___default.default.merge(getDefaultPermission()));
const addCondition = ___default.default.curry((condition, permission) => {
  const { conditions } = permission;
  const newConditions = Array.isArray(conditions) ? ___default.default.uniq(conditions.concat(condition)) : [condition];
  return ___default.default.set("conditions", newConditions, permission);
});
const getProperty = ___default.default.curry(
  (property, permission) => ___default.default.get(`properties.${property}`, permission)
);
const index$3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  addCondition,
  create,
  getProperty,
  sanitizePermissionFields
}, Symbol.toStringTag, { value: "Module" }));
const index$2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  permission: index$3
}, Symbol.toStringTag, { value: "Module" }));
const createEngineHooks = () => ({
  "before-format::validate.permission": utils.hooks.createAsyncBailHook(),
  "format.permission": utils.hooks.createAsyncSeriesWaterfallHook(),
  "after-format::validate.permission": utils.hooks.createAsyncBailHook(),
  "before-evaluate.permission": utils.hooks.createAsyncSeriesHook(),
  "before-register.permission": utils.hooks.createAsyncSeriesHook()
});
const createValidateContext = (permission) => ({
  get permission() {
    return _.cloneDeep(permission);
  }
});
const createBeforeEvaluateContext = (permission) => ({
  get permission() {
    return _.cloneDeep(permission);
  },
  addCondition(condition) {
    Object.assign(permission, addCondition(condition, permission));
    return this;
  }
});
const createWillRegisterContext = ({ permission, options }) => ({
  ...options,
  get permission() {
    return _.cloneDeep(permission);
  },
  condition: {
    and(rawConditionObject) {
      if (!permission.condition) {
        permission.condition = { $and: [] };
      }
      if (_.isArray(permission.condition.$and)) {
        permission.condition.$and.push(rawConditionObject);
      }
      return this;
    },
    or(rawConditionObject) {
      if (!permission.condition) {
        permission.condition = { $and: [] };
      }
      if (_.isArray(permission.condition.$and)) {
        const orClause = permission.condition.$and.find(_.has("$or"));
        if (orClause) {
          orClause.$or.push(rawConditionObject);
        } else {
          permission.condition.$and.push({ $or: [rawConditionObject] });
        }
      }
      return this;
    }
  }
});
const allowedOperations = [
  "$or",
  "$and",
  "$eq",
  "$ne",
  "$in",
  "$nin",
  "$lt",
  "$lte",
  "$gt",
  "$gte",
  "$exists",
  "$elemMatch"
];
const operations = _.pick(allowedOperations, sift__namespace);
const conditionsMatcher = (conditions) => {
  return sift__namespace.createQueryTester(conditions, { operations });
};
const buildParametrizedAction = ({ name, params }) => {
  return `${name}?${qs__default.default.stringify(params)}`;
};
const caslAbilityBuilder = () => {
  const { can, build, ...rest } = new ability.AbilityBuilder(ability.Ability);
  return {
    can(permission) {
      const { action, subject, properties = {}, condition } = permission;
      const { fields } = properties;
      const caslAction = typeof action === "string" ? action : buildParametrizedAction(action);
      return can(
        caslAction,
        _.isNil(subject) ? "all" : subject,
        fields,
        _.isObject(condition) ? condition : void 0
      );
    },
    buildParametrizedAction({ name, params }) {
      return `${name}?${qs__default.default.stringify(params)}`;
    },
    build() {
      const ability2 = build({ conditionsMatcher });
      function decorateCan(originalCan) {
        return function(...args) {
          const [action, ...rest2] = args;
          const caslAction = typeof action === "string" ? action : buildParametrizedAction(action);
          return originalCan.apply(ability2, [caslAction, ...rest2]);
        };
      }
      ability2.can = decorateCan(ability2.can);
      return ability2;
    },
    ...rest
  };
};
const index$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  caslAbilityBuilder
}, Symbol.toStringTag, { value: "Module" }));
const createEngineState = () => {
  const hooks = createEngineHooks();
  return { hooks };
};
const newEngine = (params) => {
  const { providers, abilityBuilderFactory = caslAbilityBuilder } = params;
  const state = createEngineState();
  const runValidationHook = async (hook, context) => state.hooks[hook].call(context);
  const evaluate = async (params2) => {
    const { options, register } = params2;
    const preFormatValidation = await runValidationHook(
      "before-format::validate.permission",
      createBeforeEvaluateContext(params2.permission)
    );
    if (preFormatValidation === false) {
      return;
    }
    const permission = await state.hooks["format.permission"].call(
      params2.permission
    );
    const afterFormatValidation = await runValidationHook(
      "after-format::validate.permission",
      createValidateContext(permission)
    );
    if (afterFormatValidation === false) {
      return;
    }
    await state.hooks["before-evaluate.permission"].call(createBeforeEvaluateContext(permission));
    const {
      action: actionName,
      subject,
      properties,
      conditions = [],
      actionParameters = {}
    } = permission;
    let action = actionName;
    if (actionParameters && Object.keys(actionParameters).length > 0) {
      action = `${actionName}?${qs__default.default.stringify(actionParameters)}`;
    }
    if (conditions.length === 0) {
      return register({ action, subject, properties });
    }
    const resolveConditions = ___default.default.map(providers.condition.get);
    const removeInvalidConditions = ___default.default.filter(
      (condition) => ___default.default.isFunction(condition.handler)
    );
    const evaluateConditions = (conditions2) => {
      return Promise.all(
        conditions2.map(async (condition) => ({
          condition,
          result: await condition.handler(
            ___default.default.merge(options, { permission: ___default.default.cloneDeep(permission) })
          )
        }))
      );
    };
    const removeInvalidResults = ___default.default.filter(
      ({ result }) => ___default.default.isBoolean(result) || ___default.default.isObject(result)
    );
    const evaluatedConditions = await Promise.resolve(conditions).then(resolveConditions).then(removeInvalidConditions).then(evaluateConditions).then(removeInvalidResults);
    const resultPropEq = ___default.default.propEq("result");
    const pickResults = ___default.default.map(___default.default.prop("result"));
    if (evaluatedConditions.every(resultPropEq(false))) {
      return;
    }
    if (___default.default.isEmpty(evaluatedConditions) || evaluatedConditions.some(resultPropEq(true))) {
      return register({ action, subject, properties });
    }
    const results = pickResults(evaluatedConditions).filter(___default.default.isObject);
    if (___default.default.isEmpty(results)) {
      return register({ action, subject, properties });
    }
    return register({
      action,
      subject,
      properties,
      condition: { $and: [{ $or: results }] }
    });
  };
  return {
    get hooks() {
      return state.hooks;
    },
    /**
     * Create a register function that wraps a `can` function
     * used to register a permission in the ability builder
     */
    createRegisterFunction(can, options) {
      return async (permission) => {
        const hookContext = createWillRegisterContext({ options, permission });
        await state.hooks["before-register.permission"].call(hookContext);
        return can(permission);
      };
    },
    /**
     * Register a new handler for a given hook
     */
    on(hook, handler) {
      const validHooks = Object.keys(state.hooks);
      const isValidHook = validHooks.includes(hook);
      if (!isValidHook) {
        throw new Error(
          `Invalid hook supplied when trying to register an handler to the permission engine. Got "${hook}" but expected one of ${validHooks.join(
            ", "
          )}`
        );
      }
      state.hooks[hook].register(handler);
      return this;
    },
    /**
     * Generate an ability based on the instance's
     * ability builder and the given permissions
     */
    async generateAbility(permissions, options = {}) {
      const { can, build } = abilityBuilderFactory();
      for (const permission of permissions) {
        const register = this.createRegisterFunction(can, options);
        await evaluate({ permission, options, register });
      }
      return build();
    }
  };
};
const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  abilities: index$1,
  new: newEngine
}, Symbol.toStringTag, { value: "Module" }));
exports.domain = index$2;
exports.engine = index;
//# sourceMappingURL=index.js.map

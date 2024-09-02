import _, { cloneDeep, isArray, has, pick, isNil, isObject } from "lodash/fp";
import qs from "qs";
import { hooks } from "@strapi/utils";
import * as sift from "sift";
import { AbilityBuilder, Ability } from "@casl/ability";
const PERMISSION_FIELDS = ["action", "subject", "properties", "conditions"];
const sanitizePermissionFields = _.pick(PERMISSION_FIELDS);
const getDefaultPermission = () => ({
  conditions: [],
  properties: {},
  subject: null
});
const create = _.pipe(_.pick(PERMISSION_FIELDS), _.merge(getDefaultPermission()));
const addCondition = _.curry((condition, permission) => {
  const { conditions } = permission;
  const newConditions = Array.isArray(conditions) ? _.uniq(conditions.concat(condition)) : [condition];
  return _.set("conditions", newConditions, permission);
});
const getProperty = _.curry(
  (property, permission) => _.get(`properties.${property}`, permission)
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
  "before-format::validate.permission": hooks.createAsyncBailHook(),
  "format.permission": hooks.createAsyncSeriesWaterfallHook(),
  "after-format::validate.permission": hooks.createAsyncBailHook(),
  "before-evaluate.permission": hooks.createAsyncSeriesHook(),
  "before-register.permission": hooks.createAsyncSeriesHook()
});
const createValidateContext = (permission) => ({
  get permission() {
    return cloneDeep(permission);
  }
});
const createBeforeEvaluateContext = (permission) => ({
  get permission() {
    return cloneDeep(permission);
  },
  addCondition(condition) {
    Object.assign(permission, addCondition(condition, permission));
    return this;
  }
});
const createWillRegisterContext = ({ permission, options }) => ({
  ...options,
  get permission() {
    return cloneDeep(permission);
  },
  condition: {
    and(rawConditionObject) {
      if (!permission.condition) {
        permission.condition = { $and: [] };
      }
      if (isArray(permission.condition.$and)) {
        permission.condition.$and.push(rawConditionObject);
      }
      return this;
    },
    or(rawConditionObject) {
      if (!permission.condition) {
        permission.condition = { $and: [] };
      }
      if (isArray(permission.condition.$and)) {
        const orClause = permission.condition.$and.find(has("$or"));
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
const operations = pick(allowedOperations, sift);
const conditionsMatcher = (conditions) => {
  return sift.createQueryTester(conditions, { operations });
};
const buildParametrizedAction = ({ name, params }) => {
  return `${name}?${qs.stringify(params)}`;
};
const caslAbilityBuilder = () => {
  const { can, build, ...rest } = new AbilityBuilder(Ability);
  return {
    can(permission) {
      const { action, subject, properties = {}, condition } = permission;
      const { fields } = properties;
      const caslAction = typeof action === "string" ? action : buildParametrizedAction(action);
      return can(
        caslAction,
        isNil(subject) ? "all" : subject,
        fields,
        isObject(condition) ? condition : void 0
      );
    },
    buildParametrizedAction({ name, params }) {
      return `${name}?${qs.stringify(params)}`;
    },
    build() {
      const ability = build({ conditionsMatcher });
      function decorateCan(originalCan) {
        return function(...args) {
          const [action, ...rest2] = args;
          const caslAction = typeof action === "string" ? action : buildParametrizedAction(action);
          return originalCan.apply(ability, [caslAction, ...rest2]);
        };
      }
      ability.can = decorateCan(ability.can);
      return ability;
    },
    ...rest
  };
};
const index$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  caslAbilityBuilder
}, Symbol.toStringTag, { value: "Module" }));
const createEngineState = () => {
  const hooks2 = createEngineHooks();
  return { hooks: hooks2 };
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
      action = `${actionName}?${qs.stringify(actionParameters)}`;
    }
    if (conditions.length === 0) {
      return register({ action, subject, properties });
    }
    const resolveConditions = _.map(providers.condition.get);
    const removeInvalidConditions = _.filter(
      (condition) => _.isFunction(condition.handler)
    );
    const evaluateConditions = (conditions2) => {
      return Promise.all(
        conditions2.map(async (condition) => ({
          condition,
          result: await condition.handler(
            _.merge(options, { permission: _.cloneDeep(permission) })
          )
        }))
      );
    };
    const removeInvalidResults = _.filter(
      ({ result }) => _.isBoolean(result) || _.isObject(result)
    );
    const evaluatedConditions = await Promise.resolve(conditions).then(resolveConditions).then(removeInvalidConditions).then(evaluateConditions).then(removeInvalidResults);
    const resultPropEq = _.propEq("result");
    const pickResults = _.map(_.prop("result"));
    if (evaluatedConditions.every(resultPropEq(false))) {
      return;
    }
    if (_.isEmpty(evaluatedConditions) || evaluatedConditions.some(resultPropEq(true))) {
      return register({ action, subject, properties });
    }
    const results = pickResults(evaluatedConditions).filter(_.isObject);
    if (_.isEmpty(results)) {
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
export {
  index$2 as domain,
  index as engine
};
//# sourceMappingURL=index.mjs.map

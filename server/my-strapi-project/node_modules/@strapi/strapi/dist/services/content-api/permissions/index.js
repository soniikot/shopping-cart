"use strict";
const _ = require("lodash");
const action = require("./providers/action.js");
const condition = require("./providers/condition.js");
const engine = require("./engine.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const ___default = /* @__PURE__ */ _interopDefault(_);
const typeSymbol = Symbol.for("__type__");
const createValidatePermissionHandler = (actionProvider) => ({ permission }) => {
  const action2 = actionProvider.get(permission.action);
  if (!action2) {
    strapi.log.debug(
      `Unknown action "${permission.action}" supplied when registering a new permission`
    );
    return false;
  }
  return true;
};
const instantiatePermissionsUtilities = (strapi2) => {
  const providers = {
    action: action(),
    condition: condition()
  };
  const getActionsMap = () => {
    const actionMap = {};
    const isContentApi = (action2) => {
      if (!___default.default.has(action2, typeSymbol)) {
        return false;
      }
      return action2[typeSymbol].includes("content-api");
    };
    const registerAPIsActions = (apis, source) => {
      ___default.default.forEach(apis, (api, apiName) => {
        const controllers = ___default.default.reduce(
          api.controllers,
          (acc, controller, controllerName) => {
            const contentApiActions = ___default.default.pickBy(controller, isContentApi);
            if (___default.default.isEmpty(contentApiActions)) {
              return acc;
            }
            acc[controllerName] = Object.keys(contentApiActions);
            return acc;
          },
          {}
        );
        if (!___default.default.isEmpty(controllers)) {
          actionMap[`${source}::${apiName}`] = { controllers };
        }
      });
    };
    registerAPIsActions(strapi2.api, "api");
    registerAPIsActions(strapi2.plugins, "plugin");
    return actionMap;
  };
  const registerActions = async () => {
    const actionsMap = getActionsMap();
    for (const [api, value] of Object.entries(actionsMap)) {
      const { controllers } = value;
      for (const [controller, actions] of Object.entries(controllers)) {
        await Promise.all(
          actions.map((action2) => {
            const actionUID = `${api}.${controller}.${action2}`;
            return providers.action.register(actionUID, {
              api,
              controller,
              action: action2,
              uid: actionUID
            });
          })
        );
      }
    }
  };
  const engine$1 = engine({ providers });
  engine$1.on(
    "before-format::validate.permission",
    createValidatePermissionHandler(providers.action)
  );
  return {
    engine: engine$1,
    providers,
    registerActions,
    getActionsMap
  };
};
module.exports = instantiatePermissionsUtilities;
//# sourceMappingURL=index.js.map

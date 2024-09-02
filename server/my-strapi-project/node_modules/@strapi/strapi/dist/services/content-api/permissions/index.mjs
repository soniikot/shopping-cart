import _ from "lodash";
import createActionProvider from "./providers/action.mjs";
import createConditionProvider from "./providers/condition.mjs";
import createPermissionEngine from "./engine.mjs";
const typeSymbol = Symbol.for("__type__");
const createValidatePermissionHandler = (actionProvider) => ({ permission }) => {
  const action = actionProvider.get(permission.action);
  if (!action) {
    strapi.log.debug(
      `Unknown action "${permission.action}" supplied when registering a new permission`
    );
    return false;
  }
  return true;
};
const instantiatePermissionsUtilities = (strapi2) => {
  const providers = {
    action: createActionProvider(),
    condition: createConditionProvider()
  };
  const getActionsMap = () => {
    const actionMap = {};
    const isContentApi = (action) => {
      if (!_.has(action, typeSymbol)) {
        return false;
      }
      return action[typeSymbol].includes("content-api");
    };
    const registerAPIsActions = (apis, source) => {
      _.forEach(apis, (api, apiName) => {
        const controllers = _.reduce(
          api.controllers,
          (acc, controller, controllerName) => {
            const contentApiActions = _.pickBy(controller, isContentApi);
            if (_.isEmpty(contentApiActions)) {
              return acc;
            }
            acc[controllerName] = Object.keys(contentApiActions);
            return acc;
          },
          {}
        );
        if (!_.isEmpty(controllers)) {
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
          actions.map((action) => {
            const actionUID = `${api}.${controller}.${action}`;
            return providers.action.register(actionUID, {
              api,
              controller,
              action,
              uid: actionUID
            });
          })
        );
      }
    }
  };
  const engine = createPermissionEngine({ providers });
  engine.on(
    "before-format::validate.permission",
    createValidatePermissionHandler(providers.action)
  );
  return {
    engine,
    providers,
    registerActions,
    getActionsMap
  };
};
export {
  instantiatePermissionsUtilities as default
};
//# sourceMappingURL=index.mjs.map

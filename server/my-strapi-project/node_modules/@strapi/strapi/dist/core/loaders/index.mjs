import loadSrcIndex from "./src-index.mjs";
import loadAPIs from "./apis.mjs";
import loadMiddlewares from "./middlewares.mjs";
import loadComponents from "./components.mjs";
import loadPolicies from "./policies.mjs";
import loadPlugins from "./plugins/index.mjs";
import loadAdmin from "./admin.mjs";
import loadSanitizers from "./sanitizers.mjs";
import loadValidators from "./validators.mjs";
const loaders = {
  loadSrcIndex,
  loadAPIs,
  loadMiddlewares,
  loadComponents,
  loadPolicies,
  loadPlugins,
  loadAdmin,
  loadSanitizers,
  loadValidators
};
export {
  loaders as default
};
//# sourceMappingURL=index.mjs.map

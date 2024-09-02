"use strict";
const srcIndex = require("./src-index.js");
const apis = require("./apis.js");
const middlewares = require("./middlewares.js");
const components = require("./components.js");
const policies = require("./policies.js");
const index = require("./plugins/index.js");
const admin = require("./admin.js");
const sanitizers = require("./sanitizers.js");
const validators = require("./validators.js");
const loaders = {
  loadSrcIndex: srcIndex,
  loadAPIs: apis,
  loadMiddlewares: middlewares,
  loadComponents: components,
  loadPolicies: policies,
  loadPlugins: index,
  loadAdmin: admin,
  loadSanitizers: sanitizers,
  loadValidators: validators
};
module.exports = loaders;
//# sourceMappingURL=index.js.map

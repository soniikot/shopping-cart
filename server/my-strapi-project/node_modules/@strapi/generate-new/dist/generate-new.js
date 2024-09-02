"use strict";
const usage = require("./utils/usage.js");
const checkInstallPath = require("./utils/check-install-path.js");
const createCliDbProject = require("./create-cli-db-project.js");
const createCustomizedProject = require("./create-customized-project.js");
const createQuickstartProject = require("./create-quickstart-project.js");
const generateNew = async (scope) => {
  const hasDatabaseConfig = Boolean(scope.database);
  checkInstallPath(scope.rootPath);
  await usage.trackUsage({ event: "willCreateProject", scope });
  if (hasDatabaseConfig) {
    return createCliDbProject(scope);
  }
  if (scope.quick === true) {
    return createQuickstartProject(scope);
  }
  return createCustomizedProject(scope);
};
module.exports = generateNew;
//# sourceMappingURL=generate-new.js.map

"use strict";
const _ = require("lodash");
const usage = require("./utils/usage.js");
const dbConfigs = require("./utils/db-configs.js");
const dbClientDependencies = require("./utils/db-client-dependencies.js");
const dbClientName = require("./utils/db-client-name.js");
const createProject = require("./create-project.js");
const createCLIDatabaseProject = async (scope) => {
  console.log("Creating a project from the database CLI arguments.");
  await usage.trackUsage({ event: "didChooseCustomDatabase", scope });
  const { client } = scope.database ?? {};
  if (!client) {
    throw new Error("Missing client");
  }
  const configuration = {
    client: dbClientName({ client }),
    connection: _.merge(
      {},
      dbConfigs[client] || {},
      scope.database
    ),
    dependencies: {
      ...dbClientDependencies({ scope, client }),
      ...scope.additionalsDependencies
    }
  };
  return createProject(scope, configuration);
};
module.exports = createCLIDatabaseProject;
//# sourceMappingURL=create-cli-db-project.js.map

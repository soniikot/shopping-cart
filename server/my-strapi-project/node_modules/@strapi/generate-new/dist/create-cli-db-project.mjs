import { merge } from "lodash";
import { trackUsage } from "./utils/usage.mjs";
import defaultConfigs from "./utils/db-configs.mjs";
import clientDependencies from "./utils/db-client-dependencies.mjs";
import getClientName from "./utils/db-client-name.mjs";
import createProject from "./create-project.mjs";
const createCLIDatabaseProject = async (scope) => {
  console.log("Creating a project from the database CLI arguments.");
  await trackUsage({ event: "didChooseCustomDatabase", scope });
  const { client } = scope.database ?? {};
  if (!client) {
    throw new Error("Missing client");
  }
  const configuration = {
    client: getClientName({ client }),
    connection: merge(
      {},
      defaultConfigs[client] || {},
      scope.database
    ),
    dependencies: {
      ...clientDependencies({ scope, client }),
      ...scope.additionalsDependencies
    }
  };
  return createProject(scope, configuration);
};
export {
  createCLIDatabaseProject as default
};
//# sourceMappingURL=create-cli-db-project.mjs.map

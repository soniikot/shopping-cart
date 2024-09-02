"use strict";
const execa = require("execa");
const usage = require("./utils/usage.js");
const dbConfigs = require("./utils/db-configs.js");
const dbClientDependencies = require("./utils/db-client-dependencies.js");
const createProject = require("./create-project.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const execa__default = /* @__PURE__ */ _interopDefault(execa);
async function createQuickStartProject(scope) {
  console.log("Creating a quickstart project.");
  await usage.trackUsage({ event: "didChooseQuickstart", scope });
  const client = "sqlite";
  const configuration = {
    client,
    connection: dbConfigs[client],
    dependencies: { ...dbClientDependencies({ client }), ...scope.additionalsDependencies }
  };
  await createProject(scope, configuration);
  if (scope.runQuickstartApp !== true)
    return;
  console.log(`Running your Strapi application.`);
  try {
    await usage.trackUsage({ event: "willStartServer", scope });
    await execa__default.default("npm", ["run", "develop"], {
      stdio: "inherit",
      cwd: scope.rootPath,
      env: {
        FORCE_COLOR: "1"
      }
    });
  } catch (error) {
    if (typeof error === "string" || error instanceof Error) {
      await usage.trackUsage({
        event: "didNotStartServer",
        scope,
        error
      });
      await usage.captureStderr("didNotStartServer", error);
    }
    process.exit(1);
  }
}
module.exports = createQuickStartProject;
//# sourceMappingURL=create-quickstart-project.js.map

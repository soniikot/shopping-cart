import execa from "execa";
import { trackUsage, captureStderr } from "./utils/usage.mjs";
import defaultConfigs from "./utils/db-configs.mjs";
import clientDependencies from "./utils/db-client-dependencies.mjs";
import createProject from "./create-project.mjs";
async function createQuickStartProject(scope) {
  console.log("Creating a quickstart project.");
  await trackUsage({ event: "didChooseQuickstart", scope });
  const client = "sqlite";
  const configuration = {
    client,
    connection: defaultConfigs[client],
    dependencies: { ...clientDependencies({ client }), ...scope.additionalsDependencies }
  };
  await createProject(scope, configuration);
  if (scope.runQuickstartApp !== true)
    return;
  console.log(`Running your Strapi application.`);
  try {
    await trackUsage({ event: "willStartServer", scope });
    await execa("npm", ["run", "develop"], {
      stdio: "inherit",
      cwd: scope.rootPath,
      env: {
        FORCE_COLOR: "1"
      }
    });
  } catch (error) {
    if (typeof error === "string" || error instanceof Error) {
      await trackUsage({
        event: "didNotStartServer",
        scope,
        error
      });
      await captureStderr("didNotStartServer", error);
    }
    process.exit(1);
  }
}
export {
  createQuickStartProject as default
};
//# sourceMappingURL=create-quickstart-project.mjs.map

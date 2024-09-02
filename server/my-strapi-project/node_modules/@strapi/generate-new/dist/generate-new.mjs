import { trackUsage } from "./utils/usage.mjs";
import checkInstallPath from "./utils/check-install-path.mjs";
import createCLIDatabaseProject from "./create-cli-db-project.mjs";
import createCustomizedProject from "./create-customized-project.mjs";
import createQuickStartProject from "./create-quickstart-project.mjs";
const generateNew = async (scope) => {
  const hasDatabaseConfig = Boolean(scope.database);
  checkInstallPath(scope.rootPath);
  await trackUsage({ event: "willCreateProject", scope });
  if (hasDatabaseConfig) {
    return createCLIDatabaseProject(scope);
  }
  if (scope.quick === true) {
    return createQuickStartProject(scope);
  }
  return createCustomizedProject(scope);
};
export {
  generateNew as default
};
//# sourceMappingURL=generate-new.mjs.map

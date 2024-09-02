"use strict";
const os = require("os");
const Strapi = require("../../../Strapi.js");
const action = async ({ uuid, dependencies, all }) => {
  const config = {
    reportUUID: Boolean(all || uuid),
    reportDependencies: Boolean(all || dependencies)
  };
  const appContext = await Strapi.compile();
  const app = await Strapi(appContext).register();
  let debugInfo = `Launched In: ${Date.now() - app.config.launchedAt} ms
Environment: ${app.config.environment}
OS: ${process.platform}-${process.arch}
Strapi Version: ${app.config.info.strapi}
Node/Yarn Version: ${process.env.npm_config_user_agent}
Edition: ${app.EE ? "Enterprise" : "Community"}
Database: ${app?.config?.database?.connection?.client ?? "unknown"}`;
  if (config.reportUUID) {
    debugInfo += `${os.EOL}UUID: ${app.config.uuid}`;
  }
  if (config.reportDependencies) {
    debugInfo += `${os.EOL}Dependencies: ${JSON.stringify(app.config.info.dependencies, null, 2)}
Dev Dependencies: ${JSON.stringify(app.config.info.devDependencies, null, 2)}`;
  }
  console.log(debugInfo);
  await app.destroy();
};
module.exports = action;
//# sourceMappingURL=action.js.map

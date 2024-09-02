"use strict";
const tsUtils = require("@strapi/typescript-utils");
const Strapi = require("../../../../Strapi.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const tsUtils__default = /* @__PURE__ */ _interopDefault(tsUtils);
const action = async ({ debug, silent, verbose, outDir }) => {
  if ((debug || verbose) && silent) {
    console.error("Flags conflict: both silent and debug mode are enabled, exiting...");
    process.exit(1);
  }
  const appContext = await Strapi.compile({ ignoreDiagnostics: true });
  const app = await Strapi(appContext).register();
  await tsUtils__default.default.generators.generate({
    strapi: app,
    pwd: appContext.appDir,
    rootDir: outDir ?? void 0,
    logger: {
      silent,
      // TODO V5: verbose is deprecated and should be removed
      debug: debug || verbose
    },
    artifacts: { contentTypes: true, components: true }
  });
  await app.destroy();
};
module.exports = action;
//# sourceMappingURL=action.js.map

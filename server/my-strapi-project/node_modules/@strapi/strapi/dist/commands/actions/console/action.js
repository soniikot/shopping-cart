"use strict";
const REPL = require("repl");
const Strapi = require("../../../Strapi.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const REPL__default = /* @__PURE__ */ _interopDefault(REPL);
const action = async () => {
  const appContext = await Strapi.compile();
  const app = await Strapi(appContext).load();
  app.start().then(() => {
    const repl = REPL__default.default.start(app.config.info.name + " > " || "strapi > ");
    repl.on("exit", (err) => {
      if (err) {
        app.log.error(err);
        process.exit(1);
      }
      app.server.destroy();
      process.exit(0);
    });
  });
};
module.exports = action;
//# sourceMappingURL=action.js.map

"use strict";
const CLITable = require("cli-table3");
const chalk = require("chalk");
const Strapi = require("../../../../Strapi.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const CLITable__default = /* @__PURE__ */ _interopDefault(CLITable);
const chalk__default = /* @__PURE__ */ _interopDefault(chalk);
const action = async () => {
  const appContext = await Strapi.compile();
  const app = await Strapi(appContext).register();
  const list = app.container.get("controllers").keys();
  const infoTable = new CLITable__default.default({
    head: [chalk__default.default.blue("Name")]
  });
  list.forEach((name) => infoTable.push([name]));
  console.log(infoTable.toString());
  await app.destroy();
};
module.exports = action;
//# sourceMappingURL=action.js.map

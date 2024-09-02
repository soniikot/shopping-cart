"use strict";
const CLITable = require("cli-table3");
const chalk = require("chalk");
const fp = require("lodash/fp");
const Strapi = require("../../../../Strapi.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const CLITable__default = /* @__PURE__ */ _interopDefault(CLITable);
const chalk__default = /* @__PURE__ */ _interopDefault(chalk);
const action = async () => {
  const appContext = await Strapi.compile();
  const app = await Strapi(appContext).load();
  const list = app.server.mount().listRoutes();
  const infoTable = new CLITable__default.default({
    head: [chalk__default.default.blue("Method"), chalk__default.default.blue("Path")],
    colWidths: [20]
  });
  list.filter((route) => route.methods.length).forEach((route) => {
    infoTable.push([route.methods.map(fp.toUpper).join("|"), route.path]);
  });
  console.log(infoTable.toString());
  await app.destroy();
};
module.exports = action;
//# sourceMappingURL=action.js.map

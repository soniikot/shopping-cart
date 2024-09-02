"use strict";
const helpers = require("../../utils/helpers.js");
const action = require("./action.js");
const command = ({ command: command2 }) => {
  command2.command("uninstall [plugins...]").description("Uninstall a Strapi plugin").option("-d, --delete-files", "Delete files", false).action(helpers.runAction("uninstall", action));
};
module.exports = command;
//# sourceMappingURL=command.js.map

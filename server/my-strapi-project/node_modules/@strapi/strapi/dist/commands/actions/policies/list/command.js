"use strict";
const helpers = require("../../../utils/helpers.js");
const action = require("./action.js");
const command = ({ command: command2 }) => {
  command2.command("policies:list").description("List all the application policies").action(helpers.runAction("policies:list", action));
};
module.exports = command;
//# sourceMappingURL=command.js.map

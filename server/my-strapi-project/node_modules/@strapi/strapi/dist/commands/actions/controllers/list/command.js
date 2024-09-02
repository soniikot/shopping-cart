"use strict";
const helpers = require("../../../utils/helpers.js");
const action = require("./action.js");
const command = ({ command: command2 }) => {
  command2.command("controllers:list").description("List all the application controllers").action(helpers.runAction("controllers:list", action));
};
module.exports = command;
//# sourceMappingURL=command.js.map

"use strict";
const helpers = require("../../../utils/helpers.js");
const action = require("./action.js");
const command = ({ command: command2 }) => {
  command2.command("services:list").description("List all the application services").action(helpers.runAction("services:list", action));
};
module.exports = command;
//# sourceMappingURL=command.js.map

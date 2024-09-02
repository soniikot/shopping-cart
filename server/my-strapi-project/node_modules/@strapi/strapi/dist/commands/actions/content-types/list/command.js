"use strict";
const helpers = require("../../../utils/helpers.js");
const action = require("./action.js");
const command = ({ command: command2 }) => {
  command2.command("content-types:list").description("List all the application content-types").action(helpers.runAction("content-types:list", action));
};
module.exports = command;
//# sourceMappingURL=command.js.map
